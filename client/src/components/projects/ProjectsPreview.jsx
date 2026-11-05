//Esto lo que hace es que que por ahora muestra un mensaje de "próximamente", pero que oculta el contenido 
// real detrás de un registro: si no tienes cuenta, te invita a crearla; si ya la tienes, 
// te deja entrar a ver los proyectos.

import { Link } from 'react-router-dom'
import SectionHeader from '../common/SectionHeader'
import { Layers, Lock, ArrowUpRight } from '../common/Icons'
import { useAuth } from '../../hooks/useAuth'

export default function ProjectsPreview() {
  const { user } = useAuth()
  return (
    <section id="proyectos" className="section">
      <div className="container">
        <SectionHeader label="Selección de trabajos" title="Proyectos con propósito."
          text="Casos de estudio y demos construidos para explorar ideas, resolver necesidades y aprender haciendo." />

        <div className="empty-box">
          <span className="empty-icon"><Layers /></span>
          <div className="flex-grow-1">
            <strong>Los próximos casos empiezan aquí.</strong>
            <p className="mb-0">Esta sección se actualizará con proyectos y demos interactivas.</p>
          </div>
          <a href="#contacto" className="text-link">Proponer una colaboración</a>
        </div>

        <div className="gate">
          <span><Lock /> {user ? 'Ya puedes ver el detalle completo y las demos.' : 'Para ver el detalle completo y las demos, crea una cuenta o inicia sesión.'}</span>
          {user
            ? <Link to="/proyectos" className="text-link">Ver proyectos <ArrowUpRight /></Link>
            : <Link to="/registro" className="text-link">Crear cuenta <ArrowUpRight /></Link>}
        </div>
      </div>
    </section>
  )
}
