import { api } from './api'

export const getSummary = () => api.get('/analytics/summary')
export const getVisitsByDay = (days = 30) => api.get(`/analytics/visits-by-day?days=${days}`)
export const getRegistrations = (months = 6) => api.get(`/analytics/registrations?months=${months}`)
export const getContactsByType = (days) => api.get(days ? `/analytics/contacts-by-type?days=${days}` : '/analytics/contacts-by-type')
export const getTopPages = (limit = 5) => api.get(`/analytics/top-pages?limit=${limit}`)
