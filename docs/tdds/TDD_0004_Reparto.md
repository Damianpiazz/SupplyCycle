---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Reparto
---

# TDD-0004: Reparto

## Contexto de Negocio (PRD)

### Objetivo

Definir la entidad Reparto como la agrupación lógica de entregas que un repartidor debe realizar en una jornada. Un reparto organiza los pedidos del día según un recorrido preestablecido y permite calcular el resumen de carga del camión antes de salir a la calle.

### User Persona

- **Nombre**: Repartidor
- **Necesidad**: Iniciar su jornada conociendo qué y cuánto debe cargar en el camión, visualizar el progreso de su ruta (entregas pendientes vs. completadas), y dar por finalizado su recorrido diario una vez visitados todos los domicilios.

### Criterios de Aceptación

- El sistema debe agrupar los pedidos asignados a un repartidor para una fecha específica bajo una única entidad de Reparto.
- El reparto debe reflejar un estado general: `PENDIENTE`, `EN_CURSO` o `COMPLETADO`.
- No se puede iniciar un reparto si el repartidor ya tiene otro en estado `EN_CURSO`.
- No se puede marcar un reparto como `COMPLETADO` si aún tiene pedidos en estado `PENDIENTE`.
- No se puede crear un reparto sin al menos un pedido asociado.
- La transición de estados válida es: `PENDIENTE` → `EN_CURSO` → `COMPLETADO`. No se puede retroceder.
- Si no existe reparto para el día, el sistema responde con lista vacía sin error.
- El sistema debe poder calcular y mostrar el resumen de carga del camión sumando las cantidades de todos los ítems de los pedidos del reparto.
- El sistema debe proveer métricas básicas por reparto: total de pedidos, pendientes y completados.

---

## Diseño Técnico (RFC)

### Modelo de Datos (Prisma)

```prisma
model Reparto {
  id            String        @id @default(uuid())
  repartidorId  String
  fecha         DateTime      @db.Date
  estado        EstadoReparto @default(PENDIENTE)
  horaInicio    String?       // ej: "10:00"
  horaFin       String?       // ej: "14:30"
  creadoEn      DateTime      @default(now())
  actualizadoEn DateTime      @updatedAt
  pedidos       Pedido[]

  @@unique([repartidorId, fecha]) // un repartidor no puede tener dos repartos el mismo día
}

enum EstadoReparto {
  PENDIENTE
  EN_CURSO
  COMPLETADO
}
```

### Validaciones (Zod)

```ts
const crearRepartoSchema = z.object({
  repartidorId: z.string().uuid(),
  fecha: z.string().datetime(),
  pedidoIds: z.array(z.string().uuid()).min(1, 'El reparto debe tener al menos un pedido'),
});

const actualizarEstadoSchema = z.object({
  estado: z.enum(['EN_CURSO', 'COMPLETADO']),
});
```

### Contrato de API

#### Obtener repartos de un repartidor

- **Endpoint**: `GET /api/v1/repartos`
- **Query params**: `repartidorId` (requerido), `fecha` (opcional, por defecto hoy), `estado` (opcional)
- **Response Body**:

```ts
{
  data: {
    id: string;
    fecha: string;
    estado: 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';
    horaInicio?: string;
    horaFin?: string;
    resumen: {
      totalPedidos: number;
      completados: number;
      pendientes: number;
    };
  }[];
}
```

#### Obtener resumen de carga del camión

- **Endpoint**: `GET /api/v1/repartos/:id/carga`
- **Response Body**:

```ts
{
  repartoId: string;
  items: {
    producto: string;
    cantidadTotal: number;
    unidad: string;
  }[];
}
```

#### Actualizar estado del reparto

- **Endpoint**: `PATCH /api/v1/repartos/:id/estado`
- **Request Body**:

```ts
{
  estado: 'EN_CURSO' | 'COMPLETADO';
}
```

- **Response Body**:

```ts
{
  id: string;
  estado: string;
  actualizadoEn: string;
}
```

### Tipos TypeScript compartidos (mobile)

```ts
export type EstadoReparto = 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';

export interface ResumenCarga {
  producto: string;
  cantidadTotal: number;
  unidad: string;
}

export interface Reparto {
  id: string;
  repartidorId: string;
  fecha: string;
  estado: EstadoReparto;
  horaInicio?: string;
  horaFin?: string;
  pedidos?: Pedido[];
  resumen?: {
    totalPedidos: number;
    completados: number;
    pendientes: number;
  };
}
```

### Componentes de Arquitectura (Backend)

- **Domain**: Entidad `Reparto`, enum `EstadoReparto`. Reglas de negocio:
  1. No se puede iniciar un reparto si el repartidor ya tiene otro en estado `EN_CURSO`
  2. No se puede marcar como `COMPLETADO` si hay pedidos en estado `PENDIENTE`
  3. No se puede retroceder en la transición de estados (`COMPLETADO` → `EN_CURSO` inválido)
  4. No se puede crear un reparto sin al menos un pedido
  5. Un repartidor no puede tener dos repartos para la misma fecha
- **Application**: Casos de uso `ListarRepartosPorRepartidor`, `ObtenerResumenCarga`, `ActualizarEstadoReparto`
- **Infrastructure**: Controlador `repartos.controller.ts`, servicio `repartos.service.ts`, rutas `repartos.routes.ts`, schema Zod `repartos.schemas.ts`

---

## Casos de Borde y Errores

| Escenario | Resultado Esperado | Código HTTP |
|---|---|---|
| Reparto inexistente | Error "Reparto no encontrado" | 404 Not Found |
| Iniciar reparto teniendo otro activo | Error "Ya existe un reparto en curso para hoy" | 409 Conflict |
| Completar reparto con pedidos pendientes | Error "Existen entregas sin procesar en la ruta" | 400 Bad Request |
| `repartidorId` ausente al listar | Error de validación | 400 Bad Request |
| Retroceder estado (ej: `COMPLETADO` → `EN_CURSO`) | Error "Transición de estado inválida" | 400 Bad Request |
| Crear reparto sin pedidos | Error "El reparto debe tener al menos un pedido" | 400 Bad Request |
| Dos repartos para el mismo repartidor el mismo día | Error "Ya existe un reparto para esa fecha" | 409 Conflict |
| No hay repartos para el día | Lista vacía sin error | 200 OK |

---

## Plan de Implementación

1. Definir el modelo `Reparto` en `prisma/schema.prisma` y actualizar la relación en `Pedido`
2. Agregar constraint `@@unique([repartidorId, fecha])` en el modelo
3. Ejecutar migración con `npx prisma migrate dev`
4. Definir tipos TypeScript en el mobile (`types/reparto.ts`)
5. Implementar schema de validación Zod en `repartos.schemas.ts`
6. Implementar lógica de agrupación de carga en `repartos.service.ts`
7. Implementar controlador en `repartos.controller.ts`
8. Registrar rutas en `repartos.routes.ts`
9. Asegurar que el seed asigne correctamente los pedidos del TDD-0003 a un reparto válido