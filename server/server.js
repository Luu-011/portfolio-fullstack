import 'dotenv/config'
import app from './src/app.js'
import { testConnection } from './src/config/db.js'

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

app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`))
