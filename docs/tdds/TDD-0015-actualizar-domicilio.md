---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Actualizar Domicilio
---

# TDD-0015: Actualizar Domicilio

## Contexto de Negocio (PRD)

### Objetivo
Permitir modificar los datos de un domicilio existente: calle, número, piso, entre calles o ciudad.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Corregir la dirección de un cliente cuando se muda o hay un error de carga.

### Criterios de Aceptación
- El sistema debe actualizar solo los campos enviados (parcial)
- Debe rechazar si el domicilio no existe

## Diseño Técnico (RFC)

### Contrato de API

- **Endpoint**: `PATCH /api/v1/domicilios/:id`
- **Auth**: JWT (rol ADMIN)
- **Request Body**:
```json
{
  "calle": "San Martín",
  "numero": "456"
}
```
- **Response** `200 OK`:
```json
{
  "data": {
    "id": 1,
    "calle": "San Martín",
    "numero": "456",
    "ciudad": { "id": 1, "nombre": "Córdoba" }
  }
}
```

## Plan de Implementación

### Backend
1. Schema Zod con todos los campos opcionales
2. Service: verificar existencia + ciudad si cambia → `prisma.domicilio.update()`
3. Ruta `PATCH /:id` con auth ADMIN
4. Tests

### Mobile
5. Pantalla de edición con datos precargados
6. Mutation, invalidar queries de domicilio y cliente
