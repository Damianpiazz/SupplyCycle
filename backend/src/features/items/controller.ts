import type { Request, Response, NextFunction } from 'express';
import * as itemsService from './service.js';
import { sendSuccess, sendList } from '../../utils/response.js';

export async function listarController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const activo = req.query.activo !== undefined
      ? req.query.activo === 'true'
      : undefined;
    const result = await itemsService.listarItems(activo);
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
    const result = await itemsService.obtenerItem(id);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
