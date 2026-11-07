import { Router } from 'express'
import { body, query } from 'express-validator'
import * as c from '../controllers/userController.js'
import { validate } from '../middlewares/validate.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { requireRole } from '../middlewares/roleMiddleware.js'
import { idParam } from '../utils/contentRules.js'
import { ROLES } from '../utils/constants.js'

const router = Router()

// Gestión de usuarios: solo administrador
router.use(authMiddleware, requireRole('admin'))

router.get('/', query('role').optional().isIn(ROLES).withMessage('Rol no válido.'), validate, c.list)
router.put('/:id/role', idParam('id'), body('role').isIn(ROLES).withMessage('Rol no válido.'), validate, c.updateRole)
router.delete('/:id', idParam('id'), validate, c.remove)

export default router
