//Es la **sección "Hero" (portada principal)**: a la izquierda muestra una píldora de disponibilidad, 
// un titular grande con acento, un texto descriptivo y dos botones de ancla ("Hablemos" → contacto, "Ver proyectos" → proyectos); 
// a la derecha, una **tarjeta decorativa tipo "ventana de código"** 
// (oculta a lectores de pantalla) con puntos de ventana, el dominio del sitio, un bloque de código y un "orbit" con chips UI/API/DB.

import { ArrowUpRight, ArrowDown, Code } from '../common/Icons'
import { SITE } from '../../utils/constants'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <p className="status-pill"><span className="status-dot" /> Disponible para nuevos proyectos</p>
            <p className="eyebrow">Desarrollo full stack y experiencias web</p>
            <h1>
              Ideas claras.<br />
              <span className="accent">Productos</span> bien hechos.
            </h1>
            <p className="lead-text">
              Diseño y desarrollo soluciones web de punta a punta: interfaces simples,
              APIs sólidas y datos que trabajan en conjunto.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <a href="#contacto" className="btn btn-brand">Hablemos de tu proyecto <ArrowUpRight /></a>
              <a href="#proyectos" className="btn btn-ghost">Ver proyectos <ArrowDown /></a>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-card" aria-hidden="true">
              <div className="hero-card-bar">
                <span className="dots"><i /><i /><i /></span>
                <span>{SITE.domain}</span>
                <Code />
              </div>
              <div className="hero-card-body">
                <pre className="code-block">
{`01  const idea = "tu proyecto";
02  function construir() {
03    return experiencia;
04  }`}
                </pre>
                <div className="orbit">
                  <span className="orbit-core"><Code /></span>
                  <span className="chip chip-ui">UI</span>
                  <span className="chip chip-api">API</span>
                  <span className="chip chip-db">DB</span>
                </div>
              </div>
              <div className="hero-card-foot"><span>De la idea al producto</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
