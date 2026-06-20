// TDD-0003: Pedido types

import type { Cliente, Domicilio } from './cliente';
import type { PedidoItem } from './item';

export type EstadoPedido = 'PENDIENTE' | 'EN_RUTA' | 'ENTREGADO' | 'NO_ENTREGADO' | 'CANCELADO';

export type MotivoCancelacion =
  | 'CLIENTE_AUSENTE'
  | 'DIRECCION_INCORRECTA'
  | 'ACCESO_DENEGADO'
  | 'OTRO';

export interface Pedido {
  id: string;
  numeroPedido: string;
  orden: number;
  estado: EstadoPedido;
  fecha: string;
  motivoFalla: string | null;
  total?: number;
  itemsCount?: number;
  cliente: Cliente;
  domicilio: Domicilio;
  items: PedidoItem[];
}
