import { apiClient } from './api';
import type { Item } from '@/types';

export async function getItemsRequest(): Promise<Item[]> {
  const response = await apiClient.get<{ data: Item[] }>('/items');
  return response.data.data;
}
