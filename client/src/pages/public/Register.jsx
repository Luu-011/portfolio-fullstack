import { Link } from 'react-router-dom'
import RegisterForm from '../../components/auth/RegisterForm'

export default function Register() {
  return (
    <section className="auth-page">
      <div className="auth-box">
        <h1>Crea tu cuenta</h1>
        <p className="lead-text">Es gratis y te da acceso a los proyectos y las demos interactivas.</p>
        <RegisterForm />
        <p className="auth-alt">¿Ya tienes cuenta? <Link to="/login" className="text-link">Iniciar sesión</Link></p>
      </div>
    </section>
  )
}
