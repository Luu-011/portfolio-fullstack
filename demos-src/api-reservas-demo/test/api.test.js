// Pruebas de integración: levantan la API contra una base MySQL real.
// Usan la base reservas_test (se vacía en cada corrida), con las variables DB_* del .env.
// Si no hay MySQL disponible, se saltean.
import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { crearApp } from '../src/app.js';
import { config as configBase } from '../src/config.js';
import { crearPool, inicializarEsquema } from '../src/db.js';
import { ahoraEnZona, diaDeSemana, sumarDias } from '../src/agenda.js';

const config = { ...configBase, db: { ...configBase.db, database: process.env.TEST_DB_NAME ?? 'reservas_test' } };
const agenda = config.agenda;

let pool;
let motivoSalto = false;
try {
  await inicializarEsquema(config.db);
  pool = crearPool(config.db);
  await pool.query('SELECT 1');
} catch (error) {
  motivoSalto = `No hay MySQL disponible (${error.code ?? error.message}). Ver README.`;
}

// Primer día de atención que esté al menos `desdeDias` días en el futuro
function diaHabil(desdeDias, saltarDias = 0) {
  let fecha = sumarDias(ahoraEnZona(agenda.zonaHoraria).fecha, desdeDias);
  let faltan = saltarDias + 1;
  while (true) {
    if (agenda.diasAtencion.includes(diaDeSemana(fecha))) faltan -= 1;
    if (faltan === 0) return fecha;
    fecha = sumarDias(fecha, 1);
  }
}

const FECHA = diaHabil(7);
const OTRA_FECHA = diaHabil(7, 1);

const datos = (cambios = {}) => ({
  nombre: 'Ana Pérez',
  email: 'ana@correo.com',
  telefono: '+54 387 555-1234',
  servicio: 'consulta',
  fecha: FECHA,
  hora: '10:00',
  ...cambios,
});

