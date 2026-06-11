import { describe, it, expect } from 'vitest';
import {
  getEstadoColor,
  getEstadoLabel,
  getEstadoColorReparto,
  getEstadoLabelReparto,
} from '../estadoPedido';
import { Colors } from '@/constants/theme';

const theme = Colors.light;

describe('getEstadoColor', () => {
  it('returns pendiente color for PENDIENTE', () => {
    expect(getEstadoColor('PENDIENTE', theme)).toBe(theme.pendiente);
  });

  it('returns tint color for EN_RUTA', () => {
    expect(getEstadoColor('EN_RUTA', theme)).toBe(theme.tint);
  });

  it('returns entregado color for ENTREGADO', () => {
    expect(getEstadoColor('ENTREGADO', theme)).toBe(theme.entregado);
  });

  it('returns noEntregado color for NO_ENTREGADO', () => {
    expect(getEstadoColor('NO_ENTREGADO', theme)).toBe(theme.noEntregado);
  });

  it('returns muted color for CANCELADO', () => {
    expect(getEstadoColor('CANCELADO', theme)).toBe(theme.muted);
  });

  it('returns text color for unknown estado', () => {
    expect(getEstadoColor('DESCONOCIDO', theme)).toBe(theme.text);
  });
});

describe('getEstadoLabel', () => {
  it('returns "Pendiente" for PENDIENTE', () => {
    expect(getEstadoLabel('PENDIENTE')).toBe('Pendiente');
  });

  it('returns "En ruta" for EN_RUTA', () => {
    expect(getEstadoLabel('EN_RUTA')).toBe('En ruta');
  });

  it('returns "Entregado" for ENTREGADO', () => {
    expect(getEstadoLabel('ENTREGADO')).toBe('Entregado');
  });

  it('returns "No entregado" for NO_ENTREGADO', () => {
    expect(getEstadoLabel('NO_ENTREGADO')).toBe('No entregado');
  });

  it('returns "Cancelado" for CANCELADO', () => {
    expect(getEstadoLabel('CANCELADO')).toBe('Cancelado');
  });

  it('returns the input string for unknown estado', () => {
    expect(getEstadoLabel('DESCONOCIDO')).toBe('DESCONOCIDO');
  });
});

describe('getEstadoColorReparto', () => {
  it('returns pendiente color for PENDIENTE', () => {
    expect(getEstadoColorReparto('PENDIENTE', theme)).toBe(theme.pendiente);
  });

  it('returns enCurso color for EN_CURSO', () => {
    expect(getEstadoColorReparto('EN_CURSO', theme)).toBe(theme.enCurso);
  });

  it('returns completado color for COMPLETADO', () => {
    expect(getEstadoColorReparto('COMPLETADO', theme)).toBe(theme.completado);
  });

  it('returns text color for unknown estado', () => {
    expect(getEstadoColorReparto('DESCONOCIDO', theme)).toBe(theme.text);
  });
});

describe('getEstadoLabelReparto', () => {
  it('returns "Pendiente" for PENDIENTE', () => {
    expect(getEstadoLabelReparto('PENDIENTE')).toBe('Pendiente');
  });

  it('returns "En curso" for EN_CURSO', () => {
    expect(getEstadoLabelReparto('EN_CURSO')).toBe('En curso');
  });

  it('returns "Completado" for COMPLETADO', () => {
    expect(getEstadoLabelReparto('COMPLETADO')).toBe('Completado');
  });

  it('returns the input string for unknown estado', () => {
    expect(getEstadoLabelReparto('DESCONOCIDO')).toBe('DESCONOCIDO');
  });
});
