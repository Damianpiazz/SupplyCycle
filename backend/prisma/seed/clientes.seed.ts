import { faker } from '@faker-js/faker';
import { prisma } from '../../src/lib/prisma.js';
import { bulkCreate } from './helpers.js';

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'] as const;

faker.seed(42);

const CALLES_LP = [
  'Calle 1', 'Calle 2', 'Calle 3', 'Calle 4', 'Calle 5', 'Calle 6', 'Calle 7', 'Calle 8', 'Calle 9', 'Calle 10',
  'Calle 11', 'Calle 12', 'Calle 13', 'Calle 14', 'Calle 15', 'Calle 16', 'Calle 17', 'Calle 18', 'Calle 19', 'Calle 20',
  'Av. 44', 'Av. 51', 'Av. 53', 'Av. 60', 'Av. 66', 'Av. 7', 'Av. 13', 'Av. 19', 'Av. 25', 'Av. 31',
  'Av. 38', 'Av. 44', 'Av. 72', 'Av. 90', 'Diagonal 73', 'Diagonal 74', 'Diagonal 77', 'Diagonal 80',
  'Calle 115', 'Calle 116', 'Calle 117', 'Calle 118', 'Calle 119', 'Calle 120', 'Calle 121', 'Calle 122',
  'Calle 23', 'Calle 24', 'Calle 25', 'Calle 26', 'Calle 27', 'Calle 28', 'Calle 29', 'Calle 30',
  'Calle 31', 'Calle 32', 'Calle 33', 'Calle 34', 'Calle 35', 'Calle 36', 'Calle 37', 'Calle 38',
  'Calle 39', 'Calle 40', 'Calle 41', 'Calle 42', 'Calle 43', 'Calle 45', 'Calle 46', 'Calle 47',
  'Calle 48', 'Calle 49', 'Calle 50', 'Calle 52', 'Calle 54', 'Calle 55', 'Calle 56', 'Calle 57',
  'Calle 58', 'Calle 59', 'Calle 61', 'Calle 62', 'Calle 63', 'Calle 64', 'Calle 65', 'Calle 67',
  'Calle 68', 'Calle 69', 'Calle 70', 'Calle 71', 'Calle 73', 'Calle 74', 'Calle 75', 'Calle 76',
  'Calle 78', 'Calle 79', 'Calle 81', 'Calle 82',
];

export function generateClientes(count: number) {
  const usados = new Set<string>();

  return Array.from({ length: count }, () => {
    let tel: string;
    do { tel = '221' + faker.number.int({ min: 1000000, max: 9999999 }); } while (usados.has(tel));
    usados.add(tel);

    return {
      nombre: faker.person.firstName(),
      apellido: faker.person.lastName(),
      telefono: tel,
      calle: faker.helpers.arrayElement(CALLES_LP),
      numero: String(faker.number.int({ min: 100, max: 9999 })),
      localidad: 'La Plata',
      latitud: faker.number.float({ min: -34.95, max: -34.88, fractionDigits: 4 }),
      longitud: faker.number.float({ min: -57.98, max: -57.90, fractionDigits: 4 }),
      diaEntrega: faker.helpers.arrayElement(DIAS),
      horarioDesde: `${String(faker.number.int({ min: 7, max: 12 })).padStart(2, '0')}:00`,
      horarioHasta: `${String(faker.number.int({ min: 13, max: 18 })).padStart(2, '0')}:00`,
      observaciones: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
      activo: faker.helpers.maybe(() => false, { probability: 0.05 }) ?? true,
    };
  });
}

export function generateDomicilios(clientes: any[], ciudadId: string) {
  return clientes.map((c, i) => ({
    calle: c.calle,
    entreCalle1: faker.helpers.maybe(() => faker.helpers.arrayElement(CALLES_LP)) ?? null,
    entreCalle2: faker.helpers.maybe(() => faker.helpers.arrayElement(CALLES_LP)) ?? null,
    numero: c.numero,
    piso: faker.helpers.maybe(() => String(faker.number.int({ min: 1, max: 15 }))) ?? null,
    clienteId: c.id ?? `placeholder-${i}`,
    ciudadId,
  }));
}

export function generateDias(domicilios: any[]) {
  return domicilios.map(d => ({
    nombre: faker.helpers.arrayElement(DIAS),
    domicilioId: d.id,
  }));
}

export function generateHorarios(dias: any[]) {
  return dias.map(d => {
    const h = faker.number.int({ min: 7, max: 10 });
    return {
      inicio: new Date(`2026-06-11T${String(h).padStart(2, '0')}:00:00.000Z`),
      fin: new Date(`2026-06-11T${String(h + 2).padStart(2, '0')}:00:00.000Z`),
      diaId: d.id,
    };
  });
}

export async function seedClientes(count = 1000) {
  const data = generateClientes(count);
  await bulkCreate(prisma.cliente, data, 'clientes');
  return prisma.cliente.findMany({ take: count, orderBy: { creadoEn: 'asc' } });
}

export async function seedDomicilios(clientes: any[], ciudadId: string) {
  const clientesIds = clientes.map(c => c.id);
  const data = clientes.map((c, i) => ({
    calle: c.calle,
    entreCalle1: faker.helpers.maybe(() => faker.helpers.arrayElement(CALLES_LP)) ?? null,
    entreCalle2: faker.helpers.maybe(() => faker.helpers.arrayElement(CALLES_LP)) ?? null,
    numero: c.numero,
    piso: faker.helpers.maybe(() => String(faker.number.int({ min: 1, max: 15 }))) ?? null,
    clienteId: clientesIds[i]!,
    ciudadId,
  }));
  await bulkCreate(prisma.domicilio, data, 'domicilios');
  return prisma.domicilio.findMany({ take: data.length, orderBy: { creadoEn: 'asc' } });
}

export async function seedDias(domicilios: any[]) {
  const data = domicilios.map(d => ({
    nombre: faker.helpers.arrayElement(DIAS),
    domicilioId: d.id,
  }));
  await bulkCreate(prisma.dia, data, 'días');
  return prisma.dia.findMany({ take: data.length, orderBy: { creadoEn: 'asc' } });
}

export async function seedHorarios(dias: any[]) {
  const data = dias.map(d => {
    const h = faker.number.int({ min: 7, max: 10 });
    return {
      inicio: new Date(`2026-06-11T${String(h).padStart(2, '0')}:00:00.000Z`),
      fin: new Date(`2026-06-11T${String(h + 2).padStart(2, '0')}:00:00.000Z`),
      diaId: d.id,
    };
  });
  await bulkCreate(prisma.horario, data, 'horarios');
}

export async function cleanClientes() {
  await prisma.cliente.deleteMany();
}

export async function cleanDomicilios() {
  await prisma.domicilio.deleteMany();
}

export async function cleanDias() {
  await prisma.dia.deleteMany();
}

export async function cleanHorarios() {
  await prisma.horario.deleteMany();
}
