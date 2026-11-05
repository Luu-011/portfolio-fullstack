import StatusBadge from './StatusBadge'
import { formatDate } from '../../utils/format'

export default function MessageList({ messages, selectedId, onSelect }) {
  if (messages.length === 0) {
    return <p className="p-3 mb-0">No hay consultas con este filtro.</p>
  }
  return (
    <ul className="msg-list">
      {messages.map((m) => (
        <li key={m.id}>
          <button type="button" className="msg-item" aria-current={m.id === selectedId} onClick={() => onSelect(m.id)}>
            <span className="msg-item-top">
              <span>{m.name}</span>
              <StatusBadge status={m.status} />
            </span>
            <span className="small-note d-block">{m.type} · {formatDate(m.createdAt)}</span>
            <p>{m.message}</p>
          </button>
        </li>
      ))}
    </ul>
  )
}
