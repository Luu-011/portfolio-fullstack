import { useRef } from 'react'
import SectionHeader from '../common/SectionHeader'
import { PROCESS } from '../../utils/constants'
import { useScrollReveal } from '../../hooks/useScrollReveal'

// Proceso de trabajo (secuencia real, por eso se numera)
export default function Experience() {
  const root = useRef(null)

  // Los pasos aparecen uno tras otro al llegar con el scroll
  useScrollReveal(root, '.process li')

  return (
    <section id="proceso" className="section" ref={root}>
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