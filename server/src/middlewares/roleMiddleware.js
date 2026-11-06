// Uso: router.get('/ruta', authMiddleware, requireRole('operator', 'admin'), controlador)
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'No tienes permiso para hacer esto.' })
  }
  next()
}
