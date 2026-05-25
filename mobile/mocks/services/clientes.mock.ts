import { MOCK_CLIENTES } from '@/mocks/mockData';
import type { Cliente } from '@/types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockGetClientesRequest(): Promise<Cliente[]> {
  await delay(300);
  return MOCK_CLIENTES;
}
