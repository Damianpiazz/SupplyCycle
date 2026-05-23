---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Marcar Visita como Falta
---

# TDD-0043: Marcar Visita como Falta

## Contexto de Negocio (PRD)

### Objetivo
Marcar que en una visita programada el cliente no se encontraba o no se pudo entregar.

### User Persona
- **Nombre**: Repartidor
- **Necesidad**: Indicar que fue al domicilio pero no encontró al cliente.

### Criterios de Aceptación
- Cambiar el campo `falta` a `true`
- No debe modificar el estado del pedido

### Contrato de API

- **Endpoint**: `PATCH /api/v1/visitas/:id/falta`
- **Auth**: JWT (rol REPARTIDOR o ADMIN)
- **Request Body**: `{ "falta": true }`

## Plan de Implementación

### Backend
1. Service: `prisma.visita.update({ data: { falta: true } })`
2. Tests

### Mobile
4. Botón "No se encontró al cliente" en la pantalla de visita
