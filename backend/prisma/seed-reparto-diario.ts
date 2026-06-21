import 'dotenv/config';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { prisma } from '../src/lib/prisma.js';

const NUM_PEDIDOS = 100;

const CENTER_LAT = -34.9215;
const CENTER_LNG = -57.9546;
const RADIUS = 0.04;

function randomLaPlataCoords(): { lat: number; lng: number } {
  const angle = Math.random() * 2 * Math.PI;
  const r = Math.sqrt(Math.random()) * RADIUS;
  return {
    lat: CENTER_LAT + r * Math.cos(angle),
    lng: CENTER_LNG + r * Math.sin(angle),
  };
}

function timeToDate(hours: number, minutes: number = 0): Date {
  const d = new Date(0);
  d.setUTCHours(hours, minutes, 0, 0);
  return d;
}

const DIAS_SEMANA = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'] as const;

async function main() {
  console.log(`Seed: Creando reparto actual con ${NUM_PEDIDOS} pedidos en La Plata...\n`);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');

  faker.seed(12345);

  // 1. Usuarios
  console.log('[1/5] Usuarios...');
  const repartidorPassword = await bcrypt.hash('Repartidor123', 10);
  const repartidor = await prisma.usuario.upsert({
    where: { email: 'repartidor@supplycycle.com' },
    update: {},
    create: {
      email: 'repartidor@supplycycle.com',
      password: repartidorPassword,
      nombre: 'Juan',
      apellido: 'Pérez',
      rol: 'REPARTIDOR',
      activo: true,
    },
  });

  const adminPassword = await bcrypt.hash('Admin1234', 10);
  await prisma.usuario.upsert({
    where: { email: 'admin@supplycycle.com' },
    update: {},
    create: {
      email: 'admin@supplycycle.com',
      password: adminPassword,
      nombre: 'Ana',
      apellido: 'Administradora',
      rol: 'ADMIN',
      activo: true,
    },
  });
  console.log('  OK');

  // 2. Items
  console.log('[2/5] Items...');
  const itemsData = [
    { nombre: 'Bidón 20L', descripcion: 'Bidón de agua de 20 litros', unidad: 'unidad', precio: 1500 },
    { nombre: 'Bidón 12L', descripcion: 'Bidón de agua de 12 litros', unidad: 'unidad', precio: 900 },
    { nombre: 'Bidón 6L', descripcion: 'Bidón de agua de 6 litros', unidad: 'unidad', precio: 600 },
  ];

  const items: Record<string, { id: string; precio: number }> = {};
  for (const data of itemsData) {
    let item = await prisma.item.findFirst({ where: { nombre: data.nombre } });
    if (!item) {
      item = await prisma.item.create({ data: { ...data, activo: true } });
    }
    items[data.nombre] = { id: item.id, precio: item.precio ?? 0 };
  }
  console.log('  OK');

  // 3. Ciudad
  console.log('[3/5] Ciudad...');
  const ciudad = await prisma.ciudad.upsert({
    where: { id: 'seed-caba' },
    update: {},
    create: { id: 'seed-caba', nombre: 'CABA' },
  });
  console.log('  OK');

  // 4. Reparto
  console.log('[4/5] Reparto...');
  const reparto = await prisma.reparto.upsert({
    where: {
      repartidorId_fecha: {
        repartidorId: repartidor.id,
        fecha: today,
      },
    },
    update: { estado: 'EN_CURSO', horaInicio: '08:30' },
    create: {
      repartidorId: repartidor.id,
      fecha: today,
      estado: 'EN_CURSO',
      horaInicio: '08:30',
    },
  });
  console.log(`  OK Reparto: ${reparto.id}`);

  // 5. Limpiar datos previos + crear 100 pedidos
  console.log(`[5/5] Creando ${NUM_PEDIDOS} pedidos en La Plata...`);

  // Collect existing data for cleanup
  const pedidosPrev = await prisma.pedido.findMany({
    where: { repartoId: reparto.id },
    select: { id: true, domicilioId: true },
  });

  if (pedidosPrev.length > 0) {
    const prevPedidoIds = pedidosPrev.map((p) => p.id);
    const prevDomicilioIds = [...new Set(pedidosPrev.map((p) => p.domicilioId))];

    const domiciliosPrev = await prisma.domicilio.findMany({
      where: { id: { in: prevDomicilioIds } },
      select: { id: true, clienteId: true },
    });
    const prevClienteIds = [...new Set(domiciliosPrev.map((d) => d.clienteId))];

    const diasPrev = await prisma.dia.findMany({
      where: { domicilioId: { in: prevDomicilioIds } },
      select: { id: true, domicilioId: true },
    });
    const prevDiaIds = diasPrev.map((d) => d.id);

    await prisma.horario.deleteMany({ where: { diaId: { in: prevDiaIds } } });
    await prisma.dia.deleteMany({ where: { id: { in: prevDiaIds } } });
    await prisma.visita.deleteMany({ where: { pedidoId: { in: prevPedidoIds } } });
    await prisma.retenido.deleteMany({ where: { pedidoId: { in: prevPedidoIds } } });
    await prisma.pedidoItem.deleteMany({ where: { pedidoId: { in: prevPedidoIds } } });
    await prisma.pedido.deleteMany({ where: { id: { in: prevPedidoIds } } });
    await prisma.domicilio.deleteMany({ where: { id: { in: prevDomicilioIds } } });
    await prisma.cliente.deleteMany({ where: { id: { in: prevClienteIds } } });
    console.log(`  Limpiados ${pedidosPrev.length} pedidos anteriores`);
  }

  const itemNombres = Object.keys(items);
  const itemsArr = itemNombres.map((n) => items[n]!);

  for (let i = 0; i < NUM_PEDIDOS; i++) {
    const { lat, lng } = randomLaPlataCoords();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const telefono = faker.phone.number().replace(/\D/g, '').slice(0, 20);
    const cliente = await prisma.cliente.create({
      data: {
        nombre: firstName,
        apellido: lastName,
        telefono,
        activo: true,
      },
    });

    const domicilio = await prisma.domicilio.create({
      data: {
        calle: faker.location.street(),
        numero: String(faker.number.int({ min: 100, max: 9999 })),
        localidad: 'La Plata',
        latitud: lat,
        longitud: lng,
        principal: true,
        clienteId: cliente.id,
        ciudadId: ciudad.id,
      },
    });

    const dia = await prisma.dia.create({
      data: {
        nombre: DIAS_SEMANA[Math.floor(Math.random() * DIAS_SEMANA.length)],
        domicilioId: domicilio.id,
      },
    });

    const horaInicio = 7 + Math.floor(Math.random() * 9);
    await prisma.horario.create({
      data: {
        inicio: timeToDate(horaInicio),
        fin: timeToDate(horaInicio + 2),
        diaId: dia.id,
      },
    });

    const item = itemsArr[Math.floor(Math.random() * itemsArr.length)]!;
    const cantidad = 1 + Math.floor(Math.random() * 3);

    await prisma.pedido.create({
      data: {
        numeroPedido: `REP-${dateStr}-${String(i + 1).padStart(3, '0')}`,
        domicilioId: domicilio.id,
        repartoId: reparto.id,
        fecha: today,
        estado: 'PENDIENTE',
        orden: i + 1,
        items: {
          create: [{ itemId: item.id, cantidad, precioUnitario: item.precio }],
        },
      },
    });
  }

  console.log(`  OK ${NUM_PEDIDOS} pedidos PENDIENTE creados en La Plata`);
  console.log('\nSeed completado!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
