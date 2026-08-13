import { prisma } from '../../src/lib/prisma.js';

interface ClienteSeed {
  nombre: string;
  apellido: string;
  telefono: string;
  calle: string;
  numero: string;
  entreCalle1?: string | null;
  entreCalle2?: string | null;
  piso?: string | null;
  latitud: number;
  longitud: number;
  observaciones?: string | null;
}

/**
 * 20 clientes con domicilios reales en La Plata.
 * Las coordenadas están distribuidas en el casco urbano
 * (entre calles 3-19 y Av. 44-66).
 */
const CLIENTES: ClienteSeed[] = [
  {
    nombre: 'María', apellido: 'González', telefono: '2215000001',
    calle: 'Calle 12', numero: '1234',
    entreCalle1: '51', entreCalle2: '53', piso: '3B',
    latitud: -34.9215, longitud: -57.9546,
    observaciones: 'Timbre 3B',
  },
  {
    nombre: 'Carlos', apellido: 'López', telefono: '2215000002',
    calle: 'Calle 7', numero: '567',
    entreCalle1: '50', entreCalle2: '51',
    latitud: -34.9180, longitud: -57.9530,
  },
  {
    nombre: 'Ana', apellido: 'Martínez', telefono: '2215000003',
    calle: 'Av. 44', numero: '3456',
    entreCalle1: 'Calle 4', entreCalle2: 'Calle 5', piso: '5',
    latitud: -34.9165, longitud: -57.9505,
    observaciones: 'Edificio blanco, piso 5',
  },
  {
    nombre: 'Pedro', apellido: 'Ramírez', telefono: '2215000004',
    calle: 'Av. 51', numero: '890',
    entreCalle1: 'Calle 11', entreCalle2: 'Calle 12',
    latitud: -34.9210, longitud: -57.9510,
  },
  {
    nombre: 'Laura', apellido: 'Fernández', telefono: '2215000005',
    calle: 'Calle 13', numero: '2345',
    entreCalle1: '54', entreCalle2: '55',
    latitud: -34.9240, longitud: -57.9590,
  },
  {
    nombre: 'Roberto', apellido: 'Díaz', telefono: '2215000006',
    calle: 'Calle 8', numero: '890',
    entreCalle1: '47', entreCalle2: '48',
    latitud: -34.9225, longitud: -57.9560,
  },
  {
    nombre: 'Sofía', apellido: 'Torres', telefono: '2215000007',
    calle: 'Av. 53', numero: '1234',
    entreCalle1: 'Calle 10', entreCalle2: 'Calle 11',
    latitud: -34.9200, longitud: -57.9490,
  },
  {
    nombre: 'Diego', apellido: 'Acosta', telefono: '2215000008',
    calle: 'Calle 5', numero: '567',
    entreCalle1: '45', entreCalle2: '46',
    latitud: -34.9250, longitud: -57.9600,
  },
  {
    nombre: 'Valentina', apellido: 'Mendoza', telefono: '2215000009',
    calle: 'Av. 60', numero: '789',
    entreCalle1: 'Calle 10', entreCalle2: 'Calle 11',
    latitud: -34.9170, longitud: -57.9480,
  },
  {
    nombre: 'Lucas', apellido: 'Rivas', telefono: '2215000010',
    calle: 'Calle 15', numero: '901',
    entreCalle1: '58', entreCalle2: '59',
    latitud: -34.9230, longitud: -57.9570,
  },
  {
    nombre: 'Camila', apellido: 'Pereyra', telefono: '2215000011',
    calle: 'Calle 14', numero: '4567',
    entreCalle1: '56', entreCalle2: '57', piso: '7C',
    latitud: -34.9220, longitud: -57.9550,
  },
  {
    nombre: 'Martín', apellido: 'Sosa', telefono: '2215000012',
    calle: 'Calle 9', numero: '345',
    entreCalle1: '51', entreCalle2: '52',
    latitud: -34.9195, longitud: -57.9515,
  },
  {
    nombre: 'Florencia', apellido: 'Domínguez', telefono: '2215000013',
    calle: 'Calle 11', numero: '678',
    entreCalle1: '52', entreCalle2: '53',
    latitud: -34.9215, longitud: -57.9535,
  },
  {
    nombre: 'Javier', apellido: 'Paz', telefono: '2215000014',
    calle: 'Calle 6', numero: '234',
    entreCalle1: '47', entreCalle2: '48',
    latitud: -34.9235, longitud: -57.9585,
  },
  {
    nombre: 'Paula', apellido: 'Medina', telefono: '2215000015',
    calle: 'Av. 7', numero: '123',
    entreCalle1: '49', entreCalle2: '50',
    latitud: -34.9185, longitud: -57.9540,
  },
  {
    nombre: 'Federico', apellido: 'Ojeda', telefono: '2215000016',
    calle: 'Av. 66', numero: '456',
    entreCalle1: 'Calle 15', entreCalle2: 'Calle 16',
    latitud: -34.9155, longitud: -57.9460,
  },
  {
    nombre: 'Gabriela', apellido: 'Vargas', telefono: '2215000017',
    calle: 'Av. 32', numero: '5678',
    entreCalle1: 'Calle 3', entreCalle2: 'Calle 4',
    latitud: -34.9190, longitud: -57.9510,
  },
  {
    nombre: 'Alejandro', apellido: 'Castillo', telefono: '2215000018',
    calle: 'Calle 3', numero: '890',
    entreCalle1: '42', entreCalle2: '43',
    latitud: -34.9270, longitud: -57.9620,
  },
  {
    nombre: 'Lucía', apellido: 'Moreno', telefono: '2215000019',
    calle: 'Diagonal 73', numero: '1234',
    entreCalle1: 'Calle 4', entreCalle2: 'Calle 5',
    latitud: -34.9185, longitud: -57.9430,
  },
  {
    nombre: 'Gustavo', apellido: 'Roldán', telefono: '2215000020',
    calle: 'Calle 16', numero: '3456',
    entreCalle1: '60', entreCalle2: '61', piso: '4',
    latitud: -34.9245, longitud: -57.9580,
  },
];

export interface ClienteDomicilio {
  clienteId: string;
  domicilioId: string;
}

export async function seedClientes(ciudadId: string): Promise<ClienteDomicilio[]> {
  const results: ClienteDomicilio[] = [];

  for (const c of CLIENTES) {
    const cliente = await prisma.cliente.create({
      data: {
        nombre: c.nombre,
        apellido: c.apellido,
        telefono: c.telefono,
        observaciones: c.observaciones ?? null,
        activo: true,
      },
    });

    const domicilio = await prisma.domicilio.create({
      data: {
        calle: c.calle,
        numero: c.numero,
        entreCalle1: c.entreCalle1 ?? null,
        entreCalle2: c.entreCalle2 ?? null,
        piso: c.piso ?? null,
        localidad: 'La Plata',
        latitud: c.latitud,
        longitud: c.longitud,
        principal: true,
        clienteId: cliente.id,
        ciudadId,
      },
    });

    results.push({ clienteId: cliente.id, domicilioId: domicilio.id });
  }

  console.log(`  ✅ ${results.length} clientes con domicilios creados`);
  return results;
}
