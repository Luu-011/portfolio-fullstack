import { pool } from '../config/db.js'

const FIELDS = 'id, name, email, type, message, status, created_at AS createdAt'

// Agrega a cada consulta su historial de respuestas (mismo formato que usa el frontend)
async function withReplies(contacts) {
  if (contacts.length === 0) return contacts
  const [replies] = await pool.query(
    `SELECT r.id, r.contact_id AS contactId, r.message AS text, r.created_at AS createdAt,
            COALESCE(u.name, 'Operador') AS operator
       FROM contact_replies r
       LEFT JOIN users u ON u.id = r.user_id
      WHERE r.contact_id IN (?)
      ORDER BY r.created_at, r.id`,
    [contacts.map((c) => c.id)]
  )
  return contacts.map((c) => ({
    ...c,
    replies: replies.filter((r) => r.contactId === c.id).map(({ contactId, ...r }) => r),
  }))
}

export async function findAll({ status } = {}) {
  const [rows] = status
    ? await pool.query(`SELECT ${FIELDS} FROM contacts WHERE status = ? ORDER BY created_at DESC, id DESC`, [status])
    : await pool.query(`SELECT ${FIELDS} FROM contacts ORDER BY created_at DESC, id DESC`)
  return withReplies(rows)
}

export async function findById(id) {
  const [rows] = await pool.query(`SELECT ${FIELDS} FROM contacts WHERE id = ?`, [id])
  if (rows.length === 0) return null
  return (await withReplies(rows))[0]
}

export async function create({ name, email, type, message }) {
  const [result] = await pool.query(
    'INSERT INTO contacts (name, email, type, message) VALUES (?, ?, ?, ?)',
    [name, email, type, message]
  )
  return findById(result.insertId)
}
