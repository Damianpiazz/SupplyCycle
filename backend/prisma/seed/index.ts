import 'dotenv/config';
import { prisma } from '../../src/lib/prisma.js';
import { cleanAll } from './00-clean.seed.js';
import { seedUsuarios } from './01-usuarios.seed.js';
import { seedItems } from './02-items.seed.js';
import { seedCiudades } from './03-ciudades.seed.js';
import { seedEmpleados } from './04-empleados.seed.js';
import { seedClientes, seedDomicilios, seedDias, seedHorarios } from './05-clientes.seed.js';
import { seedRepartos } from './07-repartos.seed.js';
import { seedPedidos } from './10-pedidos.seed.js';
import { seedVisitas } from './11-visitas.seed.js';
import { seedRetenidos } from './12-retenidos.seed.js';
import { seedReclamos } from './13-reclamos.seed.js';
import { seedClientes as seedClientesSemana } from './14-clientes-semana.seed.js';
import { seedRepartosSemana } from './15-repartos-semana.seed.js';
import { seedPedidos as seedPedidosSemana } from './16-pedidos-semana.seed.js';

async function main() {
  console.log('🌱 Seed: La Plata — Semana del 29/06 al 04/07\n');

  // ── Clean (reverse dependency order) ──
  console.log('--- Limpiando datos existentes ---');
  await cleanAll();

  // ── Seed ──
  console.log('--- Sembrando datos ---');

  // Level 0: fuertes (sin FK)
  console.log('[1] Usuarios + Items + Ciudades + Empleados...');
  const ciudad = await seedCiudades();
  const itemsList = await seedItems();
  const { repartidores } = await seedUsuarios();
  const empleadosList = await seedEmpleados();

  // Level 0: Clientes (1000)
  console.log('[2] Clientes masivos...');
  const clientes = await seedClientes(1000);

  // Level 1: Domicilios + Repartos
  console.log('[3] Domicilios + Repartos...');
  const domicilios = await seedDomicilios(clientes, ciudad.id);
  const repartosList = await seedRepartos(repartidores);

  // Reemplazar repartos de la semana actual (upsert, no delete)
  console.log('[4] Reemplazar repartos semana actual...');
  const diasReparto = await seedRepartosSemana(repartidores[0].id);

  // Level 2: Dias + Horarios
  console.log('[5] Dias + Horarios...');
  const dias = await seedDias(domicilios);
  await seedHorarios(dias);

  // Level 3: Pedidos principales + semanales
  console.log('[6] Pedidos principales (1000+)...');
  const pedidosList = await seedPedidos(clientes, itemsList, repartosList, domicilios);

  console.log('[7] Pedidos semanales La Plata (120)...');
  const clientesLP = await seedClientesSemana(ciudad.id);
  await seedPedidosSemana(clientesLP, itemsList, diasReparto);

  // Level 4: Visitas + Retenidos + Reclamos
  console.log('[8] Visitas + Retenidos + Reclamos...');
  await seedVisitas(pedidosList, empleadosList);
  await seedRetenidos(clientes, itemsList, pedidosList, domicilios);
  await seedReclamos(clientes);

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('   Usuario: repartidor@supplycycle.com / Repartidor123');
  console.log('   Admin:   admin@supplycycle.com / Admin1234');
}

main()
  .catch((e) => {
    console.error('\n❌ Seed falló:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
