import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useVisitTracker } from '../../hooks/useVisitTracker'

export default function Layout() {
  const { pathname, hash } = useLocation()
  useVisitTracker()

  // Scroll a la sección indicada en la URL (#contacto, #servicios...) o arriba al cambiar de página
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return (
    <div id="inicio">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
