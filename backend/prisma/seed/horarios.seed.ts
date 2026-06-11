import { prisma } from '../../src/lib/prisma.js';

export async function seedHorarios(dias: any[]) {
  const slots: { diaIdx: number; inicio: string; fin: string }[] = [
    { diaIdx: 0, inicio: '2026-06-11T09:00:00.000Z', fin: '2026-06-11T11:00:00.000Z' },
    { diaIdx: 1, inicio: '2026-06-11T10:00:00.000Z', fin: '2026-06-11T12:00:00.000Z' },
    { diaIdx: 2, inicio: '2026-06-11T11:00:00.000Z', fin: '2026-06-11T13:00:00.000Z' },
    { diaIdx: 3, inicio: '2026-06-11T12:00:00.000Z', fin: '2026-06-11T14:00:00.000Z' },
    { diaIdx: 4, inicio: '2026-06-11T14:00:00.000Z', fin: '2026-06-11T16:00:00.000Z' },
    { diaIdx: 5, inicio: '2026-06-11T08:00:00.000Z', fin: '2026-06-11T10:00:00.000Z' },
    { diaIdx: 6, inicio: '2026-06-11T09:00:00.000Z', fin: '2026-06-11T11:00:00.000Z' },
    { diaIdx: 7, inicio: '2026-06-11T11:00:00.000Z', fin: '2026-06-11T13:00:00.000Z' },
    { diaIdx: 8, inicio: '2026-06-11T13:00:00.000Z', fin: '2026-06-11T15:00:00.000Z' },
    { diaIdx: 9, inicio: '2026-06-11T10:00:00.000Z', fin: '2026-06-11T12:00:00.000Z' },
    { diaIdx: 10, inicio: '2026-06-11T14:00:00.000Z', fin: '2026-06-11T16:00:00.000Z' },
    { diaIdx: 11, inicio: '2026-06-11T08:00:00.000Z', fin: '2026-06-11T10:00:00.000Z' },
    { diaIdx: 12, inicio: '2026-06-11T15:00:00.000Z', fin: '2026-06-11T17:00:00.000Z' },
    { diaIdx: 13, inicio: '2026-06-11T10:00:00.000Z', fin: '2026-06-11T12:00:00.000Z' },
    { diaIdx: 14, inicio: '2026-06-11T09:00:00.000Z', fin: '2026-06-11T11:00:00.000Z' },
  ];

  const horarios: any[] = [];
  for (const s of slots) {
    const horario = await prisma.horario.create({
      data: { inicio: new Date(s.inicio), fin: new Date(s.fin), diaId: dias[s.diaIdx]!.id },
    });
    horarios.push(horario);
  }

  console.log(`  ✅ ${horarios.length} horarios creados`);
  return horarios;
}

export async function cleanHorarios() {
  await prisma.horario.deleteMany();
}
