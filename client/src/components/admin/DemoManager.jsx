import { useState } from 'react'
import Field, { fieldProps } from './Field'
import { createDemo, updateDemo, deleteDemo } from '../../services/projectService'
import { validateTitle, validateRequiredUrl, validateDemoDescription } from '../../utils/contentValidators'

const EMPTY = { title: '', description: '', url: '' }

// Gestión de las demos de un proyecto. onChange recibe el proyecto actualizado que devuelve la API.
export default function DemoManager({ project, onChange }) {
  const [form, setForm] = useState(null) // null = cerrado; { id?, title, description, url }
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [serverError, setServerError] = useState('')

  const open = (demo) => { setErrors({}); setServerError(''); setForm(demo ? { ...EMPTY, ...demo, description: demo.description ?? '' } : { ...EMPTY }) }
  const set = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
  }

  const save = async (e) => {
    e.preventDefault()
    setServerError('')
    const found = { title: validateTitle(form.title), url: validateRequiredUrl(form.url), description: validateDemoDescription(form.description) }
    setErrors(found)
    if (Object.values(found).some(Boolean)) return

    const data = { title: form.title.trim(), description: form.description.trim(), url: form.url.trim() }
    setBusy(true)
    try {
      const updated = form.id ? await updateDemo(project.id, form.id, data) : await createDemo(project.id, data)
      onChange(updated)
      setForm(null)
    } catch (err) {
      setServerError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (demo) => {
    if (!window.confirm(`¿Eliminar la demo "${demo.title}"?`)) return
    setServerError('')
    try {
      onChange(await deleteDemo(project.id, demo.id))
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <section className="demo-admin" aria-label="Demos del proyecto">
      <div className="panel-head">
        <h3 className="subhead mb-0">Demos</h3>
        {!form && <button type="button" className="btn btn-ghost btn-sm" onClick={() => open(null)}>Agregar demo</button>}
      </div>

      {project.demos.length === 0 && !form && <p>Este proyecto todavía no tiene demos.</p>}
      {project.demos.map((d) => (
        <div className="demo-row" key={d.id}>
          <span>
            <strong className="d-block">{d.title}</strong>
            <span className="small-note">{d.url}</span>
          </span>
          <span className="row-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => open(d)}>Editar</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => remove(d)}>Eliminar</button>
          </span>
        </div>
      ))}

      {form && (
        <form onSubmit={save} noValidate className="mt-3">
          <h4 className="subhead">{form.id ? 'Editar demo' : 'Nueva demo'}</h4>
          <Field id="d-title" label="Título" error={errors.title}>
            <input type="text" className={`form-control ${errors.title ? 'is-invalid' : ''}`} {...fieldProps('d-title', errors.title)}
              value={form.title} onChange={set('title')} maxLength={100} />
          </Field>
          <Field id="d-url" label="URL de la demo" error={errors.url}>
            <input type="url" className={`form-control ${errors.url ? 'is-invalid' : ''}`} {...fieldProps('d-url', errors.url)}
              value={form.url} onChange={set('url')} placeholder="https://..." />
          </Field>
          <Field id="d-description" label="Descripción (opcional)" error={errors.description}>
            <input type="text" className={`form-control ${errors.description ? 'is-invalid' : ''}`} {...fieldProps('d-description', errors.description)}
              value={form.description} onChange={set('description')} maxLength={255} />
          </Field>
          {serverError && <p role="alert" className="form-note is-error">{serverError}</p>}
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-brand btn-sm" disabled={busy}>{busy ? 'Guardando…' : 'Guardar demo'}</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setForm(null)}>Cancelar</button>
          </div>
        </form>
      )}
      {!form && serverError && <p role="alert" className="form-note is-error">{serverError}</p>}
    </section>
  )
}
