import { prisma } from '../../src/lib/prisma.js';

type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';

export async function seedDias(domicilios: any[]) {
  // Assign days matching each client's diaEntrega
  const assignments: { domicilioIdx: number; dia: DiaSemana }[] = [
    { domicilioIdx: 0, dia: 'LUNES' },
    { domicilioIdx: 1, dia: 'LUNES' },
    { domicilioIdx: 2, dia: 'MARTES' },
    { domicilioIdx: 3, dia: 'MARTES' },
    { domicilioIdx: 4, dia: 'MIERCOLES' },
    { domicilioIdx: 5, dia: 'MIERCOLES' },
    { domicilioIdx: 6, dia: 'JUEVES' },
    { domicilioIdx: 7, dia: 'JUEVES' },
    { domicilioIdx: 8, dia: 'VIERNES' },
    { domicilioIdx: 9, dia: 'VIERNES' },
    { domicilioIdx: 10, dia: 'LUNES' },
    { domicilioIdx: 11, dia: 'MARTES' },
    { domicilioIdx: 12, dia: 'MIERCOLES' },
    { domicilioIdx: 13, dia: 'JUEVES' },
    { domicilioIdx: 14, dia: 'VIERNES' },
  ];

  const dias: any[] = [];
  for (const a of assignments) {
    const dia = await prisma.dia.create({
      data: { nombre: a.dia, domicilioId: domicilios[a.domicilioIdx]!.id },
    });
    dias.push(dia);
  }

  console.log(`  ✅ ${dias.length} días asignados`);
  return dias;
}

export async function cleanDias() {
  await prisma.dia.deleteMany();
}
