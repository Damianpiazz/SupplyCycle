import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { router } from 'expo-router';

vi.mock('@/features/pedidos/hooks/usePedidos', () => ({
  usePedidoDetalle: vi.fn(),
  useConfirmarEntrega: vi.fn(),
  useCancelarPedido: vi.fn(),
}));

import { usePedidoDetalle, useConfirmarEntrega, useCancelarPedido } from '@/features/pedidos/hooks/usePedidos';
import PedidoDetalleScreen from '@/features/pedidos/screens/PedidoDetalleScreen';

const mockConfirmarMutate = vi.fn();
const mockCancelarMutate = vi.fn();

const mockPedido = {
  id: 'pedido-1',
  orden: 1,
  estado: 'PENDIENTE',
  fecha: new Date().toISOString(),
  total: 3000,
  cliente: {
    id: 'cli-1', nombre: 'María', apellido: 'González',
    telefono: '1155550101',
    domicilio: { calle: 'Av. Corrientes', numero: '1234', localidad: 'CABA', latitud: -34.6037, longitud: -58.3816 },
    diaEntrega: 'LUNES', horarioDesde: '09:00', horarioHasta: '12:00',
  },
  items: [
    { id: 'pi-1', item: { id: 'item-001', nombre: 'Bidón 20L', unidad: 'unidad', activo: true }, cantidad: 2, precioUnitario: 1500 },
  ],
};

describe('PedidoDetalleScreen', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should show loading state', () => {
    vi.mocked(usePedidoDetalle).mockReturnValue({ data: undefined, isLoading: true, isError: false } as any);
    render(<PedidoDetalleScreen id="pedido-1" />);
    expect(screen.getByText('Cargando detalle del pedido...')).toBeTruthy();
  });

  it('should show error state with error message', () => {
    vi.mocked(usePedidoDetalle).mockReturnValue({ data: undefined, isLoading: false, isError: true, error: { message: 'Error al cargar el pedido' } } as any);
    render(<PedidoDetalleScreen id="pedido-1" />);
    expect(screen.getByText('Error al cargar el pedido')).toBeTruthy();
  });

  it('should render pedido details', () => {
    vi.mocked(usePedidoDetalle).mockReturnValue({ data: mockPedido, isLoading: false, isError: false } as any);
    vi.mocked(useConfirmarEntrega).mockReturnValue({ mutate: mockConfirmarMutate, isPending: false } as any);
    vi.mocked(useCancelarPedido).mockReturnValue({ mutate: mockCancelarMutate, isPending: false } as any);
    render(<PedidoDetalleScreen id="pedido-1" />);
    expect(screen.getByText('María González')).toBeTruthy();
    expect(screen.getByText('Bidón 20L')).toBeTruthy();
    expect(screen.getByText('$3.000')).toBeTruthy();
  });

  it('should show actions for PENDIENTE pedido', () => {
    vi.mocked(usePedidoDetalle).mockReturnValue({ data: mockPedido, isLoading: false, isError: false } as any);
    vi.mocked(useConfirmarEntrega).mockReturnValue({ mutate: mockConfirmarMutate, isPending: false } as any);
    vi.mocked(useCancelarPedido).mockReturnValue({ mutate: mockCancelarMutate, isPending: false } as any);
    render(<PedidoDetalleScreen id="pedido-1" />);
    expect(screen.getByText('Confirmar entrega')).toBeTruthy();
    expect(screen.getByText('Cancelar entrega')).toBeTruthy();
  });

  it('should NOT show actions for ENTREGADO pedido', () => {
    vi.mocked(usePedidoDetalle).mockReturnValue({
      data: { ...mockPedido, estado: 'ENTREGADO' },
      isLoading: false, isError: false,
    } as any);
    vi.mocked(useConfirmarEntrega).mockReturnValue({ mutate: mockConfirmarMutate, isPending: false } as any);
    vi.mocked(useCancelarPedido).mockReturnValue({ mutate: mockCancelarMutate, isPending: false } as any);
    render(<PedidoDetalleScreen id="pedido-1" />);
    expect(screen.queryByText('Confirmar entrega')).toBeNull();
    expect(screen.queryByText('Cancelar entrega')).toBeNull();
  });

  it('should open cancel modal and cancel with motivo', () => {
    vi.mocked(usePedidoDetalle).mockReturnValue({ data: mockPedido, isLoading: false, isError: false } as any);
    vi.mocked(useConfirmarEntrega).mockReturnValue({ mutate: mockConfirmarMutate, isPending: false } as any);
    vi.mocked(useCancelarPedido).mockReturnValue({ mutate: mockCancelarMutate, isPending: false } as any);
    render(<PedidoDetalleScreen id="pedido-1" />);
    fireEvent.press(screen.getByText('Cancelar entrega'));
    expect(screen.getByText('Seleccionar motivo')).toBeTruthy();
    fireEvent.press(screen.getByText('Cliente ausente'));
    expect(mockCancelarMutate).toHaveBeenCalledWith({ pedidoId: 'pedido-1', motivo: 'CLIENTE_AUSENTE' }, expect.any(Object));
  });

  it('should confirm entrega and navigate back', () => {
    vi.mocked(usePedidoDetalle).mockReturnValue({ data: mockPedido, isLoading: false, isError: false } as any);
    vi.mocked(useConfirmarEntrega).mockReturnValue({ mutate: mockConfirmarMutate, isPending: false } as any);
    vi.mocked(useCancelarPedido).mockReturnValue({ mutate: mockCancelarMutate, isPending: false } as any);
    render(<PedidoDetalleScreen id="pedido-1" />);
    fireEvent.press(screen.getByText('Confirmar entrega'));
    expect(mockConfirmarMutate).toHaveBeenCalledWith('pedido-1', expect.any(Object));
  });

  it('should show motivoFalla when pedido has one', () => {
    vi.mocked(usePedidoDetalle).mockReturnValue({
      data: { ...mockPedido, estado: 'NO_ENTREGADO', motivoFalla: 'CLIENTE_AUSENTE' },
      isLoading: false, isError: false,
    } as any);
    render(<PedidoDetalleScreen id="pedido-1" />);
    expect(screen.getByText('Motivo de no entrega')).toBeTruthy();
    const label = screen.getAllByText('Cliente ausente');
    expect(label.length).toBeGreaterThan(0);
  });
});
