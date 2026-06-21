import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ZodError } from 'zod';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockObtenerEstadisticasDiarias = vi.fn();
const mockObtenerEstadisticasMensuales = vi.fn();

vi.mock('../service.js', () => ({
  obtenerEstadisticasDiarias: mockObtenerEstadisticasDiarias,
  obtenerEstadisticasMensuales: mockObtenerEstadisticasMensuales,
}));

vi.mock('../../../lib/prisma.js', () => ({
  prisma: {
    pedido: { findMany: vi.fn() },
    pedidoItem: { findMany: vi.fn() },
    reparto: { findMany: vi.fn() },
  },
}));

// ─── Import after mocks ───────────────────────────────────────────────────────

const { diariasController, mensualesController } = await import('../controller.js');

// ─── Helpers ───────────────────────────────────────────────────────────────────

function mockReq(query: Record<string, string> = {}) {
  return { query } as any;
}

function mockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
}

function mockNext() {
  return vi.fn();
}

// ─── Tests: diariasController ─────────────────────────────────────────────────

describe('diariasController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('responde 200 con estadísticas diarias cuando la fecha es válida', async () => {
    const stats = {
      fecha: '2026-06-15',
      totalPedidos: 5,
      entregasRealizadas: 3,
      entregasNoRealizadas: 1,
      volumenProductos: [],
      desempenioRepartos: { total: 0, iniciados: 0, finalizados: 0 },
    };

    mockObtenerEstadisticasDiarias.mockResolvedValue(stats);

    const req = mockReq({ fecha: '2026-06-15' });
    const res = mockRes();
    const next = mockNext();

    await diariasController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: stats });
    expect(next).not.toHaveBeenCalled();
  });

  it('llama a next con ZodError cuando la fecha tiene formato inválido', async () => {
    const req = mockReq({ fecha: '15-06-2026' }); // formato incorrecto
    const res = mockRes();
    const next = mockNext();

    await diariasController(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ZodError));
    expect(res.status).not.toHaveBeenCalled();
  });

  it('llama a next con ZodError cuando la fecha no es real (ej. mes 13)', async () => {
    const req = mockReq({ fecha: '2026-13-01' }); // mes 13 no existe
    const res = mockRes();
    const next = mockNext();

    await diariasController(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ZodError));
    expect(res.status).not.toHaveBeenCalled();
  });

  it('llama a next con ZodError cuando el día no existe en el mes (ej. 30 feb)', async () => {
    const req = mockReq({ fecha: '2026-02-30' }); // febrero no tiene 30 días
    const res = mockRes();
    const next = mockNext();

    await diariasController(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ZodError));
    expect(res.status).not.toHaveBeenCalled();
  });

  it('llama a next con ZodError cuando falta la fecha', async () => {
    const req = mockReq({}); // sin fecha
    const res = mockRes();
    const next = mockNext();

    await diariasController(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ZodError));
  });

  it('llama a next con el error del servicio si falla', async () => {
    const error = new Error('Error de base de datos');
    mockObtenerEstadisticasDiarias.mockRejectedValue(error);

    const req = mockReq({ fecha: '2026-06-15' });
    const res = mockRes();
    const next = mockNext();

    await diariasController(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

// ─── Tests: mensualesController ───────────────────────────────────────────────

describe('mensualesController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('responde 200 con estadísticas mensuales cuando año y mes son válidos', async () => {
    const stats = {
      anio: 2026,
      mes: 6,
      totalPedidos: 50,
      entregasRealizadas: 40,
      entregasNoRealizadas: 10,
      totalRepartosIniciados: 15,
      totalRepartosFinalizados: 12,
      dias: [],
    };

    mockObtenerEstadisticasMensuales.mockResolvedValue(stats);

    const req = mockReq({ anio: '2026', mes: '6' });
    const res = mockRes();
    const next = mockNext();

    await mensualesController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: stats });
    expect(next).not.toHaveBeenCalled();
  });

  it('llama a next con ZodError cuando anio no es numérico', async () => {
    const req = mockReq({ anio: 'abc', mes: '6' });
    const res = mockRes();
    const next = mockNext();

    await mensualesController(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ZodError));
  });

  it('pasa el error del servicio a next cuando el mes es inválido (13)', async () => {
    const apiError = new Error('El mes debe estar entre 1 y 12');
    mockObtenerEstadisticasMensuales.mockRejectedValue(apiError);

    const req = mockReq({ anio: '2026', mes: '13' });
    const res = mockRes();
    const next = mockNext();

    await mensualesController(req, res, next);

    // Zod acepta "13" (formato \d{1,2}), la validación pasa al service que rechaza
    expect(next).toHaveBeenCalledWith(apiError);
  });

  it('llama a next con ZodError cuando falta algún parámetro', async () => {
    const req = mockReq({ anio: '2026' }); // falta mes
    const res = mockRes();
    const next = mockNext();

    await mensualesController(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ZodError));
  });
});
