---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Crear Pedido
---

# TDD-0031: Crear Pedido

## Contexto de Negocio (PRD)

### Objetivo
Registrar un nuevo pedido para un cliente con sus ítems (productos + cantidades). El pedido se crea en estado `pendiente`.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Cargar un pedido que un cliente solicitó.

### Criterios de Aceptación
- El sistema debe crear el pedido con estado `pendiente` y fecha actual
- Debe incluir al menos un item con producto, cantidad y precio unitario
- Debe calcular el precio unitario desde el producto al momento de crear
- Debe rechazar si el cliente no existe o está inactivo

## Diseño Técnico (RFC)

### Modelo de Datos

**Pedido**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| estado | EstadoPedido | DEFAULT pendiente |
| fechaAlta | DateTime | @default(now()) |
| clienteId | Int | FK -> Cliente |
| repartoId | Int? | FK -> Reparto |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |
| deletedAt | DateTime? | |

**ItemPedido**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| cantidad | Int | NOT NULL, > 0 |
| precioUnitario | Float | NOT NULL |
| productoId | Int | FK -> Producto |
| pedidoId | Int | FK -> Pedido |

### Contrato de API

- **Endpoint**: `POST /api/v1/pedidos`
- **Auth**: JWT (rol ADMIN)
- **Request Body**:
```json
{
  "clienteId": 1,
  "items": [
    { "productoId": 1, "cantidad": 2 },
    { "productoId": 2, "cantidad": 1 }
  ]
}
```
- **Response** `201 Created`:
```json
{
  "data": {
    "id": 1,
    "cliente": { "id": 1, "nombre": "Juan Pérez" },
    "estado": "pendiente",
    "fechaAlta": "2026-05-22T10:00:00Z",
    "items": [
      { "producto": { "id": 1, "nombre": "Bidón 20L" }, "cantidad": 2, "precioUnitario": 1500 }
    ],
    "total": 3000
  }
}
```

## Plan de Implementación

### Backend
1. Schema Zod: clienteId requerido, items array con productoId y cantidad (mínimo 1 item)
2. Service: `create(dto)` → verificar cliente activo → para cada item, buscar producto y precio actual → `prisma.pedido.create({ data: { clienteId, estado: 'pendiente', items: { create: ... } } })`
3. Ruta POST con auth ADMIN
4. Tests: creación exitosa, cliente inexistente, items vacío, producto inexistente

### Mobile
5. Pantalla con selector de cliente, selector de productos y cantidades
6. Mutation con TanStack Query
7. Invalidar lista de pedidos al crear
