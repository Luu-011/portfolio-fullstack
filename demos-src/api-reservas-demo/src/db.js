import { readFile } from 'node:fs/promises';
import mysql from 'mysql2/promise';

export function crearPool(db) {
  const pool = mysql.createPool({
    ...db,
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4',
    timezone: 'Z', // las fechas y horas con hora de creación se leen como UTC
  });
  // Todas las conexiones trabajan en UTC, así creada_en/actualizada_en no dependen del servidor.
  pool.pool.on('connection', (conexion) => conexion.query("SET time_zone = '+00:00'"));
  return pool;
}

export async function inicializarEsquema(db) {
  const sql = await readFile(new URL('../schema.sql', import.meta.url), 'utf8');
  const conexion = await mysql.createConnection(db);
  try {
    await conexion.query(sql);
  } finally {
    await conexion.end();
  }
}
