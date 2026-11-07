import { api, setToken } from './api'

// El backend devuelve { token, user }: se guarda el token y se devuelve el usuario
export async function register({ name, email, password }) {
  const { token, user } = await api.post('/auth/register', { name, email, password })
  setToken(token)
  return user
}

export async function login({ email, password }) {
  const { token, user } = await api.post('/auth/login', { email, password })
  setToken(token)
  return user
}

export function logout() {
  setToken(null)
}
