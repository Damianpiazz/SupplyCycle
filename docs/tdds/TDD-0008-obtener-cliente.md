---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Obtener Cliente
---

# TDD-0008: Obtener Cliente

## Contexto de Negocio (PRD)

### Objetivo
Permitir consultar los datos de un cliente específico por su ID para visualizar su información y estado.

### User Persona
- **Nombre**: Administrador / Repartidor
- **Necesidad**: Ver los datos de un cliente antes de crear un pedido o durante un reparto.

### Criterios de Aceptación
- El sistema debe retornar todos los datos del cliente solicitado
- Debe incluir sus domicilios asociados
- Debe rechazar si el cliente no existe o fue eliminado (soft delete)

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

- **Endpoint**: `GET /api/v1/clientes/:id`
- **Auth**: JWT (cualquier rol autenticado)
- **Response** `200 OK`:
```json
{
  "data": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "3512345678",
    "estado": "activo",
    "domicilios": [
      {
        "id": 1,
        "calle": "Colón",
        "numero": "123",
        "ciudad": { "id": 1, "nombre": "Córdoba" }
      }
    ]
  }
}
```

### Estructura del Código (Backend)

```
src/features/clientes/
├── clientes.routes.ts        ← GET /:id (authMiddleware)
├── clientes.controller.ts    ← getById(): extrae id params, llama service
├── clientes.service.ts       ← getById(): busca cliente con domicilios, lanza NOT_FOUND si no existe
└── clientes.types.ts         ← ClienteResponse
```

### Estructura del Código (Mobile)

```
features/clientes/
├── clientes-service.ts       ← getById(id): GET /clientes/:id
├── hooks/
│   └── use-cliente.ts        ← useQuery(['cliente', id], () => getById(id))
└── screens/
    └── detalle-cliente.tsx   ← pantalla de detalle con datos del cliente
```

Pantalla `app/(tabs)/clientes/[id].tsx` con datos del cliente y sus domicilios.

## Casos de Borde y Errores

| Escenario | Resultado Esperado | Código HTTP |
|---|---|---|
| Cliente inexistente | `{ "error": { "code": "NOT_FOUND", "message": "Cliente no encontrado" } }` | 404 Not Found |
| Cliente soft-deleted | `{ "error": { "code": "NOT_FOUND", "message": "Cliente no encontrado" } }` | 404 Not Found |
| ID no numérico | `{ "error": { "code": "VALIDATION_ERROR" } }` | 400 Bad Request |
| Sin token JWT | `{ "error": { "code": "UNAUTHORIZED" } }` | 401 Unauthorized |

## Plan de Implementación

### Backend
1. Agregar `getByIdSchema` en `clientes.schema.ts` (Zod: id numérico)
2. Implementar `clientes.service.ts`: `getById(id)` → `prisma.cliente.findUnique({ where: { id }, include: { domicilios: { include: { ciudad: true } } } })` → si no existe, `throw Errors.notFound('Cliente')`
3. Implementar `clientes.controller.ts`: `getById(req, res)` → `schema.parse(req.params)` → `service.getById()` → `res.json({ data })`
4. Agregar ruta `router.get('/:id', authMiddleware, getById)`
5. Tests: cliente existente, inexistente, soft-deleted

### Mobile
6. Agregar `getById(id)` en `clientes-service.ts`
7. Crear hook `use-cliente.ts`: `useQuery({ queryKey: ['cliente', id], queryFn: () => clientesService.getById(id) })`
8. Crear pantalla `app/(tabs)/clientes/[id].tsx` con detalle del cliente y lista de domicilios
9. Mostrar loading con ActivityIndicator mientras carga
10. Mostrar error si el cliente no existe (NOT_FOUND)
