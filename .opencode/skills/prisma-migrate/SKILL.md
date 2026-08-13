---
name: prisma-migrate
description: Genera y ejecuta migraciones de Prisma en el backend de SupplyCycle (provider postgresql, cliente singleton).
metadata:
  version: "1.1.0"
  tags: prisma, postgresql, migraciones
  scope: project
---

# prisma-migrate — Migraciones de Prisma

## Contexto / Propósito

El backend usa Prisma 7 + PostgreSQL (`provider: postgresql`) con el cliente singleton en `backend/prisma/prisma.ts`. Las migraciones se versionan y se crean con nombres descriptivos. Siempre ejecutar desde `backend/` (los scripts `db:*` del package.json ya apuntan ahí).

## Pasos

1. **Editar** `backend/prisma/schema.prisma` con el cambio de modelo/campo.

2. **Crear y aplicar la migración**:

```bash
cd backend && npm run db:migrate -- --name add_user_roles
# equivale a: npx prisma migrate dev --name add_user_roles
```

3. **Regenerar el cliente** si hace falta (generalmente `migrate dev` ya lo hace):

```bash
cd backend && npm run db:generate
```

4. **Verificar** el estado:

```bash
cd backend && npx prisma migrate status
```

5. **Si la migración falla**: revisar `schema.prisma` y los datos existentes (columnas con valores, constraints), corregir y reintentar. Nunca editar migraciones ya aplicadas por otro dev.

## Acceso al cliente

- Siempre usar el singleton: `import { prisma } from '../prisma/prisma.js'` (NUNCA crear `new PrismaClient()`).
- Transacciones con `prisma.$transaction()`.
- El cliente generado incluye los tipos; usar `import type` para tipos.

## Reglas

- Nombre descriptivo en inglés y en snake_case: `add_user_roles`, `create_orders_table`
- No borrar ni renombrar migraciones de otros devs
- No commitear la migración sin verificar que `prisma migrate dev` la aplicó y `npm run db:generate` regeneró el cliente
- Si el cambio es destructivo (borrar columnas/tablas), revisar el impacto antes de aplicar

## Checklist

- [ ] `schema.prisma` editado correctamente (provider: postgresql)
- [ ] Migración creada y aplicada (`db:migrate -- --name <snake_case>`)
- [ ] Cliente regenerado (`db:generate`)
- [ ] `prisma migrate status` sin conflictos
