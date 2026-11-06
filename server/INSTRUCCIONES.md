# Backend - tanda 1 (base de datos + registro y login)

1. `cd server`
2. `npm install`
3. Copiá `.env.example` como `.env` y completá `DB_PASSWORD` (la contraseña de root de MySQL) y `JWT_SECRET`.
4. En MySQL Workbench: File > Open SQL Script > `database/schema.sql` > ícono del rayo. Después lo mismo con `database/seed.sql`.
5. `npm run dev` debe mostrar "Conectado a MySQL" y "API escuchando en http://localhost:4000".
6. Probá http://localhost:4000/api/health en el navegador: debe responder {"ok":true}.

Cuentas de prueba (seed.sql):
- admin@demo.com / Admin12345 (rol admin)
- operador@demo.com / Operador123 (rol operator)
