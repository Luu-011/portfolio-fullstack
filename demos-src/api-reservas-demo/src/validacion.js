import {
  describirDias,
  diaDeSemana,
  fechaValida,
  horaValida,
  horariosDelDia,
  motivoNoReservable,
} from './agenda.js';

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RE_TELEFONO = /^\+?[\d\s()-]{6,20}$/;

export const CAMPOS = ['nombre', 'email', 'telefono', 'servicio', 'fecha', 'hora', 'notas'];

// Lee un campo de texto (recortando espacios) y anota los errores que encuentre.
function leerTexto(entrada, campo, { obligatorio = true, min = 0, max }, errores) {
  const crudo = entrada[campo];
  if (crudo === undefined || crudo === null || crudo === '') {
    if (obligatorio) errores.push({ campo, mensaje: 'Es obligatorio.' });
    return null;
  }
  if (typeof crudo !== 'string') {
    errores.push({ campo, mensaje: 'Tiene que ser texto.' });
    return null;
  }
  const texto = crudo.trim();
  if (obligatorio && texto === '') {
    errores.push({ campo, mensaje: 'Es obligatorio.' });
    return null;
  }
  if (texto.length < min) {
    errores.push({ campo, mensaje: `Tiene que tener al menos ${min} caracteres.` });
  } else if (texto.length > max) {
    errores.push({ campo, mensaje: `Puede tener como máximo ${max} caracteres.` });
  }
  return texto === '' ? null : texto;
}

/**
 * Valida los datos de una reserva completa.
 *
 * @param entrada   objeto con los campos (se ignoran los desconocidos)
 * @param opciones  agenda: reglas de la agenda · ahora: { fecha, hora } en la zona de la agenda
 *                  exigirFuturo: false al editar datos de contacto sin cambiar fecha ni hora
 * @returns { errores: [{ campo, mensaje }], valor: datos limpios }
 */
export function validarReserva(entrada, { agenda, ahora, exigirFuturo = true }) {
  const errores = [];
  const valor = {};

  valor.nombre = leerTexto(entrada, 'nombre', { min: 2, max: 80 }, errores);
  valor.email = leerTexto(entrada, 'email', { max: 120 }, errores);
  if (valor.email && !RE_EMAIL.test(valor.email)) {
    errores.push({ campo: 'email', mensaje: 'Tiene que ser un email válido, por ejemplo ana@correo.com.' });
  }

  valor.telefono = leerTexto(entrada, 'telefono', { obligatorio: false, max: 20 }, errores);
  if (valor.telefono && !RE_TELEFONO.test(valor.telefono)) {
    errores.push({ campo: 'telefono', mensaje: 'Usá solo números, espacios, guiones, paréntesis y un + inicial (6 a 20 caracteres).' });
  }

  valor.servicio = leerTexto(entrada, 'servicio', { max: 30 }, errores);
  if (valor.servicio && !agenda.servicios.includes(valor.servicio)) {
    errores.push({ campo: 'servicio', mensaje: `Tiene que ser uno de: ${agenda.servicios.join(', ')}.` });
  }

  valor.notas = leerTexto(entrada, 'notas', { obligatorio: false, max: 240 }, errores);

  // Fecha y hora: primero el formato, después las reglas de la agenda.
  valor.fecha = leerTexto(entrada, 'fecha', { max: 10 }, errores);
  valor.hora = leerTexto(entrada, 'hora', { max: 5 }, errores);

  const fechaOk = valor.fecha !== null && fechaValida(valor.fecha);
  if (valor.fecha !== null && !fechaOk && !errores.some((e) => e.campo === 'fecha')) {
    errores.push({ campo: 'fecha', mensaje: 'Usá el formato AAAA-MM-DD con una fecha real, por ejemplo 2027-03-15.' });
  }

  const horaOk = valor.hora !== null && horaValida(valor.hora);
  if (valor.hora !== null && !horaOk && !errores.some((e) => e.campo === 'hora')) {
    errores.push({ campo: 'hora', mensaje: 'Usá el formato HH:MM de 24 horas, por ejemplo 09:30.' });
  }

  if (fechaOk && !agenda.diasAtencion.includes(diaDeSemana(valor.fecha))) {
    errores.push({ campo: 'fecha', mensaje: `Ese día no hay atención. Atendemos ${describirDias(agenda.diasAtencion)}.` });
  }

  if (horaOk) {
    const horarios = horariosDelDia(agenda);
    if (!horarios.includes(valor.hora)) {
      errores.push({
        campo: 'hora',
        mensaje: `Elegí un horario entre ${horarios[0]} y ${horarios.at(-1)}, cada ${agenda.duracionMin} minutos.`,
      });
    }
  }

  const yaHayErrorDeFecha = errores.some((e) => e.campo === 'fecha' || e.campo === 'hora');
  if (exigirFuturo && fechaOk && horaOk && !yaHayErrorDeFecha) {
    const motivo = motivoNoReservable(valor.fecha, valor.hora, ahora, agenda);
    if (motivo) errores.push({ campo: 'fecha', mensaje: motivo });
  }

  return { errores, valor };
}

// Filtros y paginación de GET /api/reservas
export function validarConsulta(query, agenda) {
  const errores = [];
  const valor = { limit: 50, offset: 0 };

  if (query.fecha !== undefined) {
    if (fechaValida(query.fecha)) valor.fecha = query.fecha;
    else errores.push({ campo: 'fecha', mensaje: 'Usá el formato AAAA-MM-DD.' });
  }
  if (query.estado !== undefined) {
    if (['confirmada', 'cancelada'].includes(query.estado)) valor.estado = query.estado;
    else errores.push({ campo: 'estado', mensaje: 'Tiene que ser confirmada o cancelada.' });
  }
  if (query.email !== undefined) {
    if (typeof query.email === 'string' && query.email.trim()) valor.email = query.email.trim();
    else errores.push({ campo: 'email', mensaje: 'No puede estar vacío.' });
  }
  if (query.servicio !== undefined) {
    if (agenda.servicios.includes(query.servicio)) valor.servicio = query.servicio;
    else errores.push({ campo: 'servicio', mensaje: `Tiene que ser uno de: ${agenda.servicios.join(', ')}.` });
  }
  for (const [campo, min, max] of [['limit', 1, 100], ['offset', 0, Infinity]]) {
    if (query[campo] === undefined) continue;
    const n = Number(query[campo]);
    if (Number.isInteger(n) && n >= min && n <= max) valor[campo] = n;
    else errores.push({ campo, mensaje: `Tiene que ser un número entero${max === Infinity ? ` desde ${min}` : ` entre ${min} y ${max}`}.` });
  }
  return { errores, valor };
}
