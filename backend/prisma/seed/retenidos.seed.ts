import { faker } from '@faker-js/faker';
import { prisma } from '../../src/lib/prisma.js';
import { bulkCreate } from './helpers.js';

faker.seed(42);

const ESTADOS_RET = ['RETENIDO', 'RETENIDO', 'RETENIDO', 'DEVUELTO', 'PERDIDO'] as const;

export async function seedRetenidos(clientes: any[], items: any[], pedidos: any[]) {
  const data: any[] = [];
  const usados = new Set<string>();

  // Generate ~1000 retenidos from a subset of pedidos
  const pedidosSubset = pedidos.length > 1000 ? faker.helpers.arrayElements(pedidos, 1000) : pedidos;

  for (const p of pedidosSubset) {
    const numRet = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < numRet; i++) {
      const item = faker.helpers.arrayElement(items);
      const key = `${p.id}-${item.id}-${i}`;
      if (usados.has(key)) continue;
      usados.add(key);

      const inicio = new Date(p.fecha);
      const fin = faker.helpers.maybe(() => {
        const d = new Date(inicio);
        d.setDate(d.getDate() + faker.number.int({ min: 5, max: 60 }));
        return d;
      }) ?? null;

      data.push({
        estado: faker.helpers.arrayElement(ESTADOS_RET),
        inicio,
        fin,
        itemId: item.id,
        clienteId: p.clienteId,
        pedidoId: p.id,
      });

      if (data.length >= 1000) break;
    }
    if (data.length >= 1000) break;
  }

  await bulkCreate(prisma.retenido, data, 'retenidos');
  return prisma.retenido.findMany({ take: data.length, orderBy: { creadoEn: 'asc' } });
}

export async function cleanRetenidos() {
  await prisma.retenido.deleteMany();
}
