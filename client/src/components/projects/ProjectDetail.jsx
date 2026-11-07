import { useState } from 'react'
import { ArrowUpRight } from '../common/Icons'
import DemoViewer from './DemoViewer'
import { API_ORIGIN } from '../../services/api'
import '../../styles/media.css'

export default function ProjectDetail({ project }) {
  const [activeDemo, setActiveDemo] = useState(null)

  return (
    <>
      <div className="detail-grid">
        <div>
          <h1>{project.title}</h1>
          <p className="lead-text">{project.summary}</p>
          {project.image && <img className="project-hero" src={`${API_ORIGIN}${project.image}`} alt={`Imagen del proyecto ${project.title}`} />}
          <p>{project.description}</p>
        </div>

        <aside className="card-soft detail-side">
          <h3>Tecnologías</h3>
          <ul className="tags">
            {project.stack.map((t) => <li key={t}>{t}</li>)}
          </ul>
          <h3>Año</h3>
          <p className="mb-0">{project.year}</p>
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-link">
              Ver código en GitHub <ArrowUpRight />
            </a>
          )}
        </aside>
      </div>

      <section className="demos">
        <h2 className="subhead">Demos</h2>
        {project.demos.length === 0 ? (
          <p>Este proyecto todavía no tiene demos publicadas.</p>
        ) : (
          <ul className="demo-list">
            {project.demos.map((d) => (
              <li key={d.id} className="demo-item">
                <span>
                  <strong className="d-block">{d.title}</strong>
                  <span className="small-note">{d.description}</span>
                </span>
                <button type="button" className="btn btn-ghost btn-sm"
                  aria-pressed={activeDemo?.id === d.id} onClick={() => setActiveDemo(d)}>
                  Ver demo
                </button>
              </li>
            ))}
          </ul>
        )}
        {activeDemo && <DemoViewer key={activeDemo.id} demo={activeDemo} onClose={() => setActiveDemo(null)} />}
      </section>
    </>
  )
}
