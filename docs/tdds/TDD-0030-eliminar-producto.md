---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Eliminar Producto (Soft Delete)
---

# TDD-0030: Eliminar Producto (Soft Delete)

## Contexto de Negocio (PRD)

### Objetivo
Eliminar un producto del catálogo sin perder el historial de pedidos que lo incluyen.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Dar de baja un producto que ya no se comercializa.

### Criterios de Aceptación
- Soft delete: marcar `deletedAt`
- Los pedidos históricos con ese producto deben mantenerse

### Contrato de API

- **Endpoint**: `DELETE /api/v1/productos/:id`
- **Auth**: JWT (rol ADMIN)
- **Response** `200 OK`

## Plan de Implementación

### Backend
1. Agregar `deletedAt` al modelo Producto (migración)
2. Service: `prisma.producto.update({ data: { deletedAt: new Date() } })`
3. Ruta DELETE con auth ADMIN
4. Tests

### Mobile
5. Botón de eliminar con confirmación
