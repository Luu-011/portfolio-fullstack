import { Link } from 'react-router-dom'
import { ArrowUpRight } from '../common/Icons'
import { API_ORIGIN } from '../../services/api'
import '../../styles/media.css'

export default function ProjectCard({ project }) {
  const demos = project.demos.length
  return (
    <Link to={`/proyectos/${project.id}`} className="card-soft project-card">
      {project.image && <img className="project-cover" src={`${API_ORIGIN}${project.image}`} alt="" loading="lazy" />}
      <h3>{project.title}</h3>
      <p className="mb-0">{project.summary}</p>
      <ul className="tags">
        {project.stack.map((t) => <li key={t}>{t}</li>)}
      </ul>
      <span className="project-meta">
        <span>{demos === 0 ? 'Sin demos' : `${demos} ${demos === 1 ? 'demo' : 'demos'}`} · {project.year}</span>
        <ArrowUpRight />
      </span>
    </Link>
  )
}
