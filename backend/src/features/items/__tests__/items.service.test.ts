import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ZodError } from 'zod';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockPrisma = {
  item: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  pedidoItem: { count: vi.fn() },
  retenido: { count: vi.fn() },
};

vi.mock('../../../lib/prisma.js', () => ({ prisma: mockPrisma }));

// ─── Import after mocks ───────────────────────────────────────────────────────

const { crearItem, actualizarItem, eliminarItem } = await import('../service.js');
const { itemSchema } = await import('../schema.js');

// ─── Fixtures ──────────────────────────────────────────────────────────────────

const baseItem = {
  id: 'item-1',
  nombre: 'Bidón 20L',
  descripcion: null,
  unidad: 'unidad',
  precio: null,
  activo: true,
  retornable: false,
};

// ─── Tests: crearItem (SPEC-03 TDD-0061) ──────────────────────────────────────

describe('crearItem (SPEC-03 TDD-0061)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('persiste retornable true y precio al crear', async () => {
    mockPrisma.item.findFirst.mockResolvedValue(null);
    mockPrisma.item.create.mockResolvedValue({ ...baseItem, retornable: true, precio: 1500 });

    const result = await crearItem({ nombre: 'Bidón 20L', unidad: 'unidad', precio: 1500, retornable: true });

    expect(mockPrisma.item.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        retornable: true,
        precio: 1500,
      }),
    });
    expect(result.retornable).toBe(true);
    expect(result.precio).toBe(1500);
  });

  it('retorna retornable default false cuando no se envía', async () => {
    mockPrisma.item.findFirst.mockResolvedValue(null);
    mockPrisma.item.create.mockResolvedValue(baseItem);

    await crearItem({ nombre: 'Bidón 20L', unidad: 'unidad' });

    expect(mockPrisma.item.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        retornable: false,
      }),
    });
  });

  it('lanza 409 si ya existe un ítem con el mismo nombre (case-insensitive)', async () => {
    mockPrisma.item.findFirst.mockResolvedValue({ id: 'item-otro' });

    await expect(crearItem({ nombre: 'bidón 20l', unidad: 'unidad' })).rejects.toMatchObject({
      statusCode: 409,
      code: 'CONFLICT',
    });

    expect(mockPrisma.item.create).not.toHaveBeenCalled();
  });
});

// ─── Tests: actualizarItem ─────────────────────────────────────────────────────

describe('actualizarItem (SPEC-03 TDD-0061)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('actualiza retornable y precio al hacer PATCH', async () => {
    mockPrisma.item.findUnique.mockResolvedValue(baseItem);
    mockPrisma.item.update.mockResolvedValue({ ...baseItem, retornable: false, precio: 2000 });

    const result = await actualizarItem('item-1', { retornable: false, precio: 2000 });

    expect(mockPrisma.item.update).toHaveBeenCalledWith({
      where: { id: 'item-1' },
      data: expect.objectContaining({
        retornable: false,
        precio: 2000,
      }),
    });
    expect(result.retornable).toBe(false);
    expect(result.precio).toBe(2000);
  });

  it('lanza 404 si el ítem no existe', async () => {
    mockPrisma.item.findUnique.mockResolvedValue(null);

    await expect(actualizarItem('no-existe', { nombre: 'Otro' })).rejects.toMatchObject({
      statusCode: 404,
    });

    expect(mockPrisma.item.update).not.toHaveBeenCalled();
  });
});

// ─── Tests: eliminarItem ───────────────────────────────────────────────────────

describe('eliminarItem (SPEC-03 TDD-0061)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lanza 409 si el ítem está referenciado por PedidoItem', async () => {
    mockPrisma.item.findUnique.mockResolvedValue(baseItem);
    mockPrisma.pedidoItem.count.mockResolvedValue(2);

    await expect(eliminarItem('item-1')).rejects.toMatchObject({
      statusCode: 409,
      code: 'CONFLICT',
    });

    expect(mockPrisma.item.delete).not.toHaveBeenCalled();
  });

  it('lanza 409 si el ítem está referenciado solo por Retenido (gate fix A)', async () => {
    mockPrisma.item.findUnique.mockResolvedValue(baseItem);
    mockPrisma.pedidoItem.count.mockResolvedValue(0);
    mockPrisma.retenido.count.mockResolvedValue(1);

    await expect(eliminarItem('item-1')).rejects.toMatchObject({
      statusCode: 409,
      code: 'CONFLICT',
    });

    expect(mockPrisma.item.delete).not.toHaveBeenCalled();
  });

  it('elimina el ítem si no está en uso', async () => {
    mockPrisma.item.findUnique.mockResolvedValue(baseItem);
    mockPrisma.pedidoItem.count.mockResolvedValue(0);
    mockPrisma.retenido.count.mockResolvedValue(0);
    mockPrisma.item.delete.mockResolvedValue(baseItem);

    const result = await eliminarItem('item-1');

    expect(mockPrisma.item.delete).toHaveBeenCalledWith({ where: { id: 'item-1' } });
    expect(result).toEqual({ message: 'Ítem eliminado correctamente' });
  });

  it('lanza 404 si el ítem no existe', async () => {
    mockPrisma.item.findUnique.mockResolvedValue(null);

    await expect(eliminarItem('no-existe')).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});

// ─── Tests: itemSchema (validation contract) ───────────────────────────────────

describe('itemSchema (SPEC-03 TDD-0061)', () => {
  it('rechaza nombre de menos de 2 caracteres (400 en ruta)', () => {
    expect(() => itemSchema.parse({ nombre: 'x', unidad: 'unidad' })).toThrow(ZodError);
  });

  it('incluye retornable default false y precio opcional', () => {
    const parsed = itemSchema.parse({ nombre: 'Bidón 20L', unidad: 'unidad' });
    expect(parsed.retornable).toBe(false);
    expect(parsed.activo).toBe(true);
    expect(parsed.precio).toBeUndefined();

    const conPrecio = itemSchema.parse({ nombre: 'Bidón 20L', unidad: 'unidad', precio: 1500, retornable: true });
    expect(conPrecio.precio).toBe(1500);
    expect(conPrecio.retornable).toBe(true);
  });

  it('rechaza retornable que no sea boolean', () => {
    expect(() =>
      itemSchema.parse({ nombre: 'Bidón 20L', unidad: 'unidad', retornable: 'si' })
    ).toThrow(ZodError);
  });
});
