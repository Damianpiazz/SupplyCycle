import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

vi.mock('@/features/pedidos/hooks/usePedidos', () => ({
  useCrearPedido: vi.fn(),
}));

vi.mock('@/services/clientes', () => ({
  getClientesRequest: vi.fn(),
}));

vi.mock('@/services/items', () => ({
  getItemsRequest: vi.fn(),
}));

vi.mock('@/services/repartos', () => ({
  getRepartosDisponiblesRequest: vi.fn(),
}));

// Mock fallback services to reject so the error path is hit
vi.mock('@/mocks/services/clientes.mock', () => ({
  mockGetClientesRequest: vi.fn(() => Promise.reject(new Error('mock fail'))),
}));
vi.mock('@/mocks/services/items.mock', () => ({
  mockGetItemsRequest: vi.fn(() => Promise.reject(new Error('mock fail'))),
}));
vi.mock('@/mocks/services/repartos.mock', () => ({
  mockGetRepartosDisponiblesRequest: vi.fn(() => Promise.reject(new Error('mock fail'))),
}));

import { useCrearPedido } from '@/features/pedidos/hooks/usePedidos';
import { getClientesRequest } from '@/services/clientes';
import { getItemsRequest } from '@/services/items';
import { getRepartosDisponiblesRequest } from '@/services/repartos';
import PedidoAltaScreen from '@/features/pedidos/screens/PedidoAltaScreen';

const mockClientes = [
  { id: 'cli-1', nombre: 'María', apellido: 'González', telefono: '1155550101', domicilio: { calle: 'Av. Corrientes', numero: '1234', localidad: 'CABA', latitud: -34.6037, longitud: -58.3816 }, diaEntrega: 'LUNES', horarioDesde: '09:00', horarioHasta: '12:00' },
];

const mockItems = [
  { id: 'item-001', nombre: 'Bidón 20L', unidad: 'unidad', precio: 1500, activo: true },
  { id: 'item-002', nombre: 'Bidón 12L', unidad: 'unidad', precio: 900, activo: true },
];

const mockRepartos = [
  { id: 'reparto-1', repartidorId: 'user-1', fecha: new Date().toISOString(), estado: 'EN_CURSO' },
];

const mockCrearPedidoMutate = vi.fn();

describe('PedidoAltaScreen', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should show loading state while fetching data', () => {
    vi.mocked(useCrearPedido).mockReturnValue({ mutate: mockCrearPedidoMutate, isPending: false } as any);
    (getClientesRequest as any).mockImplementation(() => new Promise(() => {}));
    (getItemsRequest as any).mockImplementation(() => new Promise(() => {}));
    (getRepartosDisponiblesRequest as any).mockImplementation(() => new Promise(() => {}));
    render(<PedidoAltaScreen />);
    expect(screen.getByText('Cargando datos...')).toBeTruthy();
  });

  it('should show error state when data loading fails', async () => {
    vi.mocked(useCrearPedido).mockReturnValue({ mutate: mockCrearPedidoMutate, isPending: false } as any);
    (getClientesRequest as any).mockRejectedValue(new Error('fail'));
    (getItemsRequest as any).mockRejectedValue(new Error('fail'));
    (getRepartosDisponiblesRequest as any).mockRejectedValue(new Error('fail'));
    render(<PedidoAltaScreen />);
    await waitFor(() => {
      expect(screen.getByText('Error al cargar datos iniciales')).toBeTruthy();
    });
  });

  it('should render form with items when data loads', async () => {
    vi.mocked(useCrearPedido).mockReturnValue({ mutate: mockCrearPedidoMutate, isPending: false } as any);
    (getClientesRequest as any).mockResolvedValue(mockClientes);
    (getItemsRequest as any).mockResolvedValue(mockItems);
    (getRepartosDisponiblesRequest as any).mockResolvedValue(mockRepartos);
    render(<PedidoAltaScreen />);
    await waitFor(() => {
      expect(screen.getByText('Items del pedido')).toBeTruthy();
      expect(screen.getByText('Bidón 20L')).toBeTruthy();
      expect(screen.getByText('Bidón 12L')).toBeTruthy();
    });
  });

  it('should select cliente via modal', async () => {
    vi.mocked(useCrearPedido).mockReturnValue({ mutate: mockCrearPedidoMutate, isPending: false } as any);
    (getClientesRequest as any).mockResolvedValue(mockClientes);
    (getItemsRequest as any).mockResolvedValue(mockItems);
    (getRepartosDisponiblesRequest as any).mockResolvedValue(mockRepartos);
    render(<PedidoAltaScreen />);
    await waitFor(() => {
      expect(screen.getByText('Seleccionar cliente...')).toBeTruthy();
    });
    fireEvent.press(screen.getByText('Seleccionar cliente...'));
    expect(screen.getByText('Seleccionar Cliente')).toBeTruthy();
    fireEvent.press(screen.getByText('María González'));
    expect(screen.getAllByText('María González').length).toBeGreaterThan(0);
  });

  it('should show total estimado and create button', async () => {
    vi.mocked(useCrearPedido).mockReturnValue({ mutate: mockCrearPedidoMutate, isPending: false } as any);
    (getClientesRequest as any).mockResolvedValue(mockClientes);
    (getItemsRequest as any).mockResolvedValue(mockItems);
    (getRepartosDisponiblesRequest as any).mockResolvedValue(mockRepartos);
    render(<PedidoAltaScreen />);
    await waitFor(() => {
      expect(screen.getByText('Crear Pedido')).toBeTruthy();
    });
  });
});
