/** Create a Date from YYYY-MM-DD string without timezone conversion */
export function dateFromISODate(dateStr: string): Date {
  const [y, m, d] = dateStr.slice(0, 10).split('-');
  return new Date(Number(y), Number(m) - 1, Number(d));
}

/** Format a calendar-date Date to YYYY-MM-DD without timezone shift */
export function fmtDate(d: Date): string {
  const y = String(d.getFullYear());
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
