import { faker } from '@faker-js/faker';
import { prisma } from '../../src/lib/prisma.js';
import { bulkCreate } from './helpers.js';

faker.seed(42);

export function* dateRange(from: Date, to: Date) {
  const d = new Date(from);
  while (d <= to) {
    yield new Date(d);
    d.setDate(d.getDate() + 1);
  }
}

export function generateRepartos(repartidores: any[], startDate: Date, endDate: Date) {
  const data: any[] = [];
  const estadoPool = ['COMPLETADO', 'COMPLETADO', 'COMPLETADO', 'COMPLETADO', 'COMPLETADO', 'EN_CURSO', 'PENDIENTE'];

  for (const day of dateRange(startDate, endDate)) {
    for (const r of repartidores) {
      const isPast = day < new Date();
      const isToday = day.toDateString() === new Date().toDateString();
      const estado = isToday ? 'EN_CURSO' : isPast ? faker.helpers.arrayElement(['COMPLETADO', 'COMPLETADO', 'COMPLETADO', 'COMPLETADO', 'PENDIENTE']) : 'PENDIENTE';
      data.push({
        repartidorId: r.id,
        fecha: day,
        estado,
        horaInicio: isPast || isToday ? `${String(faker.number.int({ min: 7, max: 9 })).padStart(2, '0')}:30` : null,
        horaFin: isPast ? `${String(faker.number.int({ min: 13, max: 17 })).padStart(2, '0')}:00` : null,
      });
    }
  }

  return data;
}

export async function seedRepartos(repartidores: any[]) {
  const start = new Date('2026-01-01');
  const end = new Date();
  const data = generateRepartos(repartidores, start, end);
  await bulkCreate(prisma.reparto, data as any, 'repartos');
  return prisma.reparto.findMany({ take: data.length, orderBy: { fecha: 'asc' } });
}

export async function cleanRepartos() {
  await prisma.reparto.deleteMany();
}
