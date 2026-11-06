import { Router } from 'express'
import { body } from 'express-validator'
import { register, login, me } from '../controllers/authController.js'
import { validate } from '../middlewares/validate.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { nameRule, emailRule, passwordRule } from '../utils/rules.js'

const router = Router()

router.post('/register', nameRule, emailRule, passwordRule, validate, register)
router.post('/login', emailRule, body('password').isString().withMessage('Escribe tu contraseña.').bail().notEmpty().withMessage('Escribe tu contraseña.'), validate, login)
router.get('/me', authMiddleware, me)

export default router
