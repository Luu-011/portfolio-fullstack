import express from 'express'
import cors from 'cors'
import { pool } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'
import visitRoutes from './routes/visitRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { UPLOADS_DIR } from './utils/images.js'
import { notFound, errorHandler } from './middlewares/errorHandler.js'

const app = express()

// Necesario cuando la API está detrás de un proxy (Render, Vercel): así req.ip es la IP real del visitante
app.set('trust proxy', 1)

// CLIENT_URL admite varios orígenes separados por coma (sin "/" al final):
//   http://localhost:5173,https://tu-sitio.vercel.app
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',').map((o) => o.trim().replace(/\/$/, '')).filter(Boolean)
app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '100kb' }))

// Comprueba que la API y la base de datos responden
app.get('/api/health', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// Imágenes subidas: se sirven como archivos estáticos, sin listado de carpeta
app.use('/uploads', express.static(UPLOADS_DIR, {
  index: false,
  dotfiles: 'deny',
  setHeaders: (res) => {
    res.set('X-Content-Type-Options', 'nosniff')
    res.set('Cross-Origin-Resource-Policy', 'cross-origin') // permite mostrarlas en el frontend (otro dominio)
  },
}))

app.use('/api/auth', authRoutes)
app.use('/api/contacts', contactRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/visits', visitRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/users', userRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
