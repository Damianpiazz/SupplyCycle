# Sesión 01 — MVP Entrega 1: Base funcional de la app mobile

**Fecha:** 2026-05-23
**Objetivo:** Generar la base funcional y consistente de la Entrega 1 del MVP de la app mobile SupplyCycle para repartidores.

---

## Archivos creados

### Arquitectura base
| Archivo | Propósito |
|---|---|
| `mobile/types/api.ts` | Tipos `ApiResponse<T>`, `ApiListResponse<T>`, `ApiError` (ADR-0000) |
| `mobile/types/usuario.ts` | Tipo `Usuario`, `AuthResponse`, `LoginCredentials` (TDD-0005) |
| `mobile/types/cliente.ts` | Tipo `Cliente`, `Domicilio`, `DiaSemana` (TDD-0001) |
| `mobile/types/item.ts` | Tipo `Item`, `PedidoItem` (TDD-0002) |
| `mobile/types/pedido.ts` | Tipo `Pedido`, `EstadoPedido`, `MotivoCancelacion` (TDD-0003) |
| `mobile/types/reparto.ts` | Tipo `Reparto`, `EstadoReparto`, `ResumenCarga` (TDD-0004) |
| `mobile/types/index.ts` | Re-export centralizado |
| `mobile/constants/theme.ts` | Colores extendidos con estados, spacing, border radius, font sizes |

### UI Components (atómicos reutilizables)
| Archivo | Propósito |
|---|---|
| `mobile/components/ui/button.tsx` | Botón con variantes: primary, secondary, danger, ghost, success, warning |
| `mobile/components/ui/card.tsx` | Tarjeta con opción onPress |
| `mobile/components/ui/input.tsx` | Input con label, error, focus state |
| `mobile/components/ui/loading-spinner.tsx` | Spinner de carga con mensaje opcional |
| `mobile/components/ui/error-message.tsx` | Mensaje de error con botón de reintento |
| `mobile/components/ui/header.tsx` | Header "SupplyCycle" superior |
| `mobile/components/ui/icon-symbol.tsx` | Mappings extendidos para todos los íconos usados |
| `mobile/components/ui/index.ts` | Barrel export |

### Stores (Zustand)
| Archivo | Propósito |
|---|---|
| `mobile/stores/authStore.ts` | Store de autenticación: token, usuario, isAuthenticated, isLoading |
| `mobile/stores/uiStore.ts` | Store de UI: isOffline |
| `mobile/stores/offlineStore.ts` | Store de cola offline: mutations pendientes de sincronizar |
| `mobile/stores/index.ts` | Barrel export |

### Servicios HTTP
| Archivo | Propósito |
|---|---|
| `mobile/services/api.ts` | Cliente Axios singleton con interceptors JWT + 401 auto-logout |
| `mobile/services/handleApiError.ts` | Función global de parseo de errores |
| `mobile/services/index.ts` | Barrel export |

### Auth Feature
| Archivo | Propósito |
|---|---|
| `mobile/features/auth/services/authStorage.ts` | SecureStore wrapper: saveToken, getToken, clearToken |
| `mobile/features/auth/services/authService.ts` | Llamadas HTTP reales: login, getMe |
| `mobile/features/auth/services/mockAuthService.ts` | Mock login con credenciales de prueba |
| `mobile/features/auth/hooks/useLogin.ts` | Hook useMutation para login con mock/real toggle |
| `mobile/features/auth/screens/LoginScreen.tsx` | Pantalla de login con validación y manejo de errores |

### Navegación (Expo Router)
| Archivo | Propósito |
|---|---|
| `mobile/app/_layout.tsx` | Layout raíz: auth gate + QueryClientProvider |
| `mobile/app/login.tsx` | Ruta de login |
| `mobile/app/modal.tsx` | Modal global (existente, sin cambios) |
| `mobile/app/(tabs)/_layout.tsx` | Bottom Tab Navigator con 5 tabs (Inicio, Repartos, Pedidos, Mapa, Perfil) |
| `mobile/app/(tabs)/index.tsx` | Ruta Inicio → InicioScreen |
| `mobile/app/(tabs)/repartos/_layout.tsx` | Stack layout con header "SupplyCycle" |
| `mobile/app/(tabs)/repartos/index.tsx` | Ruta Repartos → RepartosListScreen |
| `mobile/app/(tabs)/pedidos/_layout.tsx` | Stack layout con header + detalle |
| `mobile/app/(tabs)/pedidos/index.tsx` | Ruta Pedidos → PedidosListScreen |
| `mobile/app/(tabs)/pedidos/[id].tsx` | Ruta detalle pedido → PedidoDetalleScreen |
| `mobile/app/(tabs)/mapa/_layout.tsx` | Stack layout con header + detalle |
| `mobile/app/(tabs)/mapa/index.tsx` | Ruta Mapa → MapaScreen |
| `mobile/app/(tabs)/mapa/[id].tsx` | Ruta detalle desde mapa → PedidoDetalleScreen |
| `mobile/app/(tabs)/perfil.tsx` | Ruta Perfil → PerfilScreen |

