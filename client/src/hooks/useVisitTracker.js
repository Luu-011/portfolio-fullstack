import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'
import { registerVisit } from '../services/visitService'

// Avisa al backend de la visita: UNA vez por sesión del navegador (y otra al iniciar sesión,
// que cuenta como acceso de usuario registrado). Usa Web Storage (sessionStorage) para no repetir.
export function useVisitTracker() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const staff = user && user.role !== 'user'
  const key = user ? `visit_user_${user.id}` : 'visit_anon'

  useEffect(() => {
    if (staff) return // el equipo no cuenta como visitante
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      return
    }
    registerVisit(pathname).catch(() => {}) // si falla, no se le muestra nada al visitante
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, staff])
}
