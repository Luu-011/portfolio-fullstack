import { Link } from 'react-router-dom'
import LoginForm from '../../components/auth/LoginForm'

export default function Login() {
  return (
    <section className="auth-page">
      <div className="auth-box">
        <h1>Inicia sesión</h1>
        <p className="lead-text">Accede para ver el detalle de los proyectos y las demos.</p>
        <LoginForm />
        <p className="auth-alt">¿Aún no tienes cuenta? <Link to="/registro" className="text-link">Crear cuenta</Link></p>
      </div>
    </section>
  )
}
