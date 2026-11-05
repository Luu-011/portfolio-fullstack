export default function StatusBadge({ status }) {
  const pending = status === 'pendiente'
  return (
    <span className={`badge-status ${pending ? 'is-pending' : 'is-done'}`}>
      {pending ? 'Pendiente' : 'Respondida'}
    </span>
  )
}
