export function notFound(_req, res) {
  res.status(404).json({ message: 'Ruta no encontrada.' })
}

export function errorHandler(err, _req, res, _next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'El cuerpo de la petición no es un JSON válido.' })
  }
  // Errores de subida de archivos (multer)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'La imagen no puede superar los 2 MB.' })
  }
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: 'Archivo no válido. Envía una sola imagen en el campo "image".' })
  }
  console.error(err)
  res.status(500).json({ message: 'Ocurrió un error en el servidor.' })
}
