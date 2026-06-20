import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

vi.mock('@/features/pedidos/hooks/usePedidos', () => ({
  useCrearPedido: vi.fn(),
}));

vi.mock('@/features/clientes/services/clienteService', () => ({
  listClientesRequest: vi.fn(),
}));

vi.mock('@/services/items', () => ({
  getItemsRequest: vi.fn(),
}));

vi.mock('@/services/repartos', () => ({
  getRepartosDisponiblesRequest: vi.fn(),
}));

const mockShowToast = vi.fn();
vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

import { useCrearPedido } from '@/features/pedidos/hooks/usePedidos';
import { listClientesRequest } from '@/features/clientes/services/clienteService';
import { getItemsRequest } from '@/services/items';
import { getRepartosDisponiblesRequest } from '@/services/repartos';
import PedidoAltaScreen from '@/features/pedidos/screens/PedidoAltaScreen';

const mockClientes = [
  { id: 'cli-1', nombre: 'María', apellido: 'González', telefono: '1155550101', activo: true, domicilios: [{ id: 'dom-1', calle: 'Av. Corrientes', numero: '1234', localidad: 'CABA', latitud: -34.6037, longitud: -58.3816, principal: true, dias: [{ id: 'dia-1', nombre: 'LUNES', horarios: [{ id: 'hor-1', inicio: '09:00', fin: '12:00' }] }] }] },
];

const mockItems = [
  { id: 'item-001', nombre: 'Bidón 20L', unidad: 'unidad', precio: 1500, activo: true },
  { id: 'item-002', nombre: 'Bidón 12L', unidad: 'unidad', precio: 900, activo: true },
];

const mockRepartos = [
  { id: 'reparto-1', repartidorId: 'user-1', fecha: new Date().toISOString(), estado: 'EN_CURSO' },
];

const mockCrearPedidoMutate = vi.fn();

async function loadData() {
  vi.mocked(useCrearPedido).mockReturnValue({ mutate: mockCrearPedidoMutate, isPending: false } as any);
  (listClientesRequest as any).mockResolvedValue(mockClientes);
  (getItemsRequest as any).mockResolvedValue(mockItems);
  (getRepartosDisponiblesRequest as any).mockResolvedValue(mockRepartos);
  render(<PedidoAltaScreen />);
  await waitFor(() => {
    expect(screen.getByText('Items del pedido')).toBeTruthy();
  });
}

describe('PedidoAltaScreen', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should show loading state while fetching data', () => {
    vi.mocked(useCrearPedido).mockReturnValue({ mutate: mockCrearPedidoMutate, isPending: false } as any);
    (listClientesRequest as any).mockImplementation(() => new Promise(() => {}));
    (getItemsRequest as any).mockImplementation(() => new Promise(() => {}));
    (getRepartosDisponiblesRequest as any).mockImplementation(() => new Promise(() => {}));
    render(<PedidoAltaScreen />);
    expect(screen.getByText('Cargando datos...')).toBeTruthy();
  });

  it('should show error state when data loading fails', async () => {
    vi.mocked(useCrearPedido).mockReturnValue({ mutate: mockCrearPedidoMutate, isPending: false } as any);
    (listClientesRequest as any).mockRejectedValue(new Error('fail'));
    (getItemsRequest as any).mockRejectedValue(new Error('fail'));
    (getRepartosDisponiblesRequest as any).mockRejectedValue(new Error('fail'));
    render(<PedidoAltaScreen />);
    await waitFor(() => {
      expect(screen.getByText('Error al cargar datos iniciales')).toBeTruthy();
    });
  });

  it('should render form with items when data loads', async () => {
    await loadData();
    expect(screen.getByText('Bidón 20L')).toBeTruthy();
    expect(screen.getByText('Bidón 12L')).toBeTruthy();
  });

  it('should select cliente via modal', async () => {
    await loadData();
    expect(screen.getByText('Seleccionar cliente...')).toBeTruthy();
    fireEvent.press(screen.getByText('Seleccionar cliente...'));
    expect(screen.getByText('Seleccionar Cliente')).toBeTruthy();
    fireEvent.press(screen.getByText('María González'));
    expect(screen.getAllByText('María González').length).toBeGreaterThan(0);
  });

  it('should show total estimado and create button', async () => {
    await loadData();
    expect(screen.getByText('Crear Pedido')).toBeTruthy();
  });

  it('should show validation toast when no cliente selected on submit', async () => {
    await loadData();
    fireEvent.press(screen.getByText('Crear Pedido'));
    expect(mockShowToast).toHaveBeenCalledWith('Seleccioná un cliente', 'warning');
  });

  it('should toggle item selection and calculate total estimado', async () => {
    await loadData();
    const agregarButtons = screen.getAllByText('Agregar');
    fireEvent.press(agregarButtons[0]);
    expect(screen.getByText('$1.500')).toBeTruthy();
    const stepperMinus = screen.getAllByText('−');
    const stepperPlus = screen.getAllByText('+');
    expect(stepperMinus.length).toBeGreaterThan(0);
    expect(stepperPlus.length).toBeGreaterThan(0);
  });

  it('should call crearPedido mutate with correct payload on submit', async () => {
    await loadData();
    fireEvent.press(screen.getByText('Seleccionar cliente...'));
    fireEvent.press(screen.getByText('María González'));
    await waitFor(() => expect(screen.getByText('Seleccionar domicilio...')).toBeTruthy());
    fireEvent.press(screen.getByText('Seleccionar domicilio...'));
    fireEvent.press(screen.getByText('Av. Corrientes 1234, CABA'));
    const agregarButtons = screen.getAllByText('Agregar');
    fireEvent.press(agregarButtons[0]);
    fireEvent.press(screen.getByText('Crear Pedido'));
    expect(mockCrearPedidoMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        clienteId: 'cli-1',
        items: [{ itemId: 'item-001', cantidad: 1 }],
      }),
      expect.any(Object)
    );
  });

  it('should show error toast when crearPedido fails', async () => {
    const mockMutate = vi.fn((_payload, options) => options?.onError?.(new Error('Error del servidor')));
    vi.mocked(useCrearPedido).mockReturnValue({ mutate: mockMutate, isPending: false } as any);
    (listClientesRequest as any).mockResolvedValue(mockClientes);
    (getItemsRequest as any).mockResolvedValue(mockItems);
    (getRepartosDisponiblesRequest as any).mockResolvedValue(mockRepartos);
    render(<PedidoAltaScreen />);
    await waitFor(() => expect(screen.getByText('Seleccionar cliente...')).toBeTruthy());
    fireEvent.press(screen.getByText('Seleccionar cliente...'));
    fireEvent.press(screen.getByText('María González'));
    await waitFor(() => expect(screen.getByText('Seleccionar domicilio...')).toBeTruthy());
    fireEvent.press(screen.getByText('Seleccionar domicilio...'));
    fireEvent.press(screen.getByText('Av. Corrientes 1234, CABA'));
    const agregarButtons = screen.getAllByText('Agregar');
    fireEvent.press(agregarButtons[0]);
    fireEvent.press(screen.getByText('Crear Pedido'));
    expect(mockShowToast).toHaveBeenCalledWith('Error del servidor', 'error');
  });
});
