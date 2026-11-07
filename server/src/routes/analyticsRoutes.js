import { Router } from 'express'
import { query } from 'express-validator'
import * as c from '../controllers/analyticsController.js'
import { validate } from '../middlewares/validate.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { requireRole } from '../middlewares/roleMiddleware.js'

const router = Router()

// Todo el analytics es solo para el administrador
router.use(authMiddleware, requireRole('admin'))

const intParam = (name, min, max) =>
  query(name).optional().isInt({ min, max }).withMessage(`${name} debe ser un número entre ${min} y ${max}.`)

router.get('/summary', c.summary)
router.get('/visits-by-day', intParam('days', 1, 365), validate, c.visitsByDay)
router.get('/registrations', intParam('months', 1, 24), validate, c.registrations)
router.get('/contacts-by-type', intParam('days', 1, 365), validate, c.contactsByType)
router.get('/top-pages', intParam('limit', 1, 20), validate, c.topPages)

export default router
