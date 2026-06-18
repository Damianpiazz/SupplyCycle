import 'dotenv/config';
import bcrypt from 'bcrypt';
import { prisma } from '../src/lib/prisma.js';

function timeStringToDate(time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(0);
  d.setUTCHours(h ?? 0, m ?? 0, 0, 0);
  return d;
}

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.pedidoItem.deleteMany();
  await prisma.horario.deleteMany();
  await prisma.dia.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.domicilio.deleteMany();
  await prisma.ciudad.deleteMany();
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

  // --- Ciudades ---
  const ciudadCABA = await prisma.ciudad.upsert({
    where: { id: 'seed-caba' },
    update: {},
    create: { id: 'seed-caba', nombre: 'CABA' },
  });

  // --- Clientes + Domicilios + Días + Horarios ---
  interface ClienteSeed {
    nombre: string;
    apellido: string;
    telefono: string;
    calle: string;
    numero: string;
    localidad: string;
    latitud?: number;
    longitud?: number;
    diaEntrega: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO';
    horarioDesde: string;
    horarioHasta: string;
    observaciones?: string;
  }

  const clientesData: ClienteSeed[] = [
    { nombre: 'María', apellido: 'González', telefono: '1145678901', calle: 'Av. Corrientes', numero: '1234', localidad: 'CABA', latitud: -34.6037, longitud: -58.3816, diaEntrega: 'LUNES', horarioDesde: '09:00', horarioHasta: '11:00', observaciones: 'Timbre 3B' },
    { nombre: 'Carlos', apellido: 'López', telefono: '1156789012', calle: 'Av. Santa Fe', numero: '5678', localidad: 'CABA', latitud: -34.5956, longitud: -58.3749, diaEntrega: 'LUNES', horarioDesde: '10:00', horarioHasta: '12:00' },
    { nombre: 'Ana', apellido: 'Martínez', telefono: '1167890123', calle: 'Av. Rivadavia', numero: '3456', localidad: 'CABA', latitud: -34.6097, longitud: -58.3958, diaEntrega: 'LUNES', horarioDesde: '11:00', horarioHasta: '13:00', observaciones: 'Edificio blanco, piso 5' },
    { nombre: 'Pedro', apellido: 'Ramírez', telefono: '1178901234', calle: 'Callao', numero: '789', localidad: 'CABA', latitud: -34.6010, longitud: -58.3845, diaEntrega: 'LUNES', horarioDesde: '12:00', horarioHasta: '14:00' },
    { nombre: 'Laura', apellido: 'Fernández', telefono: '1189012345', calle: 'Av. Belgrano', numero: '2345', localidad: 'CABA', latitud: -34.6130, longitud: -58.3810, diaEntrega: 'LUNES', horarioDesde: '14:00', horarioHasta: '16:00' },
    { nombre: 'Roberto', apellido: 'Díaz', telefono: '1190123456', calle: 'Av. Pueyrredón', numero: '890', localidad: 'CABA', latitud: -34.5985, longitud: -58.3886, diaEntrega: 'LUNES', horarioDesde: '08:00', horarioHasta: '10:00' },
  ];

  const domicilioIds: string[] = [];
  for (const c of clientesData) {
    const cliente = await prisma.cliente.create({
      data: {
        nombre: c.nombre,
        apellido: c.apellido,
        telefono: c.telefono,
        observaciones: c.observaciones ?? null,
        activo: true,
      },
    });

    const domicilio = await prisma.domicilio.create({
      data: {
        calle: c.calle,
        numero: c.numero,
        localidad: c.localidad,
        latitud: c.latitud ?? null,
        longitud: c.longitud ?? null,
        principal: true,
        clienteId: cliente.id,
        ciudadId: ciudadCABA.id,
      },
    });

    const dia = await prisma.dia.create({
      data: { nombre: c.diaEntrega, domicilioId: domicilio.id },
    });

    await prisma.horario.create({
      data: {
        inicio: timeStringToDate(c.horarioDesde),
        fin: timeStringToDate(c.horarioHasta),
        diaId: dia.id,
      },
    });

    domicilioIds.push(domicilio.id);
  }
  console.log(`  ✅ ${clientesData.length} clientes con domicilios creados`);

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
    { orden: 1, domicilioIdx: 5, items: [{ itemId: item20l.id, cantidad: 2 }] },
    { orden: 2, domicilioIdx: 1, items: [{ itemId: item20l.id, cantidad: 1 }, { itemId: item12l.id, cantidad: 1 }] },
    { orden: 3, domicilioIdx: 2, items: [{ itemId: item20l.id, cantidad: 3 }], estado: 'ENTREGADO' as const },
    { orden: 4, domicilioIdx: 3, items: [{ itemId: item12l.id, cantidad: 2 }] },
    { orden: 5, domicilioIdx: 4, items: [{ itemId: item20l.id, cantidad: 1 }], estado: 'NO_ENTREGADO' as const, motivo: 'CLIENTE_AUSENTE' },
    { orden: 6, domicilioIdx: 0, items: [{ itemId: item20l.id, cantidad: 2 }, { itemId: item6l.id, cantidad: 1 }] },
  ];

  const itemPrices: Record<string, number> = {
    [item20l.id]: item20l.precio!,
    [item12l.id]: item12l.precio!,
    [item6l.id]: item6l.precio!,
  };

  for (let idx = 0; idx < pedidosData.length; idx++) {
    const pd = pedidosData[idx]!;
    const numero = 'PEDIDO #' + String(idx + 1);
    await prisma.pedido.create({
      data: {
        numeroPedido: numero,
        domicilioId: domicilioIds[pd.domicilioIdx]!,
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
