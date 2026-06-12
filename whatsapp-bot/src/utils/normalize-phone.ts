export function normalizePhone(phone: string): string {
  let clean = phone.replace(/@.*$/, '')
  clean = clean.replace(/\D/g, '')
  if (clean.startsWith('549')) clean = clean.slice(3)
  else if (clean.startsWith('54')) clean = clean.slice(2)
  return clean
}
