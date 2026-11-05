//Es la **sección "Cómo trabajo"**: usa el encabezado reutilizable y pinta una **lista ordenada y numerada** (`<ol>`)
//  generada automáticamente desde el array `PROCESS`, 
// donde cada paso muestra su número (`01`, `02`…), su título y su descripción.

import SectionHeader from '../common/SectionHeader'
import { PROCESS } from '../../utils/constants'

// Proceso de trabajo (secuencia real, por eso se numera)
export default function Experience() {
  return (
    <section id="proceso" className="section">
      <div className="container">
        <SectionHeader label="Cómo trabajo" title="De la pregunta al producto."
          text="Un proceso colaborativo para que cada decisión tenga un propósito." />
        <ol className="process">
          {PROCESS.map((p, i) => (
            <li key={p.title}>
              <span className="process-num">0{i + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
