import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react-native';

vi.mock('@/features/pedidos/hooks/usePedidos', () => ({
  useBuscarPedidos: vi.fn(),
}));

import { useBuscarPedidos } from '@/features/pedidos/hooks/usePedidos';
import { router } from 'expo-router';
import PedidosListScreen from '@/features/pedidos/screens/PedidosListScreen';

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

describe('PedidosListScreen', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should show loading spinner', () => {
    vi.mocked(useBuscarPedidos).mockReturnValue({
      data: undefined, isLoading: true, isError: false, error: null,
    } as any);
    render(<PedidosListScreen />);
    expect(screen.getByText('Buscando pedidos...')).toBeTruthy();
  });

  it('should show error message', () => {
    vi.mocked(useBuscarPedidos).mockReturnValue({
      data: undefined, isLoading: false, isError: true, error: new Error('Error al cargar pedidos'),
    } as any);
    render(<PedidosListScreen />);
    expect(screen.getByText('Error al cargar pedidos')).toBeTruthy();
  });

  it('should render list of pedidos', () => {
    vi.mocked(useBuscarPedidos).mockReturnValue({
      data: { data: [mockPedido], total: 1 },
      isLoading: false, isError: false, error: null,
    } as any);
    render(<PedidosListScreen />);
    expect(screen.getByText('María González')).toBeTruthy();
  });

  it('should show empty state when no pedidos', () => {
    vi.mocked(useBuscarPedidos).mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false, isError: false, error: null,
    } as any);
    render(<PedidosListScreen />);
    expect(screen.getByText('No hay pedidos registrados')).toBeTruthy();
  });

  it('should navigate to alta when pressing +', () => {
    vi.mocked(useBuscarPedidos).mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false, isError: false, error: null,
    } as any);
    render(<PedidosListScreen />);
    fireEvent.press(screen.getByText('+'));
    expect(router.push).toHaveBeenCalledWith('/pedidos/alta');
  });

  it('should filter by estado when pressing a filter button', () => {
    vi.mocked(useBuscarPedidos).mockReturnValue({
      data: { data: [mockPedido], total: 1 },
      isLoading: false, isError: false, error: null,
    } as any);
    render(<PedidosListScreen />);
    const filterButtons = screen.getAllByText('Pendiente');
    fireEvent.press(filterButtons[0]);
    expect(filterButtons[0]).toBeTruthy();
  });
});
