import { prisma } from '../../src/lib/prisma.js';

/** Generate a date at midnight (UTC-safe for date-only fields) */
function dateOnly(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
}

const DIAS_SEMANA = [
  { label: 'Lunes', date: dateOnly(2026, 5, 29) },
  { label: 'Martes', date: dateOnly(2026, 5, 30) },
  { label: 'Miércoles', date: dateOnly(2026, 6, 1) },
  { label: 'Jueves', date: dateOnly(2026, 6, 2) },
  { label: 'Viernes', date: dateOnly(2026, 6, 3) },
  { label: 'Sábado', date: dateOnly(2026, 6, 4) },
] as const;

export interface DiaReparto {
  label: string;
  date: Date;
  reparto: any;
}

export async function seedRepartosSemana(repartidorId: string): Promise<DiaReparto[]> {
  const results: DiaReparto[] = [];

  for (const dia of DIAS_SEMANA) {
    const isPast = dia.date < dateOnly(2026, 5, 30); // before today (Tue 30)
    const isToday = dia.date.getTime() === dateOnly(2026, 5, 30).getTime();

    let estado: string;
    let horaInicio: string | null;
    let horaFin: string | null;

    if (isPast) {
      estado = 'COMPLETADO';
      horaInicio = '08:30';
      horaFin = '15:00';
    } else if (isToday) {
      estado = 'EN_CURSO';
      horaInicio = '08:30';
      horaFin = null;
    } else {
      estado = 'PENDIENTE';
      horaInicio = null;
      horaFin = null;
    }

    // Upsert: find existing reparto for this repartidor + date, or create
    const existing = await prisma.reparto.findUnique({
      where: {
        repartidorId_fecha: { repartidorId, fecha: dia.date },
      },
    });

    if (existing) {
      await prisma.reparto.update({
        where: { id: existing.id },
        data: { estado, horaInicio, horaFin },
      });
      results.push({ ...dia, reparto: existing });
    } else {
      const reparto = await prisma.reparto.create({
        data: {
          repartidorId,
          fecha: dia.date,
          estado,
          horaInicio,
          horaFin,
        },
      });
      results.push({ ...dia, reparto });
    }
  }

  console.log(`  ✅ ${results.length} repartos actualizados (lun-sáb)`);
  return results;
}
