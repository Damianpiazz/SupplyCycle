// TDD-0001: Cliente types

export type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO';

export interface Horario {
  id: string;
  inicio: string;
  fin: string;
}

export interface Dia {
  id: string;
  nombre: DiaSemana;
  horarios: Horario[];
}

export interface Domicilio {
  id: string;
  calle: string;
  numero: string;
  localidad: string;
  latitud?: number;
  longitud?: number;
  principal: boolean;
  dias: Dia[];
}

export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  observaciones?: string;
  activo?: boolean;
  domicilios: Domicilio[];
}

export interface HorarioInput {
  inicio: string;
  fin: string;
}

export interface DiaInput {
  nombre: DiaSemana;
  horarios: HorarioInput[];
}

export interface DomicilioInput {
  calle: string;
  numero: string;
  localidad: string;
  latitud?: number;
  longitud?: number;
  principal?: boolean;
  dias: DiaInput[];
}

export interface CrearClienteInput {
  nombre: string;
  apellido: string;
  telefono: string;
  observaciones?: string;
  domicilios: DomicilioInput[];
}

export interface ActualizarClienteInput extends Partial<CrearClienteInput> {}
