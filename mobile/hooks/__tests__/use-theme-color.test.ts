import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUseColorScheme = vi.fn(() => 'light');
vi.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => mockUseColorScheme(),
}));

vi.mock('@/constants/theme', () => ({
  Colors: {
    light: {
      text: '#11181C',
      background: '#fff',
      tint: '#0a7ea4',
      icon: '#687076',
      tabIconDefault: '#687076',
      tabIconSelected: '#0a7ea4',
      pendiente: '#F59E0B',
      entregado: '#10B981',
      noEntregado: '#EF4444',
      enCurso: '#3B82F6',
      completado: '#10B981',
      card: '#F8FAFC',
      cardBorder: '#E2E8F0',
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
      info: '#3B82F6',
      surface: '#F1F5F9',
      border: '#E2E8F0',
      muted: '#94A3B8',
      inputBackground: '#F8FAFC',
      headerBackground: '#0a7ea4',
      headerText: '#FFFFFF',
    },
    dark: {
      text: '#ECEDEE',
      background: '#151718',
      tint: '#fff',
      icon: '#9BA1A6',
      tabIconDefault: '#9BA1A6',
      tabIconSelected: '#fff',
      pendiente: '#FBBF24',
      entregado: '#34D399',
      noEntregado: '#F87171',
      enCurso: '#60A5FA',
      completado: '#34D399',
      card: '#1E293B',
      cardBorder: '#334155',
      error: '#F87171',
      success: '#34D399',
      warning: '#FBBF24',
      info: '#60A5FA',
      surface: '#1E293B',
      border: '#334155',
      muted: '#64748B',
      inputBackground: '#1E293B',
      headerBackground: '#0f172a',
      headerText: '#F8FAFC',
    },
  },
}));

import { useThemeColor } from '@/hooks/use-theme-color';

describe('useThemeColor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devuelve el color de props cuando se proporciona en modo claro', () => {
    mockUseColorScheme.mockReturnValue('light');
    const result = useThemeColor({ light: '#FF0000' }, 'text');
    expect(result).toBe('#FF0000');
  });

  it('devuelve el color del tema cuando no hay prop en modo claro', () => {
    mockUseColorScheme.mockReturnValue('light');
    const result = useThemeColor({}, 'text');
    expect(result).toBe('#11181C');
  });

  it('devuelve el color dark de props cuando está en modo oscuro', () => {
    mockUseColorScheme.mockReturnValue('dark');
    const result = useThemeColor({ dark: '#00FF00' }, 'text');
    expect(result).toBe('#00FF00');
  });

  it('devuelve el color del tema oscuro cuando no hay prop dark', () => {
    mockUseColorScheme.mockReturnValue('dark');
    const result = useThemeColor({}, 'text');
    expect(result).toBe('#ECEDEE');
  });
});
