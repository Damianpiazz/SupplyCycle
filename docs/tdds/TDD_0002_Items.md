---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Item
---

# TDD-0002: Item

## Contexto de Negocio (PRD)

### Objetivo

Definir la entidad Item como los productos que pueden ser incluidos en un pedido. En la Entrega 1, el ítem principal es el bidón de agua, pero la entidad debe estar preparada para soportar otros productos en el futuro.

### User Persona

- **Nombre**: Repartidor
- **Necesidad**: Ver qué productos y en qué cantidad debe entregar en cada parada, para no cometer errores durante el reparto.

### Criterios de Aceptación

- Cada ítem debe tener un nombre de al menos 2 caracteres y una unidad de medida.
- Un ítem puede estar activo o inactivo (para no eliminarlo si tiene historial).
- El repartidor debe ver los ítems asociados a cada pedido con su cantidad.
- La cantidad de un ítem en un pedido debe ser mayor a 0.
- Un ítem inactivo no puede ser incluido en un pedido nuevo.
- Si no hay ítems activos, el sistema responde con lista vacía sin error.

---

## Diseño Técnico (RFC)

### Modelo de Datos (Prisma)

```prisma
model Item {
  id          String       @id @default(uuid())
  nombre      String       @db.VarChar(100)
  descripcion String?
  unidad      String       // ej: "unidad", "litros"
  activo      Boolean      @default(true)
  creadoEn    DateTime     @default(now())
  pedidoItems PedidoItem[]
}
```

### Validaciones (Zod)

```ts
const itemSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  descripcion: z.string().optional(),
  unidad: z.string().min(1, 'La unidad es requerida'),
  activo: z.boolean().default(true),
});

const pedidoItemSchema = z.object({
  itemId: z.string().uuid('El ID del ítem debe ser un UUID válido'),
  cantidad: z.number().int().min(1, 'La cantidad debe ser mayor a 0'),
});
```

### Contrato de API

#### Listar ítems disponibles

- **Endpoint**: `GET /api/v1/items`
- **Query params opcionales**: `activo` (boolean, por defecto `true`)
- **Response Body**:

```ts
{
  data: Item[];
}
```

#### Obtener ítem por ID

- **Endpoint**: `GET /api/v1/items/:id`
- **Response Body**:

```ts
{
  id: string;
  nombre: string;
  descripcion?: string;
  unidad: string;
  activo: boolean;
}
```

### Tipos TypeScript compartidos (mobile)

```ts
export interface Item {
  id: string;
  nombre: string;
  descripcion?: string;
  unidad: string;
  activo: boolean;
}

export interface PedidoItem {
  item: Item;
  cantidad: number; // siempre > 0
}
```

### Componentes de Arquitectura (Backend)

- **Domain**: Entidad `Item`, regla: no se puede eliminar un ítem con historial de pedidos, solo desactivar; la cantidad en `PedidoItem` debe ser mayor a 0
- **Application**: Caso de uso `ListarItems`, `ObtenerItemPorId`
- **Infrastructure**: Controlador `items.controller.ts`, servicio `items.service.ts`, rutas `items.routes.ts`, schema Zod `items.schemas.ts`

---

## Casos de Borde y Errores

| Escenario | Resultado Esperado | Código HTTP |
|---|---|---|
| ID de ítem inexistente | Error "Ítem no encontrado" | 404 Not Found |
| Ítem inactivo incluido en pedido nuevo | Error "El ítem no está disponible" | 400 Bad Request |
| Nombre vacío o menor a 2 caracteres | Error de validación | 400 Bad Request |
| Cantidad igual a 0 o negativa en PedidoItem | Error "La cantidad debe ser mayor a 0" | 400 Bad Request |
| No hay ítems activos | Lista vacía sin error | 200 OK |
| Unidad vacía | Error de validación | 400 Bad Request |

---

## Plan de Implementación

1. Definir el modelo `Item` y `PedidoItem` en `prisma/schema.prisma`
2. Ejecutar migración con `npx prisma migrate dev`
3. Definir tipos TypeScript en el mobile (`types/item.ts`)
4. Implementar schema de validación Zod en `items.schemas.ts`
5. Implementar servicio en `items.service.ts`
6. Implementar controlador en `items.controller.ts`
7. Registrar rutas en `items.routes.ts`
8. Cargar datos mock/seed (ej: Bidón 20L, Bidón 12L)