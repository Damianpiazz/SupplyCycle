/** Extract YYYY, MM, DD from an ISO date string without timezone conversion */
export function parseISODate(iso: string): { year: string; month: string; day: string } {
  const [datePart] = iso.split('T');
  const [year, month, day] = datePart.split('-');
  return { year, month, day };
}

/** Format ISO date to DD/MM/YYYY for display */
export function formatFechaDisplay(iso: string): string {
  const { year, month, day } = parseISODate(iso);
  return `${day}/${month}/${year}`;
}

/** Format ISO date to long Spanish format (e.g., "26 de mayo de 2026") */
export function formatFechaLarga(iso: string): string {
  const { year, month, day } = parseISODate(iso);
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const mesIndex = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)} de ${meses[mesIndex]} de ${year}`;
}

/** Format ISO date to DD/MM/YYYY (short) */
export function formatFechaCorta(iso: string): string {
  const { year, month, day } = parseISODate(iso);
  return `${day}/${month}/${year}`;
}

/** Convert DD/MM/YYYY to YYYY-MM-DD for API calls */
export function ddmmyyyyToISO(ddmm: string): string {
  const [day, month, year] = ddmm.split('/');
  return `${year}-${month}-${day}`;
}
