// TDD-0001: Cliente types

export type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO';

export interface Domicilio {
  calle: string;
  numero: string;
  localidad: string;
  latitud: number;
  longitud: number;
}

export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  domicilio: Domicilio;
  diaEntrega: DiaSemana;
  horarioDesde: string;
  horarioHasta: string;
  observaciones?: string;
}
