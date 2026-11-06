const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const withBreaks = (s) => esc(s).replace(/\n/g, '<br>')

const owner = () => process.env.OWNER_EMAIL || process.env.EMAIL_USER || 'owner@localhost'

// Aviso al dueño del portfolio cuando llega una consulta nueva
export function ownerNotification(contact) {
  return {
    to: owner(),
    replyTo: contact.email, // al responder desde el correo, le contestás directo al visitante
    subject: `Nueva consulta: ${contact.type}`,
    text: `${contact.name} (${contact.email}) envió una consulta de tipo "${contact.type}":\n\n${contact.message}\n\nPodés responderla desde el panel del sitio.`,
    html: `<p><strong>${esc(contact.name)}</strong> (${esc(contact.email)}) envió una consulta de tipo <em>${esc(contact.type)}</em>:</p>
<blockquote>${withBreaks(contact.message)}</blockquote>
<p>Podés responderla desde el panel del sitio.</p>`,
  }
}

// Respuesta del operador al visitante
export function replyEmail(contact, text) {
  return {
    to: contact.email,
    replyTo: owner(),
    subject: `Re: ${contact.type}`,
    text: `Hola ${contact.name},\n\n${text}\n\n---\nTu consulta original:\n${contact.message}`,
    html: `<p>Hola ${esc(contact.name)},</p>
<p>${withBreaks(text)}</p>
<hr>
<p style="color:#5C5552"><small>Tu consulta original:<br>${withBreaks(contact.message)}</small></p>`,
  }
}
