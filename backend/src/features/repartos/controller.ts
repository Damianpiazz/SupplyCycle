import type { Request, Response, NextFunction } from 'express';
import { crearRepartoSchema, actualizarEstadoSchema, agregarPedidoRepartoSchema } from './schema.js';
import * as repartosService from './service.js';
import { sendSuccess, sendList } from '../../utils/response.js';

export async function crearController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = crearRepartoSchema.parse(req.body);
    const result = await repartosService.crearReparto(data);
    sendSuccess(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function listarAdminController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const fecha = typeof req.query.fecha === 'string' ? req.query.fecha : undefined;
    const result = await repartosService.listarRepartosAdmin({ fecha });
    sendList(res, result);
  } catch (err) {
    next(err);
  }
}

export async function obtenerAdminController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const result = await repartosService.obtenerRepartoAdmin(id);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function obtenerHoyController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const repartidorId = req.user!.userId;
    const result = await repartosService.obtenerRepartoDelDia(repartidorId);
    if (!result) {
      res.status(200).json({ data: null, message: 'No hay repartos para hoy' });
      return;
    }
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function listarController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const repartidorId = typeof req.query.repartidorId === 'string' ? req.query.repartidorId : undefined;
    const fecha = typeof req.query.fecha === 'string' ? req.query.fecha : undefined;
    const estado = typeof req.query.estado === 'string' ? req.query.estado : undefined;
    if (!repartidorId) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'repartidorId es requerido',
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }
    const result = await repartosService.listarRepartos({ repartidorId, fecha, estado });
    sendList(res, result);
  } catch (err) {
    next(err);
  }
}

export async function obtenerController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const result = await repartosService.obtenerReparto(id);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function cargaController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const result = await repartosService.obtenerResumenCarga(id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function estadoController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const { estado } = actualizarEstadoSchema.parse(req.body);
    const result = await repartosService.actualizarEstado(id, estado);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function agregarPedidoController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const repartoId = req.params['repartoId'] as string;
    const { pedidoId } = agregarPedidoRepartoSchema.parse(req.body);
    const result = await repartosService.agregarPedidoAReparto(repartoId, pedidoId);
    sendSuccess(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function quitarPedidoController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const repartoId = req.params['repartoId'] as string;
    const pedidoId = req.params['pedidoId'] as string;
    const result = await repartosService.quitarPedidoDeReparto(repartoId, pedidoId);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
