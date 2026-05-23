---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Obtener Pedido
---

# TDD-0032: Obtener Pedido

## Contexto de Negocio (PRD)

### Objetivo
Consultar un pedido específico con todos sus detalles: cliente, items, estado, visita y reparto asociado.

### User Persona
- **Nombre**: Administrador / Repartidor
- **Necesidad**: Ver el detalle completo de un pedido para prepararlo o entregarlo.

### Contrato de API

- **Endpoint**: `GET /api/v1/pedidos/:id`
- **Auth**: JWT
- **Response** `200 OK`:
```json
{
  "data": {
    "id": 1,
    "estado": "entregado",
    "fechaAlta": "2026-05-22",
    "cliente": { "id": 1, "nombre": "Juan Pérez" },
    "items": [
      { "producto": { "id": 1, "nombre": "Bidón 20L" }, "cantidad": 2, "precioUnitario": 1500 }
    ],
    "visita": { "id": 1, "fecha": "2026-05-23" },
    "reparto": { "id": 1, "fecha": "2026-05-23" }
  }
}
```

## Plan de Implementación

### Backend
1. Service: `prisma.pedido.findUnique({ where: { id }, include: { cliente: true, items: { include: { producto: true } }, visita: true, reparto: true } })` → NOT_FOUND
2. Ruta GET
3. Tests

### Mobile
4. Hook `useQuery(['pedido', id])`
5. Pantalla de detalle con toda la información
