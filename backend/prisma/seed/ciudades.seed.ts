import { prisma } from '../../src/lib/prisma.js';

export async function seedCiudades() {
  const ciudad = await prisma.ciudad.create({ data: { nombre: 'La Plata' } });
  console.log(`  ✅ 1 ciudad creada`);
  return ciudad;
}

export async function cleanCiudades() {
  await prisma.ciudad.deleteMany();
}
