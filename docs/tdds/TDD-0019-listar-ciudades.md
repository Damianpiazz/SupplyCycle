---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Listar Ciudades
---

# TDD-0019: Listar Ciudades

## Contexto de Negocio (PRD)

### Objetivo
Consultar el catálogo de ciudades disponibles para usar en selectores de domicilio.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Seleccionar una ciudad al crear o editar un domicilio.

### Contrato de API

- **Endpoint**: `GET /api/v1/ciudades`
- **Auth**: JWT
- **Query Params**: `?search=&page=1&pageSize=50`
- **Response** `200 OK`:
```json
{
  "data": [{ "id": 1, "nombre": "Córdoba" }],
  "total": 1
}
```

## Plan de Implementación

### Backend
1. Service: list con filtro search por nombre, paginación
2. Ruta `GET /` con authMiddleware
3. Tests

### Mobile
4. Hook `useQuery(['ciudades', params])`
5. Picker/select component en formulario de domicilio
