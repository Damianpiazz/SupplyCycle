---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Quitar Horario de Día de Visita
---

# TDD-0025: Quitar Horario de Día de Visita

## Contexto de Negocio (PRD)

### Objetivo
Eliminar una franja horaria de un día de visita.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Ajustar la ventana horaria de entrega.

### Contrato de API

- **Endpoint**: `DELETE /api/v1/horarios/:id`
- **Auth**: JWT (rol ADMIN)
- **Response** `200 OK`

## Plan de Implementación

### Backend
1. Service: verificar existencia → `prisma.horario.delete()`
2. Tests: horario existente, inexistente

### Mobile
3. Botón de eliminar horario
4. Invalidar query del domicilio
