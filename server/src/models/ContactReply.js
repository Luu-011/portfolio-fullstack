import { pool } from '../config/db.js'

// Guarda la respuesta y marca la consulta como respondida, todo en una transacción
export async function create({ contactId, userId, text }) {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    await conn.query(
      'INSERT INTO contact_replies (contact_id, user_id, message) VALUES (?, ?, ?)',
      [contactId, userId, text]
    )
    await conn.query("UPDATE contacts SET status = 'respondida' WHERE id = ?", [contactId])
    await conn.commit()
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}
