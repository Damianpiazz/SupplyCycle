/**
 * Constante que define el umbral (en días) a partir del cual un envase
 * retenido se considera en demora.
 */
export const DIAS_LIMITE_DEMORA = 15;

/**
 * Retorna la fecha límite a partir de la cual un Retenido se considera en demora:
 *   hoy - DIAS_LIMITE_DEMORA
 */
export function calcularFechaDemora(): Date {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - DIAS_LIMITE_DEMORA);
  fecha.setHours(0, 0, 0, 0);
  return fecha;
}

/**
 * A partir de un arreglo de retenidos (con estado e inicio), calcula:
 *
 * - `tieneDemora`          → true si hay al menos 1 RETENIDO con inicio <= fecha demora
 * - `cantidadEnvasesPendientes` → total de registros en estado RETENIDO
 * - `fechaUltimaEntrega`   → fecha ISO del retenido con `inicio` más reciente (o null)
 */
export function calcularDatosDemora(
  retenidos: Array<{ estado: string; inicio: Date }>,
): {
  tieneDemora: boolean;
  cantidadEnvasesPendientes: number;
  fechaUltimaEntrega: string | null;
} {
  const pendientes = retenidos.filter((r) => r.estado === 'RETENIDO');
  const cantidadEnvasesPendientes = pendientes.length;

  const fechaDemora = calcularFechaDemora();
  const tieneDemora = pendientes.some((r) => r.inicio <= fechaDemora);

  let fechaUltimaEntrega: string | null = null;
  if (pendientes.length > 0) {
    const ultima = pendientes.reduce((a, b) => (a.inicio > b.inicio ? a : b));
    fechaUltimaEntrega = ultima.inicio.toISOString();
  }

  return { tieneDemora, cantidadEnvasesPendientes, fechaUltimaEntrega };
}
