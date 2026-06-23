// RF-08: Estadísticas diarias y mensuales

export interface EstadisticasDiarias {
  fecha: string;
  totalPedidos: number;
  entregasRealizadas: number;
  entregasNoRealizadas: number;
  volumenProductos: Array<{
    itemId: string;
    nombre: string;
    unidad: string;
    cantidadTotal: number;
  }>;
  desempenioRepartos: {
    total: number;
    iniciados: number;
    finalizados: number;
  };
}

export interface EstadisticasMensuales {
  anio: number;
  mes: number;
  totalPedidos: number;
  entregasRealizadas: number;
  entregasNoRealizadas: number;
  totalRepartosIniciados: number;
  totalRepartosFinalizados: number;
  dias: Array<{
    dia: number;
    totalPedidos: number;
    entregasRealizadas: number;
    entregasNoRealizadas: number;
  }>;
}
