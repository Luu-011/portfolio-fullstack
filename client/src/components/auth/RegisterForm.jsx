//Es el registro: pide 4 datos (incluida la repetición de la contraseña para evitar erratas), 
// valida que las dos contraseñas coincidan, crea la cuenta de verdad enviando solo lo necesario 
// (sin el campo confirm) y te lleva directo a /proyectos.

import { useNavigate } from 'react-router-dom'
import AuthForm from './AuthForm'
import { useAuth } from '../../hooks/useAuth'
import { validateName, validateEmail, validatePassword } from '../../utils/validators'

const fields = [
  { name: 'name', label: 'Nombre', type: 'text', placeholder: '¿Cómo te llamas?', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'nombre@correo.com', autoComplete: 'email' },
  { name: 'password', label: 'Contraseña', type: 'password', placeholder: 'Mínimo 8 caracteres', autoComplete: 'new-password' },
  { name: 'confirm', label: 'Repite la contraseña', type: 'password', placeholder: 'Repite la contraseña', autoComplete: 'new-password' },
]
const validators = {
  name: validateName,
  email: validateEmail,
  password: validatePassword,
  confirm: (v, all) => (v === all.password ? '' : 'Las contraseñas no coinciden.'),
}

export default function RegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async ({ name, email, password }) => {
    await register({ name: name.trim(), email: email.trim(), password })
    navigate('/proyectos', { replace: true })
  }

  return <AuthForm fields={fields} validators={validators} submitLabel="Crear cuenta" onSubmit={onSubmit} />
}
