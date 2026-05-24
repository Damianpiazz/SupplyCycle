import type { Request, Response, NextFunction } from 'express';
import { actualizarEstadoSchema } from './schema.js';
import * as repartosService from './service.js';
import { sendSuccess, sendList } from '../../utils/response.js';

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
