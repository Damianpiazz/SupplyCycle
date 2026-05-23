---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Stack Backend — Express 5 + Prisma 7 + PostgreSQL
---

# ADR-0004: Stack Backend — Express 5 + Prisma 7 + PostgreSQL

## Contexto

El backend necesita un stack moderno, tipado y productivo para construir una API REST. Se requiere un framework HTTP, un ORM para la base de datos y un motor de base de datos relacional.

Las decisiones deben priorizar la seguridad, el rendimiento y la facilidad de mantenimiento a largo plazo.

---

## Decisión

Se adopta el siguiente stack:

- **Runtime:** Node.js con TypeScript 6 (ESModules, NodeNext)
- **Framework HTTP:** Express 5
- **ORM:** Prisma 7 con `@prisma/adapter-pg`
- **Base de datos:** PostgreSQL
- **Validación:** Zod 4
- **Auth:** bcrypt + jsonwebtoken
- **Logging:** pino + morgan
- **Seguridad:** helmet + cors

---

## Opciones Consideradas

### Opción 1: Express 5 + Prisma 7 + PostgreSQL (seleccionada)
Stack maduro, probado, con excelente DX. Prisma provee type-safety nativo, migrations, studio UI y es el ORM más popular en TypeScript.

### Opción 2: Fastify + Drizzle ORM + PostgreSQL
Fastify es más rápido que Express, y Drizzle es más cercano al SQL puro. Pero Express 5 tiene un ecosistema más amplio y Prisma 7 tiene mejor integración con TypeScript 6.

### Opción 3: NestJS + TypeORM + PostgreSQL
NestJS impone una arquitectura muy rígida (decorators, módulos, providers). TypeORM tiene peor DX que Prisma y menos adopción en TypeScript moderno.

### Opción 4: Hono + Prisma + PostgreSQL
Hono es moderno y rápido pero tiene menos adopción y ecosistema que Express. Para el alcance del proyecto, Express es más predecible.

### Opción seleccionada
Opción 1. Express 5 es el estándar de la industria, Prisma 7 tiene type-safety completo con TypeScript 6, y PostgreSQL es la base de datos relacional más robusta.

---

## Consecuencias

### Positivas
- Type-safety de extremo a extremo con Prisma (schema → types → queries)
- Migraciones automáticas con Prisma Migrate
- Express 5 tiene routing mejorado y mejor manejo de errores async
- Zod 4 integrado para validación de inputs
- Helmet + cors cubren seguridad básica OOTB
- Ecosistema enorme: cualquier problema ya tiene solución documentada

### Negativas
- Express 5 es menos performante que Fastify o Hono (~15-20% más lento en benchmarks)
- Prisma es más pesado que Drizzle (runtime más grande)
- El adapter `@prisma/adapter-pg` agrega una capa de abstracción
- TypeScript 6 con NodeNext requiere `.js` en imports locales

---

## Impacto en el Sistema

### Backend
- Estructura estándar para todo el proyecto backend
- `prisma/schema.prisma` como fuente de verdad del esquema
- `prisma/prisma.ts` como cliente singleton
- Zod schemas en cada feature para validación

### Frontend (Mobile)
- Sin impacto directo. El stack backend es transparente.

### Infraestructura / Compartido
- PostgreSQL como servicio requerido (vía docker-compose)
- Prisma CLI para migraciones y generación de cliente
- Variables de entorno para conexión a DB

---

## Reglas Derivadas

- Usar siempre `prisma/prisma.ts` (singleton), nunca crear nuevos clientes Prisma
- Migraciones con nombres descriptivos: `add_user_roles`, `create_orders_table`
- TypeScript 6 con `verbatimModuleSyntax` → usar `import type` para tipos
- Imports ESM con extensión `.js` en rutas locales
