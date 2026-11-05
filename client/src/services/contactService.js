// SIMULADO con localStorage. Reemplazar por la API:
//   sendContact  -> api.post('/contacts', data)
//   getContacts  -> api.get('/contacts')
//   replyContact -> api.post(`/contacts/${id}/replies`, { text })   (el backend envía el email)
const KEY = 'mock_contacts'
const wait = (ms = 400) => new Promise((r) => setTimeout(r, ms))

const SEED = [
  { id: 1001, name: 'Camila Rojas', email: 'camila@ejemplo.com', type: 'Cotización de proyecto', status: 'pendiente',
    message: 'Hola, necesito una web con tienda online para mi emprendimiento. ¿Cuánto tiempo llevaría y qué presupuesto aproximado manejás?',
    createdAt: '2026-11-03T14:20:00.000Z', replies: [] },
  { id: 1002, name: 'Martín Pérez', email: 'martin@ejemplo.com', type: 'Asesoría técnica', status: 'respondida',
    message: 'Estoy dudando entre MySQL y MongoDB para una app de reservas. ¿Me podés orientar?',
    createdAt: '2026-11-01T10:05:00.000Z',
    replies: [{ id: 2001, operator: 'Operador', createdAt: '2026-11-01T16:40:00.000Z',
      text: 'Para reservas conviene MySQL, porque hay relaciones claras entre usuarios, turnos y servicios. Si querés, coordinamos una llamada corta.' }] },
  { id: 1003, name: 'Lucía Gómez', email: 'lucia@ejemplo.com', type: 'Consulta general', status: 'pendiente',
    message: 'Vi tu portfolio y me gustó mucho. ¿Trabajás con equipos o solo de forma independiente?',
    createdAt: '2026-10-30T09:15:00.000Z', replies: [] },
]

const read = () => {
  const raw = localStorage.getItem(KEY)
  const list = raw ? JSON.parse(raw) : []
  const missing = SEED.filter((s) => !list.some((c) => c.id === s.id))
  const all = [...list, ...missing].map((c) => ({ status: 'pendiente', replies: [], ...c }))
  if (missing.length || !raw) localStorage.setItem(KEY, JSON.stringify(all))
  return all
}
const write = (list) => localStorage.setItem(KEY, JSON.stringify(list))

export async function sendContact(data) {
  await wait(700)
  write([...read(), { ...data, id: Date.now(), status: 'pendiente', createdAt: new Date().toISOString(), replies: [] }])
  return { ok: true }
}

export async function getContacts() {
  await wait(300)
  return read().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function replyContact(id, { text, operator }) {
  await wait(600)
  const list = read()
  const i = list.findIndex((c) => c.id === id)
  if (i < 0) throw new Error('La consulta ya no existe.')
  const reply = { id: Date.now(), text, operator, createdAt: new Date().toISOString() }
  list[i] = { ...list[i], status: 'respondida', replies: [...list[i].replies, reply] }
  write(list)
  return list[i]
}
