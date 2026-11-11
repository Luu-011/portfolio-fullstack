import 'dotenv/config';

const env = process.env;

const origen = env.CORS_ORIGIN ?? '*';

export const config = {
  puerto: Number(env.PORT ?? 3000),
  corsOrigin: origen === '*' ? '*' : origen.split(',').map((o) => o.trim()),
  iniciarEsquema: (env.DB_INIT ?? 'true') !== 'false',
  db: {
    host: env.DB_HOST ?? 'localhost',
    port: Number(env.DB_PORT ?? 3306),
    user: env.DB_USER ?? 'root',
    password: env.DB_PASSWORD ?? '',
    database: env.DB_NAME ?? 'reservas',
  },
  // Reglas de la agenda. Cambialas acá para adaptar la demo a otro negocio.
  agenda: {
    zonaHoraria: env.AGENDA_TZ ?? 'America/Argentina/Buenos_Aires',
    apertura: '09:00',
    cierre: '18:00', // el último turno empieza 30 minutos antes
    duracionMin: 30,
    diasAtencion: [1, 2, 3, 4, 5], // 0 = domingo ... 6 = sábado
    maxDiasAnticipacion: 60,
    servicios: ['consulta', 'control', 'vacunacion'],
  },
};
