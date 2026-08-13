import { prisma } from '../../src/lib/prisma.js';

const CONFIGURACIONES = [
  { clave: 'DEMORA_DIAS', valor: '15', descripcion: 'Días de demora para considerar un envase como retenido' },
  { clave: 'NOTIFICACION_FRECUENCIA_DIAS', valor: '7', descripcion: 'Frecuencia mínima en días entre notificaciones a un mismo cliente' },
] as const;

/**
 * Seed de configuración inicial para RF-12 (envases demorados).
 *
 * Idempotente: usa upsert por clave para que correrlo múltiples veces
 * no duplique filas ni sobrescriba cambios manuales posteriores.
 */
export async function seedConfiguracion(): Promise<void> {
  console.log('--- Sembrando configuración inicial (RF-12) ---');

  for (const cfg of CONFIGURACIONES) {
    await prisma.configuracion.upsert({
      where: { clave: cfg.clave },
      update: {}, // No sobrescribe si ya existe y fue modificada manualmente
      create: {
        clave: cfg.clave,
        valor: cfg.valor,
      },
    });
    console.log(`  ✅ ${cfg.clave} = ${cfg.valor} (${cfg.descripcion})`);
  }

  console.log('🎯 Configuración inicial completada');
}

/**
 * Seed específico para tests: corre el seed y retorna los registros insertados.
 * Útil para verificar idempotencia en tests unitarios.
 */
export async function seedConfiguracionForTest(): Promise<Array<{ clave: string; valor: string }>> {
  await seedConfiguracion();
  return prisma.configuracion.findMany({
    where: { clave: { in: CONFIGURACIONES.map((c) => c.clave) } },
    orderBy: { clave: 'asc' },
  });
}
