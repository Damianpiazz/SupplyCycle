---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Errores y Respuestas Globales
---

# TDD-0006: Errores y Respuestas Globales

## Contexto de Negocio (PRD)

### Objetivo

Definir un formato estándar para todas las respuestas de la API, tanto exitosas como de error. Esto garantiza que el mobile siempre reciba respuestas predecibles y pueda manejarlas de forma consistente, sin importar qué endpoint las genera.

### User Persona

- **Nombre**: Desarrollador (mobile y backend)
- **Necesidad**: Saber exactamente qué estructura va a recibir en cada respuesta para no tener que manejar casos especiales por endpoint.

### Criterios de Aceptación

- Todas las respuestas exitosas deben seguir el mismo formato.
- Todos los errores deben seguir el mismo formato con código, mensaje, timestamp y detalle opcional.
- Los códigos HTTP deben usarse correctamente según la convención definida en este TDD.
- El backend nunca debe exponer stack traces ni mensajes internos en producción.
- Todos los errores de negocio deben lanzarse mediante `AppError`. Nunca usar `res.status().json()` directamente para errores.
- El mobile debe usar Axios y tener un manejador global de errores que interprete este formato.
- Los errores de validación Zod deben manejarse explícitamente en el middleware global.

---

## Diseño Técnico (RFC)

### Formato de respuesta exitosa

```ts
// Respuesta con un solo objeto
{
  data: T;
}

// Respuesta con lista
{
  data: T[];
  total: number;
}
```

### Formato de respuesta de error

```ts
{
  error: {
    code: string;       // código interno ej: "VALIDATION_ERROR", "NOT_FOUND"
    message: string;    // mensaje legible en español
    timestamp: string;  // ISO 8601, útil para debugging
    details?: {         // opcional, solo para errores de validación
      field: string;
      message: string;
    }[];
  };
}
```

### Ejemplos

#### Error de validación (400)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos ingresados no son válidos",
    "timestamp": "2026-05-22T10:30:00.000Z",
    "details": [
      { "field": "email", "message": "El email no tiene un formato válido" },
      { "field": "password", "message": "La contraseña debe tener al menos 8 caracteres" }
    ]
  }
}
```

#### Error de autenticación (401)

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Credenciales inválidas",
    "timestamp": "2026-05-22T10:30:00.000Z"
  }
}
```

#### Error de recurso no encontrado (404)

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Pedido no encontrado",
    "timestamp": "2026-05-22T10:30:00.000Z"
  }
}
```

#### Error de conflicto (409)

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "El cliente ya tiene un pedido para esa fecha",
    "timestamp": "2026-05-22T10:30:00.000Z"
  }
}
```

### Códigos internos de error

| Code | Uso |
|---|---|
| `VALIDATION_ERROR` | Datos de entrada inválidos (Zod) |
| `UNAUTHORIZED` | Sin token o credenciales inválidas |
| `FORBIDDEN` | Token válido pero sin permisos |
| `NOT_FOUND` | Recurso inexistente |
| `CONFLICT` | Violación de unicidad o regla de negocio |
| `INTERNAL_ERROR` | Error inesperado del servidor |

### Convenciones HTTP

| Situación | Código HTTP |
|---|---|
| Obtener recurso exitosamente | 200 OK |
| Crear recurso exitosamente | 201 Created |
| Datos de entrada inválidos | 400 Bad Request |
| Sin autenticación o credenciales inválidas | 401 Unauthorized |
| Autenticado pero sin permisos | 403 Forbidden |
| Recurso no encontrado | 404 Not Found |
| Conflicto de negocio o unicidad | 409 Conflict |
| Error inesperado del servidor | 500 Internal Server Error |

> Nota: No se usa 204 No Content. Todas las respuestas devuelven JSON.

---

## Implementación en Backend

### Clase base de errores

```ts
// src/lib/AppError.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: { field: string; message: string }[]
  ) {
    super(message);
  }
}
```

### Helpers de errores comunes

```ts
// src/lib/errors.ts
export const Errors = {
  notFound: (resource: string) =>
    new AppError(404, 'NOT_FOUND', `${resource} no encontrado`),

  conflict: (message: string) =>
    new AppError(409, 'CONFLICT', message),

  unauthorized: (message = 'Credenciales inválidas') =>
    new AppError(401, 'UNAUTHORIZED', message),

  forbidden: (message = 'No tenés permisos para realizar esta acción') =>
    new AppError(403, 'FORBIDDEN', message),

  validation: (details: { field: string; message: string }[]) =>
    new AppError(400, 'VALIDATION_ERROR', 'Los datos ingresados no son válidos', details),
};
```

### Middleware global de errores (Express)

```ts
// src/middleware/error.middleware.ts
import { ZodError } from 'zod';
import { AppError } from '../lib/AppError.js';

export const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();

  // Error de validación Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Los datos ingresados no son válidos',
        timestamp,
        details: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    });
  }

  // Error de negocio controlado
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        timestamp,
        details: err.details,
      },
    });
  }

  // Error inesperado: no exponer detalles en producción
  console.error(err);
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Ocurrió un error inesperado',
      timestamp,
    },
  });
};
```

> El middleware debe registrarse al final de `app.ts`, después de todas las rutas.

### Regla obligatoria

Todos los errores de negocio deben lanzarse con `throw Errors.xxx()` o `throw new AppError(...)`.
Nunca usar `res.status().json()` directamente para manejar errores.

---

## Implementación en Mobile

### Tipos TypeScript

```ts
// types/api.ts
export interface ApiError {
  code: string;
  message: string;
  timestamp: string;
  details?: { field: string; message: string }[];
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
}

export interface ApiErrorResponse {
  error: ApiError;
}
```

### Cliente HTTP con Axios

```ts
// services/api.ts
import axios from 'axios';
import type { ApiError } from '../types/api';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para agregar JWT en cada request
apiClient.interceptors.request.use((config) => {
  const token = getToken(); // desde expo-secure-store
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Manejador global de errores Axios
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error) && error.response?.data?.error) {
    return error.response.data.error;
  }
  return {
    code: 'INTERNAL_ERROR',
    message: 'Ocurrió un error inesperado',
    timestamp: new Date().toISOString(),
  };
};
```

---

## Casos de Borde y Errores

| Escenario | Resultado Esperado | Código HTTP |
|---|---|---|
| Error de validación Zod | Formato estándar con `details` por campo | 400 Bad Request |
| Ruta inexistente | Error `NOT_FOUND` con mensaje claro | 404 Not Found |
| Error inesperado en producción | Error `INTERNAL_ERROR` sin stack trace | 500 Internal Server Error |
| Token malformado | Error `UNAUTHORIZED` | 401 Unauthorized |
| Error de negocio (ej: pedido ya procesado) | Error `CONFLICT` con mensaje descriptivo | 409 Conflict |
| Error manejado sin AppError | No permitido — viola las convenciones del proyecto | — |

---

## Plan de Implementación

1. Crear clase `AppError` en `backend/src/lib/AppError.ts`
2. Crear helpers de error en `backend/src/lib/errors.ts`
3. Implementar middleware global en `backend/src/middleware/error.middleware.ts`
4. Registrar el middleware al final de `app.ts`
5. Usar `throw Errors.xxx()` en todos los servicios y controladores
6. Definir tipos `ApiResponse` y `ApiError` en `mobile/types/api.ts`
7. Implementar `apiClient` con Axios en `mobile/services/api.ts`
8. Usar `handleApiError` en todos los servicios del mobile