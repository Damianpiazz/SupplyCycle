import 'dotenv/config';
import { prisma } from '../../src/lib/prisma.js';
import { seedCiudades } from './ciudades.seed.js';
import { seedItems } from './items.seed.js';
import { seedUsuarios } from './usuarios.seed.js';
import { seedEmpleados } from './empleados.seed.js';
import { seedClientes, seedDomicilios, seedDias, seedHorarios } from './clientes.seed.js';
import { seedRepartos } from './repartos.seed.js';
import { seedPedidos } from './pedidos.seed.js';
import { seedVisitas } from './visitas.seed.js';
import { seedRetenidos } from './retenidos.seed.js';
import { seedReclamos } from './reclamos.seed.js';

async function main() {
  console.log('🌱 Seeding database...\n');

  // ── Clean (reverse dependency order) ──
  console.log('--- Limpiando datos existentes ---');
  await prisma.visita.deleteMany();
  await prisma.retenido.deleteMany();
  await prisma.reclamo.deleteMany();
  await prisma.horario.deleteMany();
  await prisma.dia.deleteMany();
  await prisma.domicilio.deleteMany();
  await prisma.pedidoItem.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.reparto.deleteMany();
  await prisma.empleado.deleteMany();
  await prisma.ciudad.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.item.deleteMany();
  await prisma.usuario.deleteMany();
  console.log('');

  // ── Seed ──
  console.log('--- Sembrando datos ---');

  const ciudad = await seedCiudades();
  const itemsList = await seedItems();
  const { repartidores } = await seedUsuarios();
  const empleadosList = await seedEmpleados();
  const clientes = await seedClientes(1000);

  const domicilios = await seedDomicilios(clientes, ciudad.id);
  const dias = await seedDias(domicilios);
  await seedHorarios(dias);

  const repartosList = await seedRepartos(repartidores);
  const pedidosList = await seedPedidos(clientes, itemsList, repartosList, domicilios);

  await seedVisitas(pedidosList, empleadosList);
  await seedRetenidos(clientes, itemsList, pedidosList, domicilios);
  await seedReclamos(clientes);

  console.log('\n🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('Seed falló:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
