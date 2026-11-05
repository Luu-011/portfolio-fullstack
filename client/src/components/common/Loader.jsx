export default function Loader({ text = 'Cargando…' }) {
  return <p className="loader" role="status">{text}</p>
}
