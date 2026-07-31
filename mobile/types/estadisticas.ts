// RF-08: Estadísticas diarias y mensuales
// RF-11: Demanda estimada

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

// ─── RF-11: Demanda estimada ───────────────────────────────────────────────

export interface DemandaProducto {
  itemId: string;
  nombre: string;
  unidad: string;
  cantidadEstimada: number;
  clientesEstimados: number;
}

export interface ClienteDemandaResumen {
  clienteId: string;
  nombre: string;
  apellido: string;
  frecuenciaPromedioDias: number;
  proximoPedidoEstimado: string;
  unidadesEstimadas: number;
}

export interface DemandaEstimada {
  periodo: number;
  fechaDesde: string;
  fechaHasta: string;
  totalClientes: number;
  clientesConEstimacion: number;
  demandaPorProducto: DemandaProducto[];
  demandaTotalUnidades: number;
  frecuenciaPromedioGlobal: number;
  clientes?: ClienteDemandaResumen[];
}
