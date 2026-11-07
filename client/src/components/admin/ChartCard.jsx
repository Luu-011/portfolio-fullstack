import Loader from '../common/Loader'

// Tarjeta para un gráfico: muestra "cargando" o el error y, cuando hay datos, llama a children(data)
export default function ChartCard({ title, caption, state, wide = false, children }) {
  const { data, loading, error } = state
  return (
    <figure className={`card-soft chart-card ${wide ? 'chart-wide' : ''}`}>
      <figcaption>
        <h2 className="subhead">{title}</h2>
        {caption && <p className="small-note">{caption}</p>}
      </figcaption>
      {loading && !data && <Loader />}
      {error && <p role="alert" className="form-note is-error">{error}</p>}
      {data && children(data)}
    </figure>
  )
}
