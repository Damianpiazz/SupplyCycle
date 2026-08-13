import { faker } from '@faker-js/faker';
import { prisma } from '../../src/lib/prisma.js';

/** Batch createMany helper with progress logging */
export async function bulkCreate<T extends Record<string, unknown>>(
  model: { createMany: (args: { data: T[]; skipDuplicates?: boolean }) => Promise<{ count: number }> },
  data: T[],
  label: string,
  batchSize = 200,
) {
  let total = 0;
  for (let i = 0; i < data.length; i += batchSize) {
    const { count } = await model.createMany({ data: data.slice(i, i + batchSize), skipDuplicates: true });
    total += count;
  }
  console.log(`  ✅ ${total} ${label} creados`);
  return total;
}

/**
 * Generate a random coordinate within La Plata's urban area.
 * Uses street-grid-based distribution for realistic-looking positions.
 */
export function coordenadasLaPlata(): { lat: number; lng: number } {
  // La Plata grid boundaries (approximate):
  //   Lat: -34.914 (north, Calle 44) to -34.928 (south, Calle 60)
  //   Lng: -57.963 (west, Calle 19) to -57.942 (east, Calle 1)
  const angle = Math.random() * 2 * Math.PI;
  const radius = Math.sqrt(Math.random()) * 0.012; // ~1.3km radius
  const centerLat = -34.9215;
  const centerLng = -57.9546;

  return {
    lat: centerLat + radius * Math.cos(angle),
    lng: centerLng + radius * Math.sin(angle),
  };
}

/** Common La Plata street names for seed data */
export const CALLES_LP = [
  'Calle 1', 'Calle 2', 'Calle 3', 'Calle 4', 'Calle 5', 'Calle 6',
  'Calle 7', 'Calle 8', 'Calle 9', 'Calle 10', 'Calle 11', 'Calle 12',
  'Calle 13', 'Calle 14', 'Calle 15', 'Calle 16', 'Calle 17', 'Calle 18',
  'Calle 19', 'Calle 20',
  'Av. 44', 'Av. 51', 'Av. 53', 'Av. 60', 'Av. 66',
  'Av. 7', 'Av. 13', 'Av. 19', 'Av. 31', 'Av. 32',
  'Diagonal 73', 'Diagonal 74', 'Diagonal 77', 'Diagonal 80',
];

/** Convert HH:mm string to UTC Date for the horario model */
export function timeToDate(hours: number, minutes = 0): Date {
  const d = new Date(0);
  d.setUTCHours(hours, minutes, 0, 0);
  return d;
}
