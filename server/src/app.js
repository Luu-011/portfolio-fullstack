import express from 'express'
import cors from 'cors'
import { pool } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import { notFound, errorHandler } from './middlewares/errorHandler.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
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

app.use('/api/auth', authRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
