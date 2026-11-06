export function notFound(_req, res) {
  res.status(404).json({ message: 'Ruta no encontrada.' })
}

// JSON mal formado, etc.
export function errorHandler(err, _req, res, _next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'El cuerpo de la petición no es un JSON válido.' })
  }
  console.error(err)
  res.status(500).json({ message: 'Ocurrió un error en el servidor.' })
}
