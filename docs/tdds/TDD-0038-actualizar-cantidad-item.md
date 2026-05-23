---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Actualizar Cantidad de Item en Pedido
---

# TDD-0038: Actualizar Cantidad de Item en Pedido

## Contexto de Negocio (PRD)

### Objetivo
Modificar la cantidad de un producto en un pedido pendiente.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Corregir la cantidad solicitada de un producto.

### Criterios de Aceptación
- Solo se puede modificar items de pedidos en estado `pendiente`
- No se modifica el precio unitario (se mantiene el original)

### Contrato de API

- **Endpoint**: `PATCH /api/v1/pedidos/:pedidoId/items/:itemId`
- **Auth**: JWT (rol ADMIN)
- **Request Body**: `{ "cantidad": 5 }`

## Plan de Implementación

### Backend
1. Schema: cantidad > 0
2. Service: verificar pedido pendiente → `prisma.itemPedido.update({ data: { cantidad } })`
3. Tests

### Mobile
4. Input para modificar cantidad en el detalle del pedido
