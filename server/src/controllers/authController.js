import bcrypt from 'bcryptjs'
import * as User from '../models/User.js'
import { signToken } from '../utils/token.js'

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role })

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body

    if (await User.findByEmail(email)) {
      return res.status(409).json({ message: 'Ya existe una cuenta con ese email.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash })
    res.status(201).json({ token: signToken(user), user: publicUser(user) })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe una cuenta con ese email.' })
    }
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findByEmail(email)
    const valid = user && (await bcrypt.compare(password, user.password_hash))

    // Mismo mensaje si falla el email o la contraseña: no revela qué cuentas existen
    if (!valid) return res.status(401).json({ message: 'Email o contraseña incorrectos.' })

    res.json({ token: signToken(user), user: publicUser(user) })
  } catch (err) {
    next(err)
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(401).json({ message: 'La cuenta ya no existe.' })
    res.json({ user: publicUser(user) })
  } catch (err) {
    next(err)
  }
}
