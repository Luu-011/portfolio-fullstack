import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Exige rol administrador
export default function AdminRoute() {
  const { user } = useAuth()
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />
  return <Outlet />
}
