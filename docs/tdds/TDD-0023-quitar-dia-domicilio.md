---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Quitar Día de Visita de Domicilio
---

# TDD-0023: Quitar Día de Visita de Domicilio

## Contexto de Negocio (PRD)

### Objetivo
Eliminar un día de visita de un domicilio.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Dejar de visitar a un cliente un día determinado.

### Contrato de API

- **Endpoint**: `DELETE /api/v1/domicilios/:domicilioId/dias/:diaId`
- **Auth**: JWT (rol ADMIN)
- **Response** `200 OK`

## Plan de Implementación

### Backend
1. Service: verificar que el día pertenezca al domicilio → `prisma.dia.delete()`
2. Ruta DELETE
3. Tests: día existente, día no perteneciente al domicilio

### Mobile
4. Botón de eliminar por día en el detalle del domicilio
