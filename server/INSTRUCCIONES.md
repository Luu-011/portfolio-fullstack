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

## Tanda 3 (proyectos, demos y servicios)
- `npm install` (se suma `multer`).
- Agregá al `.gitignore` de la raíz:
  `server/uploads/*` y `!server/uploads/.gitkeep` (las imágenes subidas no van a Git).

Endpoints:
- Servicios: `GET /api/services` (público, activos) · `GET /api/services/all` (admin) · `POST`, `PUT /:id`, `DELETE /:id` (admin)
- Proyectos (requieren sesión): `GET /api/projects`, `GET /api/projects/:id`
- Proyectos (admin): `POST /api/projects`, `PUT /api/projects/:id`, `DELETE /api/projects/:id` (multipart/form-data con campo `image` opcional: JPG, PNG o WebP, máx. 2 MB)
- Demos (admin): `POST /api/projects/:id/demos`, `PUT` y `DELETE /api/projects/:id/demos/:demoId`
- Imágenes: `GET /uploads/<archivo>`

## Tanda 4 (analytics)
- No suma paquetes: no hace falta `npm install`.
- Opcional: ejecutá `database/seed_visits.sql` en Workbench para tener visitas de ejemplo en los gráficos.
- `POST /api/visits` (público): { path } -> el frontend lo llama una vez por sesión del navegador.
- Solo admin (header Authorization): `GET /api/analytics/summary`, `/visits-by-day?days=30`,
  `/registrations?months=6`, `/contacts-by-type?days=90` (days opcional), `/top-pages?limit=5`

## Parte 6A (usuarios)
- Solo administrador: `GET /api/users` (opcional `?role=`), `PUT /api/users/:id/role` { role }, `DELETE /api/users/:id`
- Ahora el rol se lee de la base en cada petición: borrar o cambiar el rol de un usuario rige de inmediato.
