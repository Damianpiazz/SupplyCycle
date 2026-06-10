import 'dotenv/config';
import bcrypt from 'bcrypt';
import { type Cliente } from '../generated/prisma/client.js';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.pedidoItem.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.reparto.deleteMany();
  await prisma.item.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.usuario.deleteMany();

  // --- Usuarios ---
  const repartidorPassword = await bcrypt.hash('Repartidor123', 10);
  const repartidor = await prisma.usuario.create({
    data: {
      email: 'repartidor@supplycycle.com',
      password: repartidorPassword,
      nombre: 'Juan',
      apellido: 'Pérez',
      rol: 'REPARTIDOR',
      activo: true,
    },
  });
  console.log(`  ✅ Usuario repartidor: ${repartidor.email}`);

  const adminPassword = await bcrypt.hash('Admin1234', 10);
  const admin = await prisma.usuario.create({
    data: {
      email: 'admin@supplycycle.com',
      password: adminPassword,
      nombre: 'Ana',
      apellido: 'Administradora',
      rol: 'ADMIN',
      activo: true,
    },
  });
  console.log(`  ✅ Usuario admin: ${admin.email}`);

  // --- Items ---
  const item20l = await prisma.item.create({
    data: { nombre: 'Bidón 20L', descripcion: 'Bidón de agua de 20 litros', unidad: 'unidad', precio: 1500, activo: true },
  });
  const item12l = await prisma.item.create({
    data: { nombre: 'Bidón 12L', descripcion: 'Bidón de agua de 12 litros', unidad: 'unidad', precio: 900, activo: true },
  });
  const item6l = await prisma.item.create({
    data: { nombre: 'Bidón 6L', descripcion: 'Bidón de agua de 6 litros', unidad: 'unidad', precio: 600, activo: true },
  });
  console.log('  ✅ Items creados');

  // --- Clientes ---
  const clientesData = [
    { nombre: 'María', apellido: 'González', telefono: '1145678901', calle: 'Av. Corrientes', numero: '1234', localidad: 'CABA', latitud: -34.6037, longitud: -58.3816, diaEntrega: 'LUNES' as const, horarioDesde: '09:00', horarioHasta: '11:00', observaciones: 'Timbre 3B' },
    { nombre: 'Carlos', apellido: 'López', telefono: '1156789012', calle: 'Av. Santa Fe', numero: '5678', localidad: 'CABA', latitud: -34.5956, longitud: -58.3749, diaEntrega: 'LUNES' as const, horarioDesde: '10:00', horarioHasta: '12:00' },
    { nombre: 'Ana', apellido: 'Martínez', telefono: '1167890123', calle: 'Av. Rivadavia', numero: '3456', localidad: 'CABA', latitud: -34.6097, longitud: -58.3958, diaEntrega: 'LUNES' as const, horarioDesde: '11:00', horarioHasta: '13:00', observaciones: 'Edificio blanco, piso 5' },
    { nombre: 'Pedro', apellido: 'Ramírez', telefono: '1178901234', calle: 'Callao', numero: '789', localidad: 'CABA', latitud: -34.6010, longitud: -58.3845, diaEntrega: 'LUNES' as const, horarioDesde: '12:00', horarioHasta: '14:00' },
    { nombre: 'Laura', apellido: 'Fernández', telefono: '1189012345', calle: 'Av. Belgrano', numero: '2345', localidad: 'CABA', latitud: -34.6130, longitud: -58.3810, diaEntrega: 'LUNES' as const, horarioDesde: '14:00', horarioHasta: '16:00' },
    { nombre: 'Roberto', apellido: 'Díaz', telefono: '1190123456', calle: 'Av. Pueyrredón', numero: '890', localidad: 'CABA', latitud: -34.5985, longitud: -58.3886, diaEntrega: 'LUNES' as const, horarioDesde: '08:00', horarioHasta: '10:00' },
  ];

  const clientes: Cliente[] = [];
  for (const c of clientesData) {
    const cliente = await prisma.cliente.create({ data: c });
    clientes.push(cliente);
  }
  console.log(`  ✅ ${clientes.length} clientes creados`);

  // --- Reparto ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reparto = await prisma.reparto.create({
    data: {
      repartidorId: repartidor.id,
      fecha: today,
      estado: 'EN_CURSO',
      horaInicio: '08:30',
    },
  });
  console.log('  ✅ Reparto creado');

  // --- Pedidos ---
  const pedidosData = [
    { orden: 1, clienteIdx: 5, items: [{ itemId: item20l.id, cantidad: 2 }] },
    { orden: 2, clienteIdx: 1, items: [{ itemId: item20l.id, cantidad: 1 }, { itemId: item12l.id, cantidad: 1 }] },
    { orden: 3, clienteIdx: 2, items: [{ itemId: item20l.id, cantidad: 3 }], estado: 'ENTREGADO' as const },
    { orden: 4, clienteIdx: 3, items: [{ itemId: item12l.id, cantidad: 2 }] },
    { orden: 5, clienteIdx: 4, items: [{ itemId: item20l.id, cantidad: 1 }], estado: 'NO_ENTREGADO' as const, motivo: 'CLIENTE_AUSENTE' },
    { orden: 6, clienteIdx: 0, items: [{ itemId: item20l.id, cantidad: 2 }, { itemId: item6l.id, cantidad: 1 }] },
  ];

  // Map item IDs to prices for PedidoItem creation
  const itemPrices: Record<string, number> = {
    [item20l.id]: item20l.precio!,
    [item12l.id]: item12l.precio!,
    [item6l.id]: item6l.precio!,
  };

  for (const pd of pedidosData) {
    await prisma.pedido.create({
      data: {
        clienteId: clientes[pd.clienteIdx]!.id,
        repartoId: reparto.id,
        fecha: today,
        estado: pd.estado ?? 'PENDIENTE',
        motivoFalla: pd.motivo ?? null,
        orden: pd.orden,
        items: {
          create: pd.items.map((i) => ({
            itemId: i.itemId,
            cantidad: i.cantidad,
            precioUnitario: itemPrices[i.itemId],
          })),
        },
      },
    });
  }
  console.log(`  ✅ ${pedidosData.length} pedidos creados`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
