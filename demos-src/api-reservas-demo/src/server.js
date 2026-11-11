import { crearApp } from './app.js';
import { config } from './config.js';
import { crearPool, inicializarEsquema } from './db.js';

const pool = crearPool(config.db);

try {
  if (config.iniciarEsquema) await inicializarEsquema(config.db);
  await pool.query('SELECT 1');
} catch (error) {
  console.error(`No se pudo conectar a MySQL en ${config.db.host}:${config.db.port}/${config.db.database}`);
  console.error(`Motivo: ${error.message}`);
  console.error('Revisá las variables DB_* del archivo .env y que la base exista (ver README).');
  process.exit(1);
}

const servidor = crearApp({ pool, config }).listen(config.puerto, () => {
  console.log(`API de reservas lista en http://localhost:${config.puerto}`);
});

function cerrar() {
  servidor.close(async () => {
    await pool.end();
    process.exit(0);
  });
}
process.on('SIGINT', cerrar);
process.on('SIGTERM', cerrar);
