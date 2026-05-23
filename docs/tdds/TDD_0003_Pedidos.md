---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Pedido
---

# TDD-0003: Pedido

## Contexto de Negocio (PRD)

### Objetivo

El Pedido representa la entrega de uno o más ítems a un cliente en una fecha específica. Es la entidad central del flujo del repartidor: ver, confirmar o registrar como fallida cada entrega del día.

### User Persona

- **Nombre**: Repartidor
- **Necesidad**: Ver los pedidos asignados para el día, consultar el detalle de cada uno, y registrar si la entrega fue exitosa o fallida, indicando el motivo en caso de falla.

### Criterios de Aceptación

- El sistema debe mostrar todos los pedidos del día para un repartidor dado.
- Cada pedido debe tener un estado: `PENDIENTE`, `ENTREGADO` o `NO_ENTREGADO`.
- El repartidor puede confirmar una entrega, cambiando el estado a `ENTREGADO`.
- El repartidor puede registrar una entrega fallida, cambiando el estado a `NO_ENTREGADO` e indicando un motivo obligatorio.
- Solo se puede confirmar o cancelar un pedido que esté en estado `PENDIENTE`.
- Un pedido debe tener al menos un ítem para poder crearse.
- No puede haber dos pedidos para el mismo cliente en la misma fecha.
- El campo `orden` debe ser mayor a 0.
- Si no hay pedidos para el día, el sistema responde con lista vacía sin error.
- El cambio de estado debe reflejarse inmediatamente en el listado y en el mapa.

---

## Diseño Técnico (RFC)

### Modelo de Datos (Prisma)

```prisma
model Pedido {
  id            String        @id @default(uuid())
  clienteId     String
  repartoId     String
  fecha         DateTime
  estado        EstadoPedido  @default(PENDIENTE)
  motivoFalla   String?
  orden         Int           // posición en el recorrido del día, mayor a 0
  creadoEn      DateTime      @default(now())
  actualizadoEn DateTime      @updatedAt
  cliente       Cliente       @relation(fields: [clienteId], references: [id])
  reparto       Reparto       @relation(fields: [repartoId], references: [id])
  items         PedidoItem[]

  @@unique([clienteId, fecha]) // un cliente no puede tener dos pedidos el mismo día
}

model PedidoItem {
  id       String @id @default(uuid())
  pedidoId String
  itemId   String
  cantidad Int    // mayor a 0
  pedido   Pedido @relation(fields: [pedidoId], references: [id])
  item     Item   @relation(fields: [itemId], references: [id])
}

enum EstadoPedido {
  PENDIENTE
  ENTREGADO
  NO_ENTREGADO
}
```

### Validaciones (Zod)

```ts
const crearPedidoSchema = z.object({
  clienteId: z.string().uuid(),
  repartoId: z.string().uuid(),
  fecha: z.string().datetime(),
  orden: z.number().int().min(1, 'El orden debe ser mayor a 0'),
  items: z.array(z.object({
    itemId: z.string().uuid(),
    cantidad: z.number().int().min(1, 'La cantidad debe ser mayor a 0'),
  })).min(1, 'El pedido debe tener al menos un ítem'),
});

const cancelarPedidoSchema = z.object({
  motivo: z.enum(['CLIENTE_AUSENTE', 'DIRECCION_INCORRECTA', 'ACCESO_DENEGADO', 'OTRO']),
});
```

### Contrato de API

#### Obtener pedidos del día para un repartidor

- **Endpoint**: `GET /api/v1/pedidos/hoy`
- **Query params**: `repartidorId` (requerido)
- **Response Body**:

```ts
{
  data: {
    id: string;
    orden: number;
    estado: 'PENDIENTE' | 'ENTREGADO' | 'NO_ENTREGADO';
    fecha: string; // ISO 8601
    cliente: {
      id: string;
      nombre: string;
      apellido: string;
      telefono: string;
      domicilio: Domicilio;
      horarioDesde: string;
      horarioHasta: string;
    };
    items: PedidoItem[];
  }[];
}
```

#### Obtener detalle de un pedido

- **Endpoint**: `GET /api/v1/pedidos/:id`
- **Response Body**:

```ts
{
  id: string;
  orden: number;
  estado: 'PENDIENTE' | 'ENTREGADO' | 'NO_ENTREGADO';
  fecha: string;
  motivoFalla?: string;
  cliente: Cliente;
  items: PedidoItem[];
}
```

#### Obtener todos los pedidos con filtros

- **Endpoint**: `GET /api/v1/pedidos`
- **Query params opcionales**: `clienteNombre`, `fecha`, `estado`
- **Response Body**:

