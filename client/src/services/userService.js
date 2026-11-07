import { api } from './api'

export const getUsers = () => api.get('/users')
export const updateUserRole = (id, role) => api.put(`/users/${id}/role`, { role })
export const deleteUser = (id) => api.delete(`/users/${id}`)
