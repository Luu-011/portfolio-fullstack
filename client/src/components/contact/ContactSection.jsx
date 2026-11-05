//Es la sección de contacto con dos columnas: a la izquierda un texto de invitación 
// y el email con un botón que lo copia al portapapeles (mostrando ✅ durante 2 segundos como confirmación), 
// y a la derecha el formulario de contacto ya construido — todo con un id="contacto" para que los enlaces internos salten aquí.

import { useState } from 'react'
import ContactForm from './ContactForm'
import { Mail, Copy, Check } from '../common/Icons'
import { SITE } from '../../utils/constants'

export default function ContactSection() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* el portapapeles no está disponible */
    }
  }

  return (
    <section id="contacto" className="section">
      <div className="container">
        <div className="row g-5 align-items-start">
          <div className="col-lg-5">
            <p className="section-label">Contacto</p>
            <h2 className="contact-title">Tu próxima idea merece tomar forma.</h2>
            <p className="lead-text">Cuéntame qué tienes en mente. Respondo con claridad y sin vueltas.</p>
            <p className="email-line">
              <Mail /> <span>{SITE.email}</span>
              <button type="button" className="icon-btn" onClick={copyEmail} aria-label="Copiar email">
                {copied ? <Check /> : <Copy />}
              </button>
            </p>
            <p className="small-note">Consultas generales, cotización de proyectos y asesoría técnica.</p>
          </div>
          <div className="col-lg-7"><ContactForm /></div>
        </div>
      </div>
    </section>
  )
}
