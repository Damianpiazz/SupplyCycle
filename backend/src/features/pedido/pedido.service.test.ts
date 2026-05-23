import { describe, it, expect, vi, beforeEach } from 'vitest';

import { MOTIVOS_FALLA_VALIDOS } from './types.js';

// ============================================================
// Mock del módulo Prisma (hoisted automáticamente por vi.mock)
// ============================================================

const mockPrisma = vi.hoisted(() => ({
  pedido: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('../../lib/prisma.js', () => ({
  prisma: mockPrisma,
}));

const service = await import('./service.js');

// ============================================================
// Fixtures
// ============================================================
const PEDIDO_ID = '550e8400-e29b-41d4-a716-446655440000';

const pedidoPendiente = {
  id: PEDIDO_ID,
  estado: 'PENDIENTE' as const,
  motivoFalla: null,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

const pedidoEntregado = {
  ...pedidoPendiente,
  estado: 'ENTREGADO' as const,
};

const pedidoNoEntregado = {
  ...pedidoPendiente,
  estado: 'NO_ENTREGADO' as const,
  motivoFalla: 'CLIENTE_AUSENTE' as const,
};

// ============================================================
// Tests
// ============================================================

describe('confirmarEntrega', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('✅ debería cambiar estado de PENDIENTE a ENTREGADO', async () => {
    mockPrisma.pedido.findUnique.mockResolvedValue(pedidoPendiente);
    mockPrisma.pedido.update.mockResolvedValue({
      ...pedidoPendiente,
      estado: 'ENTREGADO',
    });

    const resultado = await service.confirmarEntrega(PEDIDO_ID);

    expect(mockPrisma.pedido.findUnique).toHaveBeenCalledWith({
      where: { id: PEDIDO_ID },
    });
    expect(mockPrisma.pedido.update).toHaveBeenCalledWith({
      where: { id: PEDIDO_ID },
      data: { estado: 'ENTREGADO' },
    });
    expect(resultado.estado).toBe('ENTREGADO');
  });

  it('❌ debería lanzar AppError 404 si el pedido no existe', async () => {
    mockPrisma.pedido.findUnique.mockResolvedValue(null);

    await expect(service.confirmarEntrega(PEDIDO_ID)).rejects.toThrow();
    await expect(service.confirmarEntrega(PEDIDO_ID)).rejects.toMatchObject({
      statusCode: 404,
      message: expect.stringContaining('no encontrado'),
    });
  });

  it('❌ debería lanzar AppError 409 si el pedido ya está ENTREGADO', async () => {
    mockPrisma.pedido.findUnique.mockResolvedValue(pedidoEntregado);

    await expect(service.confirmarEntrega(PEDIDO_ID)).rejects.toMatchObject({
      statusCode: 409,
      message: expect.stringContaining('PENDIENTE'),
    });
  });

  it('❌ debería lanzar AppError 409 si el pedido ya está NO_ENTREGADO', async () => {
    mockPrisma.pedido.findUnique.mockResolvedValue(pedidoNoEntregado);

    await expect(service.confirmarEntrega(PEDIDO_ID)).rejects.toMatchObject({
      statusCode: 409,
      message: expect.stringContaining('PENDIENTE'),
    });
  });
});

describe('registrarFalla', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('✅ debería cambiar estado a NO_ENTREGADO con motivo válido', async () => {
    const motivo = 'CLIENTE_AUSENTE';

    mockPrisma.pedido.findUnique.mockResolvedValue(pedidoPendiente);
    mockPrisma.pedido.update.mockResolvedValue({
      ...pedidoPendiente,
      estado: 'NO_ENTREGADO',
      motivoFalla: motivo,
    });

    const resultado = await service.registrarFalla(PEDIDO_ID, motivo);

    expect(mockPrisma.pedido.findUnique).toHaveBeenCalledWith({
      where: { id: PEDIDO_ID },
    });
    expect(mockPrisma.pedido.update).toHaveBeenCalledWith({
      where: { id: PEDIDO_ID },
      data: {
        estado: 'NO_ENTREGADO',
        motivoFalla: motivo,
      },
    });
    expect(resultado.estado).toBe('NO_ENTREGADO');
    expect(resultado.motivoFalla).toBe(motivo);
  });

  it('✅ debería aceptar todos los motivos válidos del enum', async () => {
    for (const motivo of MOTIVOS_FALLA_VALIDOS) {
      mockPrisma.pedido.findUnique.mockResolvedValue(pedidoPendiente);
      mockPrisma.pedido.update.mockResolvedValue({
        ...pedidoPendiente,
        estado: 'NO_ENTREGADO',
        motivoFalla: motivo,
      });

      const resultado = await service.registrarFalla(PEDIDO_ID, motivo);
      expect(resultado.estado).toBe('NO_ENTREGADO');
      vi.clearAllMocks();
    }
  });

  it('❌ debería lanzar AppError 400 si el motivo no es válido', async () => {
    await expect(service.registrarFalla(PEDIDO_ID, 'INVALIDO')).rejects.toMatchObject({
      statusCode: 400,
      message: expect.stringContaining('Motivo de falla inválido'),
    });

    // No debería consultar la DB si el motivo es inválido
    expect(mockPrisma.pedido.findUnique).not.toHaveBeenCalled();
  });

  it('❌ debería lanzar AppError 404 si el pedido no existe', async () => {
    mockPrisma.pedido.findUnique.mockResolvedValue(null);

    await expect(service.registrarFalla(PEDIDO_ID, 'CLIENTE_AUSENTE')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('❌ debería lanzar AppError 409 si el pedido ya está ENTREGADO', async () => {
    mockPrisma.pedido.findUnique.mockResolvedValue(pedidoEntregado);

    await expect(service.registrarFalla(PEDIDO_ID, 'CLIENTE_AUSENTE')).rejects.toMatchObject({
      statusCode: 409,
      message: expect.stringContaining('PENDIENTE'),
    });
  });

  it('❌ debería lanzar AppError 409 si el pedido ya está NO_ENTREGADO', async () => {
    mockPrisma.pedido.findUnique.mockResolvedValue(pedidoNoEntregado);

    await expect(service.registrarFalla(PEDIDO_ID, 'CLIENTE_AUSENTE')).rejects.toMatchObject({
      statusCode: 409,
      message: expect.stringContaining('PENDIENTE'),
    });
  });
});
