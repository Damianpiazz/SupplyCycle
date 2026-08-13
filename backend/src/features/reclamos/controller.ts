import type { Request, Response, NextFunction } from 'express';
import { crearReclamoSchema, listarReclamosQuerySchema } from './schema.js';
import * as reclamosService from './service.js';
import { sendSuccess, sendList } from '../../utils/response.js';

/** POST /reclamos */
export async function crearController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = crearReclamoSchema.parse(req.body);
    const result = await reclamosService.crearReclamo(data);
    sendSuccess(res, result, 201);
  } catch (err) {
    next(err);
  }
}

/** GET /reclamos */
export async function listarController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = listarReclamosQuerySchema.parse(req.query);
    const { data, total } = await reclamosService.listarReclamos(query);
    sendList(res, data, total);
  } catch (err) {
    next(err);
  }
}

/** GET /reclamos/:id */
export async function obtenerController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const result = await reclamosService.obtenerReclamo(id);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
