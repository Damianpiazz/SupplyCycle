// TDD-0002: Item types

export interface Item {
  id: string;
  nombre: string;
  descripcion?: string;
  unidad: string;
  precio?: number;
  activo: boolean;
}

export interface PedidoItem {
  id: string;
  item: Item;
  cantidad: number;
  precioUnitario?: number;
}
