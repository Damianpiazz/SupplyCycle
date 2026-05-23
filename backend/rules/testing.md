# Backend Testing Guidelines
- Tests unitarios con Vitest
- Tests de integración con supertest
- Mockear Prisma con `vitest-mock-prisma`
- Nombrar archivos: `*.test.ts` o `*.spec.ts`
- Cobertura minima: 80%

## Estructura de carpetas

- `backend/src/__tests__/` → todos los tests de integración
- `backend/src/__tests__/setup.ts` → setup global compartido (NO modificar salvo cambios de infraestructura)
- Los tests unitarios viven junto al archivo que testean: `pedidoService.test.ts` al lado de `pedidoService.ts`

## Setup global de integración (`__tests__/setup.ts`)

El archivo `setup.ts` se ejecuta una sola vez antes de toda la suite de integración. Provee:

- `getTestDb()` → retorna un `PrismaClient` conectado a `TEST_DATABASE_URL`
- `disconnectTestDb()` → desconecta el cliente al finalizar la suite

**Reglas de uso:**
- Siempre llamar `disconnectTestDb()` en el `afterAll` global de cada archivo de integración.
- Usar `getTestDb()` solo para seed y cleanup, nunca dentro del código bajo test.
- Requiere `TEST_DATABASE_URL` definida en `.env.test` en la raíz de `backend/`.
- Si `TEST_DATABASE_URL` no está definida, cae en `DATABASE_URL` como fallback (solo en CI).
- `JWT_SECRET` se setea automáticamente a `test-jwt-secret` si no está en el entorno.