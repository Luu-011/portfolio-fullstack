# API de reservas (demo)

Servicio REST para reservar turnos, con validaciones y control de horarios ocupados.
Es independiente del resto del sistema: tiene su propia tabla y no depende de nada más.

**Tecnologías:** Node.js (20 o más) · Express 5 · MySQL (`mysql2`) · REST API

## Puesta en marcha

**1. Base de datos.** Necesita un MySQL 8 con una base llamada `reservas`. Dos formas:

```bash
# a) Con Docker (usa docker-compose.yml, ya trae usuario y base creados)
docker compose up -d

# b) Con un MySQL que ya tengan instalado
mysql -u root -p -e "CREATE DATABASE reservas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
```

**2. Configuración y arranque**

```bash
cp .env.example .env     # ajustar DB_USER / DB_PASSWORD si no usan el docker-compose
npm install
npm start                # http://localhost:3000
```

Al arrancar crea la tabla `reservas` si no existe (`DB_INIT=true`). También se puede correr a mano:
`npm run db:init` o `mysql reservas < schema.sql`.

## Endpoints

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/health` | Estado del servicio y de la base |
| GET | `/api/disponibilidad?fecha=AAAA-MM-DD` | Horarios del día y cuáles están libres |
| GET | `/api/reservas` | Lista reservas. Filtros: `fecha`, `estado`, `email`, `servicio`. Paginación: `limit` (1-100, por defecto 50) y `offset` |
| GET | `/api/reservas/:id` | Una reserva |
| POST | `/api/reservas` | Crea una reserva (201 + cabecera `Location`) |
| PATCH | `/api/reservas/:id` | Cambia datos de contacto o reprograma. Se mandan solo los campos que cambian |
| DELETE | `/api/reservas/:id` | Cancela la reserva. Queda guardada con `estado: "cancelada"` y el horario se libera |

Cuerpo de `POST /api/reservas`:

| Campo | Obligatorio | Regla |
|---|---|---|
| `nombre` | sí | 2 a 80 caracteres |
| `email` | sí | email válido, hasta 120 caracteres |
| `telefono` | no | 6 a 20 caracteres: números, espacios, guiones, paréntesis y un `+` inicial |
| `servicio` | sí | `consulta`, `control` o `vacunacion` |
| `fecha` | sí | `AAAA-MM-DD`, una fecha real |
| `hora` | sí | `HH:MM`, en la grilla de turnos |
| `notas` | no | hasta 240 caracteres |

### Ejemplos

```bash
FECHA=$(date -d 'next monday' +%F)    # un lunes futuro (en macOS: date -v+mon +%F)

# Ver horarios libres
curl "localhost:3000/api/disponibilidad?fecha=$FECHA"

# Reservar
curl -X POST localhost:3000/api/reservas -H 'Content-Type: application/json' -d '{
  "nombre": "Ana Pérez", "email": "ana@correo.com", "telefono": "+54 387 555-1234",
  "servicio": "consulta", "fecha": "'$FECHA'", "hora": "10:00"
}'

# Reprogramar a las 11:30
curl -X PATCH localhost:3000/api/reservas/1 -H 'Content-Type: application/json' -d '{"hora": "11:30"}'

# Cancelar
curl -X DELETE localhost:3000/api/reservas/1
```

`requests.http` trae los mismos pedidos listos para la extensión REST Client de VS Code.

## Reglas de la agenda

Se definen en `src/config.js` y se pueden cambiar sin tocar el resto:

- Atención de lunes a viernes, de 09:00 a 18:00, con turnos de 30 minutos (el último empieza a las 17:30).
- No se reserva en el pasado ni con más de 60 días de anticipación. "Hoy" y "ahora" se calculan en la zona horaria
  `AGENDA_TZ` (por defecto `America/Argentina/Buenos_Aires`), no en la del servidor.
- Hay una sola agenda: un horario no puede estar reservado dos veces, sin importar el servicio.
- Un horario cancelado vuelve a quedar libre.

La exclusión de horarios la garantiza la base de datos, no solo el código: la columna `turno_activo` de `schema.sql`
vale 1 mientras la reserva está confirmada y `NULL` cuando se cancela, y sobre `(fecha, hora, turno_activo)` hay un
índice `UNIQUE`. Si dos pedidos llegan a la vez para el mismo horario, uno recibe 201 y el otro 409
(hay una prueba que lanza 8 pedidos simultáneos).

## Respuestas de error

Todos los errores tienen la misma forma:

```json
{
  "error": "validacion",
  "mensaje": "Hay datos que no son válidos. Revisá el detalle.",
  "detalles": [{ "campo": "hora", "mensaje": "Elegí un horario entre 09:00 y 17:30, cada 30 minutos." }]
}
```

| Código | `error` | Cuándo |
|---|---|---|
| 400 | `validacion` | Algún campo o filtro no es válido (`detalles` dice cuál y por qué) |
| 400 | `id_invalido` / `json_invalido` | El id no es un número / el cuerpo no es JSON |
| 404 | `no_encontrada` / `ruta_no_encontrada` | No existe la reserva / la ruta |
| 409 | `horario_ocupado` | El horario ya está reservado |
| 409 | `ya_cancelada` / `reserva_cancelada` | Cancelar o editar una reserva que ya está cancelada |
| 413 | `cuerpo_muy_grande` | El cuerpo pasa los 10 KB |
| 500 | `error_interno` | Falla inesperada (el detalle queda en el log del servidor) |

## Pruebas

```bash
npm test
```

- `test/validacion.test.js`: reglas de validación y de calendario. No necesita base de datos.
- `test/api.test.js`: la API completa contra MySQL real, incluyendo los pedidos simultáneos.
  Usa la base `reservas_test` (hay que crearla igual que `reservas`; se vacía en cada corrida) con las variables `DB_*`.
  Si no encuentra MySQL, las saltea.

Las pruebas se corrieron contra MariaDB 10.11. El esquema usa solo funciones que también existen en MySQL 5.7 y 8.

## Conectarla con otro sistema

- **Base de datos:** apuntar `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME` a su MySQL. Solo crea y usa la tabla `reservas`.
- **Navegador:** `CORS_ORIGIN` acepta el origen de su frontend (por ejemplo `https://miweb.com`) o varios separados por coma.
- **Como parte de otro Express:** `crearApp({ pool, config })` en `src/app.js` devuelve la app, y `crearRutas({ pool, agenda })`
  en `src/rutas.js` devuelve solo el router para montarlo con `app.use('/api', ...)`.
- **Sin autenticación:** es una demo. Antes de publicarla hace falta agregar autenticación y limitar la cantidad de pedidos.

## Estructura

```
src/
  server.js            Arranque: conexión, esquema, puerto y cierre ordenado
  app.js               Express: CORS, JSON, health y manejo de errores
  rutas.js             Los endpoints
  validacion.js        Validación de reservas y de filtros
  agenda.js            Reglas de calendario (funciones puras)
  repositorio.js       Consultas SQL con parámetros
  db.js                Pool de MySQL y creación del esquema
  config.js            Variables de entorno y reglas de la agenda
schema.sql             Tabla reservas
docker-compose.yml     MySQL 8 para probar
requests.http          Pedidos de ejemplo
test/                  Pruebas
```
