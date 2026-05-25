import type { Request, Response, NextFunction } from 'express';
import * as clientesService from './service.js';
import { sendSuccess, sendList } from '../../utils/response.js';

export async function listarController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const nombre = typeof req.query.nombre === 'string' ? req.query.nombre : undefined;
    const dia = typeof req.query.dia === 'string' ? req.query.dia : undefined;
    const result = await clientesService.listarClientes({ nombre, dia });
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
    const result = await clientesService.obtenerCliente(id);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
