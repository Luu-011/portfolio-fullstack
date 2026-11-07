import { Router } from 'express'
import { body } from 'express-validator'
import { record } from '../controllers/visitController.js'
import { validate } from '../middlewares/validate.js'
import { optionalAuth } from '../middlewares/authMiddleware.js'
import { rateLimit } from '../middlewares/rateLimit.js'

const router = Router()

// Evita que alguien infle el contador mandando visitas en masa
const visitLimiter = rateLimit({
  max: Number(process.env.VISIT_RATE_MAX || 30),
  message: 'Demasiadas solicitudes. Intenta más tarde.',
})

const pathRule = body('path').isString().withMessage('Ruta no válida.').bail().trim()
  .matches(/^\/[A-Za-z0-9\-._~/%]{0,254}$/).withMessage('Ruta no válida.')

router.post('/', visitLimiter, optionalAuth, pathRule, validate, record)

export default router
