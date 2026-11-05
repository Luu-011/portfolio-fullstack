import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useFetch } from '../../hooks/useFetch'
import { getProjects } from '../../services/projectService'
import ProjectCard from '../../components/projects/ProjectCard'
import Loader from '../../components/common/Loader'

export default function Projects() {
  const { user } = useAuth()
  const { data, loading, error, reload } = useFetch(getProjects)
  const [tech, setTech] = useState('Todos')

  const projects = data || []
  const techs = ['Todos', ...new Set(projects.flatMap((p) => p.stack))]
  const visible = tech === 'Todos' ? projects : projects.filter((p) => p.stack.includes(tech))

  return (
    <section className="page">
      <div className="container">
        <h1>Proyectos y demos</h1>
        <p className="lead-text">Hola, {user.name}. Elige un proyecto para ver su detalle y probar sus demos.</p>

        {loading && <Loader text="Cargando proyectos…" />}
        {error && (
          <p role="alert" className="form-note is-error">
            {error} <button className="text-link btn-link-inline" onClick={reload}>Reintentar</button>
          </p>
        )}

        {data && (
          <>
            <div className="filters" role="group" aria-label="Filtrar por tecnología">
              {techs.map((t) => (
                <button key={t} type="button" className="filter-chip" aria-pressed={tech === t} onClick={() => setTech(t)}>
                  {t}
                </button>
              ))}
            </div>
            <div className="row g-3">
              {visible.map((p) => (
                <div className="col-md-6 col-lg-4" key={p.id}><ProjectCard project={p} /></div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
