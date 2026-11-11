import { test } from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../src/config.js';
import { ahoraEnZona, describirDias, fechaValida, horariosDelDia, sumarDias } from '../src/agenda.js';
import { validarConsulta, validarReserva } from '../src/validacion.js';

const agenda = config.agenda;
// Miércoles 10 de marzo de 2027, 12:00 (hora de la agenda)
const ahora = { fecha: '2027-03-10', hora: '12:00' };

const valida = {
  nombre: 'Ana Pérez',
  email: 'ana@correo.com',
  servicio: 'consulta',
  fecha: '2027-03-15', // lunes
  hora: '10:00',
};

const validar = (cambios = {}, opciones = {}) =>
  validarReserva({ ...valida, ...cambios }, { agenda, ahora, ...opciones });
const camposConError = (resultado) => resultado.errores.map((e) => e.campo);
const mensajeDe = (resultado, campo) => resultado.errores.find((e) => e.campo === campo)?.mensaje;

test('agenda: horarios del día cada 30 minutos', () => {
  const h = horariosDelDia(agenda);
  assert.equal(h.length, 18);
  assert.equal(h[0], '09:00');
  assert.equal(h.at(-1), '17:30');
});

test('agenda: fechas reales y no reales', () => {
  assert.equal(fechaValida('2027-03-15'), true);
  assert.equal(fechaValida('2028-02-29'), true);
  assert.equal(fechaValida('2027-02-29'), false);
  assert.equal(fechaValida('2027-02-31'), false);
  assert.equal(fechaValida('15/03/2027'), false);
  assert.equal(fechaValida(20270315), false);
});

test('agenda: describe los días de atención', () => {
  assert.equal(describirDias([1, 2, 3, 4, 5]), 'de lunes a viernes');
  assert.equal(describirDias([1, 3, 5]), 'lunes, miércoles, viernes');
});

test('agenda: "ahora" respeta la zona horaria', () => {
  assert.deepEqual(ahoraEnZona('America/Argentina/Buenos_Aires', new Date('2027-03-10T15:30:00Z')), {
    fecha: '2027-03-10',
    hora: '12:30',
  });
  // 02:00 UTC todavía es el día anterior en Buenos Aires
  assert.deepEqual(ahoraEnZona('America/Argentina/Buenos_Aires', new Date('2027-03-10T02:00:00Z')), {
    fecha: '2027-03-09',
    hora: '23:00',
  });
});

test('reserva válida: no devuelve errores y limpia los espacios', () => {
  const r = validar({ nombre: '  Ana Pérez  ', telefono: '+54 387 555-1234', notas: ' Primera vez ' });
  assert.deepEqual(r.errores, []);
  assert.equal(r.valor.nombre, 'Ana Pérez');
  assert.equal(r.valor.notas, 'Primera vez');
});

test('teléfono y notas son opcionales', () => {
  const r = validar();
  assert.deepEqual(r.errores, []);
  assert.equal(r.valor.telefono, null);
  assert.equal(r.valor.notas, null);
});

test('campos obligatorios', () => {
  const r = validarReserva({}, { agenda, ahora });
  assert.deepEqual(camposConError(r).sort(), ['email', 'fecha', 'hora', 'nombre', 'servicio']);
});

test('tipos incorrectos', () => {
  const r = validar({ nombre: 123, hora: 1000 });
  assert.equal(mensajeDe(r, 'nombre'), 'Tiene que ser texto.');
  assert.equal(mensajeDe(r, 'hora'), 'Tiene que ser texto.');
});

test('nombre, email, teléfono, servicio y notas', () => {
  assert.deepEqual(camposConError(validar({ nombre: 'A' })), ['nombre']);
  assert.deepEqual(camposConError(validar({ email: 'ana@correo' })), ['email']);
  assert.deepEqual(camposConError(validar({ telefono: 'abc' })), ['telefono']);
  assert.deepEqual(camposConError(validar({ servicio: 'peluqueria' })), ['servicio']);
  assert.deepEqual(camposConError(validar({ notas: 'x'.repeat(241) })), ['notas']);
});

test('fecha: formato y fechas inexistentes', () => {
  assert.deepEqual(camposConError(validar({ fecha: '15-03-2027' })), ['fecha']);
  assert.deepEqual(camposConError(validar({ fecha: '2027-02-31' })), ['fecha']);
});

test('fecha: no hay atención los fines de semana', () => {
  const r = validar({ fecha: '2027-03-13' }); // sábado
  assert.match(mensajeDe(r, 'fecha'), /Atendemos de lunes a viernes/);
});

test('hora: formato y horarios fuera de la grilla', () => {
  assert.deepEqual(camposConError(validar({ hora: '9:00' })), ['hora']);
  assert.deepEqual(camposConError(validar({ hora: '25:00' })), ['hora']);
  assert.deepEqual(camposConError(validar({ hora: '08:30' })), ['hora']); // antes de abrir
  assert.deepEqual(camposConError(validar({ hora: '18:00' })), ['hora']); // ya cerró
  assert.deepEqual(camposConError(validar({ hora: '10:15' })), ['hora']); // no es múltiplo de 30
  assert.deepEqual(camposConError(validar({ hora: '17:30' })), []); // último turno
});

test('no se puede reservar en el pasado ni en el instante actual', () => {
  assert.match(mensajeDe(validar({ fecha: '2027-03-08' }), 'fecha'), /ya pasó/);
  assert.match(mensajeDe(validar({ fecha: '2027-03-10', hora: '09:00' }), 'fecha'), /ya pasó/);
  assert.match(mensajeDe(validar({ fecha: '2027-03-10', hora: '12:00' }), 'fecha'), /ya pasó/);
  assert.deepEqual(camposConError(validar({ fecha: '2027-03-10', hora: '12:30' })), []);
});

test('anticipación máxima', () => {
  const limite = sumarDias(ahora.fecha, agenda.maxDiasAnticipacion); // domingo 2027-05-09
  assert.equal(limite, '2027-05-09');
  assert.deepEqual(camposConError(validar({ fecha: '2027-05-07' })), []); // viernes dentro del límite
  assert.match(mensajeDe(validar({ fecha: '2027-05-10' }), 'fecha'), /60 días/);
});

test('al editar solo el contacto no se exige que la fecha sea futura', () => {
  const r = validar({ fecha: '2027-03-08', nombre: 'Ana María' }, { exigirFuturo: false });
  assert.deepEqual(r.errores, []);
});

test('se ignoran los campos desconocidos (por ejemplo estado)', () => {
  const r = validar({ estado: 'cancelada', id: 99 });
  assert.deepEqual(r.errores, []);
  assert.equal('estado' in r.valor, false);
  assert.equal('id' in r.valor, false);
});

test('consulta: filtros y paginación', () => {
  assert.deepEqual(validarConsulta({}, agenda), { errores: [], valor: { limit: 50, offset: 0 } });
  const ok = validarConsulta({ fecha: '2027-03-15', estado: 'confirmada', limit: '10', offset: '20' }, agenda);
  assert.deepEqual(ok.errores, []);
  assert.deepEqual(ok.valor, { limit: 10, offset: 20, fecha: '2027-03-15', estado: 'confirmada' });

  const mal = validarConsulta({ fecha: 'hoy', estado: 'otra', limit: '0', offset: '-1', servicio: 'x' }, agenda);
  assert.deepEqual(mal.errores.map((e) => e.campo).sort(), ['estado', 'fecha', 'limit', 'offset', 'servicio']);
  assert.deepEqual(validarConsulta({ limit: '101' }, agenda).errores.map((e) => e.campo), ['limit']);
});
