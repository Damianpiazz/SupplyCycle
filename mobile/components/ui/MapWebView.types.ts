export interface LineString {
  type: 'LineString';
  coordinates: [number, number][];
}

export interface MapPedido {
  id: string;
  estado: string;
  numeroPedido: string;
  latitud: number;
  longitud: number;
  clienteNombre: string;
  clienteApellido: string;
  domicilioCalle: string;
  domicilioNumero: string;
}

export interface ColorMap {
  [estado: string]: string;
}

export interface MapWebViewProps {
  pedidos: MapPedido[];
  routeGeoJSON: LineString | null;
  selectedPedidoId: string | null;
  darkMode: boolean;
  colorMap: ColorMap;
  userLocation: [number, number] | null;
  onSelectPedido: (id: string | null) => void;
}
