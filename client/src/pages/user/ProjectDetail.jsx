import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import { getProjectById } from '../../services/projectService'
import ProjectContent from '../../components/projects/ProjectDetail'
import Loader from '../../components/common/Loader'

export default function ProjectDetail() {
  const { id } = useParams()
  const { data: project, loading, error } = useFetch(() => getProjectById(id), [id])

  return (
    <section className="page">
      <div className="container">
        <Link to="/proyectos" className="text-link back-link">← Volver a proyectos</Link>
        {loading && <Loader text="Cargando proyecto…" />}
        {error && <p role="alert" className="form-note is-error">{error}</p>}
        {project && <ProjectContent project={project} />}
      </div>
    </section>
  )
}
