---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Agregar Item a Pedido
---

# TDD-0037: Agregar Item a Pedido

## Contexto de Negocio (PRD)

### Objetivo
Agregar un producto existente al pedido con una cantidad determinada.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Agregar un producto adicional a un pedido pendiente.

### Criterios de Aceptación
- Solo se puede agregar items a pedidos en estado `pendiente`
- El producto debe existir y estar activo
- El precio unitario se toma del producto al momento de agregar

### Contrato de API

- **Endpoint**: `POST /api/v1/pedidos/:pedidoId/items`
- **Auth**: JWT (rol ADMIN)
- **Request Body**: `{ "productoId": 1, "cantidad": 3 }`
- **Response** `201 Created`

## Plan de Implementación

### Backend
1. Schema: productoId, cantidad > 0
2. Service: verificar pedido pendiente → verificar producto → `prisma.itemPedido.create()`
3. Tests: éxito, pedido no pendiente, producto inexistente

### Mobile
4. Modal o pantalla para agregar producto a pedido existente
