import { useState } from 'react'
import Field, { fieldProps } from './Field'
import { createService, updateService } from '../../services/serviceService'
import { validateTitle, validateServiceDescription, validatePrice } from '../../utils/contentValidators'

const rules = { title: validateTitle, description: validateServiceDescription, refPrice: validatePrice }

// service = null para crear; con un servicio, para editarlo
export default function ServiceForm({ service, onSaved, onCancel }) {
  const [values, setValues] = useState({
    title: service?.title ?? '',
    description: service?.description ?? '',
    refPrice: service?.refPrice != null ? String(service.refPrice) : '',
    active: service?.active ?? true,
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')

  const set = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const found = Object.fromEntries(Object.entries(rules).map(([name, rule]) => [name, rule(values[name])]))
    setErrors(found)
    if (Object.values(found).some(Boolean)) return

    const data = {
      title: values.title.trim(),
      description: values.description.trim(),
      refPrice: values.refPrice.trim() === '' ? undefined : Number(values.refPrice),
      active: values.active,
    }
    setSaving(true)
    try {
      const saved = service ? await updateService(service.id, data) : await createService(data)
      onSaved(saved, !service)
    } catch (err) {
      setServerError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field id="s-title" label="Título" error={errors.title}>
        <input type="text" className={`form-control ${errors.title ? 'is-invalid' : ''}`} {...fieldProps('s-title', errors.title)}
          value={values.title} onChange={set('title')} maxLength={100} />
      </Field>
      <Field id="s-description" label="Descripción" error={errors.description}>
        <textarea rows="3" className={`form-control ${errors.description ? 'is-invalid' : ''}`} {...fieldProps('s-description', errors.description)}
          value={values.description} onChange={set('description')} maxLength={1000} />
      </Field>
      <Field id="s-price" label="Precio de referencia (opcional)" error={errors.refPrice}>
        <input type="number" step="0.01" min="0" className={`form-control ${errors.refPrice ? 'is-invalid' : ''}`} {...fieldProps('s-price', errors.refPrice)}
          value={values.refPrice} onChange={set('refPrice')} />
      </Field>
      <div className="form-check mb-3">
        <input id="s-active" type="checkbox" className="form-check-input" checked={values.active}
          onChange={(e) => setValues((v) => ({ ...v, active: e.target.checked }))} />
        <label htmlFor="s-active" className="form-check-label">Visible en la home</label>
      </div>
      {serverError && <p role="alert" className="form-note is-error">{serverError}</p>}
      <div className="d-flex gap-2 flex-wrap">
        <button type="submit" className="btn btn-brand" disabled={saving}>
          {saving ? 'Guardando…' : service ? 'Guardar cambios' : 'Crear servicio'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cerrar</button>
      </div>
    </form>
  )
}
