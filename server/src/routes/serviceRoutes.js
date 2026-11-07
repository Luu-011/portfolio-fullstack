import { Router } from 'express'
import * as c from '../controllers/serviceController.js'
import { validate } from '../middlewares/validate.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { requireRole } from '../middlewares/roleMiddleware.js'
import { idParam, serviceRules } from '../utils/contentRules.js'

const router = Router()
const admin = [authMiddleware, requireRole('admin')]

router.get('/', c.list)                       // público: servicios activos (para la home)
router.get('/all', ...admin, c.listAll)       // admin: todos

router.post('/', ...admin, ...serviceRules, validate, c.create)
router.put('/:id', ...admin, idParam('id'), ...serviceRules, validate, c.update)
router.delete('/:id', ...admin, idParam('id'), validate, c.remove)

export default router
