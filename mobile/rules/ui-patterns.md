# Mobile UI Patterns
## Componentes
- UI atómicos en `components/ui/` (Button, Card, Input, etc.)
- Componentes compuestos en `components/`
- Cada componente es `export default function`
## Estilos
- Usar StyleSheet.create() en cada componente
- Colores y spacing desde `constants/theme.ts`
- Dark mode via `useColorScheme()` hook
## Navegación
- Expo Router file-based en `app/`
- Nuevas rutas = nuevo archivo en `app/`
- Tabs en `app/(tabs)/`
- Modales en `app/modal.tsx`