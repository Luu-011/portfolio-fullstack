import { api } from './api'

export const getProjects = () => api.get('/projects')                      // requiere sesión
export const getProjectById = (id) => api.get(`/projects/${id}`)
