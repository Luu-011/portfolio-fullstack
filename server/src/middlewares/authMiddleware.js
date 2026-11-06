import { verifyToken } from '../utils/token.js'

// Exige un token válido en el header  Authorization: Bearer <token>
export function authMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Necesitas iniciar sesión.' })
  }
  try {
    const payload = verifyToken(token)
    req.user = { id: payload.id, role: payload.role }
    next()
  } catch {
    res.status(401).json({ message: 'Tu sesión expiró. Inicia sesión de nuevo.' })
  }
}
