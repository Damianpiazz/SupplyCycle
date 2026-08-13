import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mocks ────────────────────────────────────────────────────────
const mockPrisma = {
  configuracion: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
};

vi.mock('../../../lib/prisma.js', () => ({ prisma: mockPrisma }));

const { obtenerConfiguracion, obtenerDiasDemora, obtenerFrecuenciaNotificacion } = await import('../configuracion.service.js');

// ─── Tests: configuracion.service ─────────────────────────────────
describe('configuracion.service — obtenerConfiguracion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna el valor cuando la clave existe', async () => {
    mockPrisma.configuracion.findUnique.mockResolvedValue({
      clave: 'DEMORA_DIAS',
      valor: '15',
    });

    const resultado = await obtenerConfiguracion('DEMORA_DIAS', '999');
    expect(resultado).toBe('15');
    expect(mockPrisma.configuracion.findUnique).toHaveBeenCalledWith({
      where: { clave: 'DEMORA_DIAS' },
    });
  });

  it('retorna el valorDefault cuando la clave NO existe', async () => {
    mockPrisma.configuracion.findUnique.mockResolvedValue(null);

    const resultado = await obtenerConfiguracion('DEMORA_DIAS', '999');
    expect(resultado).toBe('999');
    expect(mockPrisma.configuracion.findUnique).toHaveBeenCalledWith({
      where: { clave: 'DEMORA_DIAS' },
    });
  });

  it('obtenerDiasDemora retorna 15 por defecto si no hay registro', async () => {
    mockPrisma.configuracion.findUnique.mockResolvedValue(null);

    const dias = await obtenerDiasDemora();
    expect(dias).toBe(15);
  });

  it('obtenerDiasDemora retorna el valor de DB cuando existe', async () => {
    mockPrisma.configuracion.findUnique.mockResolvedValue({
      clave: 'DEMORA_DIAS',
      valor: '20',
    });

    const dias = await obtenerDiasDemora();
    expect(dias).toBe(20);
  });

  it('obtenerFrecuenciaNotificacion retorna 7 por defecto si no hay registro', async () => {
    mockPrisma.configuracion.findUnique.mockResolvedValue(null);

    const frecuencia = await obtenerFrecuenciaNotificacion();
    expect(frecuencia).toBe(7);
  });

  it('obtenerFrecuenciaNotificacion retorna el valor de DB cuando existe', async () => {
    mockPrisma.configuracion.findUnique.mockResolvedValue({
      clave: 'NOTIFICACION_FRECUENCIA_DIAS',
      valor: '14',
    });

    const frecuencia = await obtenerFrecuenciaNotificacion();
    expect(frecuencia).toBe(14);
  });
});

// ─── Tests: seed idempotencia ─────────────────────────────────────
describe('seed 18-configuracion — idempotencia', () => {
  const upsertLog: Array<{ where: { clave: string }; create: { clave: string; valor: string }; update: object }> = [];

  beforeEach(() => {
    vi.clearAllMocks();
    upsertLog.length = 0;

    // findUnique siempre devuelve null para simular que no hay datos
    mockPrisma.configuracion.findUnique.mockResolvedValue(null);

    // upsert: capturar cada llamado y devolver el registro "creado"
    mockPrisma.configuracion.upsert.mockImplementation(
      (args: { where: { clave: string }; create: { clave: string; valor: string }; update: object }) => {
        upsertLog.push(args);
        return Promise.resolve({ id: 'mock-id', ...args.create, actualizadoEn: new Date() });
      },
    );
  });

  it('inserta ambas claves al correr seedConfiguracion', async () => {
    const { seedConfiguracion } = await import('../../../../prisma/seed/18-configuracion.seed.js');

    await seedConfiguracion();

    expect(mockPrisma.configuracion.upsert).toHaveBeenCalledTimes(2);

    const clavesInsertadas = upsertLog.map((u) => u.where.clave).sort();
    expect(clavesInsertadas).toEqual(['DEMORA_DIAS', 'NOTIFICACION_FRECUENCIA_DIAS']);
  });

  it('usa upsert, no create — update vacío para no sobrescribir', async () => {
    const { seedConfiguracion } = await import('../../../../prisma/seed/18-configuracion.seed.js');

    await seedConfiguracion();

    for (const log of upsertLog) {
      expect(log.update).toEqual({});
    }
  });

  it('correr el seed dos veces NO duplica registros (misma cantidad de upserts)', async () => {
    const { seedConfiguracion } = await import('../../../../prisma/seed/18-configuracion.seed.js');

    // Primera ejecución
    await seedConfiguracion();
    expect(mockPrisma.configuracion.upsert).toHaveBeenCalledTimes(2);

    // Segunda ejecución
    await seedConfiguracion();
    // upsert no inserta duplicados porque el where ya encuentra el registro,
    // y update: {} no modifica nada. Pero upsert sí se vuelve a llamar.
    expect(mockPrisma.configuracion.upsert).toHaveBeenCalledTimes(4);
  });
});
