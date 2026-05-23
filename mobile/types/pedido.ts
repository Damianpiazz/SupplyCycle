// TDD-0003: Pedido types

import type { Cliente } from './cliente';
import type { PedidoItem } from './item';

export type EstadoPedido = 'PENDIENTE' | 'ENTREGADO' | 'NO_ENTREGADO';

export type MotivoCancelacion =
  | 'CLIENTE_AUSENTE'
  | 'DIRECCION_INCORRECTA'
  | 'ACCESO_DENEGADO'
  | 'OTRO';

export interface Pedido {
  id: string;
  orden: number;
  estado: EstadoPedido;
  fecha: string;
  motivoFalla?: string;
  cliente: Cliente;
  items: PedidoItem[];
}
