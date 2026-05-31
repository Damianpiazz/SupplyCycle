import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react-native';

vi.mock('@/features/pedidos/hooks/usePedidos', () => ({
  usePedidosDelDia: vi.fn(),
}));

import { usePedidosDelDia } from '@/features/pedidos/hooks/usePedidos';
import { router } from 'expo-router';
import MapaScreen from '@/features/mapa/screens/MapaScreen';

const mockPedido = {
  id: 'pedido-1',
  orden: 1,
  estado: 'PENDIENTE',
  fecha: new Date().toISOString(),
  cliente: {
    id: 'cli-1', nombre: 'María', apellido: 'González',
    telefono: '1155550101',
    domicilio: { calle: 'Av. Corrientes', numero: '1234', localidad: 'CABA', latitud: -34.6037, longitud: -58.3816 },
    diaEntrega: 'LUNES', horarioDesde: '09:00', horarioHasta: '12:00',
  },
  items: [{ id: 'pi-1', item: { id: 'item-001', nombre: 'Bidón 20L', unidad: 'unidad', activo: true }, cantidad: 2 }],
};

describe('MapaScreen', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should show loading state', () => {
    vi.mocked(usePedidosDelDia).mockReturnValue({ data: undefined, isLoading: true } as any);
    render(<MapaScreen />);
    expect(screen.getByText('Cargando mapa...')).toBeTruthy();
  });

  it('should show error state', () => {
    vi.mocked(usePedidosDelDia).mockReturnValue({ data: undefined, isLoading: false, isError: true, error: { message: 'Error al cargar el mapa' } } as any);
    render(<MapaScreen />);
    expect(screen.getByText('Error al cargar el mapa')).toBeTruthy();
  });

  it('should render map placeholder and markers', () => {
    vi.mocked(usePedidosDelDia).mockReturnValue({ data: [mockPedido], isLoading: false, isError: false } as any);
    render(<MapaScreen />);
    expect(screen.getByText('Mapa de entregas')).toBeTruthy();
    expect(screen.getByText('1 puntos de entrega')).toBeTruthy();
    expect(screen.getByText('María')).toBeTruthy();
  });

  it('should show info card when marker is pressed', () => {
    vi.mocked(usePedidosDelDia).mockReturnValue({ data: [mockPedido], isLoading: false, isError: false } as any);
    render(<MapaScreen />);
    fireEvent.press(screen.getByText('María'));
    expect(screen.getByText('Ver detalle')).toBeTruthy();
  });

  it('should navigate to detalle when Ver detalle is pressed', () => {
    vi.mocked(usePedidosDelDia).mockReturnValue({ data: [mockPedido], isLoading: false, isError: false } as any);
    render(<MapaScreen />);
    fireEvent.press(screen.getByText('María'));
    fireEvent.press(screen.getByText('Ver detalle'));
    expect(router.push).toHaveBeenCalledWith('/mapa/pedido-1');
  });
});
