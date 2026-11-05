import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../common/Logo'
import { ArrowUpRight } from '../common/Icons'
import { NAV_LINKS } from '../../utils/constants'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const close = () => setOpen(false)

  const handleLogout = () => {
    logout()
    close()
    navigate('/')
  }

  return (
    <header className="site-nav">
      <div className="container nav-inner">
        <Logo />

        <button className="nav-toggle" aria-expanded={open} aria-controls="nav-menu"
          onClick={() => setOpen(!open)}>
          {open ? 'Cerrar' : 'Menú'}
        </button>

        <nav id="nav-menu" className={`nav-menu ${open ? 'is-open' : ''}`}>
          <ul className="nav-links">
            {NAV_LINKS.map((l) => (
              <li key={l.hash}>
                <Link to={`/#${l.hash}`} onClick={close}>{l.label}</Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            {user ? (
              <>
                {['admin', 'operator'].includes(user.role) && <Link to="/admin" onClick={close} className="nav-text-link">Panel</Link>}
                <button className="btn btn-ghost" onClick={handleLogout}>Salir</button>
              </>
            ) : (
              <Link to="/login" onClick={close} className="btn btn-brand">
                Iniciar sesión <ArrowUpRight />
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
