import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react-native';

vi.mock('@/features/repartos/hooks/useReparto', () => ({
  useReparto: vi.fn(),
}));

import { useReparto } from '@/features/repartos/hooks/useReparto';
import RepartosListScreen from '@/features/repartos/screens/RepartosListScreen';

const mockPedido = {
  id: 'pedido-1',
  orden: 1,
  estado: 'PENDIENTE',
  fecha: new Date().toISOString(),
  cliente: {
    id: 'cli-1', nombre: 'María', apellido: 'González',
    telefono: '1155550101',
    activo: true,
    domicilios: [{
      id: 'dom-cliente-1',
      calle: 'Av. Corrientes',
      numero: '1234',
      localidad: 'CABA',
      latitud: -34.6037,
      longitud: -58.3816,
      principal: true,
      dias: [{
        id: 'dia-1',
        nombre: 'LUNES',
        horarios: [{ id: 'hor-1', inicio: '09:00', fin: '12:00' }],
      }],
    }],
  },
  domicilio: {
    id: 'dom-pedido-1',
    calle: 'Av. Corrientes',
    numero: '1234',
    localidad: 'CABA',
    latitud: -34.6037,
    longitud: -58.3816,
    principal: true,
    dias: [{
      id: 'dia-1',
      nombre: 'LUNES',
      horarios: [{ id: 'hor-1', inicio: '09:00', fin: '12:00' }],
    }],
  },
  items: [{ id: 'pi-1', item: { id: 'item-001', nombre: 'Bidón 20L', unidad: 'unidad', activo: true }, cantidad: 2 }],
};

describe('RepartosListScreen', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should show loading state', () => {
    vi.mocked(useReparto).mockReturnValue({ data: undefined, isLoading: true } as any);
    render(<RepartosListScreen />);
    expect(screen.getByText('Cargando entregas...')).toBeTruthy();
  });

  it('should show error state with retry', () => {
    vi.mocked(useReparto).mockReturnValue({ data: undefined, isLoading: false, isError: true, error: { message: 'Error al cargar las entregas' } } as any);
    render(<RepartosListScreen />);
    expect(screen.getByText('Error al cargar las entregas')).toBeTruthy();
  });

  it('should render list of pedidos', () => {
    vi.mocked(useReparto).mockReturnValue({ data: { pedidos: [mockPedido] }, isLoading: false, isError: false } as any);
    render(<RepartosListScreen />);
    expect(screen.getByText('María González')).toBeTruthy();
  });

  it('should show empty state when no pedidos', () => {
    vi.mocked(useReparto).mockReturnValue({ data: { pedidos: [] }, isLoading: false, isError: false } as any);
    render(<RepartosListScreen />);
    expect(screen.getByText('No hay entregas para mostrar')).toBeTruthy();
  });

  it('should filter list when pressing a filter button', () => {
    vi.mocked(useReparto).mockReturnValue({
      data: { pedidos: [mockPedido, { ...mockPedido, id: 'pedido-2', estado: 'ENTREGADO' }] },
      isLoading: false, isError: false,
    } as any);
    render(<RepartosListScreen />);
    expect(screen.getAllByText('María González').length).toBe(2);
    fireEvent.press(screen.getByText('Entregados'));
    expect(screen.getAllByText('María González').length).toBe(1);
  });
});
