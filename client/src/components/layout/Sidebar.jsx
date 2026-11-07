import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const STAFF_LINKS = [
  { to: '/admin', label: 'Resumen', end: true },
  { to: '/admin/mensajes', label: 'Consultas' },
]

// Solo el administrador ve estas secciones
const ADMIN_LINKS = [
  { to: '/admin/estadisticas', label: 'Estadísticas' },
  { to: '/admin/proyectos', label: 'Proyectos' },
  { to: '/admin/servicios', label: 'Servicios' },
  { to: '/admin/usuarios', label: 'Usuarios' },
]

export default function Sidebar() {
  const { user } = useAuth()
  const links = user?.role === 'admin' ? [...STAFF_LINKS, ...ADMIN_LINKS] : STAFF_LINKS

  return (
    <nav className="sidebar" aria-label="Panel de gestión">
      <p className="sidebar-title">Panel</p>
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : undefined)}>
          {l.label}
        </NavLink>
      ))}
    </nav>
  )
}
