import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError } from '../../../utils/api-error.js';

const mockPrisma = {
  cliente: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  domicilio: {
    deleteMany: vi.fn(),
    create: vi.fn(),
  },
  ciudad: {
    findFirst: vi.fn(),
    create: vi.fn(),
  },
  pedido: {
    count: vi.fn(),
    findMany: vi.fn(),
  },
  $transaction: vi.fn((fn: any) => fn(mockPrisma)),
};

vi.mock('../../../lib/prisma.js', () => ({ prisma: mockPrisma }));

const {
  listarClientes,
  listarTodosLosClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  obtenerDemandaCliente,
} = await import('../service.js');

const clienteInclude = {
  domicilios: {
    include: {
      dias: { include: { horarios: true } },
    },
  },
  retenidos: {
    where: { estado: 'RETENIDO' as const },
    select: { estado: true, inicio: true },
    orderBy: { inicio: 'desc' as const },
  },
};

const baseDomRow = {
  id: 'dom-1',
  calle: 'Av. Siempre Viva',
  numero: '742',
  localidad: 'CABA',
  latitud: -34.6037,
  longitud: -58.3816,
  principal: true,
  clienteId: 'cliente-1',
  dias: [
    {
      id: 'dia-1',
      nombre: 'LUNES',
      domicilioId: 'dom-1',
      horarios: [
        { id: 'horario-1', inicio: new Date('2024-01-01T09:00:00Z'), fin: new Date('2024-01-01T13:00:00Z'), diaId: 'dia-1' },
      ],
    },
  ],
};

const baseClienteRow = {
  id: 'cliente-1',
  nombre: 'Juan',
  apellido: 'Pérez',
  telefono: '1122334455',
  observaciones: null,
  activo: true,
  creadoEn: new Date(),
  actualizadoEn: new Date(),
  domicilios: [baseDomRow],
  retenidos: [],
};

const expectedResponse = {
  id: 'cliente-1',
  nombre: 'Juan',
  apellido: 'Pérez',
  telefono: '1122334455',
  observaciones: undefined,
  activo: true,
  tieneDemora: false,
  cantidadEnvasesPendientes: 0,
  fechaUltimaEntrega: null,
  domicilios: [
    {
      id: 'dom-1',
      calle: 'Av. Siempre Viva',
      numero: '742',
      localidad: 'CABA',
      latitud: -34.6037,
      longitud: -58.3816,
      principal: true,
      dias: [
        {
          id: 'dia-1',
          nombre: 'LUNES',
          horarios: [
            { id: 'horario-1', inicio: '09:00', fin: '13:00' },
          ],
        },
      ],
    },
  ],
};

