//Es la sección "Sobre mí": usa el encabezado reutilizable, muestra un avatar con la inicial 
// (oculto para lectores de pantalla) y una presentación personal en dos bloques,
//  y termina con un enlace de ancla que salta a la sección de contacto.

import SectionHeader from '../common/SectionHeader'

export default function About() {
  return (
    <section id="sobre-mi" className="section">
      <div className="container">
        <SectionHeader label="Un poco sobre mí" title="Tecnología útil, hecha con criterio."
          text="Un enfoque integral para construir experiencias digitales que se entienden y funcionan." />
        <div className="about-grid">
          <div className="about-intro">
            <span className="avatar" aria-hidden="true">N.</span>
            <p>Hola, soy <strong>NombreTech</strong>. Me interesa resolver problemas reales con
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
