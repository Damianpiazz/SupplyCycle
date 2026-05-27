import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../../../utils/api-error.js';

const mockService = {
  listarClientes: vi.fn(),
  listarTodosLosClientes: vi.fn(),
  obtenerCliente: vi.fn(),
  crearCliente: vi.fn(),
  actualizarCliente: vi.fn(),
  eliminarCliente: vi.fn(),
};

vi.mock('../service.js', () => mockService);

const {
  listarController,
  obtenerController,
  crearController,
  actualizarController,
  eliminarController,
} = await import('../controller.js');

function mockReq(overrides: Partial<Request> = {}): Request {
  return {
    params: {},
    query: {},
    body: {},
    ...overrides,
  } as Request;
}

function mockRes(): Response {
  const res: Record<string, unknown> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as unknown as Response;
}

function mockNext(): NextFunction {
  return vi.fn() as unknown as NextFunction;
}

describe('ClientesController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listarController', () => {
    it('lista clientes activos sin parámetros', async () => {
      const req = mockReq({ query: {} });
      const res = mockRes();
      const next = mockNext();
      mockService.listarClientes.mockResolvedValue([]);

      await listarController(req, res, next);

      expect(mockService.listarClientes).toHaveBeenCalledWith({
        nombre: undefined,
        dia: undefined,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: [], total: 0 });
    });

    it('incluye inactivos si query incluirInactivos=true', async () => {
      const req = mockReq({ query: { incluirInactivos: 'true' } });
      const res = mockRes();
      const next = mockNext();
      mockService.listarTodosLosClientes.mockResolvedValue([]);

      await listarController(req, res, next);

      expect(mockService.listarTodosLosClientes).toHaveBeenCalled();
    });

    it('llama next con el error si el servicio falla', async () => {
      const req = mockReq({ query: {} });
      const res = mockRes();
      const next = mockNext();
      const error = new Error('DB error');
      mockService.listarClientes.mockRejectedValue(error);

      await listarController(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('obtenerController', () => {
    it('obtiene cliente por id', async () => {
      const req = mockReq({ params: { id: 'cliente-1' } });
      const res = mockRes();
      const next = mockNext();
      mockService.obtenerCliente.mockResolvedValue({ id: 'cliente-1', nombre: 'Juan' });

      await obtenerController(req, res, next);

      expect(mockService.obtenerCliente).toHaveBeenCalledWith('cliente-1');
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('crearController', () => {
    const validBody = {
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '1122334455',
      calle: 'Av. Siempre Viva',
      numero: '742',
      localidad: 'CABA',
      latitud: -34.6037,
      longitud: -58.3816,
      diaEntrega: 'LUNES',
      horarioDesde: '09:00',
      horarioHasta: '13:00',
    };

    it('crea cliente con body válido y responde 201', async () => {
      const req = mockReq({ body: validBody });
      const res = mockRes();
      const next = mockNext();
      mockService.crearCliente.mockResolvedValue({ id: 'nuevo', ...validBody });

      await crearController(req, res, next);

      expect(mockService.crearCliente).toHaveBeenCalledWith(validBody);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: expect.objectContaining({ id: 'nuevo' }),
      });
    });

    it('llama next con ZodError si el body es inválido', async () => {
      const req = mockReq({ body: { nombre: 'J' } }); // nombre muy corto
      const res = mockRes();
      const next = mockNext();

      await crearController(req, res, next);

      expect(mockService.crearCliente).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledOnce();
      expect(next.mock.calls[0][0]).toBeInstanceOf(ZodError);
    });
  });

  describe('actualizarController', () => {
    it('actualiza cliente con body válido', async () => {
      const req = mockReq({
        params: { id: 'cliente-1' },
        body: { nombre: 'Pedro' },
      });
      const res = mockRes();
      const next = mockNext();
      mockService.actualizarCliente.mockResolvedValue({ id: 'cliente-1', nombre: 'Pedro' });

      await actualizarController(req, res, next);

      expect(mockService.actualizarCliente).toHaveBeenCalledWith('cliente-1', {
        nombre: 'Pedro',
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('llama next con ZodError si el body tiene campos inválidos', async () => {
      const req = mockReq({
        params: { id: 'cliente-1' },
        body: { latitud: 'no-es-numero' },
      });
      const res = mockRes();
      const next = mockNext();

      await actualizarController(req, res, next);

      expect(mockService.actualizarCliente).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledOnce();
      expect(next.mock.calls[0][0]).toBeInstanceOf(ZodError);
    });
  });

  describe('eliminarController', () => {
    it('elimina cliente y responde 200', async () => {
      const req = mockReq({ params: { id: 'cliente-1' } });
      const res = mockRes();
      const next = mockNext();
      mockService.eliminarCliente.mockResolvedValue({
        message: 'Cliente desactivado correctamente',
      });

      await eliminarController(req, res, next);

      expect(mockService.eliminarCliente).toHaveBeenCalledWith('cliente-1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: { message: 'Cliente desactivado correctamente' },
      });
    });

    it('pasa el error al next si el servicio falla', async () => {
      const req = mockReq({ params: { id: 'no-existe' } });
      const res = mockRes();
      const next = mockNext();
      const error = ApiError.notFound('Cliente no encontrado');
      mockService.eliminarCliente.mockRejectedValue(error);

      await eliminarController(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
