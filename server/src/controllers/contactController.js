import * as Contact from '../models/Contact.js'
import * as ContactReply from '../models/ContactReply.js'
import { sendMail } from '../config/mailer.js'
import { ownerNotification, replyEmail } from '../utils/emailTemplates.js'

// POST /api/contacts  (público)
export async function create(req, res, next) {
  try {
    const { name, email, type, message } = req.body
    const contact = await Contact.create({ name, email, type, message })

    // La consulta ya quedó registrada. Si el aviso por email falla, no se le informa error al visitante.
    sendMail(ownerNotification(contact)).catch((err) =>
      console.error('No se pudo enviar el aviso de nueva consulta:', err.message)
    )

    res.status(201).json({ ok: true })
  } catch (err) {
    next(err)
  }
}

// GET /api/contacts  (operador o admin)
export async function list(req, res, next) {
  try {
    res.json(await Contact.findAll({ status: req.query.status }))
  } catch (err) {
    next(err)
  }
}

// POST /api/contacts/:id/replies  (operador o admin)
export async function reply(req, res, next) {
  try {
    const id = Number(req.params.id)
    const contact = await Contact.findById(id)
    if (!contact) return res.status(404).json({ message: 'La consulta no existe.' })

    // Primero se envía el correo: si falla, no se guarda nada y el operador puede reintentar
    try {
      await sendMail(replyEmail(contact, req.body.text))
    } catch (err) {
      console.error('No se pudo enviar la respuesta por email:', err.message)
      return res.status(502).json({ message: 'No se pudo enviar el correo. La respuesta no se guardó; intenta de nuevo.' })
    }

    await ContactReply.create({ contactId: id, userId: req.user.id, text: req.body.text })
    res.json(await Contact.findById(id))
  } catch (err) {
    next(err)
  }
}
