# Arquitectura del Backend

```mermaid
flowchart LR
    subgraph "Middleware Global (app.ts)"
        HELM[helmet]
        CORS[cors]
        JSON[express.json]
        PINO[pino-http]
    end
    subgraph "Por Feature"
        FEAT[Feature]
    end
    subgraph "Middleware de Feature"
        AUTH[authenticate]
        ROLE[requireRole]
    end
    subgraph "Feature Layers"
        S[Schema Zod]
        C[Controller]
        SVC[Service]
    end
    subgraph "Infraestructura"
        PRISMA[Prisma Client]
        PG[(PostgreSQL)]
        LOG[Logger Pino]
    end
    subgraph "Utils"
        SH[sendSuccess<br/>sendList]
        ERR[ApiError]
        DT[dateFromISODate<br/>fmtDate]
    end

    REQ[HTTP Request] --> HELM
    HELM --> CORS
    CORS --> JSON
    JSON --> PINO
    PINO --> AUTH
    AUTH --> ROLE
    ROLE --> C
    C --> S
    S --> C
    C --> SVC
    SVC --> SH
    SVC --> ERR
    SVC --> PRISMA
    PRISMA --> PG

    SVC -.-> LOG
    C -.-> LOG

    style FEAT fill:#e1f5fe,stroke:#01579b
    style REQ fill:#fff3e0,stroke:#e65100
    style PG fill:#f3e5f5,stroke:#4a148c
```

## Flujo de una request

1. **Middleware global**: `helmet` (seguridad HTTP) → `cors` → `express.json` → `pino-http` (logging)
2. **Autenticación**: `authenticate` verifica JWT (o lanza 401) → `requireRole` verifica rol (o lanza 403)
3. **Controller**: recibe `req.user`, valida body con Zod, llama al service
4. **Service**: orquesta la lógica de negocio, usa Prisma para DB, lanza `ApiError` si algo falla
5. **Response**: `sendSuccess`/`sendList` envuelve en `{ data: ... }` (formato ADR-0000)
6. **Error**: si ocurre `ZodError` o `ApiError`, el `errorHandler` global lo captura y responde con el formato estándar

## Estructura de una feature

```
src/features/<feature>/
├── controller.ts   # Handlers Express (req → service → res)
├── service.ts      # Lógica de negocio + Prisma
├── routes.ts       # Router con middleware y versionado
├── schema.ts       # Schemas Zod para validación
├── types.ts        # Tipos específicos (opcional)
└── __tests__/      # Tests unitarios (Vitest)
```

## Features actuales

| Feature | Endpoints | Archivos |
|---|---|---|
| `auth` | POST `/login`, GET `/me`, PATCH `/me` | 7 (2 test) |
| `clientes` | CRUD completo | 6 (2 test) |
| `items` | GET list, GET by id (solo lectura) | 4 (sin test) |
| `pedidos` | CRUD + estados + items del pedido | 5 (1 test) |
| `repartos` | CRUD + carga + estado + admin | 4 (sin test) |
| `usuarios` | CRUD admin (excepto self) | 6 (1 test) |
