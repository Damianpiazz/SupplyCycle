// TDD-0004: Reparto types

import type { Pedido } from './pedido';

export type EstadoReparto = 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';

export interface ResumenCarga {
  producto: string;
  cantidadTotal: number;
  unidad: string;
}

export interface Reparto {
  id: string;
  repartidorId: string;
  fecha: string;
  estado: EstadoReparto;
  horaInicio?: string;
  horaFin?: string;
  pedidos?: Pedido[];
  resumen?: {
    totalPedidos: number;
    completados: number;
    pendientes: number;
  };
}
