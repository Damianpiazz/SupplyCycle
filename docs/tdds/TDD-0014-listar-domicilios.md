---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Listar Domicilios por Cliente
---

# TDD-0014: Listar Domicilios por Cliente

## Contexto de Negocio (PRD)

### Objetivo
Permitir consultar todos los domicilios de un cliente específico.

### User Persona
- **Nombre**: Administrador / Repartidor
- **Necesidad**: Ver todos los domicilios de un cliente para seleccionar dónde entregar el pedido.

### Criterios de Aceptación
- El sistema debe retornar los domicilios asociados al cliente
- Cada domicilio debe incluir ciudad y días de visita

## Diseño Técnico (RFC)

### Contrato de API

- **Endpoint**: `GET /api/v1/clientes/:clienteId/domicilios`
- **Auth**: JWT (cualquier rol)
- **Response** `200 OK`:
```json
{
  "data": [
    {
      "id": 1,
      "calle": "Colón",
      "numero": "123",
      "ciudad": { "id": 1, "nombre": "Córdoba" },
      "dias": [{ "id": 1, "nombre": "lunes" }]
    }
  ],
  "total": 1
}
```

### Estructura del Código (Backend)

```
src/features/domicilios/
├── domicilios.routes.ts        ← GET /clientes/:clienteId/domicilios
├── domicilios.controller.ts    ← listByCliente()
├── domicilios.service.ts       ← listByCliente(clienteId)
```

## Plan de Implementación

### Backend
1. Implementar `listByCliente(clienteId)` → `prisma.domicilio.findMany({ where: { clienteId }, include: { ciudad: true, dias: true } })`
2. Agregar ruta
3. Tests

### Mobile
4. Agregar `listByCliente(clienteId)` en servicio
5. Hook `useQuery(['domicilios', clienteId])`
6. Mostrar lista en el detalle del cliente
