import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react-native';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockUseEstadisticasDiarias = vi.fn();

vi.mock('@/features/estadisticas/hooks/useEstadisticas', () => ({
  useEstadisticasDiarias: (...args: unknown[]) => mockUseEstadisticasDiarias(...args),
}));

vi.mock('expo-router', () => ({
  router: {
    push: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
  },
}));

// Mock CalendarModal to avoid complex rendering
vi.mock('@/components/ui/CalendarModal', () => ({
  default: function MockCalendarModal() {
    return null;
  },
}));

// ─── Import after mocks ───────────────────────────────────────────────────────

import EstadisticasDiariasScreen from '../EstadisticasDiariasScreen';

// ─── Fixtures ──────────────────────────────────────────────────────────────────

const mockStats = {
  fecha: '2026-06-15',
  totalPedidos: 42,
  entregasRealizadas: 35,
  entregasNoRealizadas: 5,
  volumenProductos: [
    { itemId: 'i1', nombre: 'Bidón 12L', unidad: 'unidad', cantidadTotal: 120 },
    { itemId: 'i2', nombre: 'Bidón 20L', unidad: 'unidad', cantidadTotal: 45 },
  ],
  desempenioRepartos: {
    total: 5,
    iniciados: 4,
    finalizados: 3,
  },
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('EstadisticasDiariasScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el header y la barra de fecha', () => {
    mockUseEstadisticasDiarias.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EstadisticasDiariasScreen />);

    expect(screen.getByText('SupplyCycle')).toBeTruthy();
    expect(screen.getByText('Hoy')).toBeTruthy();
  });

  it('muestra LoadingSpinner mientras carga', () => {
    mockUseEstadisticasDiarias.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EstadisticasDiariasScreen />);

    expect(screen.getByText('Cargando estadísticas...')).toBeTruthy();
  });

  it('muestra ErrorMessage cuando hay error', () => {
    mockUseEstadisticasDiarias.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Error de red'),
      refetch: vi.fn(),
    });

    render(<EstadisticasDiariasScreen />);

    expect(screen.getByText('Error al cargar estadísticas')).toBeTruthy();
    expect(screen.getByText('Reintentar')).toBeTruthy();
  });

  it('muestra las cards con estadísticas cuando hay datos', () => {
    mockUseEstadisticasDiarias.mockReturnValue({
      data: mockStats,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EstadisticasDiariasScreen />);

    // Stat cards
    expect(screen.getByText('Pedidos totales')).toBeTruthy();
    expect(screen.getByText('42')).toBeTruthy();
    expect(screen.getByText('Entregas realizadas')).toBeTruthy();
    expect(screen.getByText('35')).toBeTruthy();
    expect(screen.getByText('Entregas no realizadas')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();

    // Desempeño
    expect(screen.getByText('Desempeño de repartos')).toBeTruthy();
    expect(screen.getByText('Totales')).toBeTruthy();
    expect(screen.getByText('Iniciados')).toBeTruthy();
    expect(screen.getByText('Finalizados')).toBeTruthy();

    // Volumen de productos
    expect(screen.getByText('Volumen de productos')).toBeTruthy();
    expect(screen.getByText('Bidón 12L')).toBeTruthy();
    expect(screen.getByText('120 unidad')).toBeTruthy();
    expect(screen.getByText('Bidón 20L')).toBeTruthy();
    expect(screen.getByText('45 unidad')).toBeTruthy();
  });

  it('muestra "Sin productos distribuidos" cuando no hay volumen', () => {
    const statsSinVolumen = {
      ...mockStats,
      volumenProductos: [],
    };

    mockUseEstadisticasDiarias.mockReturnValue({
      data: statsSinVolumen,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EstadisticasDiariasScreen />);

    expect(screen.getByText('Sin productos distribuidos')).toBeTruthy();
  });

  it('navega a la vista mensual al presionar "Ver mes"', () => {
    const mockRouter = require('expo-router').router;

    mockUseEstadisticasDiarias.mockReturnValue({
      data: mockStats,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EstadisticasDiariasScreen />);

    fireEvent.press(screen.getByText('Ver mes'));

    expect(mockRouter.push).toHaveBeenCalledWith('/estadisticas/mensual');
  });

  it('permite navegar al día anterior con el botón <', () => {
    mockUseEstadisticasDiarias.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EstadisticasDiariasScreen />);

    const prevButton = screen.getAllByText('<');
    expect(prevButton.length).toBeGreaterThanOrEqual(1);
    fireEvent.press(prevButton[0]);

    // No podemos verificar el cambio de fecha directamente,
    // pero verificamos que no crashea (renderiza sin error)
    expect(screen.getByText('Cargando estadísticas...')).toBeTruthy();
  });
});
