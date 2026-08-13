---
name: add-screen
description: Crea pantalla + ruta en Expo Router siguiendo la estructura real del repo (tabs con stack propio, features, header SupplyCycle).
metadata:
  version: "1.1.0"
  tags: expo, react-native, expo-router, screens
  scope: project
---

# add-screen — Crear una pantalla en Expo Router

## Contexto / Propósito

La app móvil usa Expo SDK 54 + Expo Router con file-based routing. Las rutas viven en `mobile/app/` y cada tab tiene su propio stack (`_layout.tsx` dentro de su carpeta). Las pantallas reutilizables se implementan como componentes en `mobile/features/<feature>/screens/` y las rutas `app/` solo las importan.

Estructura real de tabs: `index` (Inicio), `repartos`, `pedidos`, `mapa`, `clientes`, `estadisticas`, `usuarios`, `perfil` + carpeta `inicio/` como stack interno del tab Inicio (`href: null`).

## Pasos

1. **Definir el grupo de tab**: el archivo de ruta va en `mobile/app/(tabs)/<grupo>/<nombre>.tsx` (ej. `pedidos/alta.tsx`). Si el grupo no tiene `_layout.tsx`, crealo con un `Stack` propio.

2. **Crear la pantalla en la feature** (lógica de negocio y UI), ej. `mobile/features/pedidos/screens/PedidoDetalleScreen.tsx`:

```tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '@/constants/theme';

export default function PedidoDetalleScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  title: { fontSize: 18, fontWeight: '600' },
});
```

3. **Crear la ruta** en `app/(tabs)/<grupo>/<nombre>.tsx` que importa la pantalla:

```tsx
import PedidoDetalleScreen from '@/features/pedidos/screens/PedidoDetalleScreen';

export default function Route() {
  return <PedidoDetalleScreen />;
}
```

4. **Detalles reutilizables**: si la pantalla es el detalle de un pedido, reutilizar `PedidoDetalleScreen` (importado desde `features/pedidos/screens/`) en lugar de duplicar. Las rutas `[id]` reciben el parámetro con `useLocalSearchParams()`.

5. **Header**: configurar `options={{ title: 'SupplyCycle', headerTitle: 'SupplyCycle' }}` en el `_layout.tsx` correspondiente.

## Reglas

- Componentes UI atómicos en `mobile/components/ui/` (máximo 250 líneas por componente)
- Estilos con `StyleSheet.create()` + colores/spacing de `constants/theme.ts`
- Dark mode via `useColorScheme()` + `useThemeColor()`
- Código en inglés; texto visible al usuario en español
- Nada de HTTP directo en screens: usar hooks (TanStack Query) o `services/`
- Una feature NO importa de otra feature: tipos desde `types/`, lógica compartida desde `hooks/` o `services/` globales

## Checklist

- [ ] Ruta en `app/(tabs)/<grupo>/` y pantalla en `features/<feature>/screens/`
- [ ] `_layout.tsx` del grupo con `Stack` y header "SupplyCycle" (si corresponde)
- [ ] Reutilización de `PedidoDetalleScreen` para detalles de pedido
- [ ] Estilos con `StyleSheet.create()` + theme
- [ ] Tests para la pantalla/hooks (`Componente.test.tsx`)
