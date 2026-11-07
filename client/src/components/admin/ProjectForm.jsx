import { useState } from 'react'
import Field, { fieldProps } from './Field'
import ImageDropzone from './ImageDropzone'
import { createProject, updateProject } from '../../services/projectService'
import { API_ORIGIN } from '../../services/api'
import {
  parseStack, validateTitle, validateSummary, validateDescription, validateStack, validateOptionalUrl, validateYear,
} from '../../utils/contentValidators'

const rules = {
  title: validateTitle, summary: validateSummary, description: validateDescription,
  stack: validateStack, repoUrl: validateOptionalUrl, year: validateYear,
}

const initial = (p) => ({
  title: p?.title ?? '', summary: p?.summary ?? '', description: p?.description ?? '',
  stack: p ? p.stack.join(', ') : '', repoUrl: p?.repoUrl ?? '', year: p?.year ? String(p.year) : '',
})

// project = null para crear; con un proyecto, para editarlo
export default function ProjectForm({ project, onSaved, onCancel }) {
  const [values, setValues] = useState(initial(project))
  const [errors, setErrors] = useState({})
  const [file, setFile] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
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

    const data = new FormData()
    data.append('title', values.title.trim())
    data.append('summary', values.summary.trim())
    data.append('description', values.description.trim())
    data.append('stack', JSON.stringify(parseStack(values.stack)))
    if (values.repoUrl.trim()) data.append('repoUrl', values.repoUrl.trim())
    if (values.year) data.append('year', values.year)
    if (file) data.append('image', file)
    else if (removeImage) data.append('removeImage', 'true')

    setSaving(true)
    try {
      const saved = project ? await updateProject(project.id, data) : await createProject(data)
      setFile(null)
      setRemoveImage(false)
      onSaved(saved, !project)
    } catch (err) {
      setServerError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row">
        <div className="col-md-8">
          <Field id="p-title" label="Título" error={errors.title}>
            <input type="text" className={`form-control ${errors.title ? 'is-invalid' : ''}`} {...fieldProps('p-title', errors.title)}
              value={values.title} onChange={set('title')} maxLength={100} />
          </Field>
        </div>
        <div className="col-md-4">
          <Field id="p-year" label="Año (opcional)" error={errors.year}>
            <input type="number" className={`form-control ${errors.year ? 'is-invalid' : ''}`} {...fieldProps('p-year', errors.year)}
              value={values.year} onChange={set('year')} min={2000} max={2100} />
          </Field>
        </div>
      </div>

      <Field id="p-summary" label="Resumen" error={errors.summary} hint="Una frase que se ve en la tarjeta del proyecto.">
        <input type="text" className={`form-control ${errors.summary ? 'is-invalid' : ''}`} {...fieldProps('p-summary', errors.summary)}
          value={values.summary} onChange={set('summary')} maxLength={255} />
      </Field>

      <Field id="p-description" label="Descripción" error={errors.description}>
        <textarea rows="5" className={`form-control ${errors.description ? 'is-invalid' : ''}`} {...fieldProps('p-description', errors.description)}
          value={values.description} onChange={set('description')} maxLength={5000} />
      </Field>

      <div className="row">
        <div className="col-md-6">
          <Field id="p-stack" label="Tecnologías" error={errors.stack} hint="Separadas por comas. Ej.: React, Node.js, MySQL">
            <input type="text" className={`form-control ${errors.stack ? 'is-invalid' : ''}`} {...fieldProps('p-stack', errors.stack)}
              value={values.stack} onChange={set('stack')} />
          </Field>
        </div>
        <div className="col-md-6">
          <Field id="p-repo" label="Repositorio (opcional)" error={errors.repoUrl}>
            <input type="url" className={`form-control ${errors.repoUrl ? 'is-invalid' : ''}`} {...fieldProps('p-repo', errors.repoUrl)}
              value={values.repoUrl} onChange={set('repoUrl')} placeholder="https://github.com/..." />
          </Field>
        </div>
      </div>

      <div className="mb-3">
        <span className="form-label d-block">Imagen (opcional)</span>
        <ImageDropzone currentUrl={project?.image ? `${API_ORIGIN}${project.image}` : null}
          file={file} onFile={setFile} removeCurrent={removeImage} onRemoveCurrent={setRemoveImage} />
      </div>

      {serverError && <p role="alert" className="form-note is-error">{serverError}</p>}

      <div className="d-flex gap-2 flex-wrap">
        <button type="submit" className="btn btn-brand" disabled={saving}>
          {saving ? 'Guardando…' : project ? 'Guardar cambios' : 'Crear proyecto'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cerrar</button>
      </div>
    </form>
  )
}
