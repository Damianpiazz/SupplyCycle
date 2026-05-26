import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react-native';

// Mocks de @rnmapbox/maps
vi.mock('@rnmapbox/maps', () => ({
  default: {},
  MapView: ({ children, style }: any) => (
    <div data-testid="map-view" style={style}>
      {children}
    </div>
  ),
  Camera: () => null,
  UserLocation: () => null,
  setAccessToken: vi.fn(),
}));

// Mock de expo-location
vi.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: vi.fn(),
  getCurrentPositionAsync: vi.fn(),
}));

import * as Location from 'expo-location';
import MapaScreen from '@/features/mapa/screens/MapaScreen';

describe('MapaScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state while getting location', () => {
    vi.mocked(Location.requestForegroundPermissionsAsync).mockResolvedValue({
      status: 'granted',
    } as any);
    vi.mocked(Location.getCurrentPositionAsync).mockReturnValue(
      new Promise(() => {}) // never resolves → stays loading
    );

    render(<MapaScreen />);
    expect(screen.getByText('Obteniendo ubicación...')).toBeTruthy();
  });

  it('should show map when location is granted and available', async () => {
    vi.mocked(Location.requestForegroundPermissionsAsync).mockResolvedValue({
      status: 'granted',
    } as any);
    vi.mocked(Location.getCurrentPositionAsync).mockResolvedValue({
      coords: { latitude: -34.6037, longitude: -58.3816 },
    } as any);

    render(<MapaScreen />);
    // After the async location resolves, the map should appear
    const mapView = await screen.findByTestId('map-view');
    expect(mapView).toBeTruthy();
  });
});
