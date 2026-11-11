import { Router } from 'express';
import { ahoraEnZona, fechaValida, diaDeSemana, horariosDelDia, motivoNoReservable } from './agenda.js';
import { CAMPOS, validarConsulta, validarReserva } from './validacion.js';
import * as repo from './repositorio.js';

export function responderError(res, status, error, mensaje, detalles) {
  const cuerpo = { error, mensaje };
  if (detalles) cuerpo.detalles = detalles;
  return res.status(status).json(cuerpo);
}

const errorDeValidacion = (res, detalles) =>
  responderError(res, 400, 'validacion', 'Hay datos que no son válidos. Revisá el detalle.', detalles);

const horarioOcupado = (res) =>
  responderError(res, 409, 'horario_ocupado', 'Ese horario ya está reservado. Elegí otro.');

export function crearRutas({ pool, agenda }) {
  const rutas = Router();

  // Validar :id una sola vez para todas las rutas que lo usan
  rutas.param('id', (req, res, next, id) => {
    if (!/^\d{1,10}$/.test(id)) {
      return responderError(res, 400, 'id_invalido', 'El id tiene que ser un número entero positivo.');
    }
    req.reservaId = Number(id);
    next();
  });

  // Horarios de un día, marcando cuáles están libres
  rutas.get('/disponibilidad', async (req, res) => {
    const { fecha } = req.query;
    if (!fechaValida(fecha)) {
      return errorDeValidacion(res, [{ campo: 'fecha', mensaje: 'Usá el formato AAAA-MM-DD, por ejemplo 2027-03-15.' }]);
    }
    const atiende = agenda.diasAtencion.includes(diaDeSemana(fecha));
    const ahora = ahoraEnZona(agenda.zonaHoraria);
    const ocupados = new Set(atiende ? await repo.horariosOcupados(pool, fecha) : []);
    const horarios = (atiende ? horariosDelDia(agenda) : []).map((hora) => ({
      hora,
      disponible: !ocupados.has(hora) && motivoNoReservable(fecha, hora, ahora, agenda) === null,
    }));
    res.json({ fecha, atiende, horarios });
  });

  rutas.get('/reservas', async (req, res) => {
    const { errores, valor } = validarConsulta(req.query, agenda);
    if (errores.length) return errorDeValidacion(res, errores);
    const { total, filas } = await repo.listar(pool, valor);
    res.json({ total, limit: valor.limit, offset: valor.offset, datos: filas });
  });

  rutas.get('/reservas/:id', async (req, res) => {
    const reserva = await repo.obtener(pool, req.reservaId);
    if (!reserva) return responderError(res, 404, 'no_encontrada', 'No existe una reserva con ese id.');
    res.json(reserva);
  });

  rutas.post('/reservas', async (req, res) => {
    const ahora = ahoraEnZona(agenda.zonaHoraria);
    const { errores, valor } = validarReserva(req.body ?? {}, { agenda, ahora });
    if (errores.length) return errorDeValidacion(res, errores);

    try {
      const reserva = await repo.crear(pool, valor);
      res.status(201).location(`/api/reservas/${reserva.id}`).json(reserva);
    } catch (error) {
      if (repo.esHorarioOcupado(error)) return horarioOcupado(res);
      throw error;
    }
  });

  // Edita datos de contacto o reprograma. Solo hay que mandar los campos que cambian.
  rutas.patch('/reservas/:id', async (req, res) => {
    const actual = await repo.obtener(pool, req.reservaId);
    if (!actual) return responderError(res, 404, 'no_encontrada', 'No existe una reserva con ese id.');
    if (actual.estado === 'cancelada') {
      return responderError(res, 409, 'reserva_cancelada', 'La reserva está cancelada y no se puede modificar. Creá una nueva.');
    }

    const cambios = Object.fromEntries(CAMPOS.filter((c) => req.body && c in req.body).map((c) => [c, req.body[c]]));
    if (Object.keys(cambios).length === 0) {
      return errorDeValidacion(res, [{ campo: 'cuerpo', mensaje: `Mandá al menos uno de: ${CAMPOS.join(', ')}.` }]);
    }

    const ahora = ahoraEnZona(agenda.zonaHoraria);
    const { errores, valor } = validarReserva(
      { ...actual, ...cambios },
      { agenda, ahora, exigirFuturo: 'fecha' in cambios || 'hora' in cambios },
    );
    if (errores.length) return errorDeValidacion(res, errores);

    try {
      res.json(await repo.actualizar(pool, req.reservaId, valor));
    } catch (error) {
      if (repo.esHorarioOcupado(error)) return horarioOcupado(res);
      throw error;
    }
  });

  // Cancela la reserva (queda guardada con estado "cancelada" y el horario se libera)
  rutas.delete('/reservas/:id', async (req, res) => {
    if (await repo.cancelar(pool, req.reservaId)) {
      return res.json(await repo.obtener(pool, req.reservaId));
    }
    const existente = await repo.obtener(pool, req.reservaId);
    if (!existente) return responderError(res, 404, 'no_encontrada', 'No existe una reserva con ese id.');
    return responderError(res, 409, 'ya_cancelada', 'La reserva ya estaba cancelada.');
  });

  return rutas;
}
