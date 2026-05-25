import { MOCK_REPARTO } from '@/mocks/mockData';
import type { Reparto } from '@/types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockGetRepartosDisponiblesRequest(): Promise<Reparto[]> {
  await delay(300);
  return [MOCK_REPARTO];
}
