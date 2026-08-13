import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError } from '../../../utils/api-error.js';

// ─── Mock prisma ──────────────────────────────────────────────────────────────

const mockPrisma = {
  $transaction: vi.fn((callback: (tx: typeof mockPrisma) => unknown) => callback(mockPrisma)),
  pedido: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    aggregate: vi.fn(),
  },
  domicilio: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  cliente: { findUnique: vi.fn() },
  reparto: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  item: { findUnique: vi.fn() },
  pedidoItem: {
    findFirst: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  retenido: {
    createMany: vi.fn(),
    findMany: vi.fn(),
    updateMany: vi.fn(),
  },
};

vi.mock('../../../lib/prisma.js', () => ({ prisma: mockPrisma }));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildMockPedido(overrides: Record<string, unknown> = {}) {
  const now = new Date('2026-05-22T10:00:00Z');
  return {
    id: 'ped-001',
    numeroPedido: 'PEDIDO #1',
    orden: 1,
    estado: 'PENDIENTE',
    fecha: now,
    creadoEn: now,
    actualizadoEn: now,
    deletedAt: null,
    motivoFalla: null,
    repartoId: 'rep-001',
    domicilioId: 'dom-001',
    domicilio: {
      id: 'dom-001',
      calle: 'Av. Corrientes',
      numero: '1234',
      localidad: 'CABA',
      latitud: -34.6037,
      longitud: -58.3816,
      principal: true,
      clienteId: 'cli-001',
      cliente: {
        id: 'cli-001',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '1145678901',
        observaciones: null,
        activo: true,
      },
      dias: [
        {
          id: 'dia-1',
          nombre: 'LUNES',
          domicilioId: 'dom-001',
          horarios: [
            {
              id: 'horario-1',
              inicio: new Date('2024-01-01T09:00:00Z'),
              fin: new Date('2024-01-01T11:00:00Z'),
              diaId: 'dia-1',
            },
          ],
        },
      ],
    },
    reparto: { id: 'rep-001', fecha: now },
    items: [
      {
        id: 'item-ped-001',
        itemId: 'prod-001',
        cantidad: 2,
        precioUnitario: 1500,
        item: {
          id: 'prod-001',
          nombre: 'Bidón 20L',
          descripcion: 'Bidón de agua de 20 litros',
          precio: 1500,
          unidad: 'unidad',
          activo: true,
          retornable: true,
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

  // ─── TDD-0025: Crear Pedido ─────────────────────────────────────────────────

  describe('crearPedido (TDD-0025)', () => {
    const validPayload = {
      clienteId: 'cli-001',
      items: [{ itemId: 'prod-001', cantidad: 2 }],
    };

    it('debe crear un pedido exitosamente', async () => {
      mockPrisma.domicilio.findFirst.mockResolvedValue({
        id: 'dom-001',
        calle: 'Av. Corrientes',
        numero: '1234',
        localidad: 'CABA',
        principal: true,
        cliente: { id: 'cli-001', nombre: 'Juan', apellido: 'Pérez', telefono: '1145678901', observaciones: null, activo: true },
      });
      mockPrisma.item.findUnique.mockResolvedValue({ id: 'prod-001', nombre: 'Bidón 20L', precio: 1500, activo: true });
      mockPrisma.pedido.aggregate.mockResolvedValue({ _max: { orden: 5 } });
      mockPrisma.pedido.count.mockResolvedValue(5); // Para generar numeroPedido PEDIDO #6
      mockPrisma.pedido.create.mockResolvedValue(buildMockPedido({ numeroPedido: 'PEDIDO #6' }));

      const result = await service.crearPedido(validPayload);

      expect(result).toBeDefined();
      expect(result.id).toBe('ped-001');
      expect(result.numeroPedido).toBe('PEDIDO #6');
      expect(result.estado).toBe('PENDIENTE');
      expect(result.items).toHaveLength(1);
      expect(result.items[0]!.precioUnitario).toBe(1500);
      expect(result.items[0]!.cantidad).toBe(2);
      // Verificar que se usó el precio del item
      expect(mockPrisma.item.findUnique).toHaveBeenCalledWith({ where: { id: 'prod-001' } });
      // Verificar que se generó mediante transacción
      expect(mockPrisma.$transaction).toHaveBeenCalled();
      expect(mockPrisma.pedido.count).toHaveBeenCalled();
    });

    it('debe rechazar si el cliente no existe', async () => {
      mockPrisma.domicilio.findFirst.mockResolvedValue(null);

      await expect(service.crearPedido(validPayload))
        .rejects.toThrow(ApiError);
      await expect(service.crearPedido(validPayload))
        .rejects.toThrow('Cliente no encontrado');
    });

    it('debe rechazar si un item no existe', async () => {
      mockPrisma.domicilio.findFirst.mockResolvedValue({
        id: 'dom-001',
        calle: 'Av. Corrientes',
        numero: '1234',
        localidad: 'CABA',
        principal: true,
        cliente: { id: 'cli-001', nombre: 'Juan', apellido: 'Pérez' },
      });
      mockPrisma.item.findUnique.mockResolvedValue(null);

      await expect(service.crearPedido(validPayload))
        .rejects.toThrow('no existe');
    });

    it('debe rechazar si un item está inactivo', async () => {
      mockPrisma.domicilio.findFirst.mockResolvedValue({
        id: 'dom-001',
        calle: 'Av. Corrientes',
        numero: '1234',
        localidad: 'CABA',
        principal: true,
        cliente: { id: 'cli-001', nombre: 'Juan', apellido: 'Pérez' },
      });
      mockPrisma.item.findUnique.mockResolvedValue({ id: 'prod-001', nombre: 'Bidón 20L', activo: false });

      await expect(service.crearPedido(validPayload))
        .rejects.toThrow('no está disponible');
    });
  });

  // ─── TDD-0026: Obtener Pedido ───────────────────────────────────────────────

  describe('obtenerPedido (TDD-0026)', () => {
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

  // ─── TDD-0027: Listar Pedidos ───────────────────────────────────────────────

  describe('listarPedidos (TDD-0027)', () => {
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

    it('must filter by clienteId when passed (AC1)', async () => {
      mockPrisma.pedido.findMany.mockResolvedValue([buildMockPedido()]);
      mockPrisma.pedido.count.mockResolvedValue(1);

      const result = await service.listarPedidos({ clienteId: 'cli-001' });

      expect(mockPrisma.pedido.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ domicilio: { clienteId: 'cli-001' } }),
        })
      );
      expect(mockPrisma.pedido.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ domicilio: { clienteId: 'cli-001' } }),
        })
      );
      expect(result.total).toBe(1);
      expect(result.data).toHaveLength(1);
    });

    it('must combine clienteId with the OR name filter (AC2)', async () => {
      mockPrisma.pedido.findMany.mockResolvedValue([]);
      mockPrisma.pedido.count.mockResolvedValue(0);

      await service.listarPedidos({ clienteId: 'cli-001', clienteNombre: 'Juan' });

      const where = mockPrisma.pedido.findMany.mock.calls[0]![0]!.where;
      expect(where).toEqual(
        expect.objectContaining({
          domicilio: { clienteId: 'cli-001' },
          OR: [
            { domicilio: { cliente: { nombre: { contains: 'Juan', mode: 'insensitive' } } } },
            { domicilio: { cliente: { apellido: { contains: 'Juan', mode: 'insensitive' } } } },
          ],
        })
      );
    });
  });

  // ─── TDD-0028: Actualizar Estado ────────────────────────────────────────────

  describe('actualizarEstado (TDD-0028)', () => {
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

  // ─── TDD-0029: Cancelar Pedido ──────────────────────────────────────────────

  describe('cancelarPedido (TDD-0029)', () => {
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

  // ─── TDD-0059: Cancelar Pedido Cliente (ownership BOT) ─────────────────────

  describe('cancelarPedidoCliente (TDD-0059)', () => {
    it('must reject BOT cancel of another client pedido with 404, pedido unchanged (AC3)', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'PENDIENTE' }));

      await expect(
        service.cancelarPedidoCliente('ped-001', 'CANCELACION_CLIENTE', 'cli-999')
      ).rejects.toThrow('Pedido no encontrado');
      expect(mockPrisma.pedido.update).not.toHaveBeenCalled();
    });

    it('must return the same 404 for unknown pedido (no existence leak) (AC3)', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(null);

      await expect(
        service.cancelarPedidoCliente('ped-999', 'CANCELACION_CLIENTE', 'cli-001')
      ).rejects.toThrow('Pedido no encontrado');
      expect(mockPrisma.pedido.update).not.toHaveBeenCalled();
    });

    it('must let ADMIN cancel another client pedido (bypass, no clienteId) (AC4)', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'PENDIENTE' }));
      mockPrisma.pedido.update.mockResolvedValue(
        buildMockPedido({ estado: 'CANCELADO', motivoFalla: 'CANCELACION_CLIENTE' })
      );

      const result = await service.cancelarPedidoCliente('ped-001', 'CANCELACION_CLIENTE');

      expect(result.estado).toBe('CANCELADO');
      expect(mockPrisma.pedido.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'ped-001' },
          data: { estado: 'CANCELADO', motivoFalla: 'CANCELACION_CLIENTE' },
        })
      );
    });

    it('must let BOT cancel own client pending pedido persisting motivoFalla (AC5)', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'PENDIENTE' }));
      mockPrisma.pedido.update.mockResolvedValue(
        buildMockPedido({ estado: 'CANCELADO', motivoFalla: 'YA_NO_LO_NECESITA' })
      );

      const result = await service.cancelarPedidoCliente('ped-001', 'YA_NO_LO_NECESITA', 'cli-001');

      expect(result.estado).toBe('CANCELADO');
      expect(result.motivoFalla).toBe('YA_NO_LO_NECESITA');
    });

    it('must keep rejecting non-PENDIENTE states (existing behavior preserved)', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'ENTREGADO' }));

      await expect(
        service.cancelarPedidoCliente('ped-001', 'CANCELACION_CLIENTE', 'cli-001')
      ).rejects.toThrow('Solo se pueden cancelar pedidos en estado pendiente');
    });
  });

  // ─── TDD-0030: Eliminar Pedido (Soft Delete) ────────────────────────────────

  describe('eliminarPedido (TDD-0030)', () => {
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

  // ─── TDD-0031: Agregar Item ─────────────────────────────────────────────────

  describe('agregarItem (TDD-0031)', () => {
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

    it('must return 409 (not 500) when the DB unique constraint fires (SPEC-06 AC2)', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'PENDIENTE' }));
      mockPrisma.item.findUnique.mockResolvedValue({ id: 'prod-002', nombre: 'Bidón 12L', activo: true });
      // Fast path passes — the constraint is the source of truth (D2)
      mockPrisma.pedidoItem.findFirst.mockResolvedValue(null);
      mockPrisma.pedidoItem.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.agregarItem('ped-001', { itemId: 'prod-002', cantidad: 1 }))
        .rejects.toMatchObject({ statusCode: 409, message: 'El ítem ya existe en el pedido' });
    });

    it('must block a concurrent duplicate with 409 when both calls pass findFirst (SPEC-06 AC5)', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'PENDIENTE' }));
      mockPrisma.item.findUnique.mockResolvedValue({ id: 'prod-002', nombre: 'Bidón 12L', activo: true });
      // Both racing calls pass the findFirst fast path
      mockPrisma.pedidoItem.findFirst.mockResolvedValue(null);
      mockPrisma.pedidoItem.create
        .mockResolvedValueOnce({ id: 'new-item-001', pedidoId: 'ped-001', itemId: 'prod-002', cantidad: 3, precioUnitario: 900 })
        .mockRejectedValueOnce({ code: 'P2002' });

      const results = await Promise.allSettled([
        service.agregarItem('ped-001', { itemId: 'prod-002', cantidad: 3 }),
        service.agregarItem('ped-001', { itemId: 'prod-002', cantidad: 3 }),
      ]);

      expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
      const rejected = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
      expect(rejected).toHaveLength(1);
      expect(rejected[0]!.reason).toBeInstanceOf(ApiError);
      expect(rejected[0]!.reason).toMatchObject({ statusCode: 409 });
    });
  });

  // ─── TDD-0032: Actualizar Cantidad de Item ──────────────────────────────────

  describe('actualizarCantidadItem (TDD-0032)', () => {
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

  // ─── TDD-0033: Quitar Item ──────────────────────────────────────────────────

  describe('quitarItem (TDD-0033)', () => {
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
      mockPrisma.retenido.createMany.mockResolvedValue({ count: 2 });

      const result = await service.confirmarEntrega('ped-001');
      expect(result.estado).toBe('ENTREGADO');
    });

    it('debe confirmar entrega desde EN_RUTA', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'EN_RUTA' }));
      mockPrisma.pedido.update.mockResolvedValue(buildMockPedido({ estado: 'ENTREGADO' }));
      mockPrisma.retenido.createMany.mockResolvedValue({ count: 2 });

      const result = await service.confirmarEntrega('ped-001');
      expect(result.estado).toBe('ENTREGADO');
    });

    it('debe rechazar confirmar un pedido cancelado', async () => {
      mockPrisma.pedido.findUnique.mockResolvedValue(buildMockPedido({ estado: 'CANCELADO' }));

      await expect(service.confirmarEntrega('ped-001'))
        .rejects.toThrow('El pedido no puede ser entregado desde su estado actual');
    });
  });

  // ─── Retornables + Devoluciones (RF-06) ──────────────────────────────────────

  describe('confirmarEntrega con retornables y devoluciones (RF-06)', () => {
    it('debe crear Retenidos para items retornables', async () => {
      const pedido = buildMockPedido({ estado: 'PENDIENTE' });
      mockPrisma.pedido.findUnique.mockResolvedValue(pedido);
      mockPrisma.pedido.update.mockResolvedValue({ ...pedido, estado: 'ENTREGADO' });
      mockPrisma.retenido.createMany.mockResolvedValue({ count: 2 });

      const result = await service.confirmarEntrega('ped-001');

      expect(result.estado).toBe('ENTREGADO');
      expect(mockPrisma.retenido.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({ itemId: 'prod-001', clienteId: 'cli-001', pedidoId: 'ped-001', estado: 'RETENIDO' }),
        ]),
      });
      // 2 unidades de Bidón 20L → 2 retenidos
      expect((mockPrisma.retenido.createMany.mock.calls[0]?.[0] as any)?.data).toHaveLength(2);
    });

    it('debe procesar devoluciones y cerrar Retenidos', async () => {
      const pedido = buildMockPedido({ estado: 'PENDIENTE' });
      mockPrisma.pedido.findUnique.mockResolvedValue(pedido);
      mockPrisma.pedido.update.mockResolvedValue({ ...pedido, estado: 'ENTREGADO' });
      mockPrisma.retenido.createMany.mockResolvedValue({ count: 2 });
      mockPrisma.retenido.findMany.mockResolvedValue([
        { id: 'ret-001', inicio: new Date('2026-07-01'), estado: 'RETENIDO' },
        { id: 'ret-002', inicio: new Date('2026-07-05'), estado: 'RETENIDO' },
      ]);
      mockPrisma.retenido.updateMany.mockResolvedValue({ count: 2 });
      mockPrisma.item.findUnique.mockResolvedValue({ id: 'prod-001', nombre: 'Bidón 20L' });

      const result = await service.confirmarEntrega('ped-001', undefined, undefined, [
        { itemId: 'prod-001', cantidad: 2 },
      ]);

      expect(result.estado).toBe('ENTREGADO');
      expect(mockPrisma.retenido.updateMany).toHaveBeenCalledWith({
        where: { id: { in: ['ret-001', 'ret-002'] } },
        data: { fin: expect.any(Date), estado: 'DEVUELTO' },
      });
    });

    it('debe rechazar devolución de más items de los pendientes', async () => {
      const pedido = buildMockPedido({ estado: 'PENDIENTE' });
      mockPrisma.pedido.findUnique.mockResolvedValue(pedido);
      mockPrisma.retenido.findMany.mockResolvedValue([
        { id: 'ret-001', inicio: new Date('2026-07-01'), estado: 'RETENIDO' },
      ]);
      mockPrisma.item.findUnique.mockResolvedValue({ id: 'prod-001', nombre: 'Bidón 20L' });

      await expect(
        service.confirmarEntrega('ped-001', undefined, undefined, [
          { itemId: 'prod-001', cantidad: 5 },
        ])
      ).rejects.toThrow('El cliente no tiene 5 "Bidón 20L" pendientes de devolución');
    });

    it('debe funcionar sin items retornables', async () => {
      const pedido = buildMockPedido({
        estado: 'PENDIENTE',
        items: [{
          id: 'item-ped-002',
          itemId: 'prod-002',
          cantidad: 1,
          precioUnitario: 200,
          item: {
            id: 'prod-002',
            nombre: 'Tapa para bidón 20L',
            descripcion: 'Tapa de repuesto',
            precio: 200,
            unidad: 'unidad',
            activo: true,
            retornable: false,
          },
        }],
      });
      mockPrisma.pedido.findUnique.mockResolvedValue(pedido);
      mockPrisma.pedido.update.mockResolvedValue({ ...pedido, estado: 'ENTREGADO' });

      const result = await service.confirmarEntrega('ped-001');

      expect(result.estado).toBe('ENTREGADO');
      expect(mockPrisma.retenido.createMany).not.toHaveBeenCalled();
    });

    it('debe confirmar sin devoluciones cuando no se proveen', async () => {
      const pedido = buildMockPedido({ estado: 'PENDIENTE' });
      mockPrisma.pedido.findUnique.mockResolvedValue(pedido);
      mockPrisma.pedido.update.mockResolvedValue({ ...pedido, estado: 'ENTREGADO' });
      mockPrisma.retenido.createMany.mockResolvedValue({ count: 2 });

      const result = await service.confirmarEntrega('ped-001', undefined, undefined);

      expect(result.estado).toBe('ENTREGADO');
      // createMany se llama solo para crear retenidos, sin devoluciones
      expect(mockPrisma.retenido.updateMany).not.toHaveBeenCalled();
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
