# Mobile API Integration

## Cliente HTTP
- Usar **Axios** como cliente HTTP centralizado (NO fetch nativo)
- Cliente singleton en `services/api.ts`
- Base URL desde `EXPO_PUBLIC_API_URL` (variable de entorno)
- Tiempo de espera configurable desde `EXPO_PUBLIC_API_TIMEOUT`

## Interceptors (en services/api.ts)
1. **Request interceptor**: agrega `Authorization: Bearer <token>` desde `authStorage.getToken()`
2. **Response interceptor**: si response status es 401 → ejecutar logout automático

## Formato de Respuestas (ADR-0000)
- Respuesta exitosa individual: `{ data: T }`
- Respuesta exitosa con lista: `{ data: T[]; total: number }`
- Error: `{ error: { code, message, timestamp, details? } }`
- Usar los tipos `ApiResponse<T>`, `ApiListResponse<T>`, `ApiError` desde `types/api.ts`

## Manejo de Errores
- Toda llamada HTTP usa `try/catch` o el manejador de TanStack Query
- Usar `handleApiError()` desde `services/handleApiError.ts` para transformar errores
- Mostrar feedback visual al usuario con `ErrorMessage` component
- Loading states con `LoadingSpinner` (ActivityIndicator centrado)

## Mock Fallback
- Si el endpoint devuelve error de red (ECONNREFUSED, Network Error) → usar datos mock desde `mocks/`
- Si el endpoint responde con datos reales → no usar mock
- Los mocks deben respetar exactamente los tipos TypeScript definidos en `types/`

## TanStack Query
- Estado del servidor siempre via `useQuery` / `useMutation`
- `staleTime: 5 * 60 * 1000` para datos del día (5 minutos)
- Mutaciones con `onMutate` optimista para confirmar/cancelar entregas
- `queryKey` con prefijo del feature: `['pedidos', 'hoy']`, `['reparto', id]`
