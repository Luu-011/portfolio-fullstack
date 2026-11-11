// Guardado local con la Web Storage API (localStorage).
// Todo va dentro de try/catch: en modo privado o con el almacenamiento
// bloqueado el tablero sigue funcionando, solo que sin persistir.

import { COLUMNAS, PRIORIDADES, tareasDeEjemplo } from './datos.js';

export const CLAVE = 'gestor-tareas:v1';

const estados = new Set(COLUMNAS.map((c) => c.id));
const prioridades = new Set(PRIORIDADES.map((p) => p.id));

function esTareaValida(t) {
  return (
    t &&
    typeof t.id === 'string' &&
    typeof t.titulo === 'string' &&
    t.titulo.length > 0 &&
    estados.has(t.estado) &&
    prioridades.has(t.prioridad)
  );
}

function leer() {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (crudo === null) return null;
    const datos = JSON.parse(crudo);
    return Array.isArray(datos) ? datos.filter(esTareaValida) : null;
  } catch {
    return null;
  }
}

// Primera visita (o datos ilegibles): arranca con tareas de ejemplo.
export function cargarTareas() {
  return leer() ?? tareasDeEjemplo();
}

export function guardarTareas(tareas) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(tareas));
  } catch {
    /* sin espacio o bloqueado: se ignora */
  }
}

// El evento "storage" se dispara en las demás pestañas cuando una cambia la clave.
export function escucharOtrasPestañas(alCambiar) {
  function manejar(e) {
    if (e.key === CLAVE || e.key === null) alCambiar();
  }
  window.addEventListener('storage', manejar);
  return () => window.removeEventListener('storage', manejar);
}