describe('API de reservas', { skip: motivoSalto }, () => {
  let servidor;
  let base;

  const pedir = async (metodo, ruta, cuerpo) => {
    const res = await fetch(base + ruta, {
      method: metodo,
      headers: cuerpo === undefined ? {} : { 'content-type': 'application/json' },
      body: cuerpo === undefined ? undefined : typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo),
    });
    return { status: res.status, headers: res.headers, json: await res.json() };
  };
  const campos = (r) => r.json.detalles.map((d) => d.campo).sort();

  before(async () => {
    await pool.query('DELETE FROM reservas');
    await new Promise((listo) => {
      servidor = crearApp({ pool, config }).listen(0, '127.0.0.1', listo);
    });
    base = `http://127.0.0.1:${servidor.address().port}`;
  });

  after(async () => {
    await new Promise((listo) => servidor.close(listo));
    await pool.end();
  });

  test('GET /api/health', async () => {
    const r = await pedir('GET', '/api/health');
    assert.equal(r.status, 200);
    assert.equal(r.json.estado, 'ok');
  });

  test('POST /api/reservas crea la reserva', async () => {
    const r = await pedir('POST', '/api/reservas', datos({ hora: '09:00' }));
    assert.equal(r.status, 201);
    assert.equal(r.headers.get('location'), `/api/reservas/${r.json.id}`);
    assert.equal(r.json.estado, 'confirmada');
    assert.equal(r.json.fecha, FECHA);
    assert.equal(r.json.hora, '09:00');
    assert.equal(r.json.notas, null);
    assert.match(r.json.creada_en, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  test('POST con datos inválidos devuelve 400 con el detalle por campo', async () => {
    const vacio = await pedir('POST', '/api/reservas', {});
    assert.equal(vacio.status, 400);
    assert.equal(vacio.json.error, 'validacion');
    assert.deepEqual(campos(vacio), ['email', 'fecha', 'hora', 'nombre', 'servicio']);

    const mal = await pedir('POST', '/api/reservas', datos({ email: 'x', servicio: 'corte', hora: '10:15' }));
    assert.equal(mal.status, 400);
    assert.deepEqual(campos(mal), ['email', 'hora', 'servicio']);
  });

  test('POST rechaza fines de semana, pasado y exceso de anticipación', async () => {
    const hoy = ahoraEnZona(agenda.zonaHoraria).fecha;
    let sabado = sumarDias(hoy, 7);
    while (diaDeSemana(sabado) !== 6) sabado = sumarDias(sabado, 1);

    for (const fecha of [sabado, sumarDias(hoy, -1), sumarDias(hoy, 61)]) {
      const r = await pedir('POST', '/api/reservas', datos({ fecha }));
      assert.equal(r.status, 400, fecha);
      assert.deepEqual(campos(r), ['fecha'], fecha);
    }
  });

  test('POST sobre un horario ocupado devuelve 409', async () => {
    const r = await pedir('POST', '/api/reservas', datos({ nombre: 'Beto', email: 'beto@correo.com', hora: '09:00' }));
    assert.equal(r.status, 409);
    assert.equal(r.json.error, 'horario_ocupado');
  });

  test('pedidos simultáneos al mismo horario: solo uno gana', async () => {
    const respuestas = await Promise.all(
      Array.from({ length: 8 }, (_, i) =>
        pedir('POST', '/api/reservas', datos({ nombre: `Cliente ${i}`, email: `c${i}@correo.com`, hora: '15:00' })),
      ),
    );
    const estados = respuestas.map((r) => r.status).sort();
    assert.deepEqual(estados, [201, 409, 409, 409, 409, 409, 409, 409]);
  });

  test('GET /api/disponibilidad marca los horarios ocupados', async () => {
    const r = await pedir('GET', `/api/disponibilidad?fecha=${FECHA}`);
    assert.equal(r.status, 200);
    assert.equal(r.json.atiende, true);
    assert.equal(r.json.horarios.length, 18);
    const estado = Object.fromEntries(r.json.horarios.map((h) => [h.hora, h.disponible]));
    assert.equal(estado['09:00'], false);
    assert.equal(estado['15:00'], false);
    assert.equal(estado['09:30'], true);
  });

  test('GET /api/disponibilidad en fin de semana y con fecha inválida', async () => {
    let domingo = sumarDias(FECHA, 1);
    while (diaDeSemana(domingo) !== 0) domingo = sumarDias(domingo, 1);
    const finde = await pedir('GET', `/api/disponibilidad?fecha=${domingo}`);
    assert.equal(finde.status, 200);
    assert.deepEqual(finde.json, { fecha: domingo, atiende: false, horarios: [] });

    assert.equal((await pedir('GET', '/api/disponibilidad')).status, 400);
    assert.equal((await pedir('GET', '/api/disponibilidad?fecha=2027-02-31')).status, 400);
  });

  test('GET /api/reservas/:id', async () => {
    const creada = await pedir('POST', '/api/reservas', datos({ hora: '11:00' }));
    const r = await pedir('GET', `/api/reservas/${creada.json.id}`);
    assert.equal(r.status, 200);
    assert.equal(r.json.hora, '11:00');

    assert.equal((await pedir('GET', '/api/reservas/999999')).status, 404);
    assert.equal((await pedir('GET', '/api/reservas/abc')).status, 400);
  });

  test('GET /api/reservas filtra y pagina', async () => {
    await pedir('POST', '/api/reservas', datos({ fecha: OTRA_FECHA, hora: '12:00', email: 'otra@correo.com' }));

    const todas = await pedir('GET', '/api/reservas');
    assert.equal(todas.status, 200);
    assert.equal(todas.json.total, todas.json.datos.length);

    const delDia = await pedir('GET', `/api/reservas?fecha=${OTRA_FECHA}`);
    assert.equal(delDia.json.total, 1);
    assert.equal(delDia.json.datos[0].email, 'otra@correo.com');

    const pagina = await pedir('GET', '/api/reservas?limit=2&offset=1');
    assert.equal(pagina.json.datos.length, 2);
    assert.equal(pagina.json.total, todas.json.total);
    assert.deepEqual(
      pagina.json.datos.map((d) => d.id),
      todas.json.datos.slice(1, 3).map((d) => d.id),
    );

    const mal = await pedir('GET', '/api/reservas?estado=rara&limit=500');
    assert.equal(mal.status, 400);
    assert.deepEqual(campos(mal), ['estado', 'limit']);
  });

  test('PATCH actualiza datos de contacto', async () => {
    const creada = await pedir('POST', '/api/reservas', datos({ hora: '13:00' }));
    const r = await pedir('PATCH', `/api/reservas/${creada.json.id}`, { telefono: null, notas: 'Trae estudios' });
    assert.equal(r.status, 200);
    assert.equal(r.json.telefono, null);
    assert.equal(r.json.notas, 'Trae estudios');
    assert.equal(r.json.hora, '13:00');
  });

  test('PATCH reprograma: horario libre sí, horario ocupado 409', async () => {
    const creada = await pedir('POST', '/api/reservas', datos({ hora: '13:30' }));
    const id = creada.json.id;

    const ocupado = await pedir('PATCH', `/api/reservas/${id}`, { hora: '09:00' });
    assert.equal(ocupado.status, 409);
    assert.equal(ocupado.json.error, 'horario_ocupado');

    const libre = await pedir('PATCH', `/api/reservas/${id}`, { fecha: OTRA_FECHA, hora: '16:00' });
    assert.equal(libre.status, 200);
    assert.equal(libre.json.fecha, OTRA_FECHA);
    assert.equal(libre.json.hora, '16:00');

    // El horario viejo quedó libre
    const disp = await pedir('GET', `/api/disponibilidad?fecha=${FECHA}`);
    assert.equal(disp.json.horarios.find((h) => h.hora === '13:30').disponible, true);
  });

  test('PATCH valida lo que se manda', async () => {
    const creada = await pedir('POST', '/api/reservas', datos({ hora: '14:00' }));
    const id = creada.json.id;
    assert.equal((await pedir('PATCH', `/api/reservas/${id}`, {})).status, 400);
    const mal = await pedir('PATCH', `/api/reservas/${id}`, { hora: '07:00', email: 'x' });
    assert.deepEqual(campos(mal), ['email', 'hora']);
    assert.equal((await pedir('PATCH', '/api/reservas/999999', { notas: 'x' })).status, 404);
  });

  test('DELETE cancela, libera el horario y no se puede repetir ni editar', async () => {
    const creada = await pedir('POST', '/api/reservas', datos({ hora: '16:30' }));
    const id = creada.json.id;

    const cancelada = await pedir('DELETE', `/api/reservas/${id}`);
    assert.equal(cancelada.status, 200);
    assert.equal(cancelada.json.estado, 'cancelada');

    const otraVez = await pedir('DELETE', `/api/reservas/${id}`);
    assert.equal(otraVez.status, 409);
    assert.equal(otraVez.json.error, 'ya_cancelada');

    const editar = await pedir('PATCH', `/api/reservas/${id}`, { notas: 'x' });
    assert.equal(editar.status, 409);
    assert.equal(editar.json.error, 'reserva_cancelada');

    assert.equal((await pedir('DELETE', '/api/reservas/999999')).status, 404);

    // El horario se puede volver a reservar
    const nueva = await pedir('POST', '/api/reservas', datos({ nombre: 'Carla', email: 'carla@correo.com', hora: '16:30' }));
    assert.equal(nueva.status, 201);

    // La cancelada sigue consultable
    const canceladas = await pedir('GET', '/api/reservas?estado=cancelada');
    assert.ok(canceladas.json.datos.some((d) => d.id === id));
  });

  test('JSON roto, ruta inexistente y cuerpo gigante', async () => {
    const roto = await pedir('POST', '/api/reservas', '{oops');
    assert.equal(roto.status, 400);
    assert.equal(roto.json.error, 'json_invalido');

    const noExiste = await pedir('GET', '/api/nada');
    assert.equal(noExiste.status, 404);
    assert.equal(noExiste.json.error, 'ruta_no_encontrada');

    const grande = await pedir('POST', '/api/reservas', { notas: 'x'.repeat(20000) });
    assert.equal(grande.status, 413);
  });
});
