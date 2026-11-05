//Es el **componente de layout (envoltorio) de toda la web**: pone el **Navbar arriba**, 
// el **Footer abajo** y en el medio un `<Outlet />` (el hueco donde React Router mete la página actual); 
//demás, cada vez que cambias de ruta o de ancla, **hace scroll automático**: si la URL trae `#contacto`, 
// `#servicios`, etc., salta a esa sección con `scrollIntoView()`; si no, sube arriba del todo con `scrollTo(0,0)`.

import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const { pathname, hash } = useLocation()

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
