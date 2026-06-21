import type { Request, Response, NextFunction } from 'express';
import * as clientesService from './service.js';
import { sendSuccess, sendList } from '../../utils/response.js';
import { clienteSchema, actualizarClienteSchema } from './schema.js';

export async function listarController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const nombre = typeof req.query.nombre === 'string' ? req.query.nombre : undefined;
    const telefono = typeof req.query.telefono === 'string' ? req.query.telefono : undefined;
    const dia = typeof req.query.dia === 'string' ? req.query.dia : undefined;
    const incluirInactivos = req.query.incluirInactivos === 'true';
    const result = incluirInactivos
      ? await clientesService.listarTodosLosClientes({ nombre, telefono, dia })
      : await clientesService.listarClientes({ nombre, telefono, dia });
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

export async function crearController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = clienteSchema.parse(req.body);
    const result = await clientesService.crearCliente(input);
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
    const input = actualizarClienteSchema.parse(req.body);
    const result = await clientesService.actualizarCliente(id, input);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function historialController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const result = await clientesService.obtenerHistorialEnvases(id);
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
    const result = await clientesService.eliminarCliente(id);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
