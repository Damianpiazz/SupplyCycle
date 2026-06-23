import { faker } from '@faker-js/faker';
import { prisma } from '../../src/lib/prisma.js';
import { bulkCreate } from './helpers.js';

faker.seed(42);

export async function seedReclamos(clientes: any[]) {
  const data = Array.from({ length: Math.min(50, clientes.length * 2) }, () => ({
    clienteId: faker.helpers.arrayElement(clientes).id,
  }));

  await bulkCreate(prisma.reclamo, data, 'reclamos');
  return prisma.reclamo.findMany({ take: data.length, orderBy: { creadoEn: 'asc' } });
}

export async function cleanReclamos() {
  await prisma.reclamo.deleteMany();
}
