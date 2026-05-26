import type { Request, Response, NextFunction } from 'express';
import { crearUsuarioSchema, actualizarUsuarioSchema } from './schema.js';
import * as usuariosService from './service.js';
import { sendSuccess, sendList } from '../../utils/response.js';

export async function listarController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const adminUserId = req.user!.userId;
    const result = await usuariosService.listarUsuarios(adminUserId);
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
    const result = await usuariosService.obtenerUsuario(id);
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
    const input = crearUsuarioSchema.parse(req.body);
    const result = await usuariosService.crearUsuario(input);
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
    const input = actualizarUsuarioSchema.parse(req.body);
    const result = await usuariosService.actualizarUsuario(id, input);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function desactivarController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const adminUserId = req.user!.userId;
    const result = await usuariosService.desactivarUsuario(id, adminUserId);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
