---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Validación de Inputs con Zod 4
---

# ADR-0011: Validación de Inputs con Zod 4

## Contexto

La API REST recibe datos de clientes externos (mobile, webhooks). Sin validación, datos malformados pueden llegar a la base de datos, causar errores 500 o corromper datos. Además, ZodError debe ser capturado y transformado al formato de error estándar de la API.

Se necesita una librería de validación que sea tipo-segura, declarativa y se integre con TypeScript sin fricción.

---

## Decisión

Se utiliza **Zod 4** para validar todos los inputs de la API (body, query params, path params). Cada feature define su schema Zod en `schema.ts`, y los controladores validan antes de pasar al service.

Los errores de validación Zod son capturados automáticamente por el middleware global de errores y transformados al formato `VALIDATION_ERROR` con `details` por campo.

---

## Opciones Consideradas

### Opción 1: Zod 4 (seleccionada)
TypeScript nativo, inferencia de tipos automática, sintaxis declarativa, parseo seguro. Versión 4 con mejoras de performance y DX.

### Opción 2: Joi
Librería madura pero no tiene inferencia de tipos nativa. Requiere generar tipos manualmente o con herramientas externas.

### Opción 3: Yup
Similar a Zod pero menos adopción en TypeScript. Inferencia de tipos limitada.

### Opción 4: class-validator + class-transformer
Requiere decorators y clases, más verboso. No es compatible con `verbatimModuleSyntax` de TypeScript 6 sin configuración extra.

### Opción 5: Validación manual (if/else)
Funcional pero tedioso, propenso a errores, sin tipo seguro. No escalable.

### Opción seleccionada
Opción 1. Zod 4 es el estándar de facto para validación en TypeScript. La integración con Prisma y Express es natural.

---

## Consecuencias

### Positivas
- Tipos inferidos automáticamente: `z.infer<typeof schema>` genera el tipo exacto
- Sintaxis declarativa y legible
- Parseo con `schema.parse()` o `schema.safeParse()` para manejo de errores
- ZodError capturado por middleware global de errores
- Zod 4 es más rápido que versiones anteriores
- Compatible con TypeScript 6 strict mode

### Negativas
- Duplicación potencial (los tipos Prisma ya existen, Zod agrega otra capa)
- Schemas complejos pueden ser difíciles de leer
- Zod 4 introdujo cambios breaking respecto a Zod 3 (migración si se usaba la v3)

---

## Impacto en el Sistema

### Backend
- Cada feature tiene `schema.ts` con schemas Zod
- Controladores usan `schema.parse(body)` antes de llamar al service
- Middleware global captura ZodError y responde con formato `VALIDATION_ERROR`
- `z.infer<>` se usa para tipar los DTOs en services y controllers

### Frontend (Mobile)
- Sin impacto directo. La validación es server-side.
- Se pueden compartir schemas Zod (copiados manualmente) para validación client-side.

### Infraestructura / Compartido
- Dependencia: `zod` en backend
- Sin nuevas herramientas de build

---

## Reglas Derivadas

- Todo input de API se valida con Zod antes de procesarse
- Usar `safeParse()` en lugar de `parse()` cuando se necesite manejo de error personalizado
- Los schemas Zod se definen en `schema.ts` de cada feature
- No validar dos veces lo mismo (si Prisma ya valida el tipo, Zod valida formato)
- ZodError se maneja exclusivamente en el middleware global
