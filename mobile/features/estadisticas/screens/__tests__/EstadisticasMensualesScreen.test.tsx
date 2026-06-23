import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react-native';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockUseEstadisticasMensuales = vi.fn();

vi.mock('@/features/estadisticas/hooks/useEstadisticas', () => ({
  useEstadisticasMensuales: (...args: unknown[]) => mockUseEstadisticasMensuales(...args),
}));

vi.mock('expo-router', () => ({
  router: {
    push: vi.fn(),
    back: vi.fn(),
    replace: vi.fn(),
  },
}));

// ─── Import after mocks ───────────────────────────────────────────────────────

import EstadisticasMensualesScreen from '../EstadisticasMensualesScreen';

// ─── Fixtures ──────────────────────────────────────────────────────────────────

const mockStats = {
  anio: 2026,
  mes: 6,
  totalPedidos: 180,
  entregasRealizadas: 150,
  entregasNoRealizadas: 20,
  totalRepartosIniciados: 25,
  totalRepartosFinalizados: 22,
  dias: [
    { dia: 1, totalPedidos: 8, entregasRealizadas: 7, entregasNoRealizadas: 1 },
    { dia: 2, totalPedidos: 6, entregasRealizadas: 5, entregasNoRealizadas: 0 },
    { dia: 3, totalPedidos: 10, entregasRealizadas: 8, entregasNoRealizadas: 2 },
  ],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('EstadisticasMensualesScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el header y la navegación de mes', () => {
    mockUseEstadisticasMensuales.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EstadisticasMensualesScreen />);

    expect(screen.getByText('SupplyCycle')).toBeTruthy();
    expect(screen.getByText('Junio 2026')).toBeTruthy();
    expect(screen.getByLabelText('Mes anterior')).toBeTruthy();
    expect(screen.getByLabelText('Mes siguiente')).toBeTruthy();
  });

  it('muestra LoadingSpinner mientras carga', () => {
    mockUseEstadisticasMensuales.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EstadisticasMensualesScreen />);

    expect(screen.getByText('Cargando estadísticas mensuales...')).toBeTruthy();
  });

  it('muestra ErrorMessage cuando hay error', () => {
    mockUseEstadisticasMensuales.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Error de conexión'),
      refetch: vi.fn(),
    });

    render(<EstadisticasMensualesScreen />);

    expect(screen.getByText('Error al cargar estadísticas mensuales')).toBeTruthy();
    expect(screen.getByText('Reintentar')).toBeTruthy();
  });

  it('llama a refetch al presionar Reintentar', () => {
    const refetchMock = vi.fn();
    mockUseEstadisticasMensuales.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Error'),
      refetch: refetchMock,
    });

    render(<EstadisticasMensualesScreen />);

    fireEvent.press(screen.getByText('Reintentar'));
    expect(refetchMock).toHaveBeenCalledTimes(1);
  });

  it('muestra el resumen del mes con los totales cuando hay datos', () => {
    mockUseEstadisticasMensuales.mockReturnValue({
      data: mockStats,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EstadisticasMensualesScreen />);

    // Título del resumen
    expect(screen.getByText('Resumen del mes')).toBeTruthy();

    // Métricas del resumen
    expect(screen.getByText('180')).toBeTruthy();
    expect(screen.getByText('Pedidos')).toBeTruthy();
    expect(screen.getByText('150')).toBeTruthy();
    expect(screen.getByText('Entregados')).toBeTruthy();
    expect(screen.getByText('20')).toBeTruthy();
    expect(screen.getByText('No entregados')).toBeTruthy();
    expect(screen.getByText('25')).toBeTruthy();
    expect(screen.getByText('Rep. iniciados')).toBeTruthy();
    expect(screen.getByText('22')).toBeTruthy();
    expect(screen.getByText('Rep. finalizados')).toBeTruthy();
  });

  it('muestra la tabla con los días del mes', () => {
    mockUseEstadisticasMensuales.mockReturnValue({
      data: mockStats,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EstadisticasMensualesScreen />);

    // Encabezados de la tabla
    expect(screen.getByText('Día')).toBeTruthy();
    expect(screen.getByText('Pedidos')).toBeTruthy();
    expect(screen.getByText('Entreg.')).toBeTruthy();
    expect(screen.getByText('Fallidos')).toBeTruthy();

    // Filas de datos
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('8')).toBeTruthy();
    expect(screen.getByText('7')).toBeTruthy();
    expect(screen.getByText('6')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('10')).toBeTruthy();
  });

  it('navega al mes anterior con el botón <', () => {
    mockUseEstadisticasMensuales.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EstadisticasMensualesScreen />);

    // Inicialmente Junio 2026
    expect(screen.getByText('Junio 2026')).toBeTruthy();

    // Al presionar < debería ir a Mayo 2026
    const prevButton = screen.getByLabelText('Mes anterior');
    fireEvent.press(prevButton);
    expect(screen.getByText('Mayo 2026')).toBeTruthy();
  });

  it('navega al mes siguiente con el botón >', () => {
    mockUseEstadisticasMensuales.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EstadisticasMensualesScreen />);

    // Al presionar > debería ir a Julio 2026
    const nextButton = screen.getByLabelText('Mes siguiente');
    fireEvent.press(nextButton);
    expect(screen.getByText('Julio 2026')).toBeTruthy();
  });

  it('cambia de año al navegar desde Enero a Diciembre', () => {
    // Forzamos que el estado inicial sea Enero 2026
    // No podemos mockear useState directamente, pero podemos
    // verificar que la navegación除夕 cruza el límite del año
    // correctamente si presionamos < suficiente veces
    mockUseEstadisticasMensuales.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EstadisticasMensualesScreen />);

    // Inicialmente Junio 2026, necesitamos 6 presiones para llegar a Diciembre 2025
    const prevButton = screen.getByLabelText('Mes anterior');
    for (let i = 0; i < 6; i++) {
      fireEvent.press(prevButton);
    }

    expect(screen.getByText('Diciembre 2025')).toBeTruthy();
  });

  it('cambia de año al navegar desde Diciembre a Enero', () => {
    mockUseEstadisticasMensuales.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EstadisticasMensualesScreen />);

    // De Junio 2026, 6 presiones adelante → Diciembre 2026
    const nextButton = screen.getByLabelText('Mes siguiente');
    for (let i = 0; i < 6; i++) {
      fireEvent.press(nextButton);
    }

    expect(screen.getByText('Diciembre 2026')).toBeTruthy();

    // Una más → Enero 2027
    fireEvent.press(nextButton);
    expect(screen.getByText('Enero 2027')).toBeTruthy();
  });

  it('llama a router.back al presionar el botón de retroceso', () => {
    const mockRouter = require('expo-router').router;

    mockUseEstadisticasMensuales.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EstadisticasMensualesScreen />);

    const backButton = screen.getByLabelText('Volver');
    fireEvent.press(backButton);

    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it('no crashea cuando dias está vacío', () => {
    const statsSinDias = {
      ...mockStats,
      dias: [],
    };

    mockUseEstadisticasMensuales.mockReturnValue({
      data: statsSinDias,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<EstadisticasMensualesScreen />);

    // El resumen debe mostrarse
    expect(screen.getByText('Resumen del mes')).toBeTruthy();
    expect(screen.getByText('180')).toBeTruthy();

    // La tabla debe tener encabezados pero sin filas
    expect(screen.getByText('Día')).toBeTruthy();
    expect(screen.getByText('Entreg.')).toBeTruthy();
  });
});
