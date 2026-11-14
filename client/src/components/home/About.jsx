import { useRef } from 'react'
import SectionHeader from '../common/SectionHeader'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import perfil from '../../assets/canelo.jpeg'

export default function About() {
  const root = useRef(null)

  // Los dos bloques aparecen escalonados al llegar con el scroll
  useScrollReveal(root, '.about-intro, .about-text')

  return (
    <section id="sobre-mi" className="section" ref={root}>
      <div className="container">
        <SectionHeader label="Un poco sobre mí" title="Tecnología útil, hecha con criterio."
          text="Un enfoque integral para construir experiencias digitales que se entienden y funcionan." />
        <div className="about-grid">
          <div className="about-intro">
            <img className="avatar avatar-img" src={perfil} alt="Foto de perfil de CaneloTech" width="140" height="500" />
            <p>Hola, soy <strong>CaneloTech</strong>. Me interesa resolver problemas reales con
              productos digitales claros, accesibles y bien construidos.</p>
          </div>
          <div className="about-text">
            <p>Acompaño cada etapa: entender la necesidad, diseñar la experiencia, construir el
              frontend y conectar el backend con datos confiables.</p>
            <p>El objetivo no es sumar complejidad. Es entregar una solución que sea fácil de usar y de mantener.</p>
            <a href="#contacto" className="text-link">Conversemos</a>
          </div>
        </div>
      </div>
    </section>
  )
}