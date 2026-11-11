import { useId, useRef, useState } from 'react';
import { MAX_TITULO, PRIORIDADES } from './datos.js';

export default function FormularioNueva({ onAgregar }) {
  const [titulo, setTitulo] = useState('');
  const [prioridad, setPrioridad] = useState('media');
  const [error, setError] = useState('');
  const campo = useRef(null);
  const idError = useId();

  function enviar(e) {
    e.preventDefault();
    if (!titulo.trim()) {
      setError('Escribí un título para la tarea.');
      campo.current?.focus();
      return;
    }
    onAgregar({ titulo, prioridad });
    setTitulo('');
    setError('');
    campo.current?.focus();
  }

  return (
    <form className="gt-nueva" onSubmit={enviar} noValidate>
      <div className="gt-nueva__fila">
        <label className="gt-nueva__campo">
          <span className="gt-visualmente-oculto">Título de la tarea</span>
          <input
            ref={campo}
            className="gt-input"
            type="text"
            value={titulo}
            maxLength={MAX_TITULO}
            placeholder="¿Qué hay que hacer?"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? idError : undefined}
            onChange={(e) => {
              setTitulo(e.target.value);
              if (error) setError('');
            }}
          />
        </label>

        <fieldset className="gt-segmentos">
          <legend className="gt-visualmente-oculto">Prioridad</legend>
          {PRIORIDADES.map((p) => (
            <label key={p.id} className="gt-segmento">
              <input
                type="radio"
                name="prioridad-nueva"
                value={p.id}
                checked={prioridad === p.id}
                onChange={() => setPrioridad(p.id)}
              />
              <span>{p.etiqueta}</span>
            </label>
          ))}
        </fieldset>

        <button type="submit" className="gt-boton gt-boton--primario">
          Agregar tarea
        </button>
      </div>
      {error && (
        <p id={idError} className="gt-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
