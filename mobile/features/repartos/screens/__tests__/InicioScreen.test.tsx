import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react-native';

// Mock hooks
vi.mock('@/features/repartos/hooks/useReparto', () => ({
  useReparto: vi.fn(),
  useIniciarReparto: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

vi.mock('@/features/pedidos/hooks/usePedidos', () => ({
  useConfirmarEntrega: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useIniciarEntrega: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useCancelarPedido: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  usePedidosDelDia: vi.fn(),
  usePedidoDetalle: vi.fn(),
  useBuscarPedidos: vi.fn(),
  useCrearPedido: vi.fn(),
  useAgregarItem: vi.fn(),
  useQuitarItem: vi.fn(),
  useActualizarCantidadItem: vi.fn(),
}));

import { useReparto } from '@/features/repartos/hooks/useReparto';
import InicioScreen from '@/features/repartos/screens/InicioScreen';

const mockPedido = {
  id: 'pedido-1',
  orden: 1,
  estado: 'PENDIENTE',
  fecha: new Date().toISOString(),
  cliente: {
    id: 'cli-1',
    nombre: 'María',
    apellido: 'González',
    telefono: '1155550101',
    domicilio: {
      calle: 'Av. Corrientes',
      numero: '1234',
      localidad: 'CABA',
      latitud: -34.6037,
      longitud: -58.3816,
    },
    diaEntrega: 'LUNES',
    horarioDesde: '09:00',
    horarioHasta: '12:00',
    observaciones: 'Timbre: 3A',
  },
  items: [
    { id: 'pi-1', item: { id: 'item-001', nombre: 'Bidón 20L', unidad: 'unidad', activo: true }, cantidad: 2 },
  ],
};

describe('InicioScreen', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should show loading spinner when loading', () => {
    vi.mocked(useReparto).mockReturnValue({
      data: undefined, isLoading: true, isError: false, error: null,
    } as any);
    render(<InicioScreen />);
    expect(screen.getByText('Cargando reparto...')).toBeTruthy();
  });

  it('should show error message with retry when error', () => {
    vi.mocked(useReparto).mockReturnValue({
      data: undefined, isLoading: false, isError: true, error: new Error('Error al cargar el reparto'),
    } as any);
    render(<InicioScreen />);
    expect(screen.getByText('Error al cargar el reparto')).toBeTruthy();
  });

  it('should show empty state when no reparto', () => {
    vi.mocked(useReparto).mockReturnValue({
      data: undefined, isLoading: false, isError: false, error: null,
    } as any);
    render(<InicioScreen />);
    expect(screen.getByText('No hay repartos asignados para hoy')).toBeTruthy();
  });

  it('should show progress bar and next delivery with pedidos', () => {
    vi.mocked(useReparto).mockReturnValue({
      data: {
        id: 'reparto-1',
        repartidorId: 'user-1',
        fecha: new Date().toISOString(),
        estado: 'EN_CURSO',
        pedidos: [
          mockPedido,
          { ...mockPedido, id: 'pedido-2', orden: 2, estado: 'ENTREGADO' },
        ],
        resumen: { totalPedidos: 2, completados: 1, pendientes: 1 },
      },
      isLoading: false, isError: false, error: null,
    } as any);
    render(<InicioScreen />);
    expect(screen.getByText('Progreso del día')).toBeTruthy();
    expect(screen.getByText('1 de 2 entregas')).toBeTruthy();
    expect(screen.getByText('María González')).toBeTruthy();
  });

  it('should show all completed message when no pending deliveries', () => {
    vi.mocked(useReparto).mockReturnValue({
      data: {
        id: 'reparto-1',
        repartidorId: 'user-1',
        fecha: new Date().toISOString(),
        estado: 'COMPLETADO',
        pedidos: [
          { ...mockPedido, estado: 'ENTREGADO' },
        ],
        resumen: { totalPedidos: 1, completados: 1, pendientes: 0 },
      },
      isLoading: false, isError: false, error: null,
    } as any);
    render(<InicioScreen />);
    expect(screen.getByText('¡Todas las entregas están completadas!')).toBeTruthy();
  });
});
