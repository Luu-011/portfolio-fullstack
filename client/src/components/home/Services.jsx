import SectionHeader from '../common/SectionHeader'
import { ArrowUpRight } from '../common/Icons'
import { SERVICES } from '../../utils/constants'
import { useFetch } from '../../hooks/useFetch'
import { getServices } from '../../services/serviceService'

export default function Services() {
  const { data } = useFetch(getServices)
  // Mientras carga, o si el backend no responde, se muestran los textos por defecto
  const services = data?.length
    ? data.map((s) => ({ title: s.title, text: s.description }))
    : SERVICES

  return (
    <section id="servicios" className="section">
      <div className="container">
        <SectionHeader label="Qué puedo hacer" title="Servicios pensados para avanzar."
          text="Una colaboración flexible, con objetivos y entregables claros." />
        <ul className="service-list">
          {services.map((s) => (
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
