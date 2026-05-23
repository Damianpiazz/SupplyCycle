---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Listar Pedidos
---

# TDD-0033: Listar Pedidos

## Contexto de Negocio (PRD)

### Objetivo
Consultar todos los pedidos con filtros por cliente, estado, fecha y reparto.

### User Persona
- **Nombre**: Administrador / Repartidor
- **Necesidad**: Ver los pedidos del día, filtrar por pendientes o buscar pedidos de un cliente.

### Contrato de API

- **Endpoint**: `GET /api/v1/pedidos`
- **Auth**: JWT
- **Query Params**: `?clienteId=&estado=&fechaDesde=&fechaHasta=&repartoId=&page=1&pageSize=20`
- **Response** `200 OK`:
```json
{
  "data": [
    {
      "id": 1,
      "cliente": { "id": 1, "nombre": "Juan Pérez" },
      "estado": "pendiente",
      "fechaAlta": "2026-05-22",
      "itemsCount": 3,
      "total": 4500
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

## Plan de Implementación

### Backend
1. Service: filtros dinámicos (clienteId, estado, rango fechas, repartoId), paginación, incluir count de items
2. Ruta GET
3. Tests

### Mobile
4. FlatList con filtros (Filtro por estado, selector de fechas)
5. Pull-to-refresh
6. Navegación al detalle
