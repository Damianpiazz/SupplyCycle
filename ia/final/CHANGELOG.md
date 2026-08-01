# Changelog — SupplyCycle

Historial de las 3 entregas del proyecto SupplyCycle, un monorepo desarrollado con agentes de IA especializados (backend, mobile y whatsapp-bot). Documenta cómo fue escalando el sistema: de una app de repartidores con API propia a un sistema distribuido de 3 subsistemas con integración máquina-a-máquina y automatización.

## Evolución del sistema entre entregas

| Dimensión | Entrega 1 | Entrega 2 | Entrega 3 |
|---|---|---|---|
| Subsistemas del monorepo | 2 (backend + mobile) | 2 | **3** (+ whatsapp-bot) |
| Roles del sistema | 2 (1 ADMIN, 1 REPARTIDOR) | 2 (1 ADMIN, muchos REPARTIDORES) | **3** (+ BOT) |
| Modelos de datos (Prisma) | 11 (usuarios, clientes, pedidos, domicilios…) | 13 (+ Reparto, Retenido) | **16** (+ Reclamo, Notificacion, Configuracion) |
| Flows del WhatsApp bot | — | — | **6** (alta, pedido, cancelar, reclamo, baja, welcome) |
| Automatización | Modo offline (cola manual) | Seed con 100 pedidos (La Plata) | Jobs `node-cron` + notificaciones automáticas |
| Integración | App ↔ API propia | App ↔ API con datos realistas | **Sistema distribuido M2M** (API keys bidireccionales) |
| Tests al cierre | — | — | 131 backend / 82 bot |

Entre la Entrega 1 y la 2 el sistema escaló en **profundidad**: se mantuvo el alcance de dos subsistemas (backend + mobile), pero el dominio creció con nuevas entidades (Reparto, Retenido), datos realistas (seed de 100 pedidos) y una UI consolidada. Entre la Entrega 2 y la 3 escaló en **amplitud**: se incorporó un tercer subsistema (whatsapp-bot), un nuevo rol de máquina (BOT), integración bidireccional entre servicios con API keys, y el sistema pasó de ser reactivo a automatizar procesos (detección de envases retenidos con `node-cron` y notificación automática por WhatsApp).

## Entrega 1 — Fundamentos y MVP

### Agregado

- Configuración de agentes especializados (backend, mobile, whatsapp-bot) con skills y reglas por subproyecto
- Base funcional del MVP mobile: tipos, theme, componentes UI atómicos y stores Zustand (auth, ui, offline)
- Autenticación JWT end-to-end: login → token → consumo de API con `Authorization: Bearer`
- API y frontend de pedidos (según TDD-0031…0039)
- Rol repartidor con reglas de estados (CANCELADO solo admin, NO_ENTREGADO solo repartidor)
- Modo offline / tareas offline
- Header "SupplyCycle" en todas las pantallas, botones uniformes y tab de clientes en la barra inferior
- Alta de clientes para administradores (con tests)

### Corregido

- Login que no redirigía al home
- Mock fallback que enmascaraba errores del backend (permitía ingresar sin JWT real)
- Texto invisible en el login y botones con colores inconsistentes
- Modo oscuro en la sección de miembros (revisión de PR)

## Entrega 2 — Pulido y documentación

### Agregado

- El dominio se consolida con nuevas entidades: Reparto (seed de reparto diario) y Retenido (RF-06)
- Campo `numero_pedido` (PED-XXXXXX) único, no nulo y no editable, generado automáticamente
- RF-06: visualización de demoras de envases (helper `retenidos-utils`, endpoint enriquecido y endpoints de consumo/historial)
- Guía de RF-07: historial de clientes
- Seed de reparto diario con 100 pedidos con coordenadas en La Plata

### Cambiado

- Tipografía e íconos (migración a `lucide-react-native`)
- Rediseño del detalle de reparto (se eliminó la barra de progreso redundante)
- Documentación en `docs/` revisada y completada

### Corregido

- Error `import.meta` en el build de Expo web
- Errores TypeScript en pantallas de clientes y pedidos
- Visualización del campo de fecha

## Entrega 3 — Integración y automatización

### Agregado

- El sistema pasa de 2 a 3 subsistemas: integración completa WhatsApp bot ↔ backend (proceso SDD: propose → spec → design → apply)
- Nuevo rol de máquina BOT y autenticación M2M por API key (`x-api-key`) en rutas de escritura
- Feature de reclamos y cancelación por cliente desde WhatsApp
- Infraestructura de tests del bot (27 archivos, 82 tests)
- Estimación de demanda: `GET /estadisticas/demanda` y `GET /clientes/:id/demanda`
- RF-12: el sistema se vuelve automático — detección de envases retenidos con `node-cron`, modelos `Configuracion`/`Notificacion`, umbrales configurables y seed idempotente
- Endpoint `POST /v1/send-message` con canal de confianza separado (`x-bot-api-key`)
- Ítem retornable en pedidos y sincronización/reset de la base

### Cambiado

- Formato de documentación: resúmenes estructurados con métricas de tests (131 backend / 82 bot al cierre)
