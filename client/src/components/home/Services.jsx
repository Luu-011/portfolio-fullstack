import { useRef } from 'react'
import SectionHeader from '../common/SectionHeader'
import { ArrowUpRight } from '../common/Icons'
import { SERVICES } from '../../utils/constants'
import { useFetch } from '../../hooks/useFetch'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { getServices } from '../../services/serviceService'

export default function Services() {
  const { data } = useFetch(getServices)
  const root = useRef(null)

  // Mientras carga, o si el backend no responde, se muestran los textos por defecto
  const services = data?.length
    ? data.map((s) => ({ title: s.title, text: s.description }))
    : SERVICES

  // Las filas aparecen escalonadas al llegar con el scroll
  useScrollReveal(root, '.service-list li', [data])

  return (
    <section id="servicios" className="section" ref={root}>
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