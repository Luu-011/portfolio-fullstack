import { Link } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import { getContacts } from '../../services/contactService'
import { CONTACT_TYPES } from '../../utils/constants'
import Loader from '../../components/common/Loader'
import { ArrowUpRight } from '../../components/common/Icons'

export default function Dashboard() {
  const { data, loading, error } = useFetch(getContacts)
  const messages = data || []
  const pending = messages.filter((m) => m.status === 'pendiente').length

  return (
    <>
      <h1 className="admin-title">Resumen</h1>
      <p>Estado de las consultas recibidas.</p>

      {loading && <Loader />}
      {error && <p role="alert" className="form-note is-error">{error}</p>}

      {data && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-sm-4"><div className="card-soft stat"><span className="stat-num">{messages.length}</span><span>Consultas totales</span></div></div>
            <div className="col-sm-4"><div className="card-soft stat"><span className="stat-num">{pending}</span><span>Pendientes</span></div></div>
            <div className="col-sm-4"><div className="card-soft stat"><span className="stat-num">{messages.length - pending}</span><span>Respondidas</span></div></div>
          </div>

          <h2 className="subhead">Por tipo de consulta</h2>
          <ul className="type-list">
            {CONTACT_TYPES.map((t) => (
              <li key={t}><span>{t}</span><strong>{messages.filter((m) => m.type === t).length}</strong></li>
            ))}
          </ul>

          <Link to="/admin/mensajes" className="btn btn-brand mt-3">Ir a las consultas <ArrowUpRight /></Link>
        </>
      )}
    </>
  )
}
