import { useState } from 'react';
import { COLUMNAS, MAX_NOTA, MAX_TITULO, PRIORIDADES } from './datos.js';
import { IconoBorrar, IconoDerecha, IconoEditar, IconoIzquierda } from './Iconos.jsx';

export default function Tarjeta({
  tarea,
  arrastrando,
  onInicioArrastre,
  onFinArrastre,
  onMover,
  onGuardar,
  onEliminar,
}) {
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState(tarea);
  const [error, setError] = useState('');

  const indice = COLUMNAS.findIndex((c) => c.id === tarea.estado);
  const anterior = COLUMNAS[indice - 1];
  const siguiente = COLUMNAS[indice + 1];
  const prioridad = PRIORIDADES.find((p) => p.id === tarea.prioridad);

  function abrirEdicion() {
    setBorrador(tarea);
    setError('');
    setEditando(true);
  }

  function guardar(e) {
    e?.preventDefault();
    if (!borrador.titulo.trim()) {
      setError('El título no puede quedar vacío.');
      return;
    }
    onGuardar(tarea.id, {
      titulo: borrador.titulo.trim(),
      nota: borrador.nota.trim(),
      prioridad: borrador.prioridad,
    });
    setEditando(false);
  }

  if (editando) {
    return (
      <li className="gt-tarjeta gt-tarjeta--edicion" data-tarea={tarea.id}>
        <form
          onSubmit={guardar}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setEditando(false);
          }}
          noValidate
        >
          <label className="gt-etiqueta">
            Título
            <input
              className="gt-input"
              autoFocus
              value={borrador.titulo}
              maxLength={MAX_TITULO}
              aria-invalid={error ? 'true' : 'false'}
              onChange={(e) => {
                setBorrador({ ...borrador, titulo: e.target.value });
                if (error) setError('');
              }}
            />
          </label>
          {error && (
            <p className="gt-error" role="alert">
              {error}
            </p>
          )}
          <label className="gt-etiqueta">
            Nota
            <textarea
              className="gt-input gt-input--area"
              rows={2}
              value={borrador.nota}
              maxLength={MAX_NOTA}
              onChange={(e) => setBorrador({ ...borrador, nota: e.target.value })}
            />
          </label>
          <label className="gt-etiqueta">
            Prioridad
            <select
              className="gt-input"
              value={borrador.prioridad}
              onChange={(e) => setBorrador({ ...borrador, prioridad: e.target.value })}
            >
              {PRIORIDADES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.etiqueta}
                </option>
              ))}
            </select>
          </label>
          <div className="gt-tarjeta__acciones-edicion">
            <button type="submit" className="gt-boton gt-boton--primario gt-boton--chico">
              Guardar cambios
            </button>
            <button
              type="button"
              className="gt-boton gt-boton--chico"
              onClick={() => setEditando(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li
      className="gt-tarjeta"
      data-tarea={tarea.id}
      data-arrastrando={arrastrando ? 'true' : undefined}
      data-estado={tarea.estado}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', tarea.id);
        e.dataTransfer.effectAllowed = 'move';
        onInicioArrastre(tarea.id);
      }}
      onDragEnd={onFinArrastre}
    >
      <p className="gt-tarjeta__titulo">{tarea.titulo}</p>
      {tarea.nota && <p className="gt-tarjeta__nota">{tarea.nota}</p>}

      <div className="gt-tarjeta__pie">
        <span className={`gt-prioridad gt-prioridad--${tarea.prioridad}`}>
          Prioridad {prioridad.etiqueta.toLowerCase()}
        </span>

        <div className="gt-tarjeta__acciones">
          <button
            type="button"
            className="gt-icono"
            disabled={!anterior}
            aria-label={anterior ? `Mover a ${anterior.titulo}` : 'No hay columna anterior'}
            title={anterior ? `Mover a ${anterior.titulo}` : undefined}
            onClick={() => onMover(tarea.id, anterior.id)}
          >
            <IconoIzquierda />
          </button>
          <button
            type="button"
            className="gt-icono"
            disabled={!siguiente}
            aria-label={siguiente ? `Mover a ${siguiente.titulo}` : 'No hay columna siguiente'}
            title={siguiente ? `Mover a ${siguiente.titulo}` : undefined}
            onClick={() => onMover(tarea.id, siguiente.id)}
          >
            <IconoDerecha />
          </button>
          <button
            type="button"
            className="gt-icono"
            aria-label={`Editar “${tarea.titulo}”`}
            title="Editar"
            onClick={abrirEdicion}
          >
            <IconoEditar />
          </button>
          <button
            type="button"
            className="gt-icono gt-icono--peligro"
            aria-label={`Eliminar “${tarea.titulo}”`}
            title="Eliminar"
            onClick={() => onEliminar(tarea.id)}
          >
            <IconoBorrar />
          </button>
        </div>
      </div>
    </li>
  );
}
