import * as User from '../models/User.js'

export async function list(req, res, next) {
  try {
    res.json(await User.findAllWithStats({ role: req.query.role }))
  } catch (err) { next(err) }
}

export async function updateRole(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (id === req.user.id) return res.status(400).json({ message: 'No puedes cambiar tu propio rol.' })
    if (!(await User.findById(id))) return res.status(404).json({ message: 'El usuario no existe.' })
    res.json(await User.updateRole(id, req.body.role))
  } catch (err) { next(err) }
}

export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (id === req.user.id) return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta.' })
    if (!(await User.findById(id))) return res.status(404).json({ message: 'El usuario no existe.' })
    await User.remove(id)
    res.status(204).end()
  } catch (err) { next(err) }
}
