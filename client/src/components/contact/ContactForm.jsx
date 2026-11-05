//Es el formulario de contacto completo: valida 4 campos (nombre, email, select y mensaje), 
// los envía a un servicio, gestiona 4 estados de envío (reposo, enviando, enviado, error), 
// muestra el mensaje adecuado en cada estado y usa pequeños "ayudantes" 
// (field y error) para no repetir atributos — todo con accesibilidad cuidada.

import { useState } from 'react'
import { Send } from '../common/Icons'
import { CONTACT_TYPES } from '../../utils/constants'
import { validateName, validateEmail, validateMessage, validateSelect } from '../../utils/validators'
import { sendContact } from '../../services/contactService'

const initial = { name: '', email: '', type: CONTACT_TYPES[0], message: '' }

const validate = (v) => ({
  name: validateName(v.name),
  email: validateEmail(v.email),
  type: validateSelect(v.type, CONTACT_TYPES),
  message: validateMessage(v.message),
})

export default function ContactForm() {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.values(found).some(Boolean)) return

    setStatus('sending')
    try {
      await sendContact({ ...values, name: values.name.trim(), email: values.email.trim(), message: values.message.trim() })
      setValues(initial)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const field = (name) => ({
    id: `contact-${name}`, name, value: values[name], onChange: handleChange,
    className: `form-control ${errors[name] ? 'is-invalid' : ''}`,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `contact-${name}-error` : undefined,
  })
  const error = (name) => errors[name] && (
    <div id={`contact-${name}-error`} className="invalid-feedback">{errors[name]}</div>
  )

  return (
    <form className="card-soft contact-form" onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="contact-name" className="form-label">Tu nombre</label>
          <input type="text" placeholder="¿Cómo te llamas?" autoComplete="name" {...field('name')} />
          {error('name')}
        </div>
        <div className="col-md-6">
          <label htmlFor="contact-email" className="form-label">Tu email</label>
          <input type="email" placeholder="nombre@correo.com" autoComplete="email" {...field('email')} />
          {error('email')}
        </div>
        <div className="col-12">
          <label htmlFor="contact-type" className="form-label">¿En qué te puedo ayudar?</label>
          <select {...field('type')} className={`form-select ${errors.type ? 'is-invalid' : ''}`}>
            {CONTACT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          {error('type')}
        </div>
        <div className="col-12">
          <label htmlFor="contact-message" className="form-label">Cuéntame un poco más</label>
          <textarea rows="5" maxLength={1000} placeholder="Describe tu idea, necesidad o pregunta…" {...field('message')} />
          {error('message')}
        </div>
      </div>

      <div className="form-footer">
        <p role="status" className={`form-note ${status === 'error' ? 'is-error' : ''}`}>
          {status === 'sent' && 'Consulta enviada. Te responderé por email.'}
          {status === 'error' && 'No pudimos enviar la consulta. Intenta de nuevo en unos minutos.'}
          {(status === 'idle' || status === 'sending') && 'Tu consulta queda registrada y te respondo por email.'}
        </p>
        <button type="submit" className="btn btn-brand" disabled={status === 'sending'}>
          {status === 'sending' ? 'Enviando…' : <>Enviar consulta <Send /></>}
        </button>
      </div>
    </form>
  )
}
