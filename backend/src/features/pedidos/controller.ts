import type { Request, Response, NextFunction } from 'express';
import { crearPedidoSchema, cancelarPedidoSchema } from './schema.js';
import * as pedidosService from './service.js';
import { sendSuccess, sendList } from '../../utils/response.js';

export async function obtenerHoyController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const repartidorId = req.query.repartidorId;
    if (typeof repartidorId !== 'string' || !repartidorId) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'repartidorId es requerido',
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }
    const result = await pedidosService.obtenerPedidosDelDia(repartidorId);
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
    const result = await pedidosService.obtenerPedido(id);
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
    const clienteNombre = typeof req.query.clienteNombre === 'string' ? req.query.clienteNombre : undefined;
    const fecha = typeof req.query.fecha === 'string' ? req.query.fecha : undefined;
    const estado = typeof req.query.estado === 'string' ? req.query.estado : undefined;
    const result = await pedidosService.listarPedidos({
      clienteNombre,
      fecha,
      estado,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function confirmarController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const result = await pedidosService.confirmarEntrega(id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function cancelarController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const { motivo } = cancelarPedidoSchema.parse(req.body);
    const result = await pedidosService.cancelarPedido(id, motivo);
    res.status(200).json(result);
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
    const data = crearPedidoSchema.parse(req.body);
    const result = await pedidosService.crearPedido(data);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
