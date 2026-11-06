// Límite simple de peticiones por IP, en memoria (sin dependencias extra).
// Protege el formulario de contacto, que dispara emails, contra abuso.
export function rateLimit({ windowMs = 15 * 60 * 1000, max = 5, message = 'Demasiadas solicitudes. Intenta más tarde.' } = {}) {
  const hits = new Map() // ip -> { count, resetAt }

  setInterval(() => {
    const now = Date.now()
    for (const [ip, h] of hits) if (h.resetAt <= now) hits.delete(ip)
  }, windowMs).unref()

  return (req, res, next) => {
    const now = Date.now()
    const entry = hits.get(req.ip)
    if (!entry || entry.resetAt <= now) {
      hits.set(req.ip, { count: 1, resetAt: now + windowMs })
      return next()
    }
    entry.count += 1
    if (entry.count > max) {
      res.set('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)))
      return res.status(429).json({ message })
    }
    next()
  }
}
