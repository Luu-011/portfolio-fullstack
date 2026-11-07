import { pool } from '../config/db.js'

// MySQL devuelve la columna JSON ya convertida; MariaDB la devuelve como texto
const parseStack = (s) => (typeof s === 'string' ? JSON.parse(s) : s)

const toProject = (p, demos) => ({
  id: p.id, title: p.title, summary: p.summary, description: p.description,
  stack: parseStack(p.stack), repoUrl: p.repo_url, image: p.image, year: p.year, demos,
})

// Cada proyecto incluye su array de demos (misma forma que usa el frontend)
async function withDemos(rows) {
  if (rows.length === 0) return []
  const [demos] = await pool.query(
    'SELECT id, project_id AS projectId, title, description, url FROM demos WHERE project_id IN (?) ORDER BY id',
    [rows.map((r) => r.id)]
  )
  return rows.map((r) =>
    toProject(r, demos.filter((d) => d.projectId === r.id).map(({ projectId, ...d }) => d))
  )
}

export async function findAll() {
  const [rows] = await pool.query('SELECT * FROM projects ORDER BY year DESC, id DESC')
  return withDemos(rows)
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id])
  return rows.length ? (await withDemos(rows))[0] : null
}

export async function create({ title, summary, description, stack, repoUrl, year, image }) {
  const [result] = await pool.query(
    'INSERT INTO projects (title, summary, description, stack, repo_url, image, year) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, summary, description, JSON.stringify(stack), repoUrl, image, year]
  )
  return findById(result.insertId)
}

// image: undefined = no tocar la imagen, null = quitarla, texto = nueva ruta
export async function update(id, { title, summary, description, stack, repoUrl, year, image }) {
  const fields = ['title = ?', 'summary = ?', 'description = ?', 'stack = ?', 'repo_url = ?', 'year = ?']
  const values = [title, summary, description, JSON.stringify(stack), repoUrl, year]
  if (image !== undefined) {
    fields.push('image = ?')
    values.push(image)
  }
  await pool.query(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, [...values, id])
  return findById(id)
}

// Las demos del proyecto se borran solas (ON DELETE CASCADE)
export async function remove(id) {
  await pool.query('DELETE FROM projects WHERE id = ?', [id])
}
