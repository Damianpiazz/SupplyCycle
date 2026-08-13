import { describe, it, expect, vi, beforeEach } from 'vitest';

// SPEC-08 TDD-0066: shared getOrCreateCiudad helper — previously duplicated in
// the clientes and domicilios services; now a single source of truth in lib/.
// D6 pattern: dynamic import AFTER vi.mock so the factory runs with
// mockPrisma already initialized.

const mockPrisma = {
  ciudad: {
    findFirst: vi.fn(),
    create: vi.fn(),
  },
};

vi.mock('../prisma.js', () => ({ prisma: mockPrisma }));

const { getOrCreateCiudad } = await import('../ciudad.js');

describe('getOrCreateCiudad (SPEC-08 TDD-0066)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reuses an existing city found case-insensitively and does not create', async () => {
    mockPrisma.ciudad.findFirst.mockResolvedValue({ id: 'ciudad-1', nombre: 'CABA' });

    const ciudad = await getOrCreateCiudad('caba');

    expect(ciudad).toEqual({ id: 'ciudad-1', nombre: 'CABA' });
    expect(mockPrisma.ciudad.findFirst).toHaveBeenCalledWith({
      where: { nombre: { equals: 'caba', mode: 'insensitive' } },
    });
    expect(mockPrisma.ciudad.create).not.toHaveBeenCalled();
  });

  it('creates the city when it does not exist yet', async () => {
    mockPrisma.ciudad.findFirst.mockResolvedValue(null);
    mockPrisma.ciudad.create.mockResolvedValue({ id: 'ciudad-2', nombre: 'La Plata' });

    const ciudad = await getOrCreateCiudad('La Plata');

    expect(ciudad).toEqual({ id: 'ciudad-2', nombre: 'La Plata' });
    expect(mockPrisma.ciudad.findFirst).toHaveBeenCalledWith({
      where: { nombre: { equals: 'La Plata', mode: 'insensitive' } },
    });
    expect(mockPrisma.ciudad.create).toHaveBeenCalledWith({ data: { nombre: 'La Plata' } });
  });
});
