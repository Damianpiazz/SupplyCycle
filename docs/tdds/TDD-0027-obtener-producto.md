---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Obtener Producto
---

# TDD-0027: Obtener Producto

## Contexto de Negocio (PRD)

### Objetivo
Consultar los datos de un producto específico del catálogo.

### User Persona
- **Nombre**: Administrador / Repartidor
- **Necesidad**: Ver el precio y detalles de un producto antes de crear un pedido.

### Contrato de API

- **Endpoint**: `GET /api/v1/productos/:id`
- **Auth**: JWT
- **Response** `200 OK`:
```json
{
  "data": {
    "id": 1,
    "nombre": "Bidón 20L",
    "precio": 1500,
    "unidad": "unidad",
    "stock": 100,
    "retornable": true
  }
}
```

## Plan de Implementación

### Backend
1. Service: `prisma.producto.findUnique()` → NOT_FOUND
2. Ruta GET
3. Tests

### Mobile
4. Hook `useQuery(['producto', id])`
