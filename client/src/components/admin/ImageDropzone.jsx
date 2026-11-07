import { useEffect, useState } from 'react'
import { validateImage } from '../../utils/validators'

// Selector de imagen con arrastrar y soltar (Drag and Drop API), vista previa (FileReader API)
// y validación de tipo y tamaño. El servidor vuelve a validar el contenido real del archivo.
export default function ImageDropzone({ currentUrl, file, onFile, removeCurrent, onRemoveCurrent }) {
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { if (!file) setPreview(null) }, [file])

  const accept = (f) => {
    const found = validateImage(f)
    setError(found)
    if (found) return
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result)
      onFile(f)
      onRemoveCurrent(false)
    }
    reader.readAsDataURL(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files[0]) accept(e.dataTransfer.files[0])
  }

  const clearNew = () => { onFile(null); setError('') }

  return (
    <div>
      {preview && file && (
        <div className="preview">
          <img src={preview} alt="Vista previa de la imagen elegida" />
          <button type="button" className="btn btn-ghost btn-sm" onClick={clearNew}>Quitar imagen elegida</button>
        </div>
      )}

      {!file && currentUrl && !removeCurrent && (
        <div className="preview">
          <img src={currentUrl} alt="Imagen actual del proyecto" />
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onRemoveCurrent(true)}>Eliminar imagen actual</button>
        </div>
      )}

      {!file && removeCurrent && (
        <p className="notice">La imagen actual se eliminará al guardar.{' '}
          <button type="button" className="text-link btn-link-inline" onClick={() => onRemoveCurrent(false)}>Deshacer</button>
        </p>
      )}

      <label
        className={`dropzone ${dragging ? 'is-dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input type="file" accept="image/jpeg,image/png,image/webp" className="visually-hidden"
          onChange={(e) => { if (e.target.files[0]) accept(e.target.files[0]); e.target.value = '' }} />
        Arrastra una imagen aquí o haz clic para elegirla
        <span className="d-block small-note">JPG, PNG o WebP, hasta 2 MB</span>
      </label>
      {error && <div role="alert" className="invalid-feedback d-block">{error}</div>}
    </div>
  )
}
