# Estado del proyecto y pendientes

Actualizado el 7/11/2026. Exposición: del 26 de octubre al 13 de noviembre.

## Cómo correrlo

1. MySQL instalado y iniciado. En Workbench ejecutar `server/database/schema.sql` y después `seed.sql` (una sola vez).
2. `server/`: copiar `.env.example` como `.env`, completar `DB_PASSWORD` y `JWT_SECRET`; `npm install`; `npm run dev`.
3. `client/`: `npm install`; `npm run dev`; abrir http://localhost:5173.
4. Cuentas de prueba: `admin@demo.com` / `Admin12345` y `operador@demo.com` / `Operador123`. **Cambiarlas o borrarlas antes de publicar.**

## Estructura de `client/src`

| Carpeta | Qué contiene |
|---|---|
| `pages/public` | Home, Login y Registro |
| `pages/user` | Listado y detalle de proyectos (solo usuarios registrados) |
| `pages/admin` | Resumen, Consultas, Estadísticas (gráficos), Usuarios, CRUD de Proyectos y de Servicios |
| `components/home` | Hero, Sobre mí, Stack, Servicios y Proceso de trabajo (`Experience.jsx`) |
| `components/contact` | Formulario de contacto y su sección |
| `components/projects` | Vista previa en la home, tarjeta, detalle y visor de demos |
| `components/auth` | Formulario genérico, login y registro |
| `components/admin` | Lista y detalle de consultas, formularios de proyecto/demo/servicio, selector de imagen con arrastrar y soltar, tarjeta de gráfico |
| `components/layout` | Navbar, Footer, Layout público, panel de administración y su menú lateral |
| `components/common` | Íconos, logo, encabezado de sección, indicador de carga |
| `routes` | Rutas y protección por rol (usuario, operador, administrador) |
| `context`, `hooks` | Sesión; `useAuth`, `useFetch`, `useLocalStorage`, `useVisitTracker` |
| `services` | Todas las llamadas a la API pasan por `api.js` |
| `utils` | Validaciones (`validators.js`, `contentValidators.js`), constantes editables, formato de fechas |
| `styles` | Paleta y tipografía del manual (`variables.css`) y estilos por sección |

## Estructura de `server`

| Carpeta | Qué contiene |
|---|---|
| `database` | `schema.sql` (7 tablas), `seed.sql`, `seed_visits.sql` (visitas de ejemplo, opcional), `queries.sql` (consultas de analytics, para la documentación) |
| `src/config` | Conexión a MySQL (con SSL opcional) y envío de correo (SMTP, Brevo o modo prueba) |
| `src/models` | Consultas SQL parametrizadas, una por entidad |
| `src/controllers` | Lógica de cada recurso |
| `src/routes` | Rutas y reglas de validación |
| `src/middlewares` | Sesión, roles, validación, subida de imágenes, límite de envíos, errores |
| `src/utils` | Reglas de validación, plantillas de correo, manejo de imágenes, token |
| `uploads` | Imágenes subidas (no se versionan) |

API principal: `/api/auth`, `/api/contacts`, `/api/projects` (+ demos), `/api/services`, `/api/visits`, `/api/analytics`, `/api/users`.

## Qué cubre cada requisito de los lineamientos

| Requisito | Estado |
|---|---|
| Perfil, stack, servicios, experiencia | Parcial: falta la sección de experiencia profesional real |
| Formulario de contacto por email | Hecho (real con Gmail en localhost) |
| Proyectos y demos con registro obligatorio | Hecho |
| Panel del operador: ver y responder consultas | Hecho |
| CRUD de proyectos, demos y servicios | Hecho |
| Gestión de usuarios registrados | Hecho |
| Contadores de visitas y gráficos | Hecho (los gráficos arrancan en cero sin tráfico) |
| Validación de campos, archivos e imágenes | Hecho (cliente y servidor) |
| Framework CSS | Hecho (Bootstrap) |
| Manual de marca (anteproyecto) | **Pendiente** |
| Documentación (manual, arquitectura, código) | **Pendiente** |
| Animaciones y APIs web según integrantes | **Pendiente** (hoy hay una sola animación CSS) |
| Despliegue (nube o localhost) | Localhost funciona; nube opcional (ver `DEPLOY.md`) |

## Pendientes

### Obligatorios para regularizar
1. **Manual de marca / guía de estilo** (se valora entregarlo antes): paleta con códigos HEX, tipografías con pesos y jerarquías, logotipo. Verificar qué tipografía se ve realmente en el sitio (las fuentes se cargan desde `client/index.html`) y que el manual coincida con el código.
2. **Documentación:** diagrama de la base de datos y de la arquitectura, manual de diseño, capturas y un `README.md` del repositorio.
3. **Animaciones y APIs web:** el nivel exigido sube con cada integrante extra. Falta: animaciones con GSAP/Lottie o Web Animations API, el hook `useGeolocation` (figura en la arquitectura), uso de History API, y alguna API externa (GitHub, clima, etc.). Ya se usan: Web Storage, File/FileReader y Drag and Drop.
4. **Contenido real:** reemplazar los textos de ejemplo (nombre "NombreTech", email, "Sobre mí", stack, servicios). Están en `utils/constants.js`, `About.jsx`, `Footer.jsx` y `index.html`. Agregar la sección de **experiencia profesional**.
5. **Favicon, logo y metadatos** definitivos.
6. **Revisión en celular y accesibilidad:** probar todas las pantallas; el color Grey Olive tiene poco contraste con texto chico.
7. **Decidir y preparar el despliegue:** localhost (ver la lista de comprobación en `DEPLOY.md`) o nube.

### Para publicar en la nube (si se decide)
8. Seguir `docs/DEPLOY.md` (TiDB Cloud + Render + Vercel + Brevo). Probar el esquema en TiDB.
9. Pasar la rama `feature/conectar-api` a `main` **solo cuando** el backend esté publicado y `VITE_API_URL` configurada en Vercel.
10. Guardar las imágenes en un servicio externo (Cloudinary u otro): el disco de Render gratis es efímero.
11. Cambiar o borrar las cuentas de prueba y las visitas de ejemplo.

### Mejoras recomendadas
12. Paginación y búsqueda en las listas (consultas, usuarios, proyectos): hoy cargan todo.
13. Límite de intentos en login y registro (solo contacto y visitas lo tienen), y cabeceras de seguridad (`helmet`).
14. Recuperación de contraseña y verificación de email.
15. Autenticación externa (Google), si el grupo quiere sumarla.
16. Pruebas automáticas (hoy no hay en el repositorio).
17. Mostrar estadísticas resumidas en el "Resumen" del administrador; precargar nombre y email en el formulario de contacto si hay sesión.
18. Limpiar los `INSTRUCCIONES.md` sueltos y unificarlos en el README.

## Flujo de Git
- Una rama por tarea (`feature/nombre`), Pull Request hacia `main`.
- Antes de cada commit: `git status` y comprobar que **no** aparecen `.env`, `node_modules` ni imágenes de `uploads/`.
- `.env.example` es solo un modelo: nunca con datos reales.
