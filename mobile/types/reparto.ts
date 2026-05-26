// TDD-0004: Reparto types

import type { Pedido } from './pedido';

export type EstadoReparto = 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';

export interface ResumenCarga {
  producto: string;
  cantidadTotal: number;
  unidad: string;
}

export interface RepartoAdminListItem {
  id: string;
  fecha: string;
  estado: EstadoReparto;
  horaInicio?: string;
  horaFin?: string;
  repartidor: {
    id: string;
    nombre: string;
    apellido: string;
  };
  pedidosCount: number;
  resumen: {
    totalPedidos: number;
    completados: number;
    pendientes: number;
  };
}

export interface RepartoAdminDetalle {
  id: string;
  repartidorId: string;
  fecha: string;
  estado: EstadoReparto;
  horaInicio?: string;
  horaFin?: string;
  repartidor: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  resumen: {
    totalPedidos: number;
    completados: number;
    pendientes: number;
  };
  pedidos: Pedido[];
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
