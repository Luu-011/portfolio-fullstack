//Es el logo clicable del sitio: un enlace a la página de inicio que combina un icono + el nombre de la marca
//  (partido en dos para poder pintarlo de dos colores),
//  sacando los textos de un archivo de constantes y añadiendo una etiqueta accesible para lectores de pantalla.

import { Link } from 'react-router-dom'
import { Code } from './Icons'
import { SITE } from '../../utils/constants'

export default function Logo() {
  return (
    <Link to="/" className="brand" aria-label={`${SITE.brandFirst}${SITE.brandSecond} - inicio`}>
      <span className="brand-mark"><Code /></span>
      <span className="brand-name">{SITE.brandFirst}<span>{SITE.brandSecond}</span></span>
    </Link>
  )
}
