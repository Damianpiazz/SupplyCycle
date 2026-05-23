---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Estandarización de Respuestas API y Manejo Global de Errores
---

# ADR-0000: Estandarización de Respuestas API y Manejo Global de Errores

## Contexto

La API REST del backend y la app mobile necesitan un contrato de comunicación predecible. Sin un estándar, cada endpoint puede responder en distinto formato, obligando al mobile a manejar casos especiales por endpoint.

El backend no debe exponer stack traces ni mensajes internos en producción. Se necesita un mecanismo obligatorio que evite el uso de `res.status().json()` directo para errores.

---

## Decisión

Se adopta un formato único JSON para todas las respuestas:

- **Exitosa individual:** `{ data: T }`
- **Exitosa con lista:** `{ data: T[]; total: number }`
- **Error:** `{ error: { code, message, timestamp, details? } }`

Se implementa una clase `AppError` que extiende `Error`, helpers `Errors.notFound()`, `Errors.conflict()`, etc., un middleware global Express que captura `AppError` y `ZodError`, y un cliente Axios en mobile con interceptor JWT y `handleApiError()` global.

---

## Opciones Consideradas

### Opción 1: AppError + middleware global + Axios (seleccionada)
Contrato único, controladores limpios, sin dependencias externas. El middleware centraliza todo error.

### Opción 2: Errores inline en cada controlador
Simple al inicio pero genera inconsistencias, código duplicado y es difícil de mantener a escala.

### Opción 3: Librería externa (express-api-response, etc.)
Menos control sobre el formato, difícil de adaptar a convenciones propias, dependencia adicional.

### Opción seleccionada
Opción 1 por su balance entre simplicidad, control total y mantenibilidad.

---

## Consecuencias

### Positivas
- Mobile con un solo `handleApiError` para toda la app
- Backend centraliza errores en un solo punto
- `ZodError` se captura automáticamente y se transforma al formato estándar
- Sin fugas de stack traces en producción
- Tipos compartidos entre backend y mobile

### Negativas
- Exige disciplina del equipo: si alguien usa `res.status().json()` directo se saltea el contrato
- No hay validación automática del cumplimiento del contrato (se puede agregar un test)

---

## Impacto en el Sistema

### Backend
- Nuevos archivos: `src/lib/AppError.ts`, `src/lib/errors.ts`, `src/middleware/error.middleware.ts`
- Middleware registrado al final de `app.ts` después de todas las rutas
- Refactor de controladores existentes para usar `throw Errors.xxx()`

### Frontend (Mobile)
- Nuevos archivos: `types/api.ts` (interfaces `ApiResponse`, `ApiError`)
- Nuevo archivo: `services/api.ts` (cliente Axios con interceptors)
- `handleApiError` usado en todos los servicios

### Infraestructura / Compartido
- Contrato API documentado. Sin nuevas dependencias externas.

---

## Reglas Derivadas

- Todo error de negocio se lanza con `throw Errors.xxx()` o `throw new AppError()`
- Nunca usar `res.status().json()` para errores
- Middleware de errores SIEMPRE al final de `app.ts`
- No se usa 204 No Content — todas las respuestas devuelven JSON
- Mobile adjunta JWT vía interceptor de Axios
