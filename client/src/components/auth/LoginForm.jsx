import { useNavigate, useLocation } from 'react-router-dom'
import AuthForm from './AuthForm'
import { useAuth } from '../../hooks/useAuth'
import { validateEmail } from '../../utils/validators'

const fields = [
  { name: 'email', label: 'Email', type: 'email', placeholder: 'nombre@correo.com', autoComplete: 'email' },
  { name: 'password', label: 'Contraseña', type: 'password', placeholder: 'Tu contraseña', autoComplete: 'current-password' },
]
const validators = {
  email: validateEmail,
  password: (v) => (v ? '' : 'Escribe tu contraseña.'),
}

export default function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/proyectos'

  const onSubmit = async (values) => {
    const user = await login({ email: values.email.trim(), password: values.password })
    navigate(['admin', 'operator'].includes(user.role) ? '/admin' : from, { replace: true })
  }

  return <AuthForm fields={fields} validators={validators} submitLabel="Iniciar sesión" onSubmit={onSubmit} />
}
