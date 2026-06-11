import type { Request, Response, NextFunction } from 'express';
import {
  crearPedidoSchema,
  cancelarPedidoSchema,
  actualizarEstadoSchema,
  agregarItemSchema,
  actualizarCantidadSchema,
} from './schema.js';
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
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined;
    const { data, total } = await pedidosService.listarPedidos({
      clienteNombre,
      fecha,
      estado,
      page,
      pageSize,
    });
    sendList(res, data, total);
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
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

/** Repartidor: PENDIENTE/EN_RUTA → NO_ENTREGADO (con motivo) */
export async function cancelarRepartidorController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const { motivo } = cancelarPedidoSchema.parse(req.body);
    const result = await pedidosService.cancelarPedidoRepartidor(id, motivo);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

/** Admin: cambia el estado según máquina de estados */
export async function actualizarEstadoController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const { estado } = actualizarEstadoSchema.parse(req.body);
    const result = await pedidosService.actualizarEstado(id, estado);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

/** POST /pedidos/:pedidoId/items */
export async function agregarItemController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const pedidoId = req.params['pedidoId'] as string;
    const data = agregarItemSchema.parse(req.body);
    const result = await pedidosService.agregarItem(pedidoId, data);
    sendSuccess(res, result, 201);
  } catch (err) {
    next(err);
  }
}

/** PATCH /pedidos/:pedidoId/items/:itemId */
export async function actualizarCantidadItemController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const pedidoId = req.params['pedidoId'] as string;
    const itemId = req.params['itemId'] as string;
    const { cantidad } = actualizarCantidadSchema.parse(req.body);
    const result = await pedidosService.actualizarCantidadItem(pedidoId, itemId, cantidad);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

/** DELETE /pedidos/:pedidoId/items/:itemId */
export async function quitarItemController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const pedidoId = req.params['pedidoId'] as string;
    const itemId = req.params['itemId'] as string;
    const result = await pedidosService.quitarItem(pedidoId, itemId);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

/** DELETE /pedidos/:id — Soft delete (admin) */
export async function eliminarPedidoController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const result = await pedidosService.eliminarPedido(id);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function obtenerDisponiblesController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const fecha = req.query.fecha as string;
    if (!fecha) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'fecha es requerida (YYYY-MM-DD)',
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }
    const result = await pedidosService.obtenerPedidosDisponiblesParaReparto(fecha);
    sendList(res, result);
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
    sendSuccess(res, result, 201);
  } catch (err) {
    next(err);
  }
}
