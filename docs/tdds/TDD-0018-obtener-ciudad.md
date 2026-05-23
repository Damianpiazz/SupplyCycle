---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Obtener Ciudad
---

# TDD-0018: Obtener Ciudad

## Contexto de Negocio (PRD)

### Objetivo
Consultar una ciudad por su ID.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Ver los datos de una ciudad.

### Contrato de API

- **Endpoint**: `GET /api/v1/ciudades/:id`
- **Auth**: JWT
- **Response** `200 OK`: `{ "data": { "id": 1, "nombre": "Córdoba" } }`

## Plan de Implementación

### Backend
1. Service: `prisma.ciudad.findUnique()` → NOT_FOUND si no existe
2. Ruta `GET /:id`
3. Tests

### Mobile
4. Hook `useQuery(['ciudad', id])`
