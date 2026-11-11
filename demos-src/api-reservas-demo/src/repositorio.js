// Acceso a MySQL. Todas las consultas usan parámetros (?), nunca texto concatenado.

const COLUMNAS = `id, nombre, email, telefono, servicio,
  DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha,
  TIME_FORMAT(hora, '%H:%i') AS hora,
  notas, estado, creada_en, actualizada_en`;

const aIso = (fecha) => (fecha instanceof Date ? fecha.toISOString() : fecha);

function serializar(fila) {
  if (!fila) return null;
  return { ...fila, creada_en: aIso(fila.creada_en), actualizada_en: aIso(fila.actualizada_en) };
}

export async function obtener(pool, id) {
  const [filas] = await pool.query(`SELECT ${COLUMNAS} FROM reservas WHERE id = ?`, [id]);
  return serializar(filas[0]);
}

export async function crear(pool, r) {
  const [res] = await pool.query(
    `INSERT INTO reservas (nombre, email, telefono, servicio, fecha, hora, notas)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [r.nombre, r.email, r.telefono, r.servicio, r.fecha, r.hora, r.notas],
  );
  return obtener(pool, res.insertId);
}

export async function actualizar(pool, id, r) {
  await pool.query(
    `UPDATE reservas
        SET nombre = ?, email = ?, telefono = ?, servicio = ?, fecha = ?, hora = ?, notas = ?
      WHERE id = ?`,
    [r.nombre, r.email, r.telefono, r.servicio, r.fecha, r.hora, r.notas, id],
  );
  return obtener(pool, id);
}

// Devuelve true si la cancelación se hizo, false si no existía o ya estaba cancelada.
export async function cancelar(pool, id) {
  const [res] = await pool.query(
    "UPDATE reservas SET estado = 'cancelada' WHERE id = ? AND estado = 'confirmada'",
    [id],
  );
  return res.affectedRows === 1;
}

export async function listar(pool, { fecha, estado, email, servicio, limit, offset }) {
  const condiciones = [];
  const params = [];
  for (const [columna, valor] of [['fecha', fecha], ['estado', estado], ['email', email], ['servicio', servicio]]) {
    if (valor !== undefined) {
      condiciones.push(`${columna} = ?`);
      params.push(valor);
    }
  }
  const donde = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM reservas ${donde}`, params);
  const [filas] = await pool.query(
    `SELECT ${COLUMNAS} FROM reservas ${donde} ORDER BY fecha, hora, id LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );
  return { total, filas: filas.map(serializar) };
}

// Horarios ('HH:MM') ya reservados en una fecha.
export async function horariosOcupados(pool, fecha) {
  const [filas] = await pool.query(
    "SELECT TIME_FORMAT(hora, '%H:%i') AS hora FROM reservas WHERE fecha = ? AND estado = 'confirmada'",
    [fecha],
  );
  return filas.map((f) => f.hora);
}

export const esHorarioOcupado = (error) => error?.code === 'ER_DUP_ENTRY';
