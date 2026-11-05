// SIMULADO. Reemplazar por: api.get('/projects') y api.get(`/projects/${id}`)
// La forma de los datos ya es la que devolvería la API: cada proyecto trae su array de demos
// (en la base de datos, las demos son otra tabla con project_id).
const wait = (ms = 400) => new Promise((r) => setTimeout(r, ms))

const PROJECTS = [
  {
    id: 1,
    title: 'Tienda online',
    summary: 'Catálogo, carrito y panel de pedidos para un comercio local.',
    description: 'Aplicación web con catálogo de productos, carrito de compras y gestión de pedidos. El backend expone una API REST con autenticación y el frontend consume los datos con React.',
    stack: ['React', 'Node.js', 'Express', 'MySQL'],
    repoUrl: 'https://github.com/',
    year: 2026,
    demos: [
      { id: 11, title: 'Catálogo de productos', description: 'Listado con filtros y búsqueda.', url: 'https://example.com' },
      { id: 12, title: 'Panel de pedidos', description: 'Vista del operador con estados de pedido.', url: 'https://example.com' },
    ],
  },
  {
    id: 2,
    title: 'Gestor de tareas',
    summary: 'Tablero de tareas con arrastrar y soltar y guardado local.',
    description: 'Tablero estilo kanban que usa la API Drag and Drop y Web Storage para recordar el estado entre sesiones. Pensado para practicar manejo de estado en React.',
    stack: ['React', 'JavaScript', 'Web Storage API'],
    repoUrl: 'https://github.com/',
    year: 2026,
    demos: [{ id: 21, title: 'Tablero kanban', description: 'Mover tareas entre columnas.', url: 'https://example.com' }],
  },
  {
    id: 3,
    title: 'API de reservas',
    summary: 'Servicio REST para reservar turnos con validaciones.',
    description: 'API para crear, consultar y cancelar reservas, con validación de datos y consultas parametrizadas sobre MySQL. Documentada y probada con Postman.',
    stack: ['Node.js', 'Express', 'MySQL', 'REST API'],
    repoUrl: 'https://github.com/',
    year: 2025,
    demos: [],
  },
]

export async function getProjects() {
  await wait()
  return PROJECTS
}

export async function getProjectById(id) {
  await wait(250)
  const project = PROJECTS.find((p) => p.id === Number(id))
  if (!project) throw new Error('No encontramos ese proyecto.')
  return project
}
