import nodemailer from 'nodemailer'

// Si EMAIL_USER y EMAIL_PASS están en el .env, se envían correos reales (SMTP).
// Si no, funciona en MODO PRUEBA: el correo se muestra en la consola y no sale de tu computadora.
const configured = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS)
export const mailMode = configured ? 'smtp' : 'test'

const port = Number(process.env.EMAIL_PORT || 465)

const transporter = configured
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

export async function sendMail({ to, subject, text, html, replyTo }) {
  const from = process.env.MAIL_FROM || process.env.EMAIL_USER || 'portfolio@localhost'
  const info = await transporter.sendMail({ from, to, replyTo, subject, text, html })
  if (!configured) {
    console.log(`\n[correo de prueba - NO se envió] Para: ${to} | Asunto: ${subject}\n${text}\n`)
  }
  return info
}

export async function verifyMailer() {
  if (configured) await transporter.verify()
}
