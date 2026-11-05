//Es la **sección "Stack" (herramientas)**: usa el encabezado reutilizable y pinta una **rejilla de tarjetas** 
// (4 por fila en escritorio, 2 en tablet, apiladas en móvil) generada desde `STACK`, 
// donde cada tarjeta muestra un icono de código, el nombre de un grupo de tecnologías 
// y una **lista de etiquetas** (`<ul className="tags">`) con las herramientas de ese grupo.

import SectionHeader from '../common/SectionHeader'
import { Code } from '../common/Icons'
import { STACK } from '../../utils/constants'

export default function Stack() {
  return (
    <section id="stack" className="section">
      <div className="container">
        <SectionHeader label="Herramientas" title="Un stack para ir de punta a punta."
          text="Tecnologías elegidas según el problema, no por moda." />
        <div className="row g-3">
          {STACK.map((group) => (
            <div className="col-sm-6 col-lg-3" key={group.title}>
              <article className="card-soft stack-card">
                <Code className="stack-icon" />
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

