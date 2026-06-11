/**
 * Colors and spacing for light and dark mode.
 * Based on the SupplyCycle brand palette — green, organic, fresh.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    /* ── Texto ─────────────────────────────────────────── */
    text: '#1A2E18',
    muted: '#4A6045',
    icon: '#4A6045',
    tabIconDefault: '#8AAA80',

    /* ── Fondos ────────────────────────────────────────── */
    background: '#F5F7F4',
    surface: '#EAF3DE',
    card: '#FFFFFF',
    inputBackground: '#FFFFFF',
    cardBorder: '#C8D4C0',
    border: '#C8D4C0',

    /* ── Primario / Accent ─────────────────────────────── */
    tint: '#639922',
    tabIconSelected: '#639922',
    buttonPrimary: '#3B6D11',
    headerBackground: '#3B6D11',
    headerText: '#FFFFFF',

    /* ── Estados · texto (iconos, texto, bordes) ──────── */
    error: '#7A3535',
    success: '#2E6B42',
    warning: '#7A5A1A',
    info: '#2A4F70',

    /* ── Estados · fondo (badges, toasts, banners) ────── */
    errorBg: '#FCEEED',
    successBg: '#EAF5EE',
    warningBg: '#FDF4E7',
    infoBg: '#EAF2FA',

    /* ── Estados · borde ───────────────────────────────── */
    errorBorder: '#EAC8C8',
    successBorder: '#C2DFCB',
    warningBorder: '#E8D8B0',
    infoBorder: '#C0D8EC',

    /* ── Estado de pedidos / rutas ─────────────────────── */
    pendiente: '#7A5A1A',
    entregado: '#2E6B42',
    noEntregado: '#7A3535',
    enCurso: '#2A4F70',
    completado: '#2E6B42',

    /* ── Utilidades ────────────────────────────────────── */
    textDisabled: '#8AAA80',
    borderSubtle: '#DDE8D5',
  },

  dark: {
    /* ── Texto ─────────────────────────────────────────── */
    text: '#D8ECC8',
    muted: '#6A9060',
    icon: '#6A9060',
    tabIconDefault: '#3A5835',

    /* ── Fondos ────────────────────────────────────────── */
    background: '#0F1A12',
    surface: '#1A3010',
    card: '#162018',
    inputBackground: '#162018',
    cardBorder: '#1C3020',
    border: '#1C3020',

    /* ── Primario / Accent ─────────────────────────────── */
    tint: '#A8D878',
    tabIconSelected: '#A8D878',
    buttonPrimary: '#7DC44A',
    headerBackground: '#0F1A12',
    headerText: '#D8ECC8',

    /* ── Estados · texto ───────────────────────────────── */
    error: '#D48080',
    success: '#80C898',
    warning: '#D4A84A',
    info: '#80B8D8',

    /* ── Estados · fondo ───────────────────────────────── */
    errorBg: '#250E0E',
    successBg: '#102A18',
    warningBg: '#251C08',
    infoBg: '#0E1A25',

    /* ── Estados · borde ───────────────────────────────── */
    errorBorder: '#401818',
    successBorder: '#1E4828',
    warningBorder: '#403010',
    infoBorder: '#183040',

    /* ── Estado de pedidos / rutas ─────────────────────── */
    pendiente: '#D4A84A',
    entregado: '#80C898',
    noEntregado: '#D48080',
    enCurso: '#80B8D8',
    completado: '#80C898',

    /* ── Utilidades ────────────────────────────────────── */
    textDisabled: '#3A5835',
    borderSubtle: '#284830',
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
  /** Texto secundario (dirección, fecha) — 13px */
  cardSecondary: 13,
  /** Labels del navbar inferior — 11px */
  tabLabel: 11,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
};

/**
 * Tipografía moderna: Inter (Google Font).
 * Usar FontFamily.inter para texto normal, FontFamily.interMedium para medium (500),
 * FontFamily.interSemiBold para semibold (600), FontFamily.interBold para bold (700).
 */
export const FontFamily = {
  inter: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interSemiBold: 'Inter_600SemiBold',
  interBold: 'Inter_700Bold',
};

export const Fonts = Platform.select({
  ios: {
    sans: FontFamily.inter,
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: FontFamily.inter,
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: `"Inter", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
