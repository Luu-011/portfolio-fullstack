import * as Visit from '../models/Visit.js'

// POST /api/visits  (público; si hay sesión, la visita se asocia al usuario)
export async function record(req, res, next) {
  try {
    // El equipo (operador/admin) no cuenta como visitante: así las métricas reflejan tráfico real
    if (req.user && req.user.role !== 'user') return res.status(204).end()

    await Visit.create({ userId: req.user?.id ?? null, path: req.body.path, ip: req.ip })
    res.status(201).json({ ok: true })
  } catch (err) {
    next(err)
  }
}
