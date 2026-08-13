// SPEC-04 RF-10: pure frequency helper shared by clientes and estadisticas
// demand features. No DB access here — callers pass already-loaded order dates
// (avoids N+1 queries). Design D5.

export const DEFAULT_FRECUENCIA_DIAS = 7;

/**
 * Average days between consecutive order dates (dates are sorted internally).
 * Returns null when fewer than 2 orders are given (no interval exists).
 * Callers decide the fallback (DEFAULT_FRECUENCIA_DIAS) when null.
 */
export function calcularIntervaloPromedioDias(fechas: Date[]): number | null {
  const sorted = [...fechas].sort((a, b) => a.getTime() - b.getTime());

  if (sorted.length < 2) {
    return null;
  }

  let sumaIntervalos = 0;
  for (let i = 1; i < sorted.length; i++) {
    const diffMs = sorted[i]!.getTime() - sorted[i - 1]!.getTime();
    sumaIntervalos += Math.round(diffMs / (1000 * 60 * 60 * 24));
  }

  return Math.round(sumaIntervalos / (sorted.length - 1));
}
