import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../errors/AppError.js';
import type { MotivoFalla } from './types.js';
import { MOTIVOS_FALLA_VALIDOS } from './types.js';

/**
 * Confirma la entrega de un pedido, cambiando su estado de PENDIENTE a ENTREGADO.
 *
 * @param pedidoId - UUID del pedido a confirmar
 * @returns Pedido actualizado
 * @throws {AppError} 404 si el pedido no existe
 * @throws {AppError} 409 si el pedido no está en estado PENDIENTE
 */
export async function confirmarEntrega(pedidoId: string) {
  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId },
  });

  if (!pedido) {
    throw new AppError(404, `Pedido con id ${pedidoId} no encontrado`);
  }

  if (pedido.estado !== 'PENDIENTE') {
    throw new AppError(
      409,
      `Solo se puede confirmar un pedido en estado PENDIENTE. Estado actual: ${pedido.estado}`,
    );
  }

  const pedidoActualizado = await prisma.pedido.update({
    where: { id: pedidoId },
    data: { estado: 'ENTREGADO' },
  });

  return pedidoActualizado;
}

/**
 * Registra una falla de entrega, cambiando el estado de PENDIENTE a NO_ENTREGADO
 * y guardando el motivo de la falla.
 *
 * @param pedidoId - UUID del pedido a cancelar
 * @param motivo   - Motivo de la falla (debe ser un valor válido del enum)
 * @returns Pedido actualizado
 * @throws {AppError} 404 si el pedido no existe
 * @throws {AppError} 409 si el pedido no está en estado PENDIENTE
 * @throws {AppError} 400 si el motivo no es válido
 */
export async function registrarFalla(pedidoId: string, motivo: string) {
  const motivoValido = MOTIVOS_FALLA_VALIDOS.includes(
    motivo as (typeof MOTIVOS_FALLA_VALIDOS)[number],
  );

  if (!motivoValido) {
    throw new AppError(
      400,
      `Motivo de falla inválido. Valores permitidos: ${MOTIVOS_FALLA_VALIDOS.join(', ')}`,
    );
  }

  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId },
  });

  if (!pedido) {
    throw new AppError(404, `Pedido con id ${pedidoId} no encontrado`);
  }

  if (pedido.estado !== 'PENDIENTE') {
    throw new AppError(
      409,
      `Solo se puede registrar falla en un pedido en estado PENDIENTE. Estado actual: ${pedido.estado}`,
    );
  }

  const pedidoActualizado = await prisma.pedido.update({
    where: { id: pedidoId },
    data: {
      estado: 'NO_ENTREGADO',
      motivoFalla: motivo as MotivoFalla,
    },
  });

  return pedidoActualizado;
}
