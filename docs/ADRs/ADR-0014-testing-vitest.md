---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Testing con Vitest + supertest + vitest-mock-prisma
---

# ADR-0014: Testing con Vitest + supertest + vitest-mock-prisma

## Contexto

El backend necesita un framework de testing rápido, compatible con TypeScript 6 y ESModules. Además, se requieren tests de integración para la API Express y tests unitarios para servicios que usan Prisma, sin necesidad de una base de datos real.

Se necesita una solución que permita:
- Tests unitarios rápidos (sin base de datos)
- Tests de integración con Express (supertest)
- Mocking de Prisma para aislar la lógica de negocio

---

## Decisión

Se utiliza **Vitest** como runner de tests, **supertest** para tests de integración HTTP, y **vitest-mock-prisma** para mockear el cliente Prisma en tests unitarios.

- Tests unitarios: mockean Prisma con `vitest-mock-prisma`
- Tests de integración: levantan Express con supertest y base de datos de test
- Cobertura mínima: 80%

---

## Opciones Consideradas

### Opción 1: Vitest + supertest + vitest-mock-prisma (seleccionada)
Vitest es nativamente compatible con TypeScript 6 y ESModules. Es ~20x más rápido que Jest al usar esbuild para transformar. supertest es el estándar para testear Express.

### Opción 2: Jest + ts-jest
Jest no es nativamente compatible con ESModules. Requiere configuración extra para funcionar con TypeScript 6 y NodeNext. ts-jest es lento.

### Opción 3: Vitest + supertest + base de datos real
Más fidelidad pero más lento y requiere infraestructura de base de datos. Los tests unitarios no necesitan base de datos real.

### Opción 4: Ava + supertest
Ava es rápido pero tiene menos ecosistema que Vitest. Menos integraciones con herramientas del ecosistema.

### Opción seleccionada
Opción 1. Vitest es el estándar moderno para testing en TypeScript, con integración nativa de ESModules y TypeScript 6.

---

## Consecuencias

### Positivas
- Vitest es nativamente compatible con TypeScript 6 y ESModules
- Transformación rápida con esbuild (sin ts-jest)
- Mocking de Prisma sencillo con `vitest-mock-prisma`
- Compatibilidad con Jest API (describe, it, expect) → migración trivial
- supertest permite testear Express sin levantar el servidor real
- Watch mode rápido para TDD
- Cobertura de código integrada con v8/istanbul

### Negativas
- vitest-mock-prisma no soporta todas las features de Prisma (transacciones, queries complejas)
- Tests de integración requieren una base de datos PostgreSQL real (o testcontainers)
- La cobertura del 80% requiere disciplina del equipo

---

## Impacto en el Sistema

### Backend
- `vitest.config.ts` → configuración de Vitest
- `src/**/*.test.ts` → tests unitarios junto al código
- Mocking de Prisma en tests unitarios con `vitest-mock-prisma`
- Tests de integración con supertest en `tests/integration/`
- Script `npm run test` y `npm run test:coverage`

### Frontend (Mobile)
- Sin impacto directo. Mobile puede adoptar Vitest independientemente.

### Infraestructura / Compartido
- Dependencias dev: `vitest`, `supertest`, `vitest-mock-prisma`
- Base de datos de test en CI (PostgreSQL)
- Umbral de cobertura configurado en `vitest.config.ts`

---

## Reglas Derivadas

- Tests unitarios con Prisma mockeado: sin base de datos real
- Tests de integración con supertest + base de datos PostgreSQL real
- Nombrar archivos: `*.test.ts` o `*.spec.ts`
- Cobertura mínima: 80% (configurada como umbral en vitest)
- Mockear Prisma con `vitest-mock-prisma` en tests unitarios
- Usar `describe`/`it`/`expect` (API compatible con Jest)
