import { prisma } from '../../src/lib/prisma.js';
import type { ClienteDomicilio } from './14-clientes-semana.seed.js';
import type { DiaReparto } from './15-repartos-semana.seed.js';

const PEDIDOS_POR_DIA = 20;

interface ItemSeed {
  id: string;
  precio: number;
  nombre: string;
}

/**
 * Create 20 pedidos per day for each reparto day.
 * Past days → ENTREGADO / NO_ENTREGADO
 * Today     → PENDIENTE / EN_RUTA / ENTREGADO
 * Future    → PENDIENTE
 */
export async function seedPedidos(
  clientes: ClienteDomicilio[],
  items: ItemSeed[],
  diasReparto: DiaReparto[],
) {
  let totalPedidos = 0;
  let numPedido = 1;

  const itemPrices: Record<string, number> = {};
  for (const it of items) itemPrices[it.id] = it.precio;

  const today = new Date(Date.UTC(2026, 5, 30, 0, 0, 0, 0)); // Tue 30 Jun

  // Map items for random selection
  const itemIds = items.map(i => i.id);

  for (const dia of diasReparto) {
    const isPast = dia.date < today;
    const isToday = dia.date.getTime() === today.getTime();

    // Shuffle clients for this day so each day gets a different assignment
    const shuffled = [...clientes].sort(() => Math.random() - 0.5);
    const dayClientes = shuffled.slice(0, PEDIDOS_POR_DIA);

    let diaCount = 0;

    for (const cd of dayClientes) {
      // Pick 1-3 random items
      const numItems = 1 + Math.floor(Math.random() * 3);
      const selectedItems: string[] = [];
      for (let k = 0; k < numItems; k++) {
        selectedItems.push(itemIds[Math.floor(Math.random() * itemIds.length)]!);
      }

      // Deduplicate
      const uniqueItems = [...new Set(selectedItems)];

      // Determine estado based on day
      let estado: string;
      let motivoFalla: string | null = null;

      if (isPast) {
        // Past days: mostly ENTREGADO, some NO_ENTREGADO
        const r = Math.random();
        if (r < 0.8) {
          estado = 'ENTREGADO';
        } else {
          estado = 'NO_ENTREGADO';
          motivoFalla = (['CLIENTE_AUSENTE', 'DOMICILIO_CERRADO', 'RECHAZADO'] as const)[
            Math.floor(Math.random() * 3)
          ]!;
        }
      } else if (isToday) {
        // Today: mixed
        const r = Math.random();
        if (r < 0.5) {
          estado = 'PENDIENTE';
        } else if (r < 0.8) {
          estado = 'EN_RUTA';
        } else {
          estado = 'ENTREGADO';
        }
      } else {
        // Future: all PENDIENTE
        estado = 'PENDIENTE';
      }

      const pedidoNumero = `W-${String(numPedido++).padStart(5, '0')}`;

      await prisma.pedido.create({
        data: {
          numeroPedido: pedidoNumero,
          domicilioId: cd.domicilioId,
          repartoId: dia.reparto.id,
          fecha: dia.date,
          estado,
          motivoFalla,
          orden: diaCount + 1,
          items: {
            create: uniqueItems.map(itemId => ({
              itemId,
              cantidad: 1 + Math.floor(Math.random() * 4),
              precioUnitario: itemPrices[itemId] ?? 500,
            })),
          },
        },
      });

      diaCount++;
      totalPedidos++;
    }

    console.log(`    ${dia.label}: ${diaCount} pedidos`);
  }

  console.log(`  ✅ ${totalPedidos} pedidos creados en total`);
}