```ts
{
  data: Pedido[];
  total: number;
}
```

#### Confirmar entrega exitosa

- **Endpoint**: `PATCH /api/v1/pedidos/:id/confirmar`
- **Request Body**: ninguno
- **Response Body**:

```ts
{
  id: string;
  estado: 'ENTREGADO';
  actualizadoEn: string;
}
```

#### Registrar entrega fallida

- **Endpoint**: `PATCH /api/v1/pedidos/:id/cancelar`
- **Request Body**:

```ts
{
  motivo: 'CLIENTE_AUSENTE' | 'DIRECCION_INCORRECTA' | 'ACCESO_DENEGADO' | 'OTRO';
}
```

- **Response Body**:

```ts
{
  id: string;
  estado: 'NO_ENTREGADO';
  motivoFalla: string;
  actualizadoEn: string;
}
```

#### Agregar un nuevo pedido

- **Endpoint**: `POST /api/v1/pedidos`
- **Request Body**:

```ts
{
  clienteId: string;
  repartoId: string;
  fecha: string; // ISO 8601
  orden: number; // mayor a 0
  items: {
    itemId: string;
    cantidad: number; // mayor a 0
  }[]; // mínimo 1 ítem
}
```

- **Response Body**:

```ts
{
  id: string;
  estado: 'PENDIENTE';
  creadoEn: string;
}
```

### Tipos TypeScript compartidos (mobile)

```ts
export type EstadoPedido = 'PENDIENTE' | 'ENTREGADO' | 'NO_ENTREGADO';

export type MotivoCancelacion =
  | 'CLIENTE_AUSENTE'
  | 'DIRECCION_INCORRECTA'
  | 'ACCESO_DENEGADO'
  | 'OTRO';

export interface Pedido {
  id: string;
  orden: number;
  estado: EstadoPedido;
  fecha: string;
  motivoFalla?: string;
  cliente: Cliente;
  items: PedidoItem[];
}
```

### Componentes de Arquitectura (Backend)

- **Domain**: Entidad `Pedido`, enum `EstadoPedido`, enum `MotivoCancelacion`, reglas: solo se puede confirmar o cancelar un pedido en estado `PENDIENTE`; un pedido debe tener al menos un ítem; no puede haber dos pedidos para el mismo cliente en la misma fecha
- **Application**: Casos de uso `ObtenerPedidosDelDia`, `ObtenerDetallePedido`, `ListarPedidos`, `ConfirmarEntrega`, `RegistrarEntregaFallida`, `AgregarPedido`
- **Infrastructure**: Controlador `pedidos.controller.ts`, servicio `pedidos.service.ts`, rutas `pedidos.routes.ts`, schema Zod `pedidos.schemas.ts`

---

## Casos de Borde y Errores

| Escenario | Resultado Esperado | Código HTTP |
|---|---|---|
| Pedido inexistente | Error "Pedido no encontrado" | 404 Not Found |
| Confirmar pedido ya entregado | Error "El pedido ya fue procesado" | 409 Conflict |
| Cancelar pedido ya procesado | Error "El pedido ya fue procesado" | 409 Conflict |
| Cancelar sin motivo | Error de validación | 400 Bad Request |
| Motivo de cancelación inválido | Error con valores aceptados | 400 Bad Request |
| `repartidorId` ausente en `/hoy` | Error de validación | 400 Bad Request |
| No hay pedidos para el día | Lista vacía sin error | 200 OK |
| Crear pedido sin ítems | Error "El pedido debe tener al menos un ítem" | 400 Bad Request |
| Crear pedido con ítem inactivo | Error "El ítem no está disponible" | 400 Bad Request |
| Crear pedido con ítem inexistente | Error de validación | 400 Bad Request |
| Dos pedidos para el mismo cliente el mismo día | Error "El cliente ya tiene un pedido para esa fecha" | 409 Conflict |
| `orden` igual a 0 o negativo | Error "El orden debe ser mayor a 0" | 400 Bad Request |

---

## Plan de Implementación

1. Definir modelos `Pedido` y `PedidoItem` en `prisma/schema.prisma`
2. Agregar constraint `@@unique([clienteId, fecha])` en el modelo
3. Ejecutar migración con `npx prisma migrate dev`
4. Definir tipos TypeScript en el mobile (`types/pedido.ts`)
5. Implementar schema de validación Zod en `pedidos.schemas.ts`
6. Implementar servicio en `pedidos.service.ts` con todos los casos de uso
7. Implementar controlador en `pedidos.controller.ts`
8. Registrar rutas en `pedidos.routes.ts`
9. Cargar datos mock/seed para el día actual