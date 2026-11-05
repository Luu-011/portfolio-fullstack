//Es un encabezado de sección reutilizable que muestra tres textos (etiqueta, título y descripción opcional) 
// con la estructura HTML semántica correcta, 
// para que todas las secciones de la web tengan cabeceras consistentes con solo cambiarle los textos.

export default function SectionHeader({ label, title, text }) {
  return (
    <header className="section-header">
      <p className="section-label">{label}</p>
      <div>
        <h2>{title}</h2>
        {text && <p className="section-text">{text}</p>}
      </div>
    </header>
  )
}
