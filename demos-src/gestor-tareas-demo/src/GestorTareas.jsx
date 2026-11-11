import { useEffect, useMemo, useRef, useState } from 'react';
import '@fontsource-variable/bricolage-grotesque/wdth.css';
import './estilos.css';

import { COLUMNAS, crearTarea, moverTarea, tareasDeEjemplo } from './datos.js';
import { cargarTareas, escucharOtrasPestañas, guardarTareas } from './almacenamiento.js';
import FormularioNueva from './FormularioNueva.jsx';
import Columna from './Columna.jsx';

const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

export default function GestorTareas() {
  const [tareas, setTareas] = useState(cargarTareas);
  const [arrastrando, setArrastrando] = useState(null);
  const [destino, setDestino] = useState(null);
  const [aviso, setAviso] = useState(null);
  const temporizadorAviso = useRef(null);
  const temporizadorArrastre = useRef(null);

  // Web Storage: cada cambio se guarda y las demás pestañas se enteran.
  useEffect(() => {
    guardarTareas(tareas);
  }, [tareas]);

  useEffect(() => escucharOtrasPestañas(() => setTareas(cargarTareas())), []);

  useEffect(
    () => () => {
      clearTimeout(temporizadorAviso.current);
      clearTimeout(temporizadorArrastre.current);
    },
    [],
  );

  const porColumna = useMemo(
    () => Object.fromEntries(COLUMNAS.map((c) => [c.id, tareas.filter((t) => t.estado === c.id)])),
    [tareas],
  );
  const total = tareas.length;
  const hechas = porColumna.done.length;
  const porcentaje = total ? Math.round((hechas / total) * 100) : 0;

  function mostrarAviso(texto, deshacer) {
    clearTimeout(temporizadorAviso.current);
    setAviso({ texto, deshacer });
    temporizadorAviso.current = setTimeout(() => setAviso(null), 6000);
  }

  function agregar({ titulo, prioridad }) {
    setTareas((prev) => [crearTarea({ titulo, prioridad }), ...prev]);
  }

  function guardarCambios(id, cambios) {
    setTareas((prev) => prev.map((t) => (t.id === id ? { ...t, ...cambios } : t)));
  }

  function mover(id, estado) {
    setTareas((prev) => moverTarea(prev, id, estado));
  }

  function eliminar(id) {
    const indice = tareas.findIndex((t) => t.id === id);
    if (indice < 0) return;
    const tarea = tareas[indice];
    setTareas((prev) => prev.filter((t) => t.id !== id));
    mostrarAviso('Tarea eliminada.', () => {
      setTareas((prev) => {
        const copia = [...prev];
        copia.splice(Math.min(indice, copia.length), 0, tarea);
        return copia;
      });
      setAviso(null);
    });
  }

  function limpiarHechas() {
    const quitadas = porColumna.done;
    if (!quitadas.length) return;
    setTareas((prev) => prev.filter((t) => t.estado !== 'done'));
    mostrarAviso(`${plural(quitadas.length, 'tarea hecha eliminada', 'tareas hechas eliminadas')}.`, () => {
      setTareas((prev) => [...prev, ...quitadas]);
      setAviso(null);
    });
  }

  function restablecer() {
    if (window.confirm('¿Volver a las tareas de ejemplo? Se pierden las tareas actuales.')) {
      setTareas(tareasDeEjemplo());
      setAviso(null);
    }
  }

  // --- Arrastrar y soltar ---
  function iniciarArrastre(id) {
    // Se difiere un tick para que la imagen que sigue al puntero no salga atenuada.
    temporizadorArrastre.current = setTimeout(() => setArrastrando(id), 0);
  }

  function terminarArrastre() {
    clearTimeout(temporizadorArrastre.current);
    setArrastrando(null);
    setDestino(null);
  }

  function soltar(id, { estado, antesDe }) {
    setTareas((prev) => moverTarea(prev, id, estado, antesDe));
    terminarArrastre();
  }

  return (
    <div className="gt">
      <div className="gt-contenedor">
        <header className="gt-cabecera">
          <div>
            <h1 className="gt-titulo">Gestor de tareas</h1>
            <p className="gt-bajada">
              Arrastrá las tarjetas entre columnas o usá las flechas. Todo se guarda en este
              navegador y se sincroniza entre pestañas.
            </p>
          </div>

          <div className="gt-resumen">
            <p className="gt-resumen__texto">
              {total
                ? `${hechas} de ${plural(total, 'tarea hecha', 'tareas hechas')}`
                : 'Todavía no hay tareas.'}
            </p>
            <div
              className="gt-progreso"
              role="progressbar"
              aria-label="Tareas hechas"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={hechas}
            >
              <div className="gt-progreso__relleno" style={{ width: `${porcentaje}%` }} />
            </div>
            <button type="button" className="gt-enlace" onClick={restablecer}>
              Restablecer demo
            </button>
          </div>
        </header>

        <FormularioNueva onAgregar={agregar} />

        <main className="gt-tablero">
          {COLUMNAS.map((columna) => (
            <Columna
              key={columna.id}
              columna={columna}
              tareas={porColumna[columna.id]}
              arrastrando={arrastrando}
              destino={destino}
              onDestino={setDestino}
              onSoltar={soltar}
              onLimpiar={limpiarHechas}
              onInicioArrastre={iniciarArrastre}
              onFinArrastre={terminarArrastre}
              onMover={mover}
              onGuardar={guardarCambios}
              onEliminar={eliminar}
            />
          ))}
        </main>
      </div>

      {aviso && (
        <div className="gt-aviso" role="status">
          <span>{aviso.texto}</span>
          {aviso.deshacer && (
            <button type="button" className="gt-aviso__boton" onClick={aviso.deshacer}>
              Deshacer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
