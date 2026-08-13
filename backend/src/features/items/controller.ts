import type { Request, Response, NextFunction } from 'express';
import { crearItemSchema, actualizarItemSchema } from './schema.js';
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

export async function crearController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = crearItemSchema.parse(req.body);
    const result = await itemsService.crearItem(input);
    sendSuccess(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function actualizarController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const input = actualizarItemSchema.parse(req.body);
    const result = await itemsService.actualizarItem(id, input);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function eliminarController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const result = await itemsService.eliminarItem(id);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
