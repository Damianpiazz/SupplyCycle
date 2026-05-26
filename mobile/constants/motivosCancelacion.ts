// Motivos de cancelación de entrega
// Estos valores coinciden con el tipo MotivoCancelacion en types/
export const MOTIVOS_CANCELACION = [
  { value: 'CLIENTE_AUSENTE', label: 'Cliente ausente' },
  { value: 'DIRECCION_INCORRECTA', label: 'Dirección incorrecta' },
  { value: 'ACCESO_DENEGADO', label: 'Acceso denegado' },
  { value: 'OTRO', label: 'Otro' },
] as const;
