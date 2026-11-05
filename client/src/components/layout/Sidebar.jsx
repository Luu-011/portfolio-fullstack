import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/admin', label: 'Resumen', end: true },
  { to: '/admin/mensajes', label: 'Consultas' },
]

export default function Sidebar() {
  return (
    <nav className="sidebar" aria-label="Panel de gestión">
      <p className="sidebar-title">Panel</p>
      {LINKS.map((l) => (
        <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : undefined)}>
          {l.label}
        </NavLink>
      ))}
    </nav>
  )
}
