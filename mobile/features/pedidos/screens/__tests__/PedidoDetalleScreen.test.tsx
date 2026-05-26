import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { router } from 'expo-router';

vi.mock('@/features/pedidos/hooks/usePedidos', () => ({
  usePedidoDetalle: vi.fn(),
  useConfirmarEntrega: vi.fn(),
  useCancelarPedido: vi.fn(),
  useQuitarItem: vi.fn(() => ({ mutateAsync: vi.fn().mockResolvedValue(undefined) })),
  useAgregarItem: vi.fn(() => ({ mutateAsync: vi.fn().mockResolvedValue(undefined) })),
  useActualizarCantidadItem: vi.fn(() => ({ mutateAsync: vi.fn().mockResolvedValue(undefined) })),
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ setQueryData: vi.fn() }),
}));

import {
  usePedidoDetalle,
  useConfirmarEntrega,
  useCancelarPedido,
} from '@/features/pedidos/hooks/usePedidos';
import PedidoDetalleScreen from '@/features/pedidos/screens/PedidoDetalleScreen';

const mockConfirmarMutate = vi.fn();
const mockCancelarMutate = vi.fn();

const mockPedido = {
  id: 'pedido-1',
  orden: 1,
  estado: 'PENDIENTE',
  fecha: new Date().toISOString(),
  motivoFalla: null,
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

function renderScreen(overrides = {}) {
  vi.mocked(usePedidoDetalle).mockReturnValue({ data: mockPedido, isLoading: false, isError: false, ...overrides } as any);
  vi.mocked(useConfirmarEntrega).mockReturnValue({ mutate: mockConfirmarMutate, isPending: false } as any);
  vi.mocked(useCancelarPedido).mockReturnValue({ mutate: mockCancelarMutate, isPending: false } as any);
  return render(<PedidoDetalleScreen id="pedido-1" />);
}

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
    renderScreen();
    expect(screen.getByText('María González')).toBeTruthy();
    expect(screen.getByText('Bidón 20L')).toBeTruthy();
    expect(screen.getByText('$3.000')).toBeTruthy();
  });

  it('should show actions for PENDIENTE pedido', () => {
    renderScreen();
    expect(screen.getByText('Confirmar entrega')).toBeTruthy();
    expect(screen.getByText('Cancelar entrega')).toBeTruthy();
  });

  it('should NOT show actions for ENTREGADO pedido', () => {
    renderScreen({ data: { ...mockPedido, estado: 'ENTREGADO' } });
    expect(screen.queryByText('Confirmar entrega')).toBeNull();
    expect(screen.queryByText('Cancelar entrega')).toBeNull();
  });

  it('should open cancel modal and cancel with motivo', () => {
    renderScreen();
    fireEvent.press(screen.getByText('Cancelar entrega'));
    expect(screen.getByText('Seleccionar motivo')).toBeTruthy();
    fireEvent.press(screen.getByText('Cliente ausente'));
    expect(mockCancelarMutate).toHaveBeenCalledWith({ pedidoId: 'pedido-1', motivo: 'CLIENTE_AUSENTE' }, expect.any(Object));
  });

  it('should confirm entrega and navigate back', () => {
    renderScreen();
    fireEvent.press(screen.getByText('Confirmar entrega'));
    expect(mockConfirmarMutate).toHaveBeenCalledWith('pedido-1', expect.any(Object));
  });

  it('should show motivoFalla when pedido has one', () => {
    renderScreen({ data: { ...mockPedido, estado: 'NO_ENTREGADO', motivoFalla: 'CLIENTE_AUSENTE' } });
    expect(screen.getByText('Motivo de no entrega')).toBeTruthy();
    const label = screen.getAllByText('Cliente ausente');
    expect(label.length).toBeGreaterThan(0);
  });

  it('should enter edit mode and show guardar/cancelar buttons', () => {
    renderScreen();
    expect(screen.getByText('Editar items')).toBeTruthy();
    fireEvent.press(screen.getByText('Editar items'));
    expect(screen.queryByText('Editar items')).toBeNull();
    expect(screen.getByText('Guardar cambios')).toBeTruthy();
    expect(screen.getByText('Cancelar')).toBeTruthy();
  });

  it('should change item quantity via stepper in edit mode', () => {
    renderScreen();
    fireEvent.press(screen.getByText('Editar items'));
    expect(screen.getByText('2')).toBeTruthy();
    fireEvent.press(screen.getByText('+'));
    expect(screen.getByText('3')).toBeTruthy();
    fireEvent.press(screen.getByText('−'));
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('should delete item in edit mode', () => {
    renderScreen();
    fireEvent.press(screen.getByText('Editar items'));
    expect(screen.getByText('Bidón 20L')).toBeTruthy();
    fireEvent.press(screen.getByText('Eliminar'));
    expect(screen.getByText('No hay items en el pedido')).toBeTruthy();
  });

  it('should open add item modal', () => {
    renderScreen();
    fireEvent.press(screen.getByText('Editar items'));
    fireEvent.press(screen.getByText('+ Agregar item'));
    expect(screen.getByText('Agregar item')).toBeTruthy();
  });

  it('should call guardarCambios and show loading state', () => {
    renderScreen();
    fireEvent.press(screen.getByText('Editar items'));
    fireEvent.press(screen.getByText('Guardar cambios'));
    expect(screen.getByText('Confirmar cambios')).toBeTruthy();
    expect(screen.getByText('¿Estás seguro de que querés modificar los items del pedido?')).toBeTruthy();
    fireEvent.press(screen.getByText('Confirmar'));
    expect(screen.getAllByText('Guardando...').length).toBeGreaterThan(0);
  });
});
