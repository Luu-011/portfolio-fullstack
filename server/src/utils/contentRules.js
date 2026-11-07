import { body, param } from 'express-validator'

export const idParam = (name = 'id') => param(name).isInt({ min: 1 }).withMessage('Identificador no válido.')

const urlOptions = { protocols: ['http', 'https'], require_protocol: true }
const urlMessage = 'Ingresa una URL válida que empiece con http:// o https://'

// En multipart la lista llega como texto: acepta JSON ('["React","Node"]') o separada por comas
const parseStack = (v) => {
  const clean = (arr) => arr.map((s) => String(s).trim()).filter(Boolean)
  if (Array.isArray(v)) return clean(v)
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v)
      if (Array.isArray(parsed)) return clean(parsed)
    } catch { /* no era JSON */ }
    return clean(v.split(','))
  }
  return []
}

export const projectRules = [
  body('title').isString().withMessage('Escribe el título.').bail().trim()
    .isLength({ min: 2, max: 100 }).withMessage('El título debe tener entre 2 y 100 caracteres.'),
  body('summary').isString().withMessage('Escribe un resumen.').bail().trim()
    .isLength({ min: 5, max: 255 }).withMessage('El resumen debe tener entre 5 y 255 caracteres.'),
  body('description').isString().withMessage('Escribe la descripción.').bail().trim()
    .isLength({ min: 10, max: 5000 }).withMessage('La descripción debe tener entre 10 y 5000 caracteres.'),
  body('stack').customSanitizer(parseStack)
    .isArray({ min: 1, max: 10 }).withMessage('Indica entre 1 y 10 tecnologías.').bail()
    .custom((arr) => arr.every((s) => s.length <= 30)).withMessage('Cada tecnología puede tener hasta 30 caracteres.'),
  body('repoUrl').optional({ values: 'falsy' }).trim()
    .isURL(urlOptions).withMessage(urlMessage).bail()
    .isLength({ max: 255 }).withMessage('La URL es demasiado larga.'),
  body('year').optional({ values: 'falsy' })
    .isInt({ min: 2000, max: 2100 }).withMessage('El año debe estar entre 2000 y 2100.').toInt(),
  body('removeImage').optional().isBoolean().withMessage('Valor no válido.').toBoolean(),
]

export const demoRules = [
  body('title').isString().withMessage('Escribe el título de la demo.').bail().trim()
    .isLength({ min: 2, max: 100 }).withMessage('El título debe tener entre 2 y 100 caracteres.'),
  body('description').optional({ values: 'falsy' }).isString().bail().trim()
    .isLength({ max: 255 }).withMessage('La descripción no puede superar los 255 caracteres.'),
  body('url').isString().withMessage('Escribe la URL de la demo.').bail().trim()
    .isURL(urlOptions).withMessage(urlMessage).bail()
    .isLength({ max: 255 }).withMessage('La URL es demasiado larga.'),
]

export const serviceRules = [
  body('title').isString().withMessage('Escribe el título.').bail().trim()
    .isLength({ min: 2, max: 100 }).withMessage('El título debe tener entre 2 y 100 caracteres.'),
  body('description').isString().withMessage('Escribe la descripción.').bail().trim()
    .isLength({ min: 5, max: 1000 }).withMessage('La descripción debe tener entre 5 y 1000 caracteres.'),
  body('refPrice').optional({ values: 'falsy' })
    .isFloat({ min: 0, max: 99999999 }).withMessage('El precio de referencia debe ser un número positivo.').toFloat(),
  body('active').optional().isBoolean().withMessage('El estado activo debe ser verdadero o falso.').toBoolean(),
]
