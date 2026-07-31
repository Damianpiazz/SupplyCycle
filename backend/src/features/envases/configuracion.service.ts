import { prisma } from '../../lib/prisma.js';

const CLAVES = {
  DEMORA_DIAS: 'DEMORA_DIAS',
  NOTIFICACION_FRECUENCIA_DIAS: 'NOTIFICACION_FRECUENCIA_DIAS',
} as const;

export type ClaveConfiguracion = keyof typeof CLAVES;

/**
 * Lee el valor de una clave de configuración desde la DB.
 * Si no existe, retorna el valorDefault provisto.
 */
export async function obtenerConfiguracion(
  clave: ClaveConfiguracion,
  valorDefault: string,
): Promise<string> {
  const registro = await prisma.configuracion.findUnique({
    where: { clave },
  });
  return registro?.valor ?? valorDefault;
}

/**
 * Obtiene la cantidad de días de demora (default: 15).
 */
export async function obtenerDiasDemora(): Promise<number> {
  const valor = await obtenerConfiguracion('DEMORA_DIAS', '15');
  return parseInt(valor, 10);
}

/**
 * Obtiene la frecuencia mínima entre notificaciones para un mismo cliente (default: 7 días).
 */
export async function obtenerFrecuenciaNotificacion(): Promise<number> {
  const valor = await obtenerConfiguracion('NOTIFICACION_FRECUENCIA_DIAS', '7');
  return parseInt(valor, 10);
}

/**
 * Escribe o actualiza una clave de configuración.
 */
export async function setearConfiguracion(
  clave: ClaveConfiguracion,
  valor: string,
): Promise<void> {
  await prisma.configuracion.upsert({
    where: { clave },
    update: { valor },
    create: { clave, valor },
  });
}

export { CLAVES };
