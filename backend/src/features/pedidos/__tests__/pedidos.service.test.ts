import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError } from '../../../utils/api-error.js';

// ─── Mock prisma ──────────────────────────────────────────────────────────────

const mockPrisma = {
  pedido: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    aggregate: vi.fn(),
  },
  cliente: { findUnique: vi.fn() },
  reparto: { findUnique: vi.fn() },
  item: { findUnique: vi.fn() },
  pedidoItem: {
    findFirst: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

vi.mock('../../../lib/prisma.js', () => ({ prisma: mockPrisma }));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildMockPedido(overrides: Record<string, unknown> = {}) {
  const now = new Date('2026-05-22T10:00:00Z');
  return {
    id: 'ped-001',
    orden: 1,
    estado: 'PENDIENTE',
    fecha: now,
    creadoEn: now,
    actualizadoEn: now,
    deletedAt: null,
    motivoFalla: null,
    clienteId: 'cli-001',
    repartoId: 'rep-001',
    cliente: {
      id: 'cli-001',
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '1145678901',
      calle: 'Av. Corrientes',
      numero: '1234',
      localidad: 'CABA',
      latitud: -34.6037,
      longitud: -58.3816,
      horarioDesde: '09:00',
      horarioHasta: '11:00',
    },
    reparto: { id: 'rep-001', fecha: now },
    items: [
      {
        id: 'item-ped-001',
        cantidad: 2,
        precioUnitario: 1500,
        item: {
          id: 'prod-001',
          nombre: 'Bidón 20L',
          descripcion: 'Bidón de agua de 20 litros',
          precio: 1500,
          unidad: 'unidad',
          activo: true,
        },
      },
    ],
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PedidosService', () => {
  // We import after mocking
  let service: typeof import('../service.js');

  beforeEach(async () => {
    vi.clearAllMocks();
    // Re-import to get fresh module state
    service = await import('../service.js');
  });

  // ─── TDD-0031: Crear Pedido ─────────────────────────────────────────────────

  describe('crearPedido (TDD-0031)', () => {
    const validPayload = {
      clienteId: 'cli-001',
      items: [{ itemId: 'prod-001', cantidad: 2 }],
    };

    it('debe crear un pedido exitosamente', async () => {
      mockPrisma.cliente.findUnique.mockResolvedValue({ id: 'cli-001', nombre: 'Juan', apellido: 'Pérez' });
      mockPrisma.item.findUnique.mockResolvedValue({ id: 'prod-001', nombre: 'Bidón 20L', precio: 1500, activo: true });
      mockPrisma.pedido.aggregate.mockResolvedValue({ _max: { orden: 5 } });
      mockPrisma.pedido.create.mockResolvedValue(buildMockPedido());

      const result = await service.crearPedido(validPayload);

      expect(result).toBeDefined();
      expect(result.id).toBe('ped-001');
      expect(result.estado).toBe('PENDIENTE');
      expect(result.items).toHaveLength(1);
      expect(result.items[0]!.precioUnitario).toBe(1500);
      expect(result.items[0]!.cantidad).toBe(2);
      // Verificar que se usó el precio del item
      expect(mockPrisma.item.findUnique).toHaveBeenCalledWith({ where: { id: 'prod-001' } });
    });

    it('debe rechazar si el cliente no existe', async () => {
      mockPrisma.cliente.findUnique.mockResolvedValue(null);

      await expect(service.crearPedido(validPayload))
        .rejects.toThrow(ApiError);
      await expect(service.crearPedido(validPayload))
        .rejects.toThrow('Cliente no encontrado');
    });

    it('debe rechazar si un item no existe', async () => {
      mockPrisma.cliente.findUnique.mockResolvedValue({ id: 'cli-001' });
      mockPrisma.item.findUnique.mockResolvedValue(null);

      await expect(service.crearPedido(validPayload))
        .rejects.toThrow('no existe');
    });

    it('debe rechazar si un item está inactivo', async () => {
      mockPrisma.cliente.findUnique.mockResolvedValue({ id: 'cli-001' });
      mockPrisma.item.findUnique.mockResolvedValue({ id: 'prod-001', nombre: 'Bidón 20L', activo: false });

      await expect(service.crearPedido(validPayload))
        .rejects.toThrow('no está disponible');
    });
  });

  // ─── TDD-0032: Obtener Pedido ───────────────────────────────────────────────

  describe('obtenerPedido (TDD-0032)', () => {
    it('debe retornar el detalle completo del pedido', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido());

      const result = await service.obtenerPedido('ped-001');

      expect(result).toBeDefined();
      expect(result.id).toBe('ped-001');
      expect(result.cliente.nombre).toBe('Juan');
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(3000); // 2 * 1500
    });

    it('debe lanzar NOT_FOUND si el pedido no existe', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(null);

      await expect(service.obtenerPedido('ped-999'))
        .rejects.toThrow(ApiError);
      await expect(service.obtenerPedido('ped-999'))
        .rejects.toThrow('Pedido no encontrado');
    });

    it('debe lanzar NOT_FOUND si el pedido está eliminado (soft delete)', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(
        buildMockPedido({ deletedAt: new Date() })
      );

      await expect(service.obtenerPedido('ped-001'))
        .rejects.toThrow('Pedido no encontrado');
    });
  });

  // ─── TDD-0033: Listar Pedidos ───────────────────────────────────────────────

  describe('listarPedidos (TDD-0033)', () => {
    it('debe retornar lista paginada de pedidos', async () => {
      mockPrisma.pedido.findMany.mockResolvedValue([buildMockPedido()]);
      mockPrisma.pedido.count.mockResolvedValue(1);

      const result = await service.listarPedidos({ page: 1, pageSize: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
      expect(result.data[0]!.itemsCount).toBe(1);
    });

    it('debe filtrar por estado', async () => {
      mockPrisma.pedido.findMany.mockResolvedValue([]);
      mockPrisma.pedido.count.mockResolvedValue(0);

      await service.listarPedidos({ estado: 'ENTREGADO' });

      expect(mockPrisma.pedido.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ estado: 'ENTREGADO' }),
        })
      );
    });

    it('debe excluir pedidos eliminados por defecto', async () => {
      mockPrisma.pedido.findMany.mockResolvedValue([]);
      mockPrisma.pedido.count.mockResolvedValue(0);

      await service.listarPedidos({});

      expect(mockPrisma.pedido.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ deletedAt: null }),
        })
      );
    });
  });

  // ─── TDD-0034: Actualizar Estado ────────────────────────────────────────────

  describe('actualizarEstado (TDD-0034)', () => {
    it('debe permitir PENDIENTE → EN_RUTA', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'PENDIENTE' }));
      mockPrisma.pedido.update.mockResolvedValue(buildMockPedido({ estado: 'EN_RUTA' }));

      const result = await service.actualizarEstado('ped-001', 'EN_RUTA');

      expect(result.estado).toBe('EN_RUTA');
      expect(mockPrisma.pedido.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'ped-001' },
          data: { estado: 'EN_RUTA' },
        })
      );
    });

    it('debe permitir EN_RUTA → ENTREGADO', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'EN_RUTA' }));
      mockPrisma.pedido.update.mockResolvedValue(buildMockPedido({ estado: 'ENTREGADO' }));

      const result = await service.actualizarEstado('ped-001', 'ENTREGADO');
      expect(result.estado).toBe('ENTREGADO');
    });

    it('debe rechazar transición inválida: ENTREGADO → EN_RUTA', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'ENTREGADO' }));

      await expect(service.actualizarEstado('ped-001', 'EN_RUTA'))
        .rejects.toThrow(ApiError);
      await expect(service.actualizarEstado('ped-001', 'EN_RUTA'))
        .rejects.toThrow('No se puede cambiar');
    });

    it('debe rechazar transición inválida: CANCELADO → ENTREGADO', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'CANCELADO' }));

      await expect(service.actualizarEstado('ped-001', 'ENTREGADO'))
        .rejects.toThrow('No se puede cambiar');
    });

    it('debe rechazar si el pedido no existe', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(null);

      await expect(service.actualizarEstado('ped-999', 'EN_RUTA'))
        .rejects.toThrow('Pedido no encontrado');
    });
  });

  // ─── TDD-0035: Cancelar Pedido ──────────────────────────────────────────────

  describe('cancelarPedido (TDD-0035)', () => {
    it('debe cancelar un pedido pendiente', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'PENDIENTE' }));
      mockPrisma.pedido.update.mockResolvedValue(buildMockPedido({ estado: 'CANCELADO' }));

      const result = await service.cancelarPedido('ped-001');
      expect(result.estado).toBe('CANCELADO');
    });

    it('debe rechazar cancelar un pedido en EN_RUTA', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'EN_RUTA' }));

      await expect(service.cancelarPedido('ped-001'))
        .rejects.toThrow('Solo se pueden cancelar pedidos en estado pendiente');
    });

    it('debe rechazar cancelar un pedido entregado', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'ENTREGADO' }));

      await expect(service.cancelarPedido('ped-001'))
        .rejects.toThrow('Solo se pueden cancelar pedidos en estado pendiente');
    });
  });

  // ─── TDD-0036: Eliminar Pedido (Soft Delete) ────────────────────────────────

  describe('eliminarPedido (TDD-0036)', () => {
    it('debe eliminar (soft delete) un pedido pendiente', async () => {
      const deletedAt = new Date();
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'PENDIENTE' }));
      mockPrisma.pedido.update.mockResolvedValue(
        buildMockPedido({ estado: 'PENDIENTE', deletedAt })
      );

      const result = await service.eliminarPedido('ped-001');
      expect(result.id).toBe('ped-001');
      expect(result.deletedAt).toBe(deletedAt.toISOString());
    });

    it('debe eliminar un pedido cancelado', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'CANCELADO' }));
      mockPrisma.pedido.update.mockResolvedValue(
        buildMockPedido({ estado: 'CANCELADO', deletedAt: new Date() })
      );

      const result = await service.eliminarPedido('ped-001');
      expect(result.id).toBe('ped-001');
    });

    it('debe rechazar eliminar un pedido EN_RUTA', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'EN_RUTA' }));

      await expect(service.eliminarPedido('ped-001'))
        .rejects.toThrow('No se puede eliminar un pedido en reparto');
    });

    it('debe rechazar eliminar un pedido ENTREGADO', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'ENTREGADO' }));

      await expect(service.eliminarPedido('ped-001'))
        .rejects.toThrow('No se puede eliminar un pedido en reparto');
    });
  });

  // ─── TDD-0037: Agregar Item ─────────────────────────────────────────────────

  describe('agregarItem (TDD-0037)', () => {
    it('debe agregar un item a un pedido pendiente', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'PENDIENTE' }));
      mockPrisma.item.findUnique.mockResolvedValue({
        id: 'prod-002', nombre: 'Bidón 12L', precio: 900, activo: true,
      });
      mockPrisma.pedidoItem.findFirst.mockResolvedValue(null);
      mockPrisma.pedidoItem.create.mockResolvedValue({
        id: 'new-item-001', pedidoId: 'ped-001', itemId: 'prod-002',
        cantidad: 3, precioUnitario: 900,
      });
      // After create, we re-fetch the pedido with include
      mockPrisma.pedido.findUnique.mockResolvedValue(
        buildMockPedido({
          items: [
            {
              id: 'item-ped-001',
              cantidad: 2,
              precioUnitario: 1500,
              item: { id: 'prod-001', nombre: 'Bidón 20L', descripcion: null, precio: 1500, unidad: 'unidad', activo: true },
            },
            {
              id: 'new-item-001',
              cantidad: 3,
              precioUnitario: 900,
              item: { id: 'prod-002', nombre: 'Bidón 12L', descripcion: null, precio: 900, unidad: 'unidad', activo: true },
            },
          ],
        })
      );

      const result = await service.agregarItem('ped-001', { itemId: 'prod-002', cantidad: 3 });

      expect(result.items).toHaveLength(2);
      expect(result.items[1]!.item.nombre).toBe('Bidón 12L');
      expect(result.items[1]!.precioUnitario).toBe(900);
    });

    it('debe rechazar si el pedido no está pendiente', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'ENTREGADO' }));

      await expect(service.agregarItem('ped-001', { itemId: 'prod-002', cantidad: 1 }))
        .rejects.toThrow('Solo se pueden modificar pedidos en estado pendiente');
    });

    it('debe rechazar si el item ya existe en el pedido', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'PENDIENTE' }));
      mockPrisma.item.findUnique.mockResolvedValue({ id: 'prod-001', nombre: 'Bidón 20L', activo: true });
      mockPrisma.pedidoItem.findFirst.mockResolvedValue({ id: 'existente' });

      await expect(service.agregarItem('ped-001', { itemId: 'prod-001', cantidad: 1 }))
        .rejects.toThrow('El ítem ya existe en el pedido');
    });
  });

  // ─── TDD-0038: Actualizar Cantidad de Item ──────────────────────────────────

  describe('actualizarCantidadItem (TDD-0038)', () => {
    it('debe actualizar la cantidad de un item', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'PENDIENTE' }));
      mockPrisma.pedidoItem.findFirst.mockResolvedValue(
        { id: 'item-ped-001', pedidoId: 'ped-001', itemId: 'prod-001', cantidad: 2 }
      );
      mockPrisma.pedidoItem.update.mockResolvedValue({});
      // Re-fetch after update
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido());

      const result = await service.actualizarCantidadItem('ped-001', 'item-ped-001', 5);
      expect(result).toBeDefined();
      expect(mockPrisma.pedidoItem.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'item-ped-001' },
          data: { cantidad: 5 },
        })
      );
    });

    it('debe rechazar si el item no existe en el pedido', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'PENDIENTE' }));
      mockPrisma.pedidoItem.findFirst.mockResolvedValue(null);

      await expect(service.actualizarCantidadItem('ped-001', 'item-999', 5))
        .rejects.toThrow('El ítem no existe en el pedido');
    });
  });

  // ─── TDD-0039: Quitar Item ──────────────────────────────────────────────────

  describe('quitarItem (TDD-0039)', () => {
    it('debe quitar un item del pedido', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'PENDIENTE' }));
      mockPrisma.pedidoItem.findFirst.mockResolvedValue(
        { id: 'item-ped-001', pedidoId: 'ped-001' }
      );
      mockPrisma.pedidoItem.count.mockResolvedValue(2); // tiene más de 1 item
      mockPrisma.pedidoItem.delete.mockResolvedValue({});
      // Re-fetch after delete - now only 1 item
      mockPrisma.pedido.findUnique.mockResolvedValue(
        buildMockPedido({
          items: [buildMockPedido().items[0]],
        })
      );

      const result = await service.quitarItem('ped-001', 'item-ped-001');
      expect(result).toBeDefined();
      expect(mockPrisma.pedidoItem.delete).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'item-ped-001' } })
      );
    });

    it('debe rechazar si es el único item del pedido', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'PENDIENTE' }));
      mockPrisma.pedidoItem.findFirst.mockResolvedValue(
        { id: 'item-ped-001', pedidoId: 'ped-001' }
      );
      mockPrisma.pedidoItem.count.mockResolvedValue(1); // único item

      await expect(service.quitarItem('ped-001', 'item-ped-001'))
        .rejects.toThrow('El pedido debe tener al menos un item');
    });
  });

  // ─── Legacy: Confirmar Entrega ──────────────────────────────────────────────

  describe('confirmarEntrega (legacy)', () => {
    it('debe confirmar entrega desde PENDIENTE (backward compat)', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'PENDIENTE' }));
      mockPrisma.pedido.update.mockResolvedValue(buildMockPedido({ estado: 'ENTREGADO' }));

      const result = await service.confirmarEntrega('ped-001');
      expect(result.estado).toBe('ENTREGADO');
    });

    it('debe confirmar entrega desde EN_RUTA', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'EN_RUTA' }));
      mockPrisma.pedido.update.mockResolvedValue(buildMockPedido({ estado: 'ENTREGADO' }));

      const result = await service.confirmarEntrega('ped-001');
      expect(result.estado).toBe('ENTREGADO');
    });

    it('debe rechazar confirmar un pedido cancelado', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'CANCELADO' }));

      await expect(service.confirmarEntrega('ped-001'))
        .rejects.toThrow('El pedido no puede ser entregado desde su estado actual');
    });
  });

  // ─── Legacy: Cancelar Repartidor ────────────────────────────────────────────

  describe('cancelarPedidoRepartidor (legacy)', () => {
    it('debe marcar como NO_ENTREGADO con motivo', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'EN_RUTA' }));
      mockPrisma.pedido.update.mockResolvedValue(
        buildMockPedido({ estado: 'NO_ENTREGADO', motivoFalla: 'CLIENTE_AUSENTE' })
      );

      const result = await service.cancelarPedidoRepartidor('ped-001', 'CLIENTE_AUSENTE');
      expect(result.estado).toBe('NO_ENTREGADO');
    });

    it('debe rechazar si el pedido no está EN_RUTA ni PENDIENTE', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'ENTREGADO' }));

      await expect(service.cancelarPedidoRepartidor('ped-001', 'OTRO'))
        .rejects.toThrow('no puede marcarse como no entregado');
    });
  });

  // ─── Obtención de datos ─────────────────────────────────────────────────────

  describe('obtenerPedidosDelDia', () => {
    it('debe retornar los pedidos del día para un repartidor', async () => {
      mockPrisma.pedido.findMany.mockResolvedValue([buildMockPedido()]);

      const result = await service.obtenerPedidosDelDia('repartidor-001');

      expect(result).toHaveLength(1);
      expect(mockPrisma.pedido.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            reparto: { repartidorId: 'repartidor-001' },
          }),
        })
      );
    });
  });
});
