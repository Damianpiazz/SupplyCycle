# Mobile Testing Guidelines

## Stack
- **Framework**: Vitest (compatible con Jest API: `describe`, `it`, `expect`)
- **Render**: `@testing-library/react-native`
- **Mocking**: mocks manuales en `__mocks__/` o `vitest-mock-extended`

## Nomenclatura
- Tests junto al código fuente: `Componente.test.tsx`, `hook.test.ts`
- Tests de integración en `tests/integration/`

## Cobertura por capa

| Capa | Tipo de test | Qué probar |
|---|---|---|
| Componentes UI | Unitario | Renderizado con diferentes props, estados (loading, error, vacío), eventos (onPress) |
| Hooks | Unitario | Lógica de negocio, queries/mutations mockeadas, casos de borde |
| Services | Unitario | Llamadas HTTP, transformación de datos, errores de red |
| Screens | Integración | Flujo completo con mocks (login → ver pedidos → confirmar entrega) |

## Mocks recomendados

| Dependencia | Cómo mockear |
|---|---|
| `expo-secure-store` | `__mocks__/expo-secure-store.ts` — `getItemAsync`, `setItemAsync`, `deleteItemAsync` |
| `@react-native-community/netinfo` | `__mocks__/@react-native-community/netinfo.ts` — `fetch()`, `addEventListener()` |
| `axios` | Mockear a nivel de TanStack Query, no de Axios |
| `expo-router` | `router.push`, `router.replace` como jest.fn() |

## Coverage mínimo
- 70% en componentes UI
- 80% en hooks y services

## Comandos
```bash
npm run test           # vitest
npm run test:coverage  # vitest --coverage
```

## Reglas
- Cada componente/hook principal debe tener al menos un test
- Testear estado vacío: "No hay datos", "Lista vacía"
- Testear estado error: "Error al cargar", botón de reintento
- NO testear implementación interna (estados privados, funciones helper internas)
- SÍ testear comportamiento observable (renderizado, eventos, salida de hooks)
