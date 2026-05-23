/**
 * Error personalizado de aplicación con código HTTP.
 *
 * Úsalo en toda la capa de servicio para errores de negocio
 * que deben traducirse a respuestas HTTP con el código correcto.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  /**
   * @param statusCode - Código HTTP (400, 404, 409, etc.)
   * @param message    - Mensaje legible para el cliente
   * @param code       - Código interno opcional (por defecto deriva del status)
   */
  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code ?? getDefaultCode(statusCode);
  }
}

function getDefaultCode(statusCode: number): string {
  switch (statusCode) {
    case 400: return 'BAD_REQUEST';
    case 401: return 'UNAUTHORIZED';
    case 403: return 'FORBIDDEN';
    case 404: return 'NOT_FOUND';
    case 409: return 'CONFLICT';
    case 422: return 'UNPROCESSABLE_ENTITY';
    case 429: return 'TOO_MANY_REQUESTS';
    default:  return 'INTERNAL_ERROR';
  }
}
