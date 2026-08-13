import 'dotenv/config';
import { prisma } from '../../src/lib/prisma.js';

/**
 * Wipe all data in reverse dependency order (children → parents).
 */
export async function cleanAll() {
  console.log('🧹 Limpiando datos existentes...');

  // Level 4: dependen de Pedido, Cliente, Item, Empleado
  await prisma.visita.deleteMany();       // FK: pedidoId, empleadoId
  await prisma.retenido.deleteMany();     // FK: itemId, clienteId, pedidoId
  await prisma.reclamo.deleteMany();      // FK: clienteId
  // Level 3: dependen de Pedido
  await prisma.pedidoItem.deleteMany();   // FK: pedidoId, itemId
  await prisma.pedido.deleteMany();       // FK: domicilioId, repartoId
  // Level 2: dependen de Dia, Reparto
  await prisma.horario.deleteMany();      // FK: diaId
  await prisma.dia.deleteMany();          // FK: domicilioId
  await prisma.reparto.deleteMany();      // FK: repartidorId
  // Level 1: dependen de Cliente, Ciudad
  await prisma.domicilio.deleteMany();    // FK: clienteId, ciudadId
  // Level 0: fuertes (sin FK)
  await prisma.empleado.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.item.deleteMany();
  await prisma.ciudad.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('🧹 Limpieza completa\n');
}

// Allow running standalone: npx tsx prisma/seed/00-clean.seed.ts
async function main() {
  await cleanAll();
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Clean failed:', e);
  process.exit(1);
});
