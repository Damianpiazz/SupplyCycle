import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Cliente } from '@/types';

vi.mock('@/services/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { getClientesRequest } from '@/services/clientes';
import { apiClient } from '@/services/api';

const mockClientes: Cliente[] = [
  {
    id: 'cliente-1',
    nombre: 'Juan',
    apellido: 'Pérez',
    telefono: '1234567890',
    domicilio: {
      calle: 'Av. Siempre Viva',
      numero: '123',
      localidad: 'Springfield',
      latitud: -34.0,
      longitud: -58.0,
    },
    diaEntrega: 'LUNES',
    horarioDesde: '09:00',
    horarioHasta: '18:00',
  },
  {
    id: 'cliente-2',
    nombre: 'María',
    apellido: 'García',
    telefono: '0987654321',
    domicilio: {
      calle: 'Calle Falsa',
      numero: '456',
      localidad: 'Shelbyville',
      latitud: -34.5,
      longitud: -58.5,
    },
    diaEntrega: 'MIERCOLES',
    horarioDesde: '10:00',
    horarioHasta: '17:00',
  },
];

describe('getClientesRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe obtener la lista de clientes', async () => {
    (apiClient.get as any).mockResolvedValue({ data: { data: mockClientes } });

    const result = await getClientesRequest();

    expect(apiClient.get).toHaveBeenCalledWith('/clientes');
    expect(result).toEqual(mockClientes);
  });

  it('debe devolver lista vacía si no hay clientes', async () => {
    (apiClient.get as any).mockResolvedValue({ data: { data: [] } });

    const result = await getClientesRequest();

    expect(result).toEqual([]);
  });
});
