---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Soft Delete y Trazabilidad (Audit Fields)
---

# ADR-0015: Soft Delete y Trazabilidad (Audit Fields)

## Contexto

El sistema maneja datos sensibles (clientes, pedidos, repartos) que no deben perderse ante eliminaciones accidentales. Se necesita poder recuperar registros eliminados y auditar quién creó/modificó cada registro.

Además, en un sistema de gestión de pedidos, eliminar físicamente un registro puede romper relaciones y referencias históricas.

---

## Decisión

Se implementa **soft delete** en todas las entidades del sistema, más campos de auditoría en cada tabla.

Campos estándar en todas las tablas:

```prisma
model BaseEntity {
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  deletedAt  DateTime?  // soft delete
  createdBy  String?    // usuario que creó
  updatedBy  String?    // usuario que modificó
}
```

Las consultas siempre filtran `WHERE deletedAt IS NULL` por defecto. Para acceder a registros eliminados se usa un query parameter `?incluirEliminados=true` en la API.

---

## Opciones Consideradas

### Opción 1: Soft delete con campos de auditoría (seleccionada)
Se agrega `deletedAt` en todas las tablas. Las queries filtran por defecto. Se puede recuperar registros eliminados.

### Opción 2: Hard delete + backup periódico
Los datos se pierden hasta el próximo backup. No hay recuperación granular. No hay trazabilidad de eliminación.

### Opción 3: Tabla de logs separada
Una tabla `audit_log` que registra cada operación. Más complejo (trigger por cada CRUD). Más potente pero sobredimensionado.

### Opción 4: Solo soft delete sin auditoría
Se elimina lógicamente pero no se sabe quién lo hizo ni cuándo exactamente.

### Opción seleccionada
Opción 1. Soft delete es simple de implementar con Prisma (middleware o `@updatedAt`), no requiere tablas adicionales, y permite recuperación granular.

---

## Consecuencias

### Positivas
- Los datos nunca se pierden físicamente
- Recuperación granular de registros eliminados
- Trazabilidad de quién creó/modificó cada registro
- Las relaciones históricas se mantienen (pedidos referencian clientes eliminados)
- Implementación simple con Prisma (middleware `$use`)

### Negativas
- Las tablas crecen en tamaño con registros "borrados"
- Cada query debe filtrar `deletedAt IS NULL` (olvidarlo expone datos "eliminados")
- Las constraints de unicidad pueden conflicto con registros eliminados
- Prisma no tiene soft delete nativo → requiere middleware o consultas explícitas

---

## Impacto en el Sistema

### Backend
- Middleware Prisma que filtra `deletedAt` automáticamente en todas las queries
- Campos `createdAt`, `updatedAt`, `deletedAt`, `createdBy`, `updatedBy` en cada modelo
- Endpoints GET aceptan `?incluirEliminados=true`
- Los services inyectan el usuario autenticado en `createdBy`/`updatedBy`
- PATCH / DELETE solo marcan `deletedAt`, nunca eliminan físicamente

### Frontend (Mobile)
- Sin impacto directo. Puede mostrar indicador visual si un recurso está "eliminado" (soft).

### Infraestructura / Compartido
- Migraciones Prisma para agregar campos de auditoría a tablas existentes
- Prisma middleware para filtrar soft delete automático

---

## Reglas Derivadas

- Toda entidad tiene `createdAt`, `updatedAt`, `deletedAt`, `createdBy`, `updatedBy`
- DELETE siempre es soft delete (marcar `deletedAt`)
- Las queries GET filtran `deletedAt IS NULL` por defecto
- Endpoint con `?incluirEliminados=true` para acceder a eliminados
- El `createdBy` se obtiene del token JWT del request
- Prisma middleware global para filtrar soft delete automáticamente
- Las constraints de unicidad deben considerar `deletedAt` (unique compuesto)
