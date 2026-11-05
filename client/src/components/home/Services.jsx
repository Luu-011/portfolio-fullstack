//Es la **sección "Servicios"**: usa el encabezado reutilizable y pinta una **lista** (`<ul>`) 
// generada desde `SERVICES`, donde cada servicio es una **fila clicable** (un `<a href="#contacto">`) con título, 
// descripción y una flecha ↗, de modo que **todo el servicio** lleva a la sección de contacto.

import SectionHeader from '../common/SectionHeader'
import { ArrowUpRight } from '../common/Icons'
import { SERVICES } from '../../utils/constants'

export default function Services() {
  return (
    <section id="servicios" className="section">
      <div className="container">
        <SectionHeader label="Qué puedo hacer" title="Servicios pensados para avanzar."
          text="Una colaboración flexible, con objetivos y entregables claros." />
        <ul className="service-list">
          {SERVICES.map((s) => (
            <li key={s.title}>
              <a href="#contacto" className="service-row">
                <span>
                  <h3>{s.title}</h3>
                  <span className="service-text">{s.text}</span>
                </span>
                <ArrowUpRight className="service-arrow" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
