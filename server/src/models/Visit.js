import { pool } from '../config/db.js'

const INSERT = 'INSERT INTO visits (user_id, path, ip) VALUES (?, ?, ?)'

// user_id NULL = visitante general; con valor = acceso de un usuario registrado
export async function create({ userId, path, ip }) {
  try {
    await pool.query(INSERT, [userId, path, ip])
  } catch (err) {
    // El token era válido pero la cuenta ya no existe: se cuenta como visitante
    if (err.code === 'ER_NO_REFERENCED_ROW_2' && userId !== null) {
      await pool.query(INSERT, [null, path, ip])
      return
    }
    throw err
  }
}
