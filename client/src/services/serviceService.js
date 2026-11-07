import { api } from './api'

export const getServices = () => api.get('/services')                      // público: solo activos

// Solo administrador
export const getAllServices = () => api.get('/services/all')
export const createService = (data) => api.post('/services', data)
export const updateService = (id, data) => api.put(`/services/${id}`, data)
export const deleteService = (id) => api.delete(`/services/${id}`)
