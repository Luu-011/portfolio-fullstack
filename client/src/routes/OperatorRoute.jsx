import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ALLOWED = ['operator', 'admin']

// Exige rol operador o administrador
export default function OperatorRoute() {
  const { user } = useAuth()
  if (!user || !ALLOWED.includes(user.role)) return <Navigate to="/login" replace />
  return <Outlet />
}
