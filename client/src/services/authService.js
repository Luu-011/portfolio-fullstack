// SIMULADO con localStorage. Cuando exista el backend, reemplazar el cuerpo
// de cada función por una llamada a la API (por ejemplo api.post('/auth/login', data)).
// Las contraseñas NO deben guardarse así en producción: el backend usa bcrypt.
const KEY = 'mock_users'
const read = () => JSON.parse(localStorage.getItem(KEY) || '[]')
const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms))

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
