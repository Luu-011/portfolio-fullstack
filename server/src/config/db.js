import mysql from 'mysql2/promise'

// Las bases en la nube (TiDB Cloud, etc.) exigen conexión cifrada: DB_SSL=true.
//   DB_SSL_CA                    (opcional) certificado de la CA del proveedor, en formato PEM
//   DB_SSL_REJECT_UNAUTHORIZED   poner "false" solo como último recurso (desactiva la verificación)
const ssl = process.env.DB_SSL === 'true'
  ? {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
      ca: process.env.DB_SSL_CA ? process.env.DB_SSL_CA.replace(/\\n/g, '\n') : undefined,
    }
  : undefined

// Pool de conexiones. Todas las consultas usan parámetros (?) para evitar inyección SQL.
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  ssl,
})

export async function testConnection() {
  const conn = await pool.getConnection()
  await conn.ping()
  conn.release()
}
