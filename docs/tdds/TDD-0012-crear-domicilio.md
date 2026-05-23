---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Crear Domicilio
---

# TDD-0012: Crear Domicilio

## Contexto de Negocio (PRD)

### Objetivo
Permitir registrar un domicilio para un cliente existente, incluyendo ciudad, días de visita y horarios.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Agregar la dirección de un cliente para planificar las rutas de reparto.

### Criterios de Aceptación
- El sistema debe crear un domicilio asociado a un cliente existente
- Debe rechazar si el cliente no existe
- Calle, numero y ciudad son obligatorios

## Diseño Técnico (RFC)

### Modelo de Datos

**Domicilio**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| calle | String | NOT NULL |
| entreCalle1 | String? | |
| entreCalle2 | String? | |
| numero | String | NOT NULL |
| piso | String? | |
| clienteId | Int | FK -> Cliente, NOT NULL |
| ciudadId | Int | FK -> Ciudad, NOT NULL |

### Contrato de API

- **Endpoint**: `POST /api/v1/clientes/:clienteId/domicilios`
- **Auth**: JWT (rol ADMIN)
- **Request Body**:
```json
{
  "calle": "Colón",
  "entreCalle1": "San Martín",
  "entreCalle2": "Belgrano",
  "numero": "123",
  "piso": "4B",
  "ciudadId": 1
}
```
- **Response** `201 Created`:
```json
{
  "data": {
    "id": 1,
    "calle": "Colón",
    "numero": "123",
    "piso": "4B",
    "ciudad": { "id": 1, "nombre": "Córdoba" }
  }
}
```

### Estructura del Código (Backend)

```
src/features/domicilios/
├── domicilios.routes.ts        ← POST / (authMiddleware, authorize('ADMIN'))
├── domicilios.controller.ts    ← create()
├── domicilios.service.ts       ← create(): verifica cliente, verifica ciudad, crea domicilio
├── domicilios.schema.ts        ← createDomicilioSchema (Zod)
└── domicilios.types.ts
```

### Estructura del Código (Mobile)

```
features/domicilios/
├── domicilios-service.ts       ← create(clienteId, dto): POST /clientes/:id/domicilios
└── screens/
    └── crear-domicilio.tsx     ← formulario con selector de ciudad
```

## Casos de Borde y Errores

| Escenario | Resultado Esperado | Código HTTP |
|---|---|---|
| Cliente inexistente | `NOT_FOUND` | 404 |
| Ciudad inexistente | `NOT_FOUND` | 404 |
| Calle vacía | `VALIDATION_ERROR` | 400 |
| Cliente soft-deleted | `NOT_FOUND` | 404 |

## Plan de Implementación

### Backend
1. Crear `domicilios.schema.ts` con `createDomicilioSchema`
2. Implementar `domicilios.service.ts`: `create(clienteId, dto)` → verificar cliente y ciudad → `prisma.domicilio.create()`
3. Implementar `domicilios.controller.ts`
4. Crear `domicilios.routes.ts` anidada bajo clientes
5. Montar en `app.ts`
6. Tests

### Mobile
7. Agregar `create(clienteId, dto)` en `domicilios-service.ts`
8. Crear pantalla con formulario (calle, numero, piso, selector de ciudad, entreCalles)
9. Mutation con TanStack Query, invalidar query del cliente al crear
