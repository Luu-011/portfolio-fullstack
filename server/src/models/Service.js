import { pool } from '../config/db.js'

const toService = (s) => ({
  id: s.id, title: s.title, description: s.description,
  refPrice: s.ref_price === null ? null : Number(s.ref_price),
  active: Boolean(s.active),
})

export async function findActive() {
  const [rows] = await pool.query('SELECT * FROM services WHERE active = 1 ORDER BY id')
  return rows.map(toService)
}

export async function findAll() {
  const [rows] = await pool.query('SELECT * FROM services ORDER BY id')
  return rows.map(toService)
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM services WHERE id = ?', [id])
  return rows.length ? toService(rows[0]) : null
}

export async function create({ title, description, refPrice, active }) {
  const [result] = await pool.query(
    'INSERT INTO services (title, description, ref_price, active) VALUES (?, ?, ?, ?)',
    [title, description, refPrice, active ? 1 : 0]
  )
  return findById(result.insertId)
}

export async function update(id, { title, description, refPrice, active }) {
  await pool.query(
    'UPDATE services SET title = ?, description = ?, ref_price = ?, active = ? WHERE id = ?',
    [title, description, refPrice, active ? 1 : 0, id]
  )
  return findById(id)
}

// Las consultas que citaban este servicio no se borran: su service_id pasa a NULL
export async function remove(id) {
  await pool.query('DELETE FROM services WHERE id = ?', [id])
}