### Mock Data
| Archivo | Propósito |
|---|---|
| `mobile/mocks/mockData.ts` | 6 clientes, 3 items, 6 pedidos (estados mixtos), 1 reparto en curso, motivos de cancelación |

### Tests
| Archivo | Tests |
|---|---|
| `mobile/types/__tests__/types.test.ts` | 8 tests: validación de estructuras de tipos |
| `mobile/mocks/__tests__/mockData.test.ts` | 12 tests: integridad y consistencia de datos mock |
| `mobile/features/auth/__tests__/authStorage.test.ts` | 4 tests: SecureStore wrapper |
| `mobile/features/auth/__tests__/mockAuthService.test.ts` | 4 tests: login mock exitoso/fallido |
| `mobile/services/__tests__/handleApiError.test.ts` | 4 tests: parseo de errores Axios y red |
| `mobile/vitest.config.ts` | Configuración de Vitest con path alias |

---

## Decisiones técnicas

1. **Mock toggle via constante `USE_MOCK`**: Cada hook de feature tiene un flag `USE_MOCK = true` que permite switchear entre datos mock y llamadas HTTP reales cuando el backend esté disponible. No requiere configuración externa.

2. **Auth gate en `_layout.tsx`**: El layout raíz verifica el token al montar la app. Si hay token en SecureStore, intenta cargar el usuario vía mock (getMeRequest). Si no hay token, muestra el login. Esto sigue ADR-0010.

3. **Stacks por tab**: Cada tab que necesita navegación interna (Pedidos, Mapa) tiene su propio `_layout.tsx` con `Stack` navigator. Repartos también tiene stack aunque actualmente solo tiene una pantalla, preparado para futuras expansiones.

4. **Pantalla de detalle compartida**: `PedidoDetalleScreen` se importa tanto desde `pedidos/[id].tsx` como desde `mapa/[id].tsx`. Cada una mantiene su propio stack, por lo que al volver desde detalle se regresa al tab correcto.

5. **Sin Google Maps nativo aún**: El Mapa usa un placeholder visual con lista de marcadores y tarjeta de información al seleccionar. La integración real con Google Maps se hará en una iteración posterior.

6. **OfflineStore preparada**: La estructura de cola offline está creada y lista para integrarse con TanStack Query's `onMutate` optimista y NetInfo para detección de conectividad.

7. **Validación de login en frontend**: La pantalla de Login valida email formato y campos vacíos antes de enviar, mostrando errores inline sin llamar al servidor.

---

## Lo que queda pendiente por feature

### Auth
- [ ] Integración real con backend `POST /api/v1/auth/login` y `GET /api/v1/auth/me`
- [ ] Refresh token flow
- [ ] Test de integración login + navegación

### Repartos
- [ ] Botones de acción rápida en Inicio (Saltar/Entregar)
- [ ] Vista de carga del camión (resumen de carga)
- [ ] Iniciar/Finalizar reparto

### Pedidos
- [ ] Agregar nuevo pedido desde la app
- [ ] Sincronización optimista con TanStack Query
- [ ] Historial de pedidos con paginación

### Mapa
- [ ] Integración real con Google Maps (`react-native-maps`)
- [ ] Marcadores diferenciados por estado
- [ ] Línea de ruta entre puntos de entrega

### Perfil
- [ ] Editar datos de contacto
- [ ] Estadísticas del repartidor

### Offline
- [ ] Integración con `@react-native-community/netinfo`
- [ ] Cache en AsyncStorage de pedidos del día
- [ ] Ejecución automática de cola offline al恢复ar conexión
- [ ] Banner "Sin conexión" en UI
- [ ] Límite de reintentos (3) para mutaciones offline

### Testing
- [ ] Tests de componentes UI (Button, Card, LoginScreen)
- [ ] Tests de integración pantalla completa (login → ver pedidos)
- [ ] Mocks para expo-router en tests

### Infraestructura
- [ ] Variables de entorno funcionales (.env)
- [ ] Google Maps API key
- [ ] CI/CD para tests automáticos

---

## Resumen de resultados

- **36 tests unitarios** pasando correctamente
- **0 errores de TypeScript** (`tsc --noEmit` exitoso)
- **5 features implementadas**: Auth, Repartos, Pedidos, Mapa, Perfil
- **10 pantallas**: Login, Inicio, Repartos, Pedidos Lista, Pedido Detalle, Mapa, Mapa Detalle, Perfil
- **5 tabs** en la barra inferior
- **Mock login funcional** con credenciales `repartidor@supplycycle.com` / `12345678`
