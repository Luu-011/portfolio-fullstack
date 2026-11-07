import { pool } from '../config/db.js'
import { CONTACT_TYPES } from '../utils/constants.js'

// Todas las consultas usan parámetros (?): los valores nunca se pegan dentro del SQL.
// Las mismas consultas están comentadas en database/queries.sql para la documentación.

const pad = (n) => String(n).padStart(2, '0')
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const ym = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`

export async function summary() {
  const [[visits]] = await pool.query(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(user_id IS NULL), 0) AS anonymous,
            COALESCE(SUM(user_id IS NOT NULL), 0) AS registered
       FROM visits`
  )
  const [[users]] = await pool.query("SELECT COUNT(*) AS total FROM users WHERE role = 'user'")
  const [[contacts]] = await pool.query(
    `SELECT COUNT(*) AS total, COALESCE(SUM(status = 'pendiente'), 0) AS pending FROM contacts`
  )
  const [[projects]] = await pool.query('SELECT COUNT(*) AS total FROM projects')
  return {
    visits: { total: Number(visits.total), anonymous: Number(visits.anonymous), registered: Number(visits.registered) },
    users: Number(users.total),
    contacts: { total: Number(contacts.total), pending: Number(contacts.pending) },
    projects: Number(projects.total),
  }
}

// Visitas por día de los últimos N días (los días sin visitas aparecen con 0)
export async function visitsByDay(days) {
  const [rows] = await pool.query(
    `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS day,
            COUNT(*) AS total,
            SUM(user_id IS NOT NULL) AS registered
       FROM visits
      WHERE created_at >= (CURDATE() - INTERVAL ? DAY)
      GROUP BY day
      ORDER BY day`,
    [days - 1]
  )
  const byDay = new Map(rows.map((r) => [r.day, r]))
  const result = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = ymd(d)
    const r = byDay.get(key)
    result.push({ date: key, total: Number(r?.total || 0), registered: Number(r?.registered || 0) })
  }
  return result
}

// Usuarios registrados por mes (flujo de registros)
export async function registrationsByMonth(months) {
  const [rows] = await pool.query(
    `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
       FROM users
      WHERE role = 'user'
        AND created_at >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL ? MONTH)
      GROUP BY month
      ORDER BY month`,
    [months - 1]
  )
  const byMonth = new Map(rows.map((r) => [r.month, r.count]))
  const result = []
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const key = ym(new Date(now.getFullYear(), now.getMonth() - i, 1))
    result.push({ month: key, count: Number(byMonth.get(key) || 0) })
  }
  return result
}

// Tipos de consulta más frecuentes; days (opcional) limita a los últimos N días
export async function contactsByType(days) {
  const [rows] = days
    ? await pool.query(
        'SELECT type, COUNT(*) AS count FROM contacts WHERE created_at >= (CURDATE() - INTERVAL ? DAY) GROUP BY type',
        [days]
      )
    : await pool.query('SELECT type, COUNT(*) AS count FROM contacts GROUP BY type')
  const byType = new Map(rows.map((r) => [r.type, r.count]))
  return CONTACT_TYPES.map((type) => ({ type, count: Number(byType.get(type) || 0) }))
    .sort((a, b) => b.count - a.count)
}

// Páginas por las que más entra la gente
export async function topPages(limit) {
  const [rows] = await pool.query(
    'SELECT path, COUNT(*) AS count FROM visits GROUP BY path ORDER BY count DESC, path LIMIT ?',
    [limit]
  )
  return rows.map((r) => ({ path: r.path, count: Number(r.count) }))
}
