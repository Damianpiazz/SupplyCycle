import { MOCK_ITEMS } from '@/mocks/mockData';
import type { Item } from '@/types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockGetItemsRequest(): Promise<Item[]> {
  await delay(300);
  return MOCK_ITEMS.filter((i) => i.activo);
}
