import * as Project from '../models/Project.js'
import * as Demo from '../models/Demo.js'
import { saveImage, deleteImage } from '../utils/images.js'

const notFound = (res, what = 'El proyecto') => res.status(404).json({ message: `${what} no existe.` })

export async function list(_req, res, next) {
  try {
    res.json(await Project.findAll())
  } catch (err) { next(err) }
}

export async function get(req, res, next) {
  try {
    const project = await Project.findById(Number(req.params.id))
    if (!project) return notFound(res)
    res.json(project)
  } catch (err) { next(err) }
}

export async function create(req, res, next) {
  try {
    const { title, summary, description, stack, repoUrl, year } = req.body
    const image = req.image ? await saveImage(req.image.buffer, req.image.ext) : null
    const project = await Project.create({ title, summary, description, stack, repoUrl: repoUrl || null, year: year || null, image })
    res.status(201).json(project)
  } catch (err) { next(err) }
}

export async function update(req, res, next) {
  try {
    const id = Number(req.params.id)
    const current = await Project.findById(id)
    if (!current) return notFound(res)

    const { title, summary, description, stack, repoUrl, year, removeImage } = req.body
    let image // undefined = se conserva la imagen actual
    if (req.image) image = await saveImage(req.image.buffer, req.image.ext)
    else if (removeImage) image = null

    const project = await Project.update(id, { title, summary, description, stack, repoUrl: repoUrl || null, year: year || null, image })
    if (image !== undefined) await deleteImage(current.image)
    res.json(project)
  } catch (err) { next(err) }
}

export async function remove(req, res, next) {
  try {
    const id = Number(req.params.id)
    const current = await Project.findById(id)
    if (!current) return notFound(res)
    await Project.remove(id)
    await deleteImage(current.image)
    res.status(204).end()
  } catch (err) { next(err) }
}

// Las operaciones sobre demos devuelven el proyecto completo y actualizado
export async function createDemo(req, res, next) {
  try {
    const projectId = Number(req.params.id)
    if (!(await Project.findById(projectId))) return notFound(res)
    await Demo.create(projectId, req.body)
    res.status(201).json(await Project.findById(projectId))
  } catch (err) { next(err) }
}

export async function updateDemo(req, res, next) {
  try {
    const projectId = Number(req.params.id)
    const demoId = Number(req.params.demoId)
    if (!(await Demo.exists(demoId, projectId))) return notFound(res, 'La demo')
    await Demo.update(demoId, projectId, req.body)
    res.json(await Project.findById(projectId))
  } catch (err) { next(err) }
}

export async function removeDemo(req, res, next) {
  try {
    const projectId = Number(req.params.id)
    const demoId = Number(req.params.demoId)
    if (!(await Demo.exists(demoId, projectId))) return notFound(res, 'La demo')
    await Demo.remove(demoId, projectId)
    res.json(await Project.findById(projectId))
  } catch (err) { next(err) }
}
