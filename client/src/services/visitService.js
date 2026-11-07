import { api } from './api'

export const registerVisit = (path) => api.post('/visits', { path })
