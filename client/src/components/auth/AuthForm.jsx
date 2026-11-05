//Este es un formulario reutilizable que dibuja sus campos solo, valida lo que escribes,
// muestra errores (tuyos y del servidor), y desactiva el botón mientras envía 
// sirviendo tanto para login como para registro con solo cambiarle la configuración.
import { useState } from 'react'

// Formulario reutilizable para login y registro
export default function AuthForm({ fields, validators, submitLabel, onSubmit }) {
  const initial = Object.fromEntries(fields.map((f) => [f.name, '']))
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const found = Object.fromEntries(fields.map((f) => [f.name, validators[f.name](values[f.name], values)]))
    setErrors(found)
    if (Object.values(found).some(Boolean)) return

    setLoading(true)
    try {
      await onSubmit(values)
    } catch (err) {
      setServerError(err.message || 'Ocurrió un error. Intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card-soft auth-form">
      {fields.map((f) => (
        <div className="mb-3" key={f.name}>
          <label htmlFor={`auth-${f.name}`} className="form-label">{f.label}</label>
          <input id={`auth-${f.name}`} name={f.name} type={f.type} placeholder={f.placeholder}
            autoComplete={f.autoComplete} value={values[f.name]} onChange={handleChange}
            className={`form-control ${errors[f.name] ? 'is-invalid' : ''}`} aria-invalid={Boolean(errors[f.name])} />
          {errors[f.name] && <div className="invalid-feedback">{errors[f.name]}</div>}
        </div>
      ))}
      {serverError && <p className="form-note is-error" role="alert">{serverError}</p>}
      <button type="submit" className="btn btn-brand w-100 justify-content-center" disabled={loading}>
        {loading ? 'Un momento…' : submitLabel}
      </button>
    </form>
  )
}
