import { verifyToken } from '../utils/token.js'
import { findById } from '../models/User.js'

const EXPIRED = { message: 'Tu sesión expiró. Inicia sesión de nuevo.' }

// Exige un token válido en el header  Authorization: Bearer <token>
export async function authMiddleware(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ')
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Necesitas iniciar sesión.' })
  }

  let payload
  try {
    payload = verifyToken(token)
  } catch {
    return res.status(401).json(EXPIRED)
  }

  try {
    // El rol se lee de la base en cada petición: si se borra a un usuario o se le cambia
    // el rol, el cambio rige de inmediato y no recién cuando vence su token.
    const user = await findById(payload.id)
    if (!user) return res.status(401).json(EXPIRED)
    req.user = { id: user.id, role: user.role }
    next()
  } catch (err) {
    next(err)
  }
}

// Como authMiddleware, pero NO falla si no hay token o es inválido: la persona se trata como visitante.
// Se usa en rutas públicas que registran quién es el usuario cuando está logueado (ej. visitas).
export function optionalAuth(req, _res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ')
  if (scheme === 'Bearer' && token) {
    try {
      const payload = verifyToken(token)
      req.user = { id: payload.id, role: payload.role }
    } catch {
      /* token inválido o vencido: sigue como visitante */
    }
  }
  next()
}
