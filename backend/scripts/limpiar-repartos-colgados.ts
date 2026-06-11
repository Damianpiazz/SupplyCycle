/**
 * Script de limpieza: detecta y repara repartos atascados en EN_CURSO de días anteriores.
 *
 * Uso:
 *   npx tsx scripts/limpiar-repartos-colgados.ts          # dry-run (solo lista)
 *   npx tsx scripts/limpiar-repartos-colgados.ts --fix     # aplica correcciones
 *
 * ¿Qué hace?
 *   Busca repartos con estado EN_CURSO cuya fecha sea anterior a hoy.
 *   Si todos sus pedidos están en estados terminales (ENTREGADO, NO_ENTREGADO, CANCELADO),
 *   los pasa automáticamente a COMPLETADO con horaFin.
 *   Si aún hay pedidos PENDIENTE o EN_RUTA, los lista para revisión manual.
 */

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const args = process.argv.slice(2);
const isFix = args.includes('--fix');

const connectionString = `${process.env['DATABASE_URL']}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const ESTADOS_TERMINALES = ['ENTREGADO', 'NO_ENTREGADO', 'CANCELADO'] as const;

async function main() {
  console.log('=== Limpieza de repartos colgados EN_CURSO ===\n');

  // Fecha de inicio de hoy (sin hora)
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Buscar repartos EN_CURSO de días anteriores
  const colgados = await prisma.reparto.findMany({
    where: {
      estado: 'EN_CURSO',
      fecha: { lt: hoy },
    },
    include: {
      repartidor: { select: { nombre: true, apellido: true } },
      pedidos: { select: { id: true, estado: true } },
    },
    orderBy: { fecha: 'desc' },
  });

  if (colgados.length === 0) {
    console.log('✅ No hay repartos colgados en EN_CURSO de días anteriores.');
    await prisma.$disconnect();
    return;
  }

  console.log(`Se encontraron ${colgados.length} reparto(s) colgado(s):\n`);

  for (const r of colgados) {
    const total = r.pedidos.length;
    const terminales = r.pedidos.filter((p) =>
      ESTADOS_TERMINALES.includes(p.estado as typeof ESTADOS_TERMINALES[number]),
    ).length;
    const pendientes = r.pedidos.filter((p) => p.estado === 'PENDIENTE').length;
    const enRuta = r.pedidos.filter((p) => p.estado === 'EN_RUTA').length;

    console.log(`  📦 Reparto: ${r.id}`);
    console.log(`     Fecha:     ${r.fecha.toISOString().slice(0, 10)}`);
    console.log(`     Repartidor: ${r.repartidor.nombre} ${r.repartidor.apellido}`);
    console.log(`     Pedidos:   ${total} total | ${terminales} terminales | ${pendientes} pendientes | ${enRuta} en ruta`);

    if (terminales === total) {
      // Todos los pedidos están en estado terminal → se puede auto-completar
      console.log(`     ✅ Estado: RECUPERABLE — todos los pedidos están en estado terminal`);

      if (isFix) {
        const horaFin = new Date().toLocaleTimeString('es-AR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });

        await prisma.reparto.update({
          where: { id: r.id },
          data: { estado: 'COMPLETADO', horaFin },
        });

        console.log(`     🔧 Corregido → COMPLETADO con horaFin ${horaFin}`);
      } else {
        console.log(`     ℹ️  Ejecuta con --fix para corregirlo automáticamente`);
      }
    } else {
      // Hay pedidos que no se procesaron
      console.log(`     ⚠️  BLOQUEANTE — ${pendientes + enRuta} pedido(s) sin procesar`);
      console.log(`     Revisión manual requerida:`);
      console.log(`       - Si las entregas se realizaron, actualizar cada pedido`);
      console.log(`       - Si no se realizaron, cancelar o reprogramar los pedidos restantes`);
    }
    console.log('');
  }

  const recuperables = colgados.filter((r) =>
    r.pedidos.every((p) =>
      ESTADOS_TERMINALES.includes(p.estado as typeof ESTADOS_TERMINALES[number]),
    ),
  ).length;

  const bloqueantes = colgados.length - recuperables;

  console.log('=== Resumen ===');
  console.log(`  Total colgados:     ${colgados.length}`);
  console.log(`  Recuperables:       ${recuperables} (se auto-completan con --fix)`);
  console.log(`  Requieren revisión: ${bloqueantes}`);

  if (isFix) {
    console.log('\n✅ Corrección aplicada.');
  } else {
    console.log('\n💡 Vuelve a ejecutar con --fix para aplicar las correcciones automáticas.');
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
