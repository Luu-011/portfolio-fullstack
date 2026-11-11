import cors from 'cors';
import express from 'express';
import { crearRutas, responderError } from './rutas.js';

export function crearApp({ pool, config }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json({ limit: '10kb' }));

  app.get('/', (req, res) => {
    res.json({
      nombre: 'API de reservas (demo)',
      endpoints: [
        'GET    /api/health',
        'GET    /api/disponibilidad?fecha=AAAA-MM-DD',
        'GET    /api/reservas',
        'GET    /api/reservas/:id',
        'POST   /api/reservas',
        'PATCH  /api/reservas/:id',
        'DELETE /api/reservas/:id',
      ],
    });
  });

  app.get('/api/health', async (req, res) => {
    try {
      await pool.query('SELECT 1');
      res.json({ estado: 'ok', base_de_datos: 'ok' });
    } catch {
      res.status(503).json({ estado: 'error', base_de_datos: 'sin conexión' });
    }
  });

  app.use('/api', crearRutas({ pool, agenda: config.agenda }));

  app.use((req, res) =>
    responderError(res, 404, 'ruta_no_encontrada', `No existe ${req.method} ${req.path}. Mirá GET / para ver los endpoints.`),
  );

  // Express 5 manda acá también los errores de funciones async
  app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed') {
      return responderError(res, 400, 'json_invalido', 'El cuerpo no es un JSON válido.');
    }
    if (error.type === 'entity.too.large') {
      return responderError(res, 413, 'cuerpo_muy_grande', 'El cuerpo supera los 10 KB.');
    }
    console.error(error);
    return responderError(res, 500, 'error_interno', 'Algo falló del lado del servidor. Probá de nuevo en un momento.');
  });

  return app;
}
