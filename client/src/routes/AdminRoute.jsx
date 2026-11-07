import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Exige rol administrador. Un operador vuelve al panel; alguien sin sesión, al login.
export default function AdminRoute() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/admin" replace />
  return <Outlet />
}
