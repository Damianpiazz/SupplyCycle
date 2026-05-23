---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Eliminar Cliente (Soft Delete)
---

# TDD-0011: Eliminar Cliente (Soft Delete)

## Contexto de Negocio (PRD)

### Objetivo
Permitir eliminar un cliente del sistema sin perder sus datos históricos (pedidos, reclamos). El cliente queda marcado como eliminado pero sus registros asociados se mantienen.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Dar de baja a un cliente que ya no recibe pedidos, sin perder el historial de sus pedidos anteriores.

### Criterios de Aceptación
- El sistema debe marcar `deletedAt` sin borrar físicamente el registro
- El cliente eliminado no debe aparecer en listados ni búsquedas
- Las consultas por ID deben rechazar clientes eliminados
- Las relaciones (pedidos, reclamos) deben mantenerse intactas

## Diseño Técnico (RFC)

### Modelo de Datos

**Cliente**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| nombre | String | NOT NULL |
| apellido | String | NOT NULL |
| telefono | String | UNIQUE, NOT NULL |
| estado | EstadoCliente | DEFAULT activo |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |
| deletedAt | DateTime? | → se setea al eliminar |

### Contrato de API

- **Endpoint**: `DELETE /api/v1/clientes/:id`
- **Auth**: JWT (rol ADMIN)
- **Response** `200 OK`:
```json
{
  "data": { "message": "Cliente eliminado exitosamente" }
}
```

### Estructura del Código (Backend)

```
src/features/clientes/
├── clientes.routes.ts        ← DELETE /:id (authMiddleware, authorize('ADMIN'))
├── clientes.controller.ts    ← remove(): schema.parse(params), service.remove()
├── clientes.service.ts       ← remove(id): verifica existencia, prisma.cliente.update({ data: { deletedAt: now() } })
└── clientes.schema.ts        ← clienteIdSchema (Zod: id numérico)
```

### Estructura del Código (Mobile)

```
features/clientes/
├── clientes-service.ts       ← remove(id): DELETE /clientes/:id
├── hooks/
│   └── use-remove-cliente.ts ← useMutation({ mutationFn: remove })
└── components/
    └── eliminar-cliente-button.tsx ← botón con confirmación y feedback
```

## Casos de Borde y Errores

| Escenario | Resultado Esperado | Código HTTP |
|---|---|---|
| Cliente inexistente | `{ "error": { "code": "NOT_FOUND" } }` | 404 Not Found |
| Cliente ya eliminado | `{ "error": { "code": "NOT_FOUND" } }` | 404 Not Found |
| Cliente con pedidos activos | Se elimina igual (soft delete no rompe relaciones) | 200 OK |
| Sin token ADMIN | `{ "error": { "code": "FORBIDDEN" } }` | 403 Forbidden |

## Plan de Implementación

### Backend
1. Implementar `clientes.service.ts`: `remove(id)` → verificar existencia → `prisma.cliente.update({ where: { id }, data: { deletedAt: new Date() } })`
2. Implementar `clientes.controller.ts`: `remove(req, res)` → `schema.parse(req.params)` → `service.remove()` → `res.json({ data: { message: 'Cliente eliminado exitosamente' } })`
3. Agregar ruta `router.delete('/:id', authMiddleware, authorize('ADMIN'), remove)`
4. Verificar que el middleware de soft delete del ADR-0015 filtra automáticamente `deletedAt` en consultas GET y LIST
5. Tests: eliminación exitosa, cliente ya eliminado, cliente inexistente

### Mobile
6. Agregar `remove(id)` en `clientes-service.ts`
7. Crear hook `use-remove-cliente.ts`: `useMutation({ mutationFn: () => clientesService.remove(id), onSuccess: () => queryClient.invalidateQueries(['clientes']) })`
8. Crear componente `eliminar-cliente-button.tsx` con Alert de confirmación nativa
9. Ubicar el botón en la pantalla de detalle de cliente
10. Redirigir a la lista al eliminar exitosamente
