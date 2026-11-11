import Tarjeta from './Tarjeta.jsx';

export default function Columna({
  columna,
  tareas,
  arrastrando,
  destino,
  onDestino,
  onSoltar,
  onLimpiar,
  ...acciones
}) {
  const aca = destino && destino.estado === columna.id;

  function sobreColumna(e) {
    if (!arrastrando) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    // La tarea se inserta antes de la primera tarjeta cuya mitad queda por debajo del puntero.
    const tarjetas = [...e.currentTarget.querySelectorAll('[data-tarea]')].filter(
      (el) => el.dataset.tarea !== arrastrando,
    );
    const proxima = tarjetas.find((el) => {
      const r = el.getBoundingClientRect();
      return e.clientY < r.top + r.height / 2;
    });
    const antesDe = proxima ? proxima.dataset.tarea : null;
    if (!aca || destino.antesDe !== antesDe) onDestino({ estado: columna.id, antesDe });
  }

  function saleDeColumna(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) onDestino(null);
  }

  function soltar(e) {
    if (!arrastrando) return;
    e.preventDefault();
    onSoltar(arrastrando, { estado: columna.id, antesDe: aca ? destino.antesDe : null });
  }

  const hueco = <li className="gt-hueco" aria-hidden="true" />;

  return (
    <section
      className={`gt-columna gt-columna--${columna.id}`}
      aria-labelledby={`gt-titulo-${columna.id}`}
      data-destino={aca ? 'true' : undefined}
      onDragOver={sobreColumna}
      onDragLeave={saleDeColumna}
      onDrop={soltar}
    >
      <header className="gt-columna__cabecera">
        <h2 id={`gt-titulo-${columna.id}`} className="gt-columna__titulo">
          {columna.titulo}
        </h2>
        <span className="gt-contador" aria-label={`${tareas.length} tareas`}>
          {tareas.length}
        </span>
        {columna.id === 'done' && tareas.length > 0 && (
          <button type="button" className="gt-enlace" onClick={onLimpiar}>
            Limpiar hechas
          </button>
        )}
      </header>

      <ul className="gt-lista">
        {tareas.map((tarea) => (
          <FragmentoConHueco
            key={tarea.id}
            mostrarHueco={aca && destino.antesDe === tarea.id}
            hueco={hueco}
          >
            <Tarjeta
              tarea={tarea}
              arrastrando={arrastrando === tarea.id}
              {...acciones}
            />
          </FragmentoConHueco>
        ))}
        {aca && destino.antesDe === null && hueco}
      </ul>

      {tareas.length === 0 && !aca && <p className="gt-vacio">{columna.vacio}</p>}
    </section>
  );
}

function FragmentoConHueco({ mostrarHueco, hueco, children }) {
  return (
    <>
      {mostrarHueco && hueco}
      {children}
    </>
  );
}
