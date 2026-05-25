import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Item } from '@/types';

vi.mock('@/services/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { getItemsRequest } from '@/services/items';
import { apiClient } from '@/services/api';

const mockItems: Item[] = [
  {
    id: 'item-1',
    nombre: 'Leche',
    descripcion: 'Leche entera 1L',
    unidad: 'Litro',
    precio: 1200,
    activo: true,
  },
  {
    id: 'item-2',
    nombre: 'Pan',
    descripcion: 'Pan francés',
    unidad: 'Unidad',
    precio: 800,
    activo: true,
  },
];

describe('getItemsRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe obtener la lista de items', async () => {
    (apiClient.get as any).mockResolvedValue({ data: { data: mockItems } });

    const result = await getItemsRequest();

    expect(apiClient.get).toHaveBeenCalledWith('/items');
    expect(result).toEqual(mockItems);
  });

  it('debe devolver lista vacía si no hay items', async () => {
    (apiClient.get as any).mockResolvedValue({ data: { data: [] } });

    const result = await getItemsRequest();

    expect(result).toEqual([]);
  });
});
