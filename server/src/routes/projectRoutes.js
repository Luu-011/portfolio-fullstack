import { Router } from 'express'
import * as c from '../controllers/projectController.js'
import { validate } from '../middlewares/validate.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { requireRole } from '../middlewares/roleMiddleware.js'
import { uploadImage } from '../middlewares/upload.js'
import { idParam, projectRules, demoRules } from '../utils/contentRules.js'

const router = Router()
const admin = [authMiddleware, requireRole('admin')]

// Cualquier usuario registrado puede ver proyectos y demos
router.get('/', authMiddleware, c.list)
router.get('/:id', authMiddleware, idParam('id'), validate, c.get)

// Solo el administrador gestiona el contenido (las imágenes llegan como multipart/form-data)
router.post('/', ...admin, uploadImage, ...projectRules, validate, c.create)
router.put('/:id', ...admin, idParam('id'), uploadImage, ...projectRules, validate, c.update)
router.delete('/:id', ...admin, idParam('id'), validate, c.remove)

router.post('/:id/demos', ...admin, idParam('id'), ...demoRules, validate, c.createDemo)
router.put('/:id/demos/:demoId', ...admin, idParam('id'), idParam('demoId'), ...demoRules, validate, c.updateDemo)
router.delete('/:id/demos/:demoId', ...admin, idParam('id'), idParam('demoId'), validate, c.removeDemo)

export default router
