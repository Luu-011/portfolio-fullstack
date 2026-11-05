import { useAuth } from '../../hooks/useAuth'

// Página protegida (ProtectedRoute). Aquí irán ProjectCard y DemoViewer.
export default function Projects() {
  const { user } = useAuth()
  return (
    <section className="auth-page">
      <div className="container">
        <h1>Proyectos y demos</h1>
        <p className="lead-text">Hola, {user.name}. Pronto vas a encontrar aquí el detalle de cada proyecto.</p>
      </div>
    </section>
  )
}
