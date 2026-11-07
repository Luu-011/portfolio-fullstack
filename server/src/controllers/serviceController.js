import * as Service from '../models/Service.js'

const notFound = (res) => res.status(404).json({ message: 'El servicio no existe.' })

// Público: solo servicios activos
export async function list(_req, res, next) {
  try {
    res.json(await Service.findActive())
  } catch (err) { next(err) }
}

// Admin: todos, incluso los desactivados
export async function listAll(_req, res, next) {
  try {
    res.json(await Service.findAll())
  } catch (err) { next(err) }
}

export async function create(req, res, next) {
  try {
    const { title, description, refPrice, active } = req.body
    const service = await Service.create({ title, description, refPrice: refPrice ?? null, active: active ?? true })
    res.status(201).json(service)
  } catch (err) { next(err) }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id)
    const current = await Service.findById(id)
    if (!current) return notFound(res)
    const { title, description, refPrice, active } = req.body
    res.json(await Service.update(id, { title, description, refPrice: refPrice ?? null, active: active ?? current.active }))
  } catch (err) { next(err) }
}

export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!(await Service.findById(id))) return notFound(res)
    await Service.remove(id)
    res.status(204).end()
  } catch (err) { next(err) }
}
