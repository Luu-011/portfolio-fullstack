// SIMULADO con localStorage. Cuando exista el backend, reemplazar el cuerpo
// de cada función por una llamada a la API (por ejemplo api.post('/auth/login', data)).
// Las contraseñas NO deben guardarse así en producción: el backend usa bcrypt.
const KEY = 'mock_users'
const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms))

// Cuentas de prueba para probar los paneles
const SEED = [
  { id: 1, name: 'Administrador', email: 'admin@demo.com', password: 'Admin12345', role: 'admin' },
  { id: 2, name: 'Operador', email: 'operador@demo.com', password: 'Operador123', role: 'operator' },
]

const read = () => {
  const raw = localStorage.getItem(KEY)
  const users = raw ? JSON.parse(raw) : []
  const missing = SEED.filter((s) => !users.some((u) => u.email === s.email))
  if (missing.length) {
    const all = [...missing, ...users]
    localStorage.setItem(KEY, JSON.stringify(all))
    return all
  }
  return users
}

export async function register({ name, email, password }) {
  await wait()
  const users = read()
  if (users.some((u) => u.email === email)) {
    throw new Error('Ya existe una cuenta con ese email.')
  }
  const user = { id: Date.now(), name, email, password, role: 'user' }
  localStorage.setItem(KEY, JSON.stringify([...users, user]))
  const { password: _omit, ...safe } = user
  return safe
}

export async function login({ email, password }) {
  await wait()
  const user = read().find((u) => u.email === email && u.password === password)
  if (!user) throw new Error('Email o contraseña incorrectos.')
  const { password: _omit, ...safe } = user
  return safe
}
