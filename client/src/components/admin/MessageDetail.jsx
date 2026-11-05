import { useState } from 'react'
import StatusBadge from './StatusBadge'
import { Send } from '../common/Icons'
import { validateReply } from '../../utils/validators'
import { formatDateTime } from '../../utils/format'

// Usar con key={message.id} para que el formulario se reinicie al cambiar de consulta
export default function MessageDetail({ message, onReply }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validateReply(text)
    setError(found)
    if (found) return

    setSending(true)
    setSent(false)
    try {
      await onReply(text.trim())
      setText('')
      setSent(true)
    } catch (err) {
      setError(err.message || 'No se pudo guardar la respuesta.')
    } finally {
      setSending(false)
    }
  }

  return (
    <article className="card-soft msg-detail">
      <header className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-3">
        <div>
          <h2 className="subhead mb-1">{message.name}</h2>
          <p className="mb-0 small-note">
            <a href={`mailto:${message.email}`} className="text-link">{message.email}</a> · {message.type} · {formatDateTime(message.createdAt)}
          </p>
        </div>
        <StatusBadge status={message.status} />
      </header>

      <p className="msg-body">{message.message}</p>

      {message.replies.length > 0 && (
        <>
          <h3 className="mt-4">Historial de respuestas</h3>
          <ul className="thread">
            {message.replies.map((r) => (
              <li key={r.id} className="reply">
                <p className="reply-meta mb-1"><strong>{r.operator}</strong> · {formatDateTime(r.createdAt)}</p>
                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{r.text}</p>
              </li>
            ))}
          </ul>
        </>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-4">
        <label htmlFor="reply-text" className="form-label">
          {message.replies.length ? 'Dar seguimiento' : 'Responder consulta'}
        </label>
        <textarea id="reply-text" rows="5" maxLength={2000}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          placeholder="Escribe tu respuesta…" value={text}
          onChange={(e) => { setText(e.target.value); setError(''); setSent(false) }}
          aria-invalid={Boolean(error)} aria-describedby={error ? 'reply-error' : undefined} />
        {error && <div id="reply-error" className="invalid-feedback">{error}</div>}

        <div className="form-footer">
          <p role="status" className="form-note">{sent ? 'Respuesta guardada en el historial.' : 'La respuesta queda en el historial de la consulta.'}</p>
          <button type="submit" className="btn btn-brand" disabled={sending}>
            {sending ? 'Guardando…' : <>Enviar respuesta <Send /></>}
          </button>
        </div>
      </form>
    </article>
  )
}
