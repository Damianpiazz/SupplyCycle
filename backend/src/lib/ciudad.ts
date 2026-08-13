import { prisma } from './prisma.js';

// SPEC-08 TDD-0066: shared getOrCreateCiudad helper. Single source of truth —
// previously duplicated in the clientes and domicilios services. No behavior
// change: same case-insensitive lookup, same create-on-miss semantics.

/**
 * Finds a city by name (case-insensitive) or creates it when missing.
 * Shared by the clientes and domicilios features (SPEC-08 TDD-0066).
 */
export async function getOrCreateCiudad(localidad: string) {
  let ciudad = await prisma.ciudad.findFirst({
    where: { nombre: { equals: localidad, mode: 'insensitive' } },
  });
  if (!ciudad) {
    ciudad = await prisma.ciudad.create({ data: { nombre: localidad } });
  }
  return ciudad;
}
