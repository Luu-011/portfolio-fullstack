import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { getAllServices, deleteService } from '../../services/serviceService'
import ServiceForm from '../../components/admin/ServiceForm'
import Loader from '../../components/common/Loader'
import '../../styles/admin-panel.css'
import '../../styles/admin-crud.css'

const money = (n) => (n == null ? '—' : n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }))

export default function ServicesCRUD() {
  const { data, loading, error, reload } = useFetch(getAllServices)
  const [editing, setEditing] = useState(null) // null | 'new' | servicio
  const [notice, setNotice] = useState('')
  const [actionError, setActionError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const services = data || []
  const isNew = editing === 'new'

  const handleSaved = async (_saved, created) => {
    setNotice(created ? 'Servicio creado.' : 'Cambios guardados.')
    setEditing(null)
    await reload()
  }

  const remove = async (s) => {
    if (!window.confirm(`¿Eliminar el servicio "${s.title}"?`)) return
    setActionError('')
    setBusyId(s.id)
    try {
      await deleteService(s.id)
      setNotice('Servicio eliminado.')
      await reload()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <h1 className="admin-title">Servicios</h1>
      <p>Lo que ofreces, tal como se muestra en la home. Los desactivados no se ven.</p>

      <div className="page-actions">
        <span className="small-note">{data ? `${services.length} servicios` : ''}</span>
        {!editing && <button type="button" className="btn btn-brand" onClick={() => { setNotice(''); setEditing('new') }}>Nuevo servicio</button>}
      </div>

      {notice && !editing && <p role="status" className="notice">{notice}</p>}

      {editing && (
        <section className="card-soft panel" aria-label={isNew ? 'Nuevo servicio' : 'Editar servicio'}>
          <div className="panel-head">
            <h2 className="subhead">{isNew ? 'Nuevo servicio' : `Editar: ${editing.title}`}</h2>
          </div>
          <ServiceForm key={isNew ? 'new' : editing.id} service={isNew ? null : editing}
            onSaved={handleSaved} onCancel={() => setEditing(null)} />
        </section>
      )}

      {loading && !data && <Loader text="Cargando servicios…" />}
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
              <tr><th>Servicio</th><th>Precio de referencia</th><th>Estado</th><th><span className="visually-hidden">Acciones</span></th></tr>
            </thead>
            <tbody>
              {services.length === 0 && <tr><td colSpan={4}>Todavía no hay servicios. Crea el primero con el botón "Nuevo servicio".</td></tr>}
              {services.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.title}</strong><span className="d-block small-note">{s.description}</span></td>
                  <td>{money(s.refPrice)}</td>
                  <td><span className={`badge-status ${s.active ? 'is-pending' : 'is-off'}`}>{s.active ? 'Visible' : 'Oculto'}</span></td>
                  <td>
                    <span className="row-actions">
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setNotice(''); setEditing(s) }}>Editar</button>
                      <button type="button" className="btn btn-ghost btn-sm" disabled={busyId === s.id} onClick={() => remove(s)}>Eliminar</button>
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
