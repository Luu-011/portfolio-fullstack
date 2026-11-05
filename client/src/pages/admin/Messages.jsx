import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useFetch } from '../../hooks/useFetch'
import { getContacts, replyContact } from '../../services/contactService'
import MessageList from '../../components/admin/MessageList'
import MessageDetail from '../../components/admin/MessageDetail'
import Loader from '../../components/common/Loader'

const FILTERS = [
  { id: 'todas', label: 'Todas' },
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'respondida', label: 'Respondidas' },
]

export default function Messages() {
  const { user } = useAuth()
  const { data, loading, error, reload } = useFetch(getContacts)
  const [filter, setFilter] = useState('todas')
  const [selectedId, setSelectedId] = useState(null)

  const messages = data || []
  const visible = filter === 'todas' ? messages : messages.filter((m) => m.status === filter)
  const selected = messages.find((m) => m.id === selectedId) || null

  const handleReply = async (text) => {
    await replyContact(selectedId, { text, operator: user.name })
    await reload()
  }

  return (
    <>
      <h1 className="admin-title">Consultas</h1>
      <p>Mensajes, cotizaciones y pedidos de asesoría recibidos desde el formulario de contacto.</p>

      {loading && !data && <Loader text="Cargando consultas…" />}
      {error && (
        <p role="alert" className="form-note is-error">
          {error} <button className="text-link btn-link-inline" onClick={reload}>Reintentar</button>
        </p>
      )}

      {data && (
        <>
          <div className="filters" role="group" aria-label="Filtrar consultas">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" className="filter-chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>

          <div className="messages-layout">
            <div className="card-soft">
              <MessageList messages={visible} selectedId={selectedId} onSelect={setSelectedId} />
            </div>
            {selected
              ? <MessageDetail key={selected.id} message={selected} onReply={handleReply} />
              : <div className="card-soft msg-detail"><p className="mb-0">Elige una consulta de la lista para leerla y responderla.</p></div>}
          </div>
        </>
      )}
    </>
  )
}
