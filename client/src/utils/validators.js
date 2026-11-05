// Cada validador devuelve un string con el error, o '' si el valor es válido.
export const validateName = (v = '') => {
  const s = v.trim()
  if (!s) return 'Escribe tu nombre.'
  if (s.length < 2) return 'El nombre debe tener al menos 2 caracteres.'
  if (s.length > 60) return 'El nombre no puede superar los 60 caracteres.'
  if (!/^[\p{L}\s'.-]+$/u.test(s)) return 'El nombre solo puede contener letras y espacios.'
  return ''
}

export const validateEmail = (v = '') => {
  const s = v.trim()
  if (!s) return 'Escribe tu email.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)) return 'Ingresa un email válido, por ejemplo nombre@correo.com.'
  return ''
}

export const validatePassword = (v = '') => {
  if (!v) return 'Escribe una contraseña.'
  if (v.length < 8) return 'Usa al menos 8 caracteres.'
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Combina letras y números.'
  return ''
}

export const validateMessage = (v = '') => {
  const s = v.trim()
  if (!s) return 'Cuéntame en qué te puedo ayudar.'
  if (s.length < 10) return 'Escribe al menos 10 caracteres.'
  if (s.length > 1000) return 'El mensaje no puede superar los 1000 caracteres.'
  return ''
}

export const validateSelect = (v, options) =>
  options.includes(v) ? '' : 'Elige una de las opciones.'

// Para cuando se suban imágenes (panel admin)
export const validateImage = (file, { maxMB = 2, types = ['image/jpeg', 'image/png', 'image/webp'] } = {}) => {
  if (!file) return 'Selecciona una imagen.'
  if (!types.includes(file.type)) return 'Formato no permitido. Usa JPG, PNG o WebP.'
  if (file.size > maxMB * 1024 * 1024) return `La imagen no puede superar ${maxMB} MB.`
  return ''
}
