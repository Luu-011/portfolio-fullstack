import { body } from 'express-validator'
import { CONTACT_TYPES } from './constants.js'

// Reglas de validación compartidas. Replican utils/validators.js del frontend:
// el servidor nunca confía solo en lo que valida el cliente.
export const nameRule = body('name').isString().withMessage('Escribe tu nombre.').bail().trim()
  .isLength({ min: 2, max: 60 }).withMessage('El nombre debe tener entre 2 y 60 caracteres.').bail()
  .matches(/^[\p{L}\s'.-]+$/u).withMessage('El nombre solo puede contener letras y espacios.')

export const emailRule = body('email').isString().withMessage('Escribe tu email.').bail().trim().toLowerCase()
  .isEmail().withMessage('Ingresa un email válido.').bail()
  .isLength({ max: 120 }).withMessage('El email es demasiado largo.')

export const passwordRule = body('password').isString().withMessage('Escribe una contraseña.').bail()
  .isLength({ min: 8, max: 72 }).withMessage('La contraseña debe tener entre 8 y 72 caracteres.').bail()
  .matches(/[A-Za-z]/).withMessage('Combina letras y números.').bail()
  .matches(/\d/).withMessage('Combina letras y números.')

export const typeRule = body('type').isIn(CONTACT_TYPES).withMessage('Elige una de las opciones.')

export const messageRule = body('message').isString().withMessage('Cuéntame en qué te puedo ayudar.').bail().trim()
  .isLength({ min: 10, max: 1000 }).withMessage('El mensaje debe tener entre 10 y 1000 caracteres.')

export const replyRule = body('text').isString().withMessage('Escribe la respuesta.').bail().trim()
  .isLength({ min: 10, max: 2000 }).withMessage('La respuesta debe tener entre 10 y 2000 caracteres.')
