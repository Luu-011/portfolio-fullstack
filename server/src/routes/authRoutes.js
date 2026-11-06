import { Router } from 'express'
import { body } from 'express-validator'
import { register, login, me } from '../controllers/authController.js'
import { validate } from '../middlewares/validate.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router()

// Mismas reglas que utils/validators.js del frontend (el servidor nunca confía solo en el cliente)
const nameRule = body('name').isString().withMessage('Escribe tu nombre.').bail().trim()
  .isLength({ min: 2, max: 60 }).withMessage('El nombre debe tener entre 2 y 60 caracteres.').bail()
  .matches(/^[\p{L}\s'.-]+$/u).withMessage('El nombre solo puede contener letras y espacios.')

const emailRule = body('email').isString().withMessage('Escribe tu email.').bail().trim().toLowerCase()
  .isEmail().withMessage('Ingresa un email válido.').bail()
  .isLength({ max: 120 }).withMessage('El email es demasiado largo.')

const passwordRule = body('password').isString().withMessage('Escribe una contraseña.').bail()
  .isLength({ min: 8, max: 72 }).withMessage('La contraseña debe tener entre 8 y 72 caracteres.').bail()
  .matches(/[A-Za-z]/).withMessage('Combina letras y números.').bail()
  .matches(/\d/).withMessage('Combina letras y números.')

router.post('/register', nameRule, emailRule, passwordRule, validate, register)
router.post('/login', emailRule, body('password').isString().withMessage('Escribe tu contraseña.').bail().notEmpty().withMessage('Escribe tu contraseña.'), validate, login)
router.get('/me', authMiddleware, me)

export default router
