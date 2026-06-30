import { prisma } from '../../src/lib/prisma.js';

export async function seedDomicilios(clientes: any[], ciudadId: string) {
  const domiciliosData = [
    { calle: 'Calle 7', numero: '1234', clienteIdx: 0, entreCalle1: 'Calle 8', entreCalle2: 'Calle 9', piso: '3B' },
    { calle: 'Calle 8', numero: '567', clienteIdx: 1 },
    { calle: 'Av. 44', numero: '3456', clienteIdx: 2, piso: '5' },
    { calle: 'Calle 12', numero: '789', clienteIdx: 3 },
    { calle: 'Calle 50', numero: '2345', clienteIdx: 4 },
    { calle: 'Av. 51', numero: '890', clienteIdx: 5 },
    { calle: 'Calle 10', numero: '456', clienteIdx: 6 },
    { calle: 'Calle 13', numero: '5678', clienteIdx: 7 },
    { calle: 'Av. 32', numero: '901', clienteIdx: 8 },
    { calle: 'Calle 6', numero: '123', clienteIdx: 9, observacion: 'Casa con rejas negras' },
    { calle: 'Calle 11', numero: '234', clienteIdx: 10 },
    { calle: 'Calle 9', numero: '3456', clienteIdx: 11 },
    { calle: 'Av. 53', numero: '7890', clienteIdx: 12, piso: '2C' },
    { calle: 'Calle 14', numero: '5678', clienteIdx: 13 },
    { calle: 'Calle 5', numero: '890', clienteIdx: 14 },
  ];

  const domicilios: any[] = [];
  for (const d of domiciliosData) {
    const domicilio = await prisma.domicilio.create({
      data: {
        calle: d.calle,
        entreCalle1: (d as any).entreCalle1 || null,
        entreCalle2: (d as any).entreCalle2 || null,
        numero: d.numero,
        piso: (d as any).piso || null,
        localidad: 'La Plata',
        clienteId: clientes[d.clienteIdx]!.id,
        ciudadId,
      },
    });
    domicilios.push(domicilio);
  }

  console.log(`  ✅ ${domicilios.length} domicilios creados`);
  return domicilios;
}

export async function cleanDomicilios() {
  await prisma.domicilio.deleteMany();
}
