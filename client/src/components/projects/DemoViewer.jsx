import { ArrowUpRight } from '../common/Icons'

// Muestra una demo dentro de la página. Algunos sitios bloquean ser mostrados en un iframe,
// por eso siempre se ofrece también abrirla en una pestaña nueva.
export default function DemoViewer({ demo, onClose }) {
  return (
    <section className="card-soft demo-viewer" aria-label={`Demo: ${demo.title}`}>
      <div className="demo-viewer-bar">
        <strong>{demo.title}</strong>
        <span className="d-flex gap-3 align-items-center">
          <a href={demo.url} target="_blank" rel="noopener noreferrer" className="text-link">
            Abrir en pestaña nueva <ArrowUpRight />
          </a>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cerrar demo</button>
        </span>
      </div>
      <iframe
        className="demo-frame"
        src={demo.url}
        title={`Demo: ${demo.title}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </section>
  )
}
