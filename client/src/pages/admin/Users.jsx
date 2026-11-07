import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useFetch } from '../../hooks/useFetch'
import { getUsers, updateUserRole, deleteUser } from '../../services/userService'
import { formatDate, formatDateTime } from '../../utils/format'
import Loader from '../../components/common/Loader'
import '../../styles/admin-panel.css'

const ROLE_LABELS = { user: 'Usuario', operator: 'Operador', admin: 'Administrador' }

export default function Users() {
  const { user: me } = useAuth()
  const { data, loading, error, reload } = useFetch(getUsers)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('todos')
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState('')

  const users = data || []
  const term = search.trim().toLowerCase()
  const visible = users.filter((u) =>
    (role === 'todos' || u.role === role) &&
    (!term || u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term))
  )

  const run = async (id, action) => {
    setActionError('')
    setBusyId(id)
    try {
      await action()
      await reload()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const changeRole = (u, newRole) => run(u.id, () => updateUserRole(u.id, newRole))

  const remove = (u) => {
    if (!window.confirm(`¿Eliminar la cuenta de ${u.name}? Esta acción no se puede deshacer.`)) return
    run(u.id, () => deleteUser(u.id))
  }

  return (
    <>
      <h1 className="admin-title">Usuarios</h1>
      <p>Personas que crearon una cuenta para ver los proyectos y las demos.</p>

      {loading && !data && <Loader text="Cargando usuarios…" />}
      {error && (
        <p role="alert" className="form-note is-error">
          {error} <button className="text-link btn-link-inline" onClick={reload}>Reintentar</button>
        </p>
      )}
      {actionError && <p role="alert" className="form-note is-error">{actionError}</p>}

      {data && (
        <>
          <div className="toolbar">
            <label>
              Buscar
              <input type="search" className="form-control form-control-sm" placeholder="Nombre o email"
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </label>
            <label>
              Rol
              <select className="form-select form-select-sm" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="todos">Todos</option>
                {Object.entries(ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </div>

          <div className="card-soft table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Usuario</th><th>Rol</th><th>Registro</th><th>Accesos</th><th>Último acceso</th><th><span className="visually-hidden">Acciones</span></th></tr>
              </thead>
              <tbody>
                {visible.length === 0 && <tr><td colSpan={6}>No hay usuarios con este filtro.</td></tr>}
                {visible.map((u) => {
                  const isMe = u.id === me.id
                  return (
                    <tr key={u.id}>
                      <td><strong>{u.name}</strong><span className="d-block small-note">{u.email}</span></td>
                      <td>
                        <select className="form-select form-select-sm" aria-label={`Rol de ${u.name}`} value={u.role}
                          disabled={isMe || busyId === u.id} onChange={(e) => changeRole(u, e.target.value)}>
                          {Object.entries(ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                      </td>
                      <td>{formatDate(u.createdAt)}</td>
                      <td>{u.visits}</td>
                      <td>{u.lastVisit ? formatDateTime(u.lastVisit) : '—'}</td>
                      <td>
                        <button type="button" className="btn btn-ghost btn-sm" disabled={isMe || busyId === u.id}
                          title={isMe ? 'No puedes eliminar tu propia cuenta' : undefined} onClick={() => remove(u)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}
