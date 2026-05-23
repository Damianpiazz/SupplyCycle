import type { RequestHandler } from 'express';
import { ZodError } from 'zod';

import * as pedidoService from './service.js';
import { AppError } from '../../errors/AppError.js';
import { cancelarPedidoSchema, uuidParamSchema } from './schema.js';

/**
 * Valida que el parámetro :id sea un UUID válido.
 * Si no lo es, lanza AppError 400.
 */
function assertValidUuid(raw: string): asserts raw is string {
  const result = uuidParamSchema.safeParse({ id: raw });
  if (!result.success) {
    throw new AppError(400, 'El ID del pedido debe ser un UUID válido');
  }
}

/**
 * PATCH /api/v1/pedidos/:id/confirmar
 *
 * Confirma la entrega de un pedido.
 * Body: vacío (no requiere payload).
 */
export const confirmarEntrega: RequestHandler = async (req, res, next) => {
  try {
    const rawId = req.params.id as string;
    assertValidUuid(rawId);
    const pedido = await pedidoService.confirmarEntrega(rawId);
    res.status(200).json(pedido);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/pedidos/:id/cancelar
 *
 * Registra una falla de entrega.
 * Body: { motivo: MotivoFalla }
 */
export const registrarFalla: RequestHandler = async (req, res, next) => {
  try {
    const rawId = req.params.id as string;
    assertValidUuid(rawId);

    // safeParse + AppError(400) para que el error handler devuelva 400 en vez de 422
    const bodyResult = cancelarPedidoSchema.safeParse(req.body);
    if (!bodyResult.success) {
      const messages = bodyResult.error.issues
        .map((issue) => issue.message)
        .join(', ');
      throw new AppError(400, `Error de validación: ${messages}`);
    }

    const pedido = await pedidoService.registrarFalla(rawId, bodyResult.data.motivo);
    res.status(200).json(pedido);
  } catch (error) {
    next(error);
  }
};
