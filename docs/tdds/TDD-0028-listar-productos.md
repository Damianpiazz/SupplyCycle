---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Listar Productos
---

# TDD-0028: Listar Productos

## Contexto de Negocio (PRD)

### Objetivo
Consultar el catálogo completo de productos con filtros y paginación.

### User Persona
- **Nombre**: Administrador / Repartidor
- **Necesidad**: Seleccionar productos al armar un pedido.

### Contrato de API

- **Endpoint**: `GET /api/v1/productos`
- **Auth**: JWT
- **Query Params**: `?search=&retornable=&page=1&pageSize=20`
- **Response** `200 OK`:
```json
{
  "data": [{ "id": 1, "nombre": "Bidón 20L", "precio": 1500 }],
  "total": 1
}
```

## Plan de Implementación

### Backend
1. Service: filtros por nombre (contains), retornable, paginación
2. Ruta GET
3. Tests

### Mobile
4. Hook `useQuery(['productos', params])`
5. FlatList con search bar
6. Pull-to-refresh
