import multer from 'multer'
import { detectImageType } from '../utils/images.js'

const MAX_MB = 2

const uploader = multer({
  storage: multer.memoryStorage(), // no se escribe nada en disco hasta que todo esté validado
  limits: { fileSize: MAX_MB * 1024 * 1024, files: 1 },
})

// Campo de formulario "image" (opcional). Deja el archivo validado en req.image = { buffer, ext }
export const uploadImage = [
  uploader.single('image'),
  (req, res, next) => {
    if (!req.file) return next()
    const type = detectImageType(req.file.buffer)
    if (!type) return res.status(400).json({ message: 'La imagen debe ser un JPG, PNG o WebP válido.' })
    req.image = { buffer: req.file.buffer, ext: type.ext }
    next()
  },
]
