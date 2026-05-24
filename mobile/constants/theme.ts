/**
 * Colors and spacing for light and dark mode.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Estados pedido
    pendiente: '#F59E0B',
    entregado: '#10B981',
    noEntregado: '#EF4444',
    // Estados reparto
    enCurso: '#3B82F6',
    completado: '#10B981',
    // UI
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
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Estados pedido
    pendiente: '#FBBF24',
    entregado: '#34D399',
    noEntregado: '#F87171',
    // Estados reparto
    enCurso: '#60A5FA',
    completado: '#34D399',
    // UI
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
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  title: 28,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
