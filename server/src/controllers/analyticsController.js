import * as Analytics from '../models/Analytics.js'

// Los parámetros ya se validaron en la ruta; acá solo se aplican los valores por defecto
const num = (value, fallback) => (value === undefined ? fallback : Number(value))

const handler = (fn) => async (req, res, next) => {
  try {
    res.json(await fn(req.query))
  } catch (err) {
    next(err)
  }
}

export const summary = handler(() => Analytics.summary())
export const visitsByDay = handler((q) => Analytics.visitsByDay(num(q.days, 30)))
export const registrations = handler((q) => Analytics.registrationsByMonth(num(q.months, 6)))
export const contactsByType = handler((q) => Analytics.contactsByType(q.days === undefined ? null : Number(q.days)))
export const topPages = handler((q) => Analytics.topPages(num(q.limit, 5)))
