import type { Reclamo as PrismaReclamo } from '../../../generated/prisma/client.js';

// Re-export for convenience. No custom types needed unless extending response.
export type Reclamo = PrismaReclamo;

// Input type for crearReclamo service
export interface CrearReclamoInput {
  clienteId: string;
  descripcion: string;
}
