import { useRef } from 'react'
import SectionHeader from '../common/SectionHeader'
import { PROCESS } from '../../utils/constants'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import imgEntender from '../../assets/entender.jpeg'
import imgDisenar from '../../assets/disenar.jpeg'
import imgDesarrollar from '../../assets/desarrollar.jpeg'

// La clave tiene que coincidir exactamente con el título de cada paso en PROCESS
const IMAGENES = {
  Entender: imgEntender,
  Diseñar: imgDisenar,
  Desarrollar: imgDesarrollar,
}

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
              {IMAGENES[p.title] && (
                <img
                  className="process-img"
                  src={IMAGENES[p.title]}
                  alt=""
                  width="400"
                  height="160"
                  loading="lazy"
                />
              )}
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}