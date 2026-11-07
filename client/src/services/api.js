// Cliente HTTP único: todos los services pasan por acá.
// La dirección del backend se configura con VITE_API_URL (archivo client/.env o variables de Vercel).
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '')

// Para armar la URL de imágenes subidas (/uploads/...)
export const API_ORIGIN = API_URL.replace(/\/api$/, '')

const TOKEN_KEY = 'auth_token'

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}

export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch { /* almacenamiento no disponible */ }
}

export async function request(path, { method = 'GET', body } = {}) {
  const token = getToken()
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData
  // Con FormData el navegador pone solo el Content-Type (multipart) y su separador
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json'

  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica que esté en funcionamiento.')
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null)

  if (!res.ok) {
    // Sesión vencida o token inválido: se limpia y se vuelve al login
    if (res.status === 401 && token && !path.startsWith('/auth/')) {
      setToken(null)
      try { localStorage.removeItem('auth_user') } catch { /* nada */ }
      window.location.assign('/login')
    }
    throw new Error(data?.message || 'Ocurrió un error. Intenta de nuevo.')
  }
  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
