// Campo de formulario con etiqueta, ayuda y mensaje de error accesible
export default function Field({ id, label, error, hint, children }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      {children}
      {error && <div id={`${id}-error`} className="invalid-feedback d-block">{error}</div>}
      {hint && !error && <div className="form-text">{hint}</div>}
    </div>
  )
}

// Atributos comunes de accesibilidad para el input/textarea/select del campo
export const fieldProps = (id, error) => ({
  id,
  className: error ? 'is-invalid' : '',
  'aria-invalid': Boolean(error),
  'aria-describedby': error ? `${id}-error` : undefined,
})
