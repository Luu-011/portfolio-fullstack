import { writeFile, unlink } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const UPLOADS_DIR = fileURLToPath(new URL('../../uploads', import.meta.url))

// Detecta el tipo REAL de la imagen por sus primeros bytes. No confía en el nombre
// del archivo ni en el tipo que declara el navegador, que se pueden falsificar.
export function detectImageType(buf) {
  if (buf.length < 12) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: 'jpg' }
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: 'png' }
  if (buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') return { ext: 'webp' }
  return null
}

// Guarda con un nombre aleatorio (nunca el que manda el usuario) y devuelve la ruta pública
export async function saveImage(buffer, ext) {
  const name = `${randomUUID()}.${ext}`
  await writeFile(path.join(UPLOADS_DIR, name), buffer)
  return `/uploads/${name}`
}

export async function deleteImage(imagePath) {
  if (!imagePath || !imagePath.startsWith('/uploads/')) return
  try {
    await unlink(path.join(UPLOADS_DIR, path.basename(imagePath)))
  } catch {
    /* el archivo ya no existe */
  }
}
