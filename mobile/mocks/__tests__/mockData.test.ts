import { describe, it, expect } from 'vitest';
import { MOCK_CLIENTES, MOCK_PEDIDOS, MOCK_REPARTO, MOCK_ITEMS, MOCK_MOTIVOS } from '@/mocks/mockData';

describe('Mock Data - Clientes', () => {
  it('should have at least one cliente', () => {
    expect(MOCK_CLIENTES.length).toBeGreaterThan(0);
  });

  it('each cliente should have required fields', () => {
    MOCK_CLIENTES.forEach((cliente) => {
      expect(cliente.id).toBeTruthy();
      expect(cliente.nombre).toBeTruthy();
      expect(cliente.apellido).toBeTruthy();
      expect(cliente.telefono).toBeTruthy();
      expect(cliente.domicilio).toBeDefined();
      expect(cliente.domicilio.calle).toBeTruthy();
      expect(cliente.domicilio.numero).toBeTruthy();
      expect(cliente.domicilio.latitud).toBeDefined();
      expect(cliente.domicilio.longitud).toBeDefined();
      expect(cliente.diaEntrega).toBeDefined();
      expect(cliente.horarioDesde).toBeTruthy();
      expect(cliente.horarioHasta).toBeTruthy();
    });
  });
});

describe('Mock Data - Items', () => {
  it('should have at least one item', () => {
    expect(MOCK_ITEMS.length).toBeGreaterThan(0);
  });

  it('each item should have required fields', () => {
    MOCK_ITEMS.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.nombre).toBeTruthy();
      expect(item.unidad).toBeTruthy();
      expect(typeof item.activo).toBe('boolean');
    });
  });
});

describe('Mock Data - Pedidos', () => {
  it('should have at least one pedido', () => {
    expect(MOCK_PEDIDOS.length).toBeGreaterThan(0);
  });

  it('each pedido should have valid estado', () => {
    const validEstados: string[] = ['PENDIENTE', 'EN_RUTA', 'ENTREGADO', 'NO_ENTREGADO', 'CANCELADO'];
    MOCK_PEDIDOS.forEach((pedido) => {
      expect(validEstados).toContain(pedido.estado);
      expect(pedido.cliente).toBeDefined();
      expect(pedido.items.length).toBeGreaterThan(0);
      expect(pedido.orden).toBeGreaterThan(0);
    });
  });

  it('should have mixed estados for testing', () => {
    const estados = MOCK_PEDIDOS.map((p) => p.estado);
    expect(estados).toContain('PENDIENTE');
    expect(estados).toContain('EN_RUTA');
    expect(estados).toContain('ENTREGADO');
    expect(estados).toContain('NO_ENTREGADO');
    expect(estados).toContain('CANCELADO');
  });
});

describe('Mock Data - Reparto', () => {
  it('should have required reparto fields', () => {
    expect(MOCK_REPARTO.id).toBeTruthy();
    expect(MOCK_REPARTO.repartidorId).toBeTruthy();
    expect(MOCK_REPARTO.fecha).toBeTruthy();
    expect(MOCK_REPARTO.estado).toBeDefined();
  });

  it('should have pedidos array', () => {
    expect(MOCK_REPARTO.pedidos).toBeDefined();
    expect(MOCK_REPARTO.pedidos!.length).toBeGreaterThan(0);
  });

  it('should have correct resumen counts', () => {
    const resumen = MOCK_REPARTO.resumen!;
    expect(resumen.totalPedidos).toBe(MOCK_REPARTO.pedidos!.length);
    const actualCompletados = MOCK_REPARTO.pedidos!.filter(
      (p) => p.estado === 'ENTREGADO' || p.estado === 'NO_ENTREGADO'
    ).length;
    const actualPendientes = MOCK_REPARTO.pedidos!.filter(
      (p) => p.estado === 'PENDIENTE' || p.estado === 'EN_RUTA'
    ).length;
    expect(resumen.completados).toBe(actualCompletados);
    expect(resumen.pendientes).toBe(actualPendientes);
  });
});

describe('Mock Data - Motivos', () => {
  it('should have all cancelacion motivos', () => {
    const values = MOCK_MOTIVOS.map((m) => m.value);
    expect(values).toContain('CLIENTE_AUSENTE');
    expect(values).toContain('DIRECCION_INCORRECTA');
    expect(values).toContain('ACCESO_DENEGADO');
    expect(values).toContain('OTRO');
  });

  it('each motivo should have label in Spanish', () => {
    MOCK_MOTIVOS.forEach((motivo) => {
      expect(motivo.label).toBeTruthy();
      expect(typeof motivo.label).toBe('string');
    });
  });
});
