import { api } from './api'

export const sendContact = (data) => api.post('/contacts', data)           // público
export const getContacts = () => api.get('/contacts')                      // operador / admin
export const replyContact = (id, { text }) => api.post(`/contacts/${id}/replies`, { text })
