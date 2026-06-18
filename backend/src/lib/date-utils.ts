export function timeStringToDate(time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date(0);
  d.setUTCHours(h ?? 0, m ?? 0, 0, 0);
  return d;
}

export function dateToTimeString(date: Date): string {
  return date.toISOString().slice(11, 16);
}
