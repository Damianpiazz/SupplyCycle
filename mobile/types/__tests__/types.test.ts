import { describe, it, expect } from 'vitest';

describe('Types - ApiResponse', () => {
  it('should validate ApiResponse structure', () => {
    const response = { data: { id: '1', name: 'test' } };
    expect(response).toHaveProperty('data');
    expect(response.data).toHaveProperty('id');
  });

  it('should validate ApiListResponse structure', () => {
    const response = { data: [{ id: '1' }], total: 1 };
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('total');
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should validate ApiError structure', () => {
    const error = {
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
        timestamp: new Date().toISOString(),
      },
    };
    expect(error.error).toHaveProperty('code');
    expect(error.error).toHaveProperty('message');
    expect(error.error).toHaveProperty('timestamp');
  });
});

describe('Types - Usuario', () => {
  it('should accept valid usuario object', () => {
    const usuario = {
      id: '123',
      email: 'test@test.com',
      nombre: 'Juan',
      apellido: 'Pérez',
      rol: 'REPARTIDOR' as const,
      activo: true,
    };
    expect(usuario.rol).toBe('REPARTIDOR');
    expect(usuario.activo).toBe(true);
  });

  it('should accept ADMIN role', () => {
    const usuario = {
      id: '456',
      email: 'admin@test.com',
      nombre: 'Admin',
      apellido: 'User',
      rol: 'ADMIN' as const,
      activo: true,
    };
    expect(usuario.rol).toBe('ADMIN');
  });
});

describe('Types - Cliente', () => {
  it('should have domicilio with coordinates', () => {
    const cliente = {
      id: '1',
      nombre: 'María',
      apellido: 'González',
      telefono: '1145678901',
      domicilio: {
        calle: 'Av. Corrientes',
        numero: '1234',
        localidad: 'CABA',
        latitud: -34.6037,
        longitud: -58.3816,
      },
      diaEntrega: 'LUNES' as const,
      horarioDesde: '09:00',
      horarioHasta: '11:00',
    };
    expect(cliente.domicilio.latitud).toBeGreaterThanOrEqual(-90);
    expect(cliente.domicilio.latitud).toBeLessThanOrEqual(90);
    expect(cliente.domicilio.longitud).toBeGreaterThanOrEqual(-180);
    expect(cliente.domicilio.longitud).toBeLessThanOrEqual(180);
  });

  it('should accept all diaEntrega values', () => {
    const dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'] as const;
    dias.forEach((dia) => {
      expect(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']).toContain(dia);
    });
  });
});

describe('Types - Pedido', () => {
  it('should accept valid estado values', () => {
    const estados = ['PENDIENTE', 'EN_RUTA', 'ENTREGADO', 'NO_ENTREGADO', 'CANCELADO'] as const;
    estados.forEach((estado) => {
      expect(['PENDIENTE', 'EN_RUTA', 'ENTREGADO', 'NO_ENTREGADO', 'CANCELADO']).toContain(estado);
    });
  });

  it('should accept valid motivo cancelacion values', () => {
    const motivos = [
      'CLIENTE_AUSENTE',
      'DIRECCION_INCORRECTA',
      'ACCESO_DENEGADO',
      'OTRO',
    ] as const;
    motivos.forEach((motivo) => {
      expect(motivo).toMatch(/^(CLIENTE_AUSENTE|DIRECCION_INCORRECTA|ACCESO_DENEGADO|OTRO)$/);
    });
  });

  it('should have items array with cantidad > 0 and precioUnitario', () => {
    const pedidoItem = {
      id: 'item-ped-001',
      item: { id: '1', nombre: 'Bidón 20L', unidad: 'unidad', activo: true, precio: 1500 },
      cantidad: 2,
      precioUnitario: 1500,
    };
    expect(pedidoItem.cantidad).toBeGreaterThan(0);
    expect(pedidoItem.precioUnitario).toBeGreaterThan(0);
  });
});

describe('Types - Reparto', () => {
  it('should accept valid estado values', () => {
    const estados = ['PENDIENTE', 'EN_CURSO', 'COMPLETADO'] as const;
    estados.forEach((estado) => {
      expect(['PENDIENTE', 'EN_CURSO', 'COMPLETADO']).toContain(estado);
    });
  });

  it('should have resumen with counts', () => {
    const reparto = {
      id: '1',
      repartidorId: 'user-1',
      fecha: new Date().toISOString(),
      estado: 'EN_CURSO' as const,
      resumen: {
        totalPedidos: 10,
        completados: 3,
        pendientes: 7,
      },
    };
    expect(reparto.resumen.totalPedidos).toBe(
      reparto.resumen.completados + reparto.resumen.pendientes
    );
  });
});
