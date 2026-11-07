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

// Listado para el panel del administrador, con la cantidad de accesos de cada usuario
export async function findAllWithStats({ role } = {}) {
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.role, u.created_at AS createdAt,
            COUNT(v.id) AS visits, MAX(v.created_at) AS lastVisit
       FROM users u
       LEFT JOIN visits v ON v.user_id = u.id
      ${role ? 'WHERE u.role = ?' : ''}
      GROUP BY u.id
      ORDER BY u.created_at DESC, u.id DESC`,
    role ? [role] : []
  )
  return rows.map((r) => ({ ...r, visits: Number(r.visits) }))
}

export async function updateRole(id, role) {
  await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id])
  return findById(id)
}

// Sus consultas respondidas y visitas se conservan (user_id pasa a NULL)
export async function remove(id) {
  await pool.query('DELETE FROM users WHERE id = ?', [id])
}
