---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Crear Cliente
---

# TDD-0007: Crear Cliente

## Contexto de Negocio (PRD)

### Objetivo
Permitir registrar un nuevo cliente en el sistema con sus datos personales y estado inicial.

### User Persona
- **Nombre**: Administrador del sistema
- **Necesidad**: Dar de alta un cliente que comienza a recibir pedidos.

### Criterios de Aceptación
- El sistema debe crear un cliente con nombre, apellido, teléfono y estado `activo`
- El teléfono debe ser único en el sistema
- Debe rechazar si faltan campos obligatorios
- Debe responder con los datos del cliente creado

## Diseño Técnico (RFC)

### Modelo de Datos

**Cliente**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| nombre | String | NOT NULL |
| apellido | String | NOT NULL |
| telefono | String | UNIQUE, NOT NULL |
| estado | EstadoCliente | DEFAULT activo |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |
| deletedAt | DateTime? | |

### Contrato de API

- **Endpoint**: `POST /api/v1/clientes`
- **Auth**: JWT (rol ADMIN)
- **Request Body**:
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "3512345678"
}
```
- **Response** `201 Created`:
```json
{
  "data": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "3512345678",
    "estado": "activo"
  }
}
```

### Estructura del Código (Backend)

```
src/features/clientes/
├── clientes.routes.ts        ← POST / (authMiddleware, authorize('ADMIN'))
├── clientes.controller.ts    ← create(): valida body, llama service, responde 201
├── clientes.service.ts       ← create(): verifica teléfono único, crea cliente
├── clientes.schema.ts        ← createClienteSchema (Zod)
└── clientes.types.ts         ← CreateClienteDto, ClienteResponse
```

### Estructura del Código (Mobile)

```
features/clientes/
├── clientes-service.ts       ← create(): POST /clientes
├── clientes-schema.ts        ← createClienteSchema (Zod, copia del backend)
└── screens/
    └── crear-cliente.tsx     ← formulario con React Hook Form + Zod + mutation
```

Pantalla `app/(tabs)/clientes/crear.tsx` con formulario.

## Casos de Borde y Errores

| Escenario | Resultado Esperado | Código HTTP |
|---|---|---|
| Teléfono ya existente | `{ "error": { "code": "CONFLICT", "message": "El teléfono ya está registrado" } }` | 409 Conflict |
| Nombre vacío | `{ "error": { "code": "VALIDATION_ERROR", "details": [{ "field": "nombre", "message": "Requerido" }] } }` | 400 Bad Request |
| Sin token JWT | `{ "error": { "code": "UNAUTHORIZED" } }` | 401 Unauthorized |
| Rol no ADMIN | `{ "error": { "code": "FORBIDDEN" } }` | 403 Forbidden |

## Plan de Implementación

### Backend
1. Crear `clientes.schema.ts` con `createClienteSchema` (Zod: nombre, apellido required, teléfono unique format)
2. Crear `clientes.types.ts` con `CreateClienteDto` e `ClienteResponse`
3. Implementar `clientes.service.ts`: `create(dto)` → verificar teléfono único → `prisma.cliente.create()`
4. Implementar `clientes.controller.ts`: `create(req, res)` → `schema.parse(req.body)` → `service.create()` → `res.status(201).json({ data })`
5. Crear `clientes.routes.ts`: `router.post('/', authMiddleware, authorize('ADMIN'), create)`
6. Montar rutas en `app.ts`: `app.use('/api/v1/clientes', router)`
7. Tests unitarios: creación exitosa, teléfono duplicado, validación Zod
8. Tests de integración: supertest con token ADMIN, sin token, con token USER

### Mobile
9. Crear `clientes-schema.ts` con `createClienteSchema` (Zod, mirror del backend)
10. Crear `clientes-service.ts` con `create(dto: CreateClienteDto): Promise<Cliente>`
11. Crear pantalla `app/(tabs)/clientes/crear.tsx` con formulario (React Hook Form + Zod resolver)
12. Mutation con TanStack Query: `useMutation({ mutationFn: clientesService.create })`
13. Mostrar errores de validación inline por campo
14. Mostrar error de teléfono duplicado (código CONFLICT) como mensaje global
15. Redirigir a lista de clientes al crear exitosamente
