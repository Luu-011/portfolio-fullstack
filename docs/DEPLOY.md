# Publicar el backend en la nube (opcional)

> Estado verificado el 7/11/2026. Los planes gratuitos cambian seguido: confirmá cada servicio antes de empezar.

Los lineamientos del TP aceptan presentar el proyecto **en `localhost`**, y así todo funciona hoy (incluido el correo real
con Gmail). Publicar es opcional y tiene limitaciones en planes gratuitos. Leelas antes de decidir.

## Qué hay que saber antes

| Tema | Situación |
|---|---|
| Base de datos | Render gratis no ofrece MySQL. Aiven retiró su MySQL gratuito (no se pueden crear servicios nuevos desde el 6/11/2026). La opción gratuita vigente que encontramos es **TiDB Cloud Starter** (compatible con MySQL, hasta 5 instancias gratis por organización, 5 GiB). **No probamos el esquema en TiDB**: si `schema.sql` da error, ver "Problemas frecuentes". |
| API | **Render gratis**: se duerme tras 15 min sin tráfico (la primera visita tarda ~1 min), 750 horas por mes, y **el disco se borra en cada reinicio o despliegue**. |
| Correo | Render gratis **bloquea los puertos SMTP (25, 465 y 587)**: Gmail con Nodemailer **no funciona ahí**. Hay que usar la API HTTPS de **Brevo** (ya incluida en el código). Brevo reemplaza los remitentes de Gmail por otro (es lo que dice su documentación), así que los correos pueden llegar con otro remitente o a spam. Con un dominio propio sería prolijo. |
| Imágenes | Las imágenes que se suben desde el panel se guardan en `server/uploads/`. En Render gratis **se pierden** al reiniciar. Solución a futuro: un servicio de imágenes (ej. Cloudinary). |

## Paso 1 — Base de datos en TiDB Cloud Starter

1. Creá una cuenta en tidbcloud.com y un cluster **Starter** de tipo **MySQL-compatible** (plan gratuito).
2. En **Connect** generá la contraseña y anotá: host, puerto (4000), usuario y contraseña. **El usuario lleva un prefijo**, por ejemplo `4abc123.root`: usalo completo.
3. En MySQL Workbench creá una conexión nueva con esos datos, con SSL activado (Use SSL: Require), y ejecutá `server/database/schema.sql` y después `seed.sql`.
   Si no te deja crear la base `portfolio_db`, usá la que ya existe en el cluster (ej. `test`): borrá las líneas `CREATE DATABASE` y `USE` de ambos archivos, ejecutá el resto estando conectado a esa base, y usá ese nombre en `DB_NAME`.

## Paso 2 — API en Render

1. En render.com: **New > Web Service**, conectá el repositorio de GitHub.
2. Configuración:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
   - **Health Check Path:** `/api/health`
3. En **Environment** agregá estas variables:

| Variable | Valor |
|---|---|
| `DB_HOST` | host de TiDB |
| `DB_PORT` | `4000` |
| `DB_USER` | usuario con prefijo |
| `DB_PASSWORD` | contraseña de TiDB |
| `DB_NAME` | `portfolio_db` (o la base que usaste) |
| `DB_SSL` | `true` |
| `JWT_SECRET` | un texto largo y aleatorio **distinto** al de tu computadora |
| `CLIENT_URL` | `http://localhost:5173,https://TU-SITIO.vercel.app` (sin `/` al final) |
| `BREVO_API_KEY`, `MAIL_FROM`, `OWNER_EMAIL` | ver Paso 3 |

4. Esperá el despliegue y abrí `https://TU-SERVICIO.onrender.com/api/health`. Tiene que responder `{"ok":true}`.
   En los **Logs** tiene que aparecer "Conectado a MySQL". Si dice "MODO PRUEBA" en la línea de correo, **los emails no se están enviando**.

## Paso 3 — Correo con Brevo

1. Creá una cuenta gratuita en brevo.com (300 correos por día).
2. En **Senders** agregá tu dirección como remitente y verificala con el enlace que te llega.
3. Generá una **clave de API** (API keys, versión v3) y cargala en Render como `BREVO_API_KEY`.
4. `MAIL_FROM` = `"NombreTech <la-direccion-verificada>"` y `OWNER_EMAIL` = donde querés recibir los avisos.
5. En los logs tiene que aparecer "Correo: Brevo (HTTPS) conectado".

## Paso 4 — Conectar el sitio de Vercel

1. En Vercel, proyecto > **Settings > Environment Variables**: `VITE_API_URL` = `https://TU-SERVICIO.onrender.com/api`.
2. Hacé un **Redeploy**. Las variables `VITE_` se incorporan al compilar, así que sin redeploy no se aplican.
3. Verificá que exista `client/vercel.json` con:
   `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
4. Recién ahora pasá la rama `feature/conectar-api` a `main` (Pull Request en GitHub).

## Paso 5 — Pruebas

1. Abrí el sitio y esperá hasta 1 minuto la primera vez (el servicio se despierta).
2. Registrate, iniciá sesión y mirá los proyectos.
3. Mandá una consulta de contacto y respondela desde el panel del operador.
4. Con el administrador, revisá estadísticas, usuarios y el CRUD.

## Problemas frecuentes

| Síntoma | Causa probable |
|---|---|
| "No se pudo conectar con el servidor" | El servicio está dormido (esperá 1 min y reintentá), o `VITE_API_URL` está mal o falta el redeploy. |
| Error de CORS en la consola del navegador | `CLIENT_URL` no incluye la dirección exacta de Vercel, o tiene una `/` al final. |
| `Access denied` al arrancar | Usuario sin el prefijo de TiDB, o contraseña incorrecta. |
| Error de SSL / certificado al arrancar | Descargá el certificado de la CA desde el diálogo **Connect** de TiDB y pegalo en `DB_SSL_CA` con los saltos de línea escritos como `\n`. Último recurso: `DB_SSL_REJECT_UNAUTHORIZED=false`. |
| `schema.sql` falla en TiDB | Anotá el mensaje. Si es por claves foráneas, hay que quitar las `FOREIGN KEY` del esquema (la app sigue funcionando, pero se pierden los borrados en cascada). |
| Las respuestas no llegan por correo | Revisá la línea de correo en los logs. Con "MODO PRUEBA" o con error de Brevo no se envía nada. |
| Las imágenes desaparecen | Es el disco efímero de Render gratis (ver arriba). |

## Alternativa: presentar en localhost (lista de comprobación)

1. El servicio MySQL está iniciado (`Get-Service MySQL80`).
2. `server/.env` con la contraseña de MySQL y los datos de Gmail; al arrancar dice "Correo: conectado como ...".
3. Terminal 1: `cd server`, `npm run dev`. Terminal 2: `cd client`, `npm run dev`.
4. Probar el recorrido completo antes de la exposición (registro, contacto con correo real, panel de operador y de administrador).
5. Si se cargaron datos de ejemplo de visitas, borrarlos: `DELETE FROM visits WHERE ip = '0.0.0.0';`
