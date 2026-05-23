---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Listar Repartos
---

# TDD-0051: Listar Repartos

## Contexto de Negocio (PRD)

### Objetivo
Consultar los repartos planificados con filtros por fecha y estado.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Ver los repartos del día o de la semana.

### Contrato de API

- **Endpoint**: `GET /api/v1/repartos`
- **Auth**: JWT
- **Query Params**: `?fechaDesde=&fechaHasta=&page=1&pageSize=20`
- **Response** `200 OK`:
```json
{
  "data": [
    {
      "id": 1,
      "fecha": "2026-05-23",
      "pedidosCount": 5,
      "inicio": null,
      "fin": null
    }
  ],
  "total": 1
}
```

## Plan de Implementación

### Backend
1. Service: filtros por rango de fechas, paginación, incluir count de pedidos
2. Tests

### Mobile
3. FlatList con filtro de fecha
4. Navegación al detalle
