# Mobile UI Patterns

## Componentes
- UI atómicos en `components/ui/` (Button, Card, Input, Header, LoadingSpinner, ErrorMessage)
- Componentes compuestos en `components/`
- Cada componente es `export default function`
- Límite: **máximo 250 líneas por componente**. Si excede, extraer a subcomponentes o hooks.

## Estilos
- Usar `StyleSheet.create()` en cada componente
- Colores y spacing desde `constants/theme.ts`
- Dark mode via `useColorScheme()` + `useThemeColor()`

## Navegación
- Expo Router file-based en `app/`
- Nuevas rutas = nuevo archivo en `app/`
- Tabs en `app/(tabs)/`
- El layout raíz (`app/_layout.tsx`) es el **auth gate**: si no hay token → login; si hay token → tabs
- Cada tab con stack propio usa `_layout.tsx` dentro de su carpeta: `pedidos/_layout.tsx`, `mapa/_layout.tsx`
- Las pantallas de detalle compartidas (`PedidoDetalleScreen`) se importan desde `features/pedidos/screens/`

## Header
- Todas las pantallas tienen un header superior con el texto "SupplyCycle"
- Configurar via `options={{ title: 'SupplyCycle', headerTitle: 'SupplyCycle' }}` en cada layout

## UI en español
- Todo el texto visible al usuario va en español
- Código fuente (variables, funciones, tipos, hooks, nombres de archivo) en inglés
