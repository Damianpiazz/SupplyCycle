---
name: prisma-migrate
description: Genera y ejecuta migraciones de Prisma
---
## Pasos
1. `npx prisma migrate dev --name <desc_en_ingles>`
2. Verificar con `npx prisma migrate status`
3. Si hay errores, revisar schema.prisma y reintentar
## Reglas
- Nombre descriptivo en inglés: `add_user_roles`, `create_orders_table`
- No borrar migraciones de otros devs