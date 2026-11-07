// Validaciones de proyectos, demos y servicios. Cada una devuelve el texto del error o '' si es válido.
// El servidor repite las mismas reglas (src/utils/contentRules.js).
const between = (v, min, max) => v.length >= min && v.length <= max

const isHttpUrl = (v) => {
  try {
    const u = new URL(v)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export const parseStack = (v = '') => v.split(',').map((s) => s.trim()).filter(Boolean)

export const validateTitle = (v = '') => {
  const s = v.trim()
  if (!s) return 'Escribe el título.'
  return between(s, 2, 100) ? '' : 'El título debe tener entre 2 y 100 caracteres.'
}

export const validateSummary = (v = '') => {
  const s = v.trim()
  if (!s) return 'Escribe un resumen.'
  return between(s, 5, 255) ? '' : 'El resumen debe tener entre 5 y 255 caracteres.'
}

export const validateDescription = (v = '') => {
  const s = v.trim()
  if (!s) return 'Escribe la descripción.'
  return between(s, 10, 5000) ? '' : 'La descripción debe tener entre 10 y 5000 caracteres.'
}

export const validateStack = (v = '') => {
  const list = parseStack(v)
  if (list.length < 1 || list.length > 10) return 'Indica entre 1 y 10 tecnologías, separadas por comas.'
  if (list.some((s) => s.length > 30)) return 'Cada tecnología puede tener hasta 30 caracteres.'
  return ''
}

const URL_ERROR = 'Ingresa una URL que empiece con http:// o https://'

export const validateOptionalUrl = (v = '') => {
  const s = v.trim()
  if (!s) return ''
  if (!isHttpUrl(s)) return URL_ERROR
  return s.length <= 255 ? '' : 'La URL es demasiado larga.'
}

export const validateRequiredUrl = (v = '') => {
  if (!v.trim()) return 'Escribe la URL.'
  return validateOptionalUrl(v)
}

export const validateYear = (v = '') => {
  if (String(v).trim() === '') return ''
  const n = Number(v)
  return Number.isInteger(n) && n >= 2000 && n <= 2100 ? '' : 'El año debe estar entre 2000 y 2100.'
}

export const validateDemoDescription = (v = '') =>
  v.trim().length <= 255 ? '' : 'La descripción no puede superar los 255 caracteres.'

export const validateServiceDescription = (v = '') => {
  const s = v.trim()
  if (!s) return 'Escribe la descripción.'
  return between(s, 5, 1000) ? '' : 'La descripción debe tener entre 5 y 1000 caracteres.'
}

export const validatePrice = (v = '') => {
  if (String(v).trim() === '') return ''
  const n = Number(v)
  return Number.isFinite(n) && n >= 0 && n <= 99999999 ? '' : 'El precio debe ser un número positivo.'
}
