import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { getProjects, deleteProject } from '../../services/projectService'
import { API_ORIGIN } from '../../services/api'
import ProjectForm from '../../components/admin/ProjectForm'
import DemoManager from '../../components/admin/DemoManager'
import Loader from '../../components/common/Loader'
import '../../styles/admin-panel.css'
import '../../styles/admin-crud.css'

export default function ProjectsCRUD() {
  const { data, loading, error, reload } = useFetch(getProjects)
  const [editing, setEditing] = useState(null) // null | 'new' | proyecto
  const [notice, setNotice] = useState('')
  const [actionError, setActionError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const projects = data || []
  const isNew = editing === 'new'

  const handleSaved = async (project, created) => {
    setNotice(created ? 'Proyecto creado. Ahora puedes agregarle demos.' : 'Cambios guardados.')
    setEditing(project)
    await reload()
  }

  const handleDemoChange = async (project) => {
    setEditing(project)
    await reload()
  }

  const remove = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.title}"? También se borran sus demos y su imagen.`)) return
    setActionError('')
    setBusyId(p.id)
    try {
      await deleteProject(p.id)
      if (editing && editing !== 'new' && editing.id === p.id) setEditing(null)
      await reload()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <h1 className="admin-title">Proyectos</h1>
      <p>Los proyectos y sus demos son lo que ven los usuarios registrados.</p>

      <div className="page-actions">
        <span className="small-note">{data ? `${projects.length} proyectos` : ''}</span>
        {!editing && <button type="button" className="btn btn-brand" onClick={() => { setNotice(''); setEditing('new') }}>Nuevo proyecto</button>}
      </div>

      {editing && (
        <section className="card-soft panel" aria-label={isNew ? 'Nuevo proyecto' : 'Editar proyecto'}>
          <div className="panel-head">
            <h2 className="subhead">{isNew ? 'Nuevo proyecto' : `Editar: ${editing.title}`}</h2>
          </div>
          {notice && <p role="status" className="notice">{notice}</p>}
          <ProjectForm key={isNew ? 'new' : editing.id} project={isNew ? null : editing}
            onSaved={handleSaved} onCancel={() => { setEditing(null); setNotice('') }} />
          {!isNew && <DemoManager key={`demos-${editing.id}`} project={editing} onChange={handleDemoChange} />}
        </section>
      )}

      {loading && !data && <Loader text="Cargando proyectos…" />}
      {error && (
        <p role="alert" className="form-note is-error">
          {error} <button className="text-link btn-link-inline" onClick={reload}>Reintentar</button>
        </p>
      )}
      {actionError && <p role="alert" className="form-note is-error">{actionError}</p>}

      {data && (
        <div className="card-soft table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Proyecto</th><th>Año</th><th>Tecnologías</th><th>Demos</th><th><span className="visually-hidden">Acciones</span></th></tr>
            </thead>
            <tbody>
              {projects.length === 0 && <tr><td colSpan={5}>Todavía no hay proyectos. Crea el primero con el botón "Nuevo proyecto".</td></tr>}
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className="cell-project">
                      {p.image ? <img className="thumb" src={`${API_ORIGIN}${p.image}`} alt="" /> : <span className="thumb" aria-hidden="true" />}
                      <strong>{p.title}</strong>
                    </span>
                  </td>
                  <td>{p.year ?? '—'}</td>
                  <td><ul className="tags">{p.stack.map((t) => <li key={t}>{t}</li>)}</ul></td>
                  <td>{p.demos.length}</td>
                  <td>
                    <span className="row-actions">
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setNotice(''); setEditing(p) }}>Editar</button>
                      <button type="button" className="btn btn-ghost btn-sm" disabled={busyId === p.id} onClick={() => remove(p)}>Eliminar</button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
