//Es el **pie de página (footer)**: arriba muestra el **logo**, un eslogan y un enlace discreto de 
// **"Acceso de operador"** (con icono de escudo) que lleva a `/login`; abajo, el **copyright con el año actual** 
// (calculado con `new Date().getFullYear()`) y un enlace de ancla para **volver arriba** (`#inicio`).

import { Link } from 'react-router-dom'
import Logo from '../common/Logo'
import { Shield } from '../common/Icons'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <Logo />
          <p className="footer-tagline">Diseño y desarrollo web, con intención.</p>
          <Link to="/login" className="footer-operator"><Shield /> Acceso de operador</Link>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NombreTech</span>
          <a href="#inicio">Volver arriba ↑</a>
        </div>
      </div>
    </footer>
  )
}
