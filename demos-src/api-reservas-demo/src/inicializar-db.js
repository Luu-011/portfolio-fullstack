// npm run db:init  ->  crea la tabla "reservas" si no existe.
import { config } from './config.js';
import { inicializarEsquema } from './db.js';

try {
  await inicializarEsquema(config.db);
  console.log(`Tabla "reservas" lista en ${config.db.host}:${config.db.port}/${config.db.database}`);
} catch (error) {
  console.error(`No se pudo preparar la base de datos: ${error.message}`);
  process.exit(1);
}