describe('ClientesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listarClientes', () => {
    it('devuelve solo clientes activos por defecto', async () => {
      mockPrisma.cliente.findMany.mockResolvedValue([baseClienteRow]);

      const result = await listarClientes();

      expect(mockPrisma.cliente.findMany).toHaveBeenCalledWith({
        where: { activo: true },
        include: clienteInclude,
        orderBy: { apellido: 'asc' },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        nombre: 'Juan',
        apellido: 'Pérez',
        activo: true,
      });
    });

    it('filtra por nombre', async () => {
      mockPrisma.cliente.findMany.mockResolvedValue([baseClienteRow]);

      await listarClientes({ nombre: 'Juan' });

      expect(mockPrisma.cliente.findMany).toHaveBeenCalledWith({
        where: {
          activo: true,
          OR: [
            { nombre: { contains: 'Juan', mode: 'insensitive' } },
            { apellido: { contains: 'Juan', mode: 'insensitive' } },
          ],
        },
        include: clienteInclude,
        orderBy: { apellido: 'asc' },
      });
    });

    it('filtra por día de entrega', async () => {
      mockPrisma.cliente.findMany.mockResolvedValue([baseClienteRow]);

      await listarClientes({ dia: 'LUNES' });

      expect(mockPrisma.cliente.findMany).toHaveBeenCalledWith({
        where: {
          activo: true,
          domicilios: {
            some: {
              dias: {
                some: { nombre: 'LUNES' },
              },
            },
          },
        },
        include: clienteInclude,
        orderBy: { apellido: 'asc' },
      });
    });
  });

  describe('listarTodosLosClientes', () => {
    it('devuelve todos los clientes incluyendo inactivos', async () => {
      mockPrisma.cliente.findMany.mockResolvedValue([
        baseClienteRow,
        { ...baseClienteRow, id: 'cliente-2', activo: false, domicilios: [baseDomRow] },
      ]);

      const result = await listarTodosLosClientes();

      expect(mockPrisma.cliente.findMany).toHaveBeenCalledWith({
        where: {},
        include: clienteInclude,
        orderBy: { apellido: 'asc' },
      });
      expect(result).toHaveLength(2);
    });
  });

  describe('obtenerCliente', () => {
    it('devuelve cliente por id', async () => {
      mockPrisma.cliente.findUnique.mockResolvedValue(baseClienteRow);

      const result = await obtenerCliente('cliente-1');

      expect(result).toMatchObject({
        nombre: 'Juan',
        apellido: 'Pérez',
      });
    });

    it('lanza 404 si no existe', async () => {
      mockPrisma.cliente.findUnique.mockResolvedValue(null);

      await expect(obtenerCliente('no-existe')).rejects.toThrow(ApiError);
      await expect(obtenerCliente('no-existe')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('crearCliente', () => {
    const input = {
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '1122334455',
      domicilios: [
        {
          calle: 'Av. Siempre Viva',
          numero: '742',
          localidad: 'CABA',
          latitud: -34.6037,
          longitud: -58.3816,
          principal: true,
          dias: [
            {
              nombre: 'LUNES' as const,
              horarios: [
                { inicio: '09:00', fin: '13:00' },
              ],
            },
          ],
        },
      ],
    };

    it('crea un cliente activo', async () => {
      mockPrisma.cliente.findFirst.mockResolvedValue(null);
      mockPrisma.ciudad.findFirst.mockResolvedValue({ id: 'ciudad-1', nombre: 'CABA' });
      mockPrisma.cliente.create.mockResolvedValue(baseClienteRow);

      const result = await crearCliente(input);

      expect(mockPrisma.cliente.create).toHaveBeenCalled();
      expect(result.activo).toBe(true);
      expect(result.nombre).toBe('Juan');
    });

    it('lanza 409 si el teléfono ya existe en un cliente activo', async () => {
      mockPrisma.cliente.findFirst.mockResolvedValue(baseClienteRow);

      await expect(crearCliente(input)).rejects.toThrow(ApiError);
      await expect(crearCliente(input)).rejects.toMatchObject({
        statusCode: 409,
        code: 'CONFLICT',
      });

      expect(mockPrisma.cliente.create).not.toHaveBeenCalled();
    });

    it('incluye observaciones cuando se proporcionan', async () => {
      const inputConObs = { ...input, observaciones: 'Cliente vip' };
      mockPrisma.cliente.findFirst.mockResolvedValue(null);
      mockPrisma.ciudad.findFirst.mockResolvedValue({ id: 'ciudad-1', nombre: 'CABA' });
      mockPrisma.cliente.create.mockResolvedValue(baseClienteRow);

      const result = await crearCliente(inputConObs);

      expect(result.observaciones).toBe(undefined);
    });
  });

  describe('actualizarCliente', () => {
    it('actualiza campos del cliente', async () => {
      mockPrisma.cliente.findFirst.mockResolvedValue(baseClienteRow);
      mockPrisma.cliente.update.mockResolvedValue({
        ...baseClienteRow,
        nombre: 'Pedro',
      });
      mockPrisma.cliente.findUnique.mockResolvedValue({
        ...baseClienteRow,
        nombre: 'Pedro',
      });

      const result = await actualizarCliente('cliente-1', { nombre: 'Pedro' });

      expect(result.nombre).toBe('Pedro');
    });

    it('lanza 404 si el cliente no existe o está inactivo', async () => {
      mockPrisma.cliente.findFirst.mockResolvedValue(null);

      await expect(
        actualizarCliente('no-existe', { nombre: 'Pedro' })
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('lanza 409 si el nuevo teléfono ya existe en otro cliente activo', async () => {
      mockPrisma.cliente.findFirst
        .mockResolvedValueOnce(baseClienteRow)
        .mockResolvedValueOnce({ ...baseClienteRow, id: 'otro' });

      await expect(
        actualizarCliente('cliente-1', { telefono: '9999999999' })
      ).rejects.toMatchObject({ statusCode: 409 });

      expect(mockPrisma.cliente.update).not.toHaveBeenCalled();
    });

    it('actualiza teléfono si no hay conflicto', async () => {
      mockPrisma.cliente.findFirst
        .mockResolvedValueOnce(baseClienteRow)
        .mockResolvedValueOnce(null);
      mockPrisma.cliente.update.mockResolvedValue({
        ...baseClienteRow,
        telefono: '9999999999',
      });
      mockPrisma.cliente.findUnique.mockResolvedValue({
        ...baseClienteRow,
        telefono: '9999999999',
      });

      const result = await actualizarCliente('cliente-1', {
        telefono: '9999999999',
      });

      expect(result.telefono).toBe('9999999999');
    });
  });

  describe('eliminarCliente', () => {
    it('desactiva cliente (soft-delete)', async () => {
      mockPrisma.cliente.findUnique.mockResolvedValue(baseClienteRow);
      mockPrisma.pedido.count.mockResolvedValue(0);
      mockPrisma.cliente.update.mockResolvedValue({
        ...baseClienteRow,
        activo: false,
      });

      const result = await eliminarCliente('cliente-1');

      expect(result).toEqual({ message: 'Cliente desactivado correctamente' });
      expect(mockPrisma.cliente.update).toHaveBeenCalledWith({
        where: { id: 'cliente-1' },
        data: { activo: false },
      });
    });

    it('lanza 404 si el cliente no existe', async () => {
      mockPrisma.cliente.findUnique.mockResolvedValue(null);

      await expect(eliminarCliente('no-existe')).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it('retorna éxito si el cliente ya estaba inactivo (idempotente)', async () => {
      mockPrisma.cliente.findUnique.mockResolvedValue({ ...baseClienteRow, activo: false });

      const result = await eliminarCliente('cliente-1');

      expect(result).toEqual({ message: 'El cliente ya estaba desactivado' });
      expect(mockPrisma.cliente.update).not.toHaveBeenCalled();
    });

    it('lanza 409 si el cliente tiene pedidos pendientes o en ruta', async () => {
      mockPrisma.cliente.findUnique.mockResolvedValue(baseClienteRow);
      mockPrisma.pedido.count.mockResolvedValue(2);

      await expect(eliminarCliente('cliente-1')).rejects.toMatchObject({
        statusCode: 409,
        code: 'CONFLICT',
      });

      expect(mockPrisma.cliente.update).not.toHaveBeenCalled();
    });
  });

  // ─── Tests: obtenerDemandaCliente ──────────────────────────────────────

  describe('obtenerDemandaCliente', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('lanza 404 si el cliente no existe', async () => {
      mockPrisma.cliente.findUnique.mockResolvedValue(null);

      await expect(obtenerDemandaCliente('no-existe')).rejects.toThrow(ApiError);
    });

    it('retorna datos vacios si el cliente no tiene pedidos', async () => {
      mockPrisma.cliente.findUnique.mockResolvedValue({
        id: 'cliente-1',
        nombre: 'Juan',
        apellido: 'Perez',
      });
      mockPrisma.pedido.findMany.mockResolvedValue([]);

      const result = await obtenerDemandaCliente('cliente-1');

      expect(result.historicoPedidos).toBe(0);
      expect(result.demandaPorProducto).toEqual([]);
      expect(result.totalUnidadesEstimadas).toBe(0);
      expect(result.proximoPedidoEstimado).toBeNull();
    });

    it('calcula demanda basada en historial de pedidos', async () => {
      mockPrisma.cliente.findUnique.mockResolvedValue({
        id: 'cliente-1',
        nombre: 'Juan',
        apellido: 'Perez',
      });

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      mockPrisma.pedido.findMany.mockResolvedValue([
        {
          fecha: today,
          items: [{ itemId: 'item-1', cantidad: 3, item: { nombre: 'Bidón 12L', unidad: 'unidad' } }],
        },
        {
          fecha: yesterday,
          items: [{ itemId: 'item-1', cantidad: 5, item: { nombre: 'Bidón 12L', unidad: 'unidad' } }],
        },
      ]);

      const result = await obtenerDemandaCliente('cliente-1');

      expect(result.historicoPedidos).toBe(2);
      expect(result.demandaPorProducto).toHaveLength(1);
      expect(result.demandaPorProducto[0]?.cantidadEstimada).toBe(4); // avg(3, 5) = 4
      expect(result.totalUnidadesEstimadas).toBe(4);
      // RF-10: frecuencia real sobre el fixture (hoy - ayer = 1 día)
      expect(result.frecuenciaPromedioDias).toBe(1);
    });

    it('retorna 7 (fallback) si hay <=1 pedido completado (CANCELADO excluido)', async () => {
      mockPrisma.cliente.findUnique.mockResolvedValue({
        id: 'cliente-1',
        nombre: 'Juan',
        apellido: 'Perez',
      });

      const hoy = new Date();
      const hace10Dias = new Date(hoy);
      hace10Dias.setDate(hace10Dias.getDate() - 10);

      // 1 solo pedido completado: el CANCELADO no cuenta para el intervalo
      mockPrisma.pedido.findMany.mockResolvedValue([
        { fecha: hace10Dias, estado: 'CANCELADO', items: [] },
        {
          fecha: hoy,
          estado: 'ENTREGADO',
          items: [{ itemId: 'item-1', cantidad: 2, item: { nombre: 'Bidón 12L', unidad: 'unidad' } }],
        },
      ]);

      const result = await obtenerDemandaCliente('cliente-1');

      expect(result.frecuenciaPromedioDias).toBe(7); // DEFAULT_FRECUENCIA_DIAS
      expect(result.historicoPedidos).toBe(2);
    });
  });
});
