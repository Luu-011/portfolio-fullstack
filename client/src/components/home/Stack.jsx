import { useRef } from 'react'
import SectionHeader from '../common/SectionHeader'
import { STACK } from '../../utils/constants'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import imgFrontend from '../../assets/front.jpeg'
import imgBackend from '../../assets/back.jpeg'
import imgDatos from '../../assets/datos.jpeg'
import imgHerramientas from '../../assets/herramientas.jpeg'

// La clave tiene que coincidir exactamente con el título de cada grupo en STACK
const IMAGENES = {
  Frontend: imgFrontend,
  Backend: imgBackend,
  Datos: imgDatos,
  Herramientas: imgHerramientas,
}

export default function Stack() {
  const root = useRef(null)

  // Las tarjetas aparecen escalonadas al llegar con el scroll
  useScrollReveal(root, '.stack-card')

  return (
    <section id="stack" className="section" ref={root}>
      <div className="container">
        <SectionHeader label="Herramientas" title="Un stack para ir de punta a punta."
          text="Tecnologías elegidas según el problema, no por moda." />
        <div className="row g-3">
          {STACK.map((group) => (
            <div className="col-sm-6 col-lg-3" key={group.title}>
              <article className="card-soft stack-card">
                {IMAGENES[group.title] && (
                  <img
                    className="stack-img"
                    src={IMAGENES[group.title]}
                    alt=""
                    width="400"
                    height="160"
                    loading="lazy"
                  />
                )}
                <h3>{group.title}</h3>
                <ul className="tags">
                  {group.items.map((i) => <li key={i}>{i}</li>)}
                </ul>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}