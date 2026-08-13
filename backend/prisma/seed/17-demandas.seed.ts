import { prisma } from '../../src/lib/prisma.js';
import type { ClienteDomicilio } from './14-clientes-semana.seed.js';

/**
 * Agrega 4 semanas de pedidos históricos para los 20 clientes de La Plata
 * para que el algoritmo de estimación de demanda (RF-11) tenga datos
 * significativos con múltiples pedidos por cliente a lo largo del tiempo.
 */
export async function seedDemandas(
  clientes: ClienteDomicilio[],
  items: Array<{ id: string; precio: number }>,
) {
  const today = new Date(Date.UTC(2026, 5, 30, 0, 0, 0, 0)); // Tue 30 Jun
  const itemIds = items.map((i) => i.id);
  const itemPrices: Record<string, number> = {};
  for (const it of items) itemPrices[it.id] = it.precio;

  let total = 0;
  let numPedido = 1000;

  // 4 semanas hacia atrás, lunes a sábado
  for (let semana = 1; semana <= 4; semana++) {
    for (let dia = 0; dia < 6; dia++) {
      const fecha = new Date(today);
      fecha.setDate(fecha.getDate() - (semana * 7) + dia);

      // Cada día: ~10-15 clientes hacen pedido (rotación para que no siempre los mismos)
      const shuffled = [...clientes].sort(() => Math.random() - 0.5);
      const dayClientes = shuffled.slice(0, 10 + Math.floor(Math.random() * 6));

      for (const cd of dayClientes) {
        const numItems = 1 + Math.floor(Math.random() * 2);
        const selectedItems: string[] = [];
        for (let k = 0; k < numItems; k++) {
          selectedItems.push(itemIds[Math.floor(Math.random() * itemIds.length)]!);
        }
        const uniqueItems = [...new Set(selectedItems)];

        await prisma.pedido.create({
          data: {
            numeroPedido: `W-${String(numPedido++).padStart(5, '0')}`,
            domicilioId: cd.domicilioId,
            fecha,
            estado: Math.random() < 0.85 ? 'ENTREGADO' : 'NO_ENTREGADO',
            motivoFalla: null,
            orden: 1,
            items: {
              create: uniqueItems.map((itemId) => ({
                itemId,
                cantidad: 1 + Math.floor(Math.random() * 4),
                precioUnitario: itemPrices[itemId] ?? 500,
              })),
            },
          },
        });

        total++;
      }
    }
  }

  console.log(`  ✅ ${total} pedidos históricos creados para estimación de demanda`);
}
