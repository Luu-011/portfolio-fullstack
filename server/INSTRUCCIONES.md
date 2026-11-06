# Backend

## Tanda 1 (base de datos + registro y login)
1. `cd server` y `npm install`
2. Copiá `.env.example` como `.env` y completá `DB_PASSWORD` y `JWT_SECRET`.
3. En MySQL Workbench ejecutá `database/schema.sql` y después `database/seed.sql` (una sola vez).
4. `npm run dev` -> "Conectado a MySQL" y "API escuchando en http://localhost:4000".

Cuentas de prueba: admin@demo.com / Admin12345 · operador@demo.com / Operador123

## Tanda 2 (contacto + email)
- `npm install` (se suma `nodemailer`).
- Sin tocar el `.env` funciona en MODO PRUEBA: los emails aparecen en la consola.
- Para enviar emails reales completá en `.env`: `EMAIL_USER`, `EMAIL_PASS` (contraseña de aplicación de Gmail), `MAIL_FROM` y `OWNER_EMAIL`.

Endpoints nuevos:
- `POST /api/contacts` (público): { name, email, type, message }
- `GET /api/contacts` (operador/admin, header Authorization: Bearer <token>), opcional `?status=pendiente`
- `POST /api/contacts/:id/replies` (operador/admin): { text } -> envía el email y guarda la respuesta
