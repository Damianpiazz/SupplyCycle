import { faker } from '@faker-js/faker';
import { prisma } from '../../src/lib/prisma.js';
import { bulkCreate } from './helpers.js';

faker.seed(42);

export async function seedVisitas(pedidos: any[], empleados: any[]) {
  const entregados = pedidos.filter(p => p.estado === 'ENTREGADO' || p.estado === 'NO_ENTREGADO');
  if (entregados.length === 0) return [];

  const data = entregados.map(p => ({
    fecha: new Date(p.fecha),
    hora: new Date(new Date(p.fecha).setHours(faker.number.int({ min: 8, max: 16 }), faker.number.int({ min: 0, max: 59 }))),
    falta: p.estado === 'NO_ENTREGADO',
    pedidoId: p.id,
    empleadoId: faker.helpers.arrayElement(empleados).id,
  }));

  await bulkCreate(prisma.visita, data, 'visitas');
  return prisma.visita.findMany({ take: data.length, orderBy: { creadoEn: 'asc' } });
}

export async function cleanVisitas() {
  await prisma.visita.deleteMany();
}
