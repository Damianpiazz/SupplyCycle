// TDD-0002: Item types

export interface Item {
  id: string;
  nombre: string;
  descripcion?: string;
  unidad: string;
  activo: boolean;
}

export interface PedidoItem {
  item: Item;
  cantidad: number;
}
