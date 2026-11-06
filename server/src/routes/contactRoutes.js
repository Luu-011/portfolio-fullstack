import { Router } from 'express'
import { query, param } from 'express-validator'
import { create, list, reply } from '../controllers/contactController.js'
import { validate } from '../middlewares/validate.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { requireRole } from '../middlewares/roleMiddleware.js'
import { rateLimit } from '../middlewares/rateLimit.js'
import { nameRule, emailRule, typeRule, messageRule, replyRule } from '../utils/rules.js'
import { CONTACT_STATUS } from '../utils/constants.js'

const router = Router()

const contactLimiter = rateLimit({
  max: Number(process.env.CONTACT_RATE_MAX || 5),
  message: 'Enviaste varias consultas seguidas. Intenta de nuevo en unos minutos.',
})

// Público: formulario de contacto
router.post('/', contactLimiter, nameRule, emailRule, typeRule, messageRule, validate, create)

// Operador o administrador
const staff = [authMiddleware, requireRole('operator', 'admin')]

router.get('/', ...staff,
  query('status').optional().isIn(CONTACT_STATUS).withMessage('Estado no válido.'),
  validate, list)

router.post('/:id/replies', ...staff,
  param('id').isInt({ min: 1 }).withMessage('Consulta no válida.'),
  replyRule, validate, reply)

export default router
