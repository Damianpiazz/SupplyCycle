---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Cliente
---

# TDD-0001: Cliente

## Contexto de Negocio (PRD)

### Objetivo

Definir la entidad Cliente como base del sistema. Un cliente es una persona que recibe entregas periódicas de bidones de agua en un domicilio fijo, en un día asignado de la semana. El repartidor necesita acceder a sus datos para ejecutar y registrar las entregas del día.

### User Persona

- **Nombre**: Repartidor
- **Necesidad**: Conocer el nombre, domicilio, contacto y horario de cada cliente para poder realizar la entrega de forma eficiente durante su recorrido diario.

### Criterios de Aceptación

- El sistema debe permitir obtener los datos de un cliente por su ID.
- El cliente debe tener asociado un día fijo de entrega en la semana.
- El cliente debe tener una franja horaria preferida de entrega, y `horarioDesde` debe ser anterior a `horarioHasta`.
- El contacto telefónico del cliente debe estar disponible para que el repartidor pueda llamar directamente desde la app.
- El domicilio debe incluir calle, número, localidad y coordenadas geográficas para su uso en el mapa.
- El nombre y apellido no pueden estar vacíos ni ser menores a 2 caracteres.
- El teléfono debe tener un formato válido (solo números, mínimo 7 dígitos).
- La calle y el número no pueden estar vacíos.

---

## Diseño Técnico (RFC)

### Modelo de Datos (Prisma)

```prisma
model Cliente {
  id            String    @id @default(uuid())
  nombre        String    @db.VarChar(100)
  apellido      String    @db.VarChar(100)
  telefono      String    @db.VarChar(20)
  calle         String
  numero        String
  localidad     String
  latitud       Float
  longitud      Float
  diaEntrega    DiaSemana
  horarioDesde  String    // ej: "10:00"
  horarioHasta  String    // ej: "12:00"
  observaciones String?
  creadoEn      DateTime  @default(now())
  actualizadoEn DateTime  @updatedAt
  pedidos       Pedido[]
}

enum DiaSemana {
  LUNES
  MARTES
  MIERCOLES
  JUEVES
  VIERNES
  SABADO
}
```

### Validaciones (Zod)

```ts
const clienteSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(100),
  telefono: z.string().regex(/^\d{7,15}$/, 'El teléfono debe tener entre 7 y 15 dígitos'),
  calle: z.string().min(1, 'La calle es requerida'),
  numero: z.string().min(1, 'El número es requerido'),
  localidad: z.string().min(1, 'La localidad es requerida'),
  latitud: z.number().min(-90).max(90),
  longitud: z.number().min(-180).max(180),
  diaEntrega: z.enum(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']),
  horarioDesde: z.string().regex(/^\d{2}:\d{2}$/),
  horarioHasta: z.string().regex(/^\d{2}:\d{2}$/),
  observaciones: z.string().optional(),
}).refine(
  (data) => data.horarioDesde < data.horarioHasta,
  { message: 'horarioDesde debe ser anterior a horarioHasta', path: ['horarioDesde'] }
);
```

### Contrato de API

#### Obtener cliente por ID

- **Endpoint**: `GET /api/v1/clientes/:id`
- **Request Body**: ninguno
- **Response Body**:

```ts
{
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  domicilio: {
    calle: string;
    numero: string;
    localidad: string;
    latitud: number;
    longitud: number;
  };
  diaEntrega: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO';
  horarioDesde: string;
  horarioHasta: string;
  observaciones?: string;
}
```

#### Listar todos los clientes

- **Endpoint**: `GET /api/v1/clientes`
- **Query params opcionales**: `nombre`, `dia`
- **Response Body**:

```ts
{
  data: Cliente[];
  total: number;
}
```

### Tipos TypeScript compartidos (mobile)

```ts
export type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO';

export interface Domicilio {
  calle: string;
  numero: string;
  localidad: string;
  latitud: number;
  longitud: number;
}

export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  domicilio: Domicilio;
  diaEntrega: DiaSemana;
  horarioDesde: string;
  horarioHasta: string;
  observaciones?: string;
}
```

### Componentes de Arquitectura (Backend)

- **Domain**: Entidad `Cliente`, Value Object `Domicilio`, reglas de negocio: el día de entrega debe ser válido, `horarioDesde` debe ser anterior a `horarioHasta`
- **Application**: Caso de uso `ObtenerClientePorId`, `ListarClientes`
- **Infrastructure**: Controlador `clientes.controller.ts`, servicio `clientes.service.ts`, rutas `clientes.routes.ts`, schema Zod `clientes.schemas.ts`

---

## Casos de Borde y Errores

| Escenario | Resultado Esperado | Código HTTP |
|---|---|---|
| ID de cliente inexistente | Error "Cliente no encontrado" | 404 Not Found |
| ID con formato inválido | Error de validación | 400 Bad Request |
| Coordenadas fuera de rango | Error de validación | 400 Bad Request |
| Día de entrega inválido | Error con valores aceptados | 400 Bad Request |
| Nombre o apellido menor a 2 caracteres | Error de validación | 400 Bad Request |
| Teléfono con formato inválido | Error "El teléfono debe tener entre 7 y 15 dígitos" | 400 Bad Request |
| Calle o número vacíos | Error de validación | 400 Bad Request |
| `horarioDesde` mayor o igual a `horarioHasta` | Error "horarioDesde debe ser anterior a horarioHasta" | 400 Bad Request |
| No hay clientes registrados | Lista vacía sin error | 200 OK |

---

## Plan de Implementación

1. Definir el modelo `Cliente` en `prisma/schema.prisma`
2. Ejecutar migración con `npx prisma migrate dev`
3. Definir tipos TypeScript en el mobile (`types/cliente.ts`)
4. Implementar schema de validación Zod en `clientes.schemas.ts`
5. Implementar servicio en `clientes.service.ts`
6. Implementar controlador en `clientes.controller.ts`
7. Registrar rutas en `clientes.routes.ts`
8. Cargar datos mock/seed para desarrollo