import { pool } from '../config/db.js'

const PUBLIC_FIELDS = 'id, name, email, role, created_at AS createdAt'

export async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
  return rows[0] || null
}

export async function findById(id) {
  const [rows] = await pool.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ?`, [id])
  return rows[0] || null
}

// Todo usuario nuevo se crea con rol "user" (operador y admin se asignan desde la base de datos)
export async function create({ name, email, passwordHash }) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  )
  return findById(result.insertId)
}
