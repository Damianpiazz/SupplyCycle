---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Finalizar Reparto
---

# TDD-0053: Finalizar Reparto

## Contexto de Negocio (PRD)

### Objetivo
Marcar la finalización de un reparto. Los pedidos que siguen `en_ruta` sin visita registrada quedan como `pendiente` para un próximo reparto.

### User Persona
- **Nombre**: Repartidor
- **Necesidad**: Finalizar la jornada de reparto.

### Criterios de Aceptación
- Se setea `fin` con la fecha/hora actual
- Los pedidos en estado `en_ruta` que no fueron visitados vuelven a `pendiente`
- No se puede finalizar un reparto no iniciado o ya finalizado

### Contrato de API

- **Endpoint**: `POST /api/v1/repartos/:id/finalizar`
- **Auth**: JWT (rol REPARTIDOR o ADMIN)
- **Response** `200 OK`

## Plan de Implementación

### Backend
1. Service: verificar reparto iniciado y no finalizado → `fin = new Date()` → `prisma.pedido.updateMany({ where: { repartoId: id, estado: 'en_ruta' }, data: { estado: 'pendiente' } })`
2. Tests

### Mobile
3. Botón "Finalizar reparto" con confirmación
4. Resumen al finalizar: entregados, pendientes, faltas
