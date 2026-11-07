import { pool } from '../config/db.js'

export async function exists(id, projectId) {
  const [rows] = await pool.query('SELECT 1 FROM demos WHERE id = ? AND project_id = ?', [id, projectId])
  return rows.length > 0
}

export async function create(projectId, { title, description, url }) {
  await pool.query(
    'INSERT INTO demos (project_id, title, description, url) VALUES (?, ?, ?, ?)',
    [projectId, title, description || null, url]
  )
}

export async function update(id, projectId, { title, description, url }) {
  await pool.query(
    'UPDATE demos SET title = ?, description = ?, url = ? WHERE id = ? AND project_id = ?',
    [title, description || null, url, id, projectId]
  )
}

export async function remove(id, projectId) {
  await pool.query('DELETE FROM demos WHERE id = ? AND project_id = ?', [id, projectId])
}
