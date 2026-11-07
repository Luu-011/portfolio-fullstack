import nodemailer from 'nodemailer'

// Tres formas de enviar, según lo que haya en el .env (en este orden de prioridad):
//   1. BREVO_API_KEY            -> API HTTPS de Brevo. Sirve en hostings que bloquean SMTP (Render gratis).
//   2. EMAIL_USER y EMAIL_PASS  -> SMTP (Gmail con contraseña de aplicación). Funciona en tu computadora.
//   3. ninguna                  -> MODO PRUEBA: el correo se muestra en la consola y no se envía.
const brevoKey = process.env.BREVO_API_KEY
const smtpConfigured = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS)
export const mailMode = brevoKey ? 'brevo' : smtpConfigured ? 'smtp' : 'test'

const BREVO_URL = (process.env.BREVO_API_URL || 'https://api.brevo.com/v3').replace(/\/$/, '')
const port = Number(process.env.EMAIL_PORT || 465)

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port,
      secure: port === 465,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    })
  : nodemailer.createTransport({ jsonTransport: true })

const fromValue = () => process.env.MAIL_FROM || process.env.EMAIL_USER || 'portfolio@localhost'

// '"NombreTech <cuenta@mail.com>"' -> { name: 'NombreTech', email: 'cuenta@mail.com' }
function parseFrom(value) {
  const m = /^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/.exec(value || '')
  return m ? { name: m[1].trim() || undefined, email: m[2].trim() } : { email: (value || '').trim() }
}

async function sendViaBrevo({ to, subject, text, html, replyTo }) {
  const body = { sender: parseFrom(fromValue()), to: [{ email: to }], subject, textContent: text, htmlContent: html }
  if (replyTo) body.replyTo = { email: replyTo }

  const res = await fetch(`${BREVO_URL}/smtp/email`, {
    method: 'POST',
    headers: { 'api-key': brevoKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) {
    const detail = await res.json().catch(() => null)
    throw new Error(`Brevo respondió ${res.status}${detail?.message ? `: ${detail.message}` : ''}`)
  }
  return res.json().catch(() => ({}))
}

export async function sendMail(message) {
  if (mailMode === 'brevo') return sendViaBrevo(message)

  const { to, subject, text, html, replyTo } = message
  const info = await transporter.sendMail({ from: fromValue(), to, replyTo, subject, text, html })
  if (mailMode === 'test') {
    console.log(`\n[correo de prueba - NO se envió] Para: ${to} | Asunto: ${subject}\n${text}\n`)
  }
  return info
}

export async function verifyMailer() {
  if (mailMode === 'brevo') {
    const res = await fetch(`${BREVO_URL}/account`, { headers: { 'api-key': brevoKey }, signal: AbortSignal.timeout(10000) })
    if (!res.ok) throw new Error(`Brevo rechazó la clave (HTTP ${res.status})`)
  } else if (mailMode === 'smtp') {
    await transporter.verify()
  }
}
