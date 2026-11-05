//Es una fábrica de iconos SVG: una función que crea componentes de icono con todos los ajustes visuales ya puestos
//  (línea, color heredado, tamaño del texto), y luego la usa para fabricar 10 iconos distintos cambiándole solo el dibujo.

const icon = (paths) =>
  function Icon(props) {
    return (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
        {paths}
      </svg>
    )
  }

export const ArrowUpRight = icon(<path d="M7 17 17 7M8 7h9v9" />)
export const ArrowDown = icon(<path d="M12 5v14m-6-6 6 6 6-6" />)
export const Code = icon(<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />)
export const Mail = icon(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>)
export const Lock = icon(<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>)
export const Send = icon(<path d="m21 3-9 18-2-8-8-2zM21 3 10 13" />)
export const Shield = icon(<path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z" />)
export const Copy = icon(<><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></>)
export const Check = icon(<path d="m5 12 5 5 9-10" />)
export const Layers = icon(<><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" /></>)
