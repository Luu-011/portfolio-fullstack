// Constantes, datos de ejemplo y funciones puras del tablero.

export const COLUMNAS = [
  {
    id: 'todo',
    titulo: 'Por hacer',
    vacio: 'No quedan tareas pendientes. Agregá una arriba.',
  },
  {
    id: 'doing',
    titulo: 'En curso',
    vacio: 'Arrastrá acá lo que estés haciendo.',
  },
  {
    id: 'done',
    titulo: 'Hecho',
    vacio: 'Lo que termines aparece acá.',
  },
];

export const PRIORIDADES = [
  { id: 'alta', etiqueta: 'Alta' },
  { id: 'media', etiqueta: 'Media' },
  { id: 'baja', etiqueta: 'Baja' },
];

export const MAX_TITULO = 80;
export const MAX_NOTA = 240;

export function nuevoId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

export function crearTarea({ titulo, nota = '', prioridad = 'media', estado = 'todo' }) {
  return {
    id: nuevoId(),
    titulo: titulo.trim(),
    nota: nota.trim(),
    prioridad,
    estado,
    creada: Date.now(),
  };
}

export function tareasDeEjemplo() {
  return [
    crearTarea({ titulo: 'Escribir los textos de la página de inicio', prioridad: 'media' }),
    crearTarea({
      titulo: 'Cargar las fotos de los productos',
      nota: 'Mínimo tres por producto.',
      prioridad: 'baja',
    }),
    crearTarea({
      titulo: 'Revisar el formulario de contacto',
      nota: 'Falla al enviar sin teléfono.',
      prioridad: 'alta',
      estado: 'doing',
    }),
    crearTarea({ titulo: 'Elegir el dominio', prioridad: 'media', estado: 'done' }),
    crearTarea({ titulo: 'Crear el correo del equipo', prioridad: 'baja', estado: 'done' }),
  ];
}

// Mueve una tarea a una columna. Si `antesDeId` es null, la deja al final de la columna.
export function moverTarea(tareas, id, estado, antesDeId = null) {
  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) return tareas;

  const resto = tareas.filter((t) => t.id !== id);
  const movida = { ...tarea, estado };

  if (antesDeId) {
    const i = resto.findIndex((t) => t.id === antesDeId);
    if (i >= 0) {
      resto.splice(i, 0, movida);
      return resto;
    }
  }

  let ultimo = -1;
  resto.forEach((t, i) => {
    if (t.estado === estado) ultimo = i;
  });
  resto.splice(ultimo + 1, 0, movida);
  return resto;
}
