import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowUpRight, ArrowDown, Code } from '../common/Icons'
import { SITE } from '../../utils/constants'

export default function Hero() {
  const root = useRef(null)

  useEffect(() => {
    // gsap.matchMedia respeta "reducir movimiento" del sistema operativo
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        // Entrada escalonada del texto
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from('.status-pill', { y: 16, autoAlpha: 0, duration: 0.5 })
          .from('.hero .eyebrow', { y: 16, autoAlpha: 0, duration: 0.5 }, '-=0.3')
          .from('.hero h1', { y: 40, autoAlpha: 0, duration: 0.8 }, '-=0.3')
          .from('.hero .lead-text', { y: 24, autoAlpha: 0, duration: 0.6 }, '-=0.5')
          .from('.hero .btn', { y: 20, autoAlpha: 0, duration: 0.5, stagger: 0.12 }, '-=0.4')
          // La tarjeta entra desde la derecha, en paralelo con el texto
          .from('.hero-card', { x: 60, autoAlpha: 0, duration: 0.9 }, 0.3)
          // Los chips solo cambian opacidad para no pisar su posición en CSS
          .from('.orbit .chip', { autoAlpha: 0, duration: 0.5, stagger: 0.15 }, '-=0.2')

        // Flotación suave de la tarjeta (solo eje y, no choca con la entrada en x)
        gsap.to('.hero-card', {
          y: -10,
          duration: 3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 1.2,
        })
      }, root)

      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="hero" ref={root}>
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