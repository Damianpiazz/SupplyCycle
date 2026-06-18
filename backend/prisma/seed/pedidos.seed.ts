import { faker } from '@faker-js/faker';
import { prisma } from '../../src/lib/prisma.js';
import { bulkCreate } from './helpers.js';

faker.seed(42);

const ESTADOS = ['PENDIENTE', 'PENDIENTE', 'EN_RUTA', 'ENTREGADO', 'ENTREGADO', 'ENTREGADO', 'ENTREGADO', 'NO_ENTREGADO'] as const;

export async function seedPedidos(clientes: any[], items: any[], repartos: any[], domicilios: any[]) {
  const clienteDomicilioMap = new Map<string, string>();
  for (const d of domicilios) {
    clienteDomicilioMap.set(d.clienteId, d.id);
  }

  const itemPrices: Record<string, number> = {};
  for (const it of items) itemPrices[it.id] = it.precio ?? 500;

  const pedidosData: any[] = [];
  let numPedido = 1;

  for (const reparto of repartos) {
    const numPedidos = faker.number.int({ min: 1, max: 4 });
    const clientesAsignados = faker.helpers.arrayElements(clientes, Math.min(numPedidos, clientes.length));

    for (let i = 0; i < clientesAsignados.length; i++) {
      const numItems = faker.number.int({ min: 1, max: 3 });
      const itemsSeleccionados = faker.helpers.arrayElements(items, numItems);

      pedidosData.push({
        numeroPedido: `P-${String(numPedido++).padStart(5, '0')}`,
        domicilioId: clienteDomicilioMap.get(clientesAsignados[i]!.id)!,
        repartoId: reparto.id,
        fecha: reparto.fecha,
        estado: reparto.estado === 'COMPLETADO' ? faker.helpers.arrayElement(['ENTREGADO', 'ENTREGADO', 'ENTREGADO', 'NO_ENTREGADO']) as string
          : reparto.estado === 'EN_CURSO' ? faker.helpers.arrayElement(['PENDIENTE', 'EN_RUTA', 'ENTREGADO']) as string
          : 'PENDIENTE',
        motivoFalla: null as string | null,
        orden: i + 1,
        itemsData: itemsSeleccionados.map(it => ({
          itemId: it.id,
          cantidad: faker.number.int({ min: 1, max: 4 }),
          precioUnitario: itemPrices[it.id] ?? 500,
        })),
      });
    }
  }

  // Ensure we have at least 1000 pedidos
  while (pedidosData.length < 1000) {
    const cliente = faker.helpers.arrayElement(clientes);
    const numItems = faker.number.int({ min: 1, max: 3 });
    const itemsSel = faker.helpers.arrayElements(items, numItems);
    const fecha = faker.date.between({ from: new Date('2026-01-01'), to: new Date() });

    pedidosData.push({
      numeroPedido: `P-${String(numPedido++).padStart(5, '0')}`,
      domicilioId: clienteDomicilioMap.get(cliente.id)!,
      repartoId: null,
      fecha,
      estado: faker.helpers.arrayElement(['PENDIENTE', 'CANCELADO']) as string,
      motivoFalla: null as string | null,
      orden: 1,
      itemsData: itemsSel.map(it => ({
        itemId: it.id, cantidad: faker.number.int({ min: 1, max: 3 }), precioUnitario: itemPrices[it.id] ?? 500,
      })),
    });
  }

  // Insert pedidos in batches
  console.log(`  ── Insertando ${pedidosData.length} pedidos...`);
  let pedCount = 0;
  const allPedidos: any[] = [];
  for (let i = 0; i < pedidosData.length; i += 100) {
    const batch = pedidosData.slice(i, i + 100);
    for (const pd of batch) {
      const { itemsData, ...pedidoFields } = pd;
      const p = await prisma.pedido.create({
        data: {
          ...pedidoFields,
          motivoFalla: pd.estado === 'NO_ENTREGADO' ? faker.helpers.arrayElement(['CLIENTE_AUSENTE', 'DOMICILIO_CERRADO', 'RECHAZADO']) : null,
          items: { create: itemsData },
        },
      });
      allPedidos.push(p);
      pedCount++;
    }
    console.log(`    ... ${pedCount}/${pedidosData.length} pedidos`);
  }

  console.log(`  ✅ ${allPedidos.length} pedidos creados`);
  return allPedidos;
}

export async function cleanPedidos() {
  await prisma.pedidoItem.deleteMany();
  await prisma.pedido.deleteMany();
}
