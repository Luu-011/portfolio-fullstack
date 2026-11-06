import { validationResult } from 'express-validator'

// Se coloca después de las reglas (body(...)) de cada ruta
export function validate(req, res, next) {
  const result = validationResult(req)
  if (result.isEmpty()) return next()
  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }))
  res.status(400).json({ message: errors[0].message, errors })
}
