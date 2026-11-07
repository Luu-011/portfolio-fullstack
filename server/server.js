import 'dotenv/config'
import app from './src/app.js'
import { testConnection } from './src/config/db.js'
import { mailMode, verifyMailer } from './src/config/mailer.js'

const PORT = process.env.PORT || 4000

if (!process.env.JWT_SECRET) {
  console.error('Falta JWT_SECRET en el archivo .env')
  process.exit(1)
}

try {
  await testConnection()
  console.log('Conectado a MySQL')
} catch (err) {
  console.error('No se pudo conectar a MySQL:', err.message)
  process.exit(1)
}

if (mailMode === 'test') {
  console.log('Correo: MODO PRUEBA (los emails se muestran en la consola y no se envían)')
} else {
  try {
    await verifyMailer()
    console.log(mailMode === 'brevo' ? 'Correo: Brevo (HTTPS) conectado' : `Correo: conectado como ${process.env.EMAIL_USER}`)
  } catch (err) {
    console.warn('Correo: no se pudo verificar la cuenta de email:', err.message)
  }
}

app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`))
