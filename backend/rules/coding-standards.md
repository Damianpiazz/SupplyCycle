# Backend Coding Standards
## Estructura de features
- Cada feature tiene su propia carpeta en `src/features/<feature-name>/`
- Archivos: `controller.ts`, `service.ts`, `routes.ts`, `schema.ts`, `types.ts`
- No mezclar responsabilidades entre capas
## Rutas Express
- Usar `express.Router()` en cada feature
- Montar en `app.ts` con `app.use('/api/v1/<recurso>', router)`
- Versionado: `/api/v1/`
## Prisma
- Siempre usar `prisma/prisma.ts` (singleton), no crear nuevos clientes
- Transacciones con `prisma.$transaction()`
- Migraciones con nombres descriptivos: `add_user_roles`
## Errores
- Middleware global de errores en `src/middleware/error-handler.ts`
- Usar Zod para validación de inputs
- Errores de negocio → clases custom que extienden Error