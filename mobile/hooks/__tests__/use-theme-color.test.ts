import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUseColorScheme = vi.fn(() => 'light');
vi.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => mockUseColorScheme(),
}));

vi.mock('@/constants/theme', () => ({
  Colors: {
    light: {
      text: '#1A2E18',
      muted: '#4A6045',
      icon: '#4A6045',
      tabIconDefault: '#8AAA80',
      background: '#F5F7F4',
      surface: '#EAF3DE',
      card: '#FFFFFF',
      inputBackground: '#FFFFFF',
      cardBorder: '#C8D4C0',
      border: '#C8D4C0',
      tint: '#639922',
      tabIconSelected: '#639922',
      buttonPrimary: '#3B6D11',
      headerBackground: '#3B6D11',
      headerText: '#FFFFFF',
      error: '#7A3535',
      success: '#2E6B42',
      warning: '#7A5A1A',
      info: '#2A4F70',
      errorBg: '#FCEEED',
      successBg: '#EAF5EE',
      warningBg: '#FDF4E7',
      infoBg: '#EAF2FA',
      errorBorder: '#EAC8C8',
      successBorder: '#C2DFCB',
      warningBorder: '#E8D8B0',
      infoBorder: '#C0D8EC',
      pendiente: '#7A5A1A',
      entregado: '#2E6B42',
      noEntregado: '#7A3535',
      enCurso: '#2A4F70',
      completado: '#2E6B42',
      textDisabled: '#8AAA80',
      borderSubtle: '#DDE8D5',
    },
    dark: {
      text: '#D8ECC8',
      muted: '#6A9060',
      icon: '#6A9060',
      tabIconDefault: '#3A5835',
      background: '#0F1A12',
      surface: '#1A3010',
      card: '#162018',
      inputBackground: '#162018',
      cardBorder: '#1C3020',
      border: '#1C3020',
      tint: '#A8D878',
      tabIconSelected: '#A8D878',
      buttonPrimary: '#7DC44A',
      headerBackground: '#0F1A12',
      headerText: '#D8ECC8',
      error: '#D48080',
      success: '#80C898',
      warning: '#D4A84A',
      info: '#80B8D8',
      errorBg: '#250E0E',
      successBg: '#102A18',
      warningBg: '#251C08',
      infoBg: '#0E1A25',
      errorBorder: '#401818',
      successBorder: '#1E4828',
      warningBorder: '#403010',
      infoBorder: '#183040',
      pendiente: '#D4A84A',
      entregado: '#80C898',
      noEntregado: '#D48080',
      enCurso: '#80B8D8',
      completado: '#80C898',
      textDisabled: '#3A5835',
      borderSubtle: '#284830',
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
    expect(result).toBe('#1A2E18');
  });

  it('devuelve el color dark de props cuando está en modo oscuro', () => {
    mockUseColorScheme.mockReturnValue('dark');
    const result = useThemeColor({ dark: '#00FF00' }, 'text');
    expect(result).toBe('#00FF00');
  });

  it('devuelve el color del tema oscuro cuando no hay prop dark', () => {
    mockUseColorScheme.mockReturnValue('dark');
    const result = useThemeColor({}, 'text');
    expect(result).toBe('#D8ECC8');
  });
});
