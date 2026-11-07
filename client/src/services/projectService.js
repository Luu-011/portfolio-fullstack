import { api } from './api'

export const getProjects = () => api.get('/projects')                      // requiere sesión
export const getProjectById = (id) => api.get(`/projects/${id}`)

// Solo administrador. Crear y editar reciben un FormData (puede incluir la imagen)
export const createProject = (formData) => api.post('/projects', formData)
export const updateProject = (id, formData) => api.put(`/projects/${id}`, formData)
export const deleteProject = (id) => api.delete(`/projects/${id}`)

// Cada operación sobre una demo devuelve el proyecto completo y actualizado
export const createDemo = (projectId, data) => api.post(`/projects/${projectId}/demos`, data)
export const updateDemo = (projectId, demoId, data) => api.put(`/projects/${projectId}/demos/${demoId}`, data)
export const deleteDemo = (projectId, demoId) => api.delete(`/projects/${projectId}/demos/${demoId}`)
