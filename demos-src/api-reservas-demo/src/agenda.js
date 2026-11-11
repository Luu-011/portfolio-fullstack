// Reglas de calendario. Son funciones puras: no tocan la base ni el reloj
// (el "ahora" siempre se recibe como parámetro, así se pueden probar).

export const NOMBRES_DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const aMinutos = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const aHHMM = (min) =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

const partesFecha = (fecha) => fecha.split('-').map(Number);

// ['09:00', '09:30', ..., '17:30']
export function horariosDelDia({ apertura, cierre, duracionMin }) {
  const horarios = [];
  for (let t = aMinutos(apertura); t + duracionMin <= aMinutos(cierre); t += duracionMin) {
    horarios.push(aHHMM(t));
  }
  return horarios;
}

export function fechaValida(texto) {
  if (typeof texto !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const [y, m, d] = partesFecha(texto);
  const f = new Date(Date.UTC(y, m - 1, d));
  return f.getUTCFullYear() === y && f.getUTCMonth() === m - 1 && f.getUTCDate() === d;
}

export function horaValida(texto) {
  return typeof texto === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(texto);
}

export function diaDeSemana(fecha) {
  const [y, m, d] = partesFecha(fecha);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function sumarDias(fecha, dias) {
  const [y, m, d] = partesFecha(fecha);
  return new Date(Date.UTC(y, m - 1, d + dias)).toISOString().slice(0, 10);
}

// Fecha y hora actuales en la zona horaria de la agenda: { fecha: 'AAAA-MM-DD', hora: 'HH:MM' }
export function ahoraEnZona(zonaHoraria, instante = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: zonaHoraria,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(instante)
      .map((x) => [x.type, x.value]),
  );
  return { fecha: `${p.year}-${p.month}-${p.day}`, hora: `${p.hour}:${p.minute}` };
}

export function describirDias(dias) {
  const orden = [...dias].sort((a, b) => a - b);
  const corrido = orden.every((d, i) => i === 0 || d === orden[i - 1] + 1);
  if (orden.length > 1 && corrido) {
    return `de ${NOMBRES_DIAS[orden[0]]} a ${NOMBRES_DIAS[orden.at(-1)]}`;
  }
  return orden.map((d) => NOMBRES_DIAS[d]).join(', ');
}

// Devuelve el motivo por el que un horario NO se puede reservar, o null si se puede.
export function motivoNoReservable(fecha, hora, ahora, agenda) {
  if (`${fecha} ${hora}` <= `${ahora.fecha} ${ahora.hora}`) {
    return 'No se puede reservar un horario que ya pasó.';
  }
  if (fecha > sumarDias(ahora.fecha, agenda.maxDiasAnticipacion)) {
    return `Solo se puede reservar con hasta ${agenda.maxDiasAnticipacion} días de anticipación.`;
  }
  return null;
}
