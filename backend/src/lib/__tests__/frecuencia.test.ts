import { describe, it, expect } from 'vitest';
import { calcularIntervaloPromedioDias, DEFAULT_FRECUENCIA_DIAS } from '../frecuencia.js';

// ─── SPEC-04 TDD-0062: pure frequency helper (RF-10) ──────────────────────────

describe('calcularIntervaloPromedioDias (SPEC-04 TDD-0062)', () => {
  it('returns the average interval in days for two orders 10 days apart', () => {
    const d1 = new Date('2026-07-20T12:00:00Z');
    const d2 = new Date('2026-07-30T12:00:00Z');

    expect(calcularIntervaloPromedioDias([d1, d2])).toBe(10);
  });

  it('sorts the input dates internally before computing intervals', () => {
    const d1 = new Date('2026-07-20T12:00:00Z');
    const d2 = new Date('2026-07-30T12:00:00Z');

    // Unordered input must not change the result.
    expect(calcularIntervaloPromedioDias([d2, d1])).toBe(10);
  });

  it('averages multiple consecutive intervals', () => {
    const d1 = new Date('2026-07-10T12:00:00Z');
    const d2 = new Date('2026-07-20T12:00:00Z');
    const d3 = new Date('2026-07-30T12:00:00Z');

    expect(calcularIntervaloPromedioDias([d1, d2, d3])).toBe(10);
  });

  it('returns null for an empty order list', () => {
    expect(calcularIntervaloPromedioDias([])).toBeNull();
  });

  it('returns null for a single order (no interval exists)', () => {
    expect(calcularIntervaloPromedioDias([new Date('2026-07-30T12:00:00Z')])).toBeNull();
  });

  it('exposes the default fallback of 7 days', () => {
    expect(DEFAULT_FRECUENCIA_DIAS).toBe(7);
  });

  it('clamps a same-day interval to a minimum of 1 day (F5 gate-review)', () => {
    const d1 = new Date('2026-07-20T08:00:00Z');
    const d2 = new Date('2026-07-20T12:00:00Z');

    // Dos pedidos el mismo día → intervalo 0 días, nunca "cada 0 días".
    expect(calcularIntervaloPromedioDias([d1, d2])).toBe(1);
  });

  it('averages clamped intervals together with real gaps (F5 gate-review)', () => {
    const d1 = new Date('2026-07-10T12:00:00Z');
    const d2 = new Date('2026-07-20T12:00:00Z');
    const d3 = new Date('2026-07-20T08:00:00Z');

    // Intervalos: 10 días y 0 (mismo día) → clamp a 1 → (10 + 1) / 2 = 5.5 → 6
    expect(calcularIntervaloPromedioDias([d1, d2, d3])).toBe(6);
  });
});
