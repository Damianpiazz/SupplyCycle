---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Obtener Domicilio
---

# TDD-0013: Obtener Domicilio

## Contexto de Negocio (PRD)

### Objetivo
Permitir consultar los datos de un domicilio específico, incluyendo ciudad, días de visita y horarios.

### User Persona
- **Nombre**: Administrador / Repartidor
- **Necesidad**: Ver la dirección completa de un cliente para planificar la ruta de reparto.

### Criterios de Aceptación
- El sistema debe retornar el domicilio con ciudad, días y horarios
- Debe rechazar si el domicilio no existe

## Diseño Técnico (RFC)

### Contrato de API

- **Endpoint**: `GET /api/v1/domicilios/:id`
- **Auth**: JWT (cualquier rol)
- **Response** `200 OK`:
```json
{
  "data": {
    "id": 1,
    "calle": "Colón",
    "numero": "123",
    "piso": "4B",
    "ciudad": { "id": 1, "nombre": "Córdoba" },
    "dias": [
      {
        "id": 1,
        "nombre": "lunes",
        "horarios": [{ "id": 1, "inicio": "09:00", "fin": "12:00" }]
      }
    ]
  }
}
```

### Estructura del Código (Backend)

```
src/features/domicilios/
├── domicilios.routes.ts        ← GET /:id (authMiddleware)
├── domicilios.controller.ts    ← getById()
├── domicilios.service.ts       ← getById(): busca con include ciudad, dias, horarios
└── domicilios.schema.ts        ← domicilioIdSchema
```

## Casos de Borde y Errores

| Escenario | Resultado Esperado | Código HTTP |
|---|---|---|
| Domicilio inexistente | `NOT_FOUND` | 404 |
| ID inválido | `VALIDATION_ERROR` | 400 |

## Plan de Implementación

### Backend
1. Implementar `getById(id)` → `prisma.domicilio.findUnique({ where: { id }, include: { ciudad: true, dias: { include: { horarios: true } } } })`
2. Agregar ruta `router.get('/:id', authMiddleware, getById)`
3. Tests

### Mobile
4. Agregar `getById(id)` en `domicilios-service.ts`
5. Hook `useQuery(['domicilio', id])`
