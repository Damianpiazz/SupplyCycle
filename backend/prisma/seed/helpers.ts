import { prisma } from '../../src/lib/prisma.js';

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
