---
autor: 
fecha: 2026-05-25
titulo: Proveedor de Mapas Mobile — Mapbox
---

# ADR-0016: Proveedor de Mapas Mobile — Mapbox

## Contexto

La app mobile debe mostrar un mapa interactivo con la ubicación de los pedidos del día, permitiendo al repartidor visualizar puntos de entrega, su estado (pendiente, entregado, no entregado) y navegar al detalle de cada pedido.

Se necesita un proveedor de mapas que:
- Funcione en Android e iOS desde React Native con Expo
- Permita marcadores personalizados con colores según estado del pedido
- Tenga buena cobertura de direcciones en Buenos Aires (zona de operación)
- No requiera pagos internacionales difíciles de gestionar desde Argentina

El proyecto ya tiene datos mock con coordenadas reales de Buenos Aires y un placeholder de mapa en `features/mapa/screens/`.

---

## Decisión

Se utiliza **Mapbox** como proveedor de mapas, a través de la librería `@rnmapbox/maps`.

Mapbox se ejecuta mediante **Expo Dev Client** (no Expo Go), lo cual es aceptable dado que la app se distribuirá como APK/IPA independiente, no via Expo Go.

La integración incluye:
- `MapView` de Mapbox para renderizar el mapa
- `PointAnnotation` para los marcadores de pedidos
- Colores de marcador según estado (ambar=pendiente, verde=entregado, rojo=noEntregado, azul=enCurso)
- Callout nativo con datos del cliente y botón "Ver detalle"
- Región inicial calculada automáticamente para mostrar todos los pedidos

---

## Opciones Consideradas

### Opción 1: Google Maps (react-native-maps)
Provider maduro, ampliamente documentado. Ofrece markers, callouts, polylines.

**Ventajas:**
- Librería más usada en React Native
- Cobertura excelente en Buenos Aires
- Muchos ejemplos y comunidad

**Desventajas:**
- Requiere billing account con tarjeta internacional (USD)
- El crédito gratuito de USD 200/mes se consume rápido con Directions y geocoding
- En Argentina, pagar servicios en USD implica: impuesto PAIS (30%), percepción de Ganancias (30%), y trámites de reembolso complejos por el cepo cambiario
- La empresa debe emitir factura E en USD o pasar por un proceso de reembolso engorroso
- No funciona en Expo Go (requiere dev-client igual que Mapbox)

### Opción 2: Mapbox (@rnmapbox/maps) — **seleccionada**
Plataforma de mapas diseñada para logística y delivery.

**Ventajas:**
- Free tier generoso: 50.000 cargas de mapa/mes (más que suficiente para la etapa actual)
- Pago en USD vía tarjeta internacional sin mínimos altos (pay-as-you-go después del free tier)
- Sin procesos de reembolso complejos: se paga directo con tarjeta de empresa/socio
- Excelente para logística: estilos customizables, navegación turn-by-turn (a futuro), buen rendimiento en Android sin Google Play Services
- SDK nativo con soporte para Expo (via dev-client)
- Documentación clara para React Native
- Sin dependencia de Google (importante si la app se distribuye en dispositivos sin Google Services)

**Desventajas:**
- Requiere Expo Dev Client (no Expo Go)
- Menos comunidad que react-native-maps
- Setup inicial más complejo (access token, configuración nativa)

### Opción 3: Apple Maps (react-native-maps provider="apple")
Gratuito, funciona en Expo Go en iOS.

**Desventajas:**
- Solo funciona en iOS (en Android no hay equivalente gratis sin Google)
- Sin markers personalizados con colores
- Sin polyline para rutas
- Cobertura limitada en Buenos Aires comparado con Google/Mapbox

### Opción 4: Leaflet + WebView
OpenStreetMap via WebView. Funciona en Expo Go.

**Desventajas:**
- No es nativo: rendimiento pobre, scroll y gestures no se sienten naturales
- Sin markers nativos ni callouts
- UX degradada para una app de producción
- No hay SDK para features avanzadas (geocoding, rutas)

### Opción seleccionada
**Opción 2 (Mapbox).** Es la que mejor balancea: costo (free tier generoso), capacidades técnicas (logística/delivery), y viabilidad administrativa en Argentina (sin procesos de reembolso complejos). Google Maps es técnicamente equivalente pero agrega fricción administrativa innecesaria.

---

## Consecuencias

### Positivas
- Sin costos fijos mensuales durante la etapa inicial (free tier 50k cargas/mes)
- Sin dependencia de Google (la app puede funcionar en cualquier dispositivo Android)
- Escalable a futuro: navegación turn-by-turn, isocronas, rutas optimizadas con Mapbox Navigation
- Estilos de mapa customizables desde Mapbox Studio (colores de ruta, énfasis en puntos de entrega)
- Pago simple con tarjeta internacional, sin procesos de reembolso empresarial

### Negativas
- Requiere Expo Dev Client → builds nativos para cada cambio de configuración
- El equipo debe aprender la API de `@rnmapbox/maps` (PointAnnotation en vez de Marker)
- Sin acceso a Places API de Google (si se necesita búsqueda de direcciones a futuro)
- Si el free tier se excede, hay que configurar pago automático (evitar corte de servicio)

---

## Impacto en el Sistema

### Backend
- Sin impacto. Las coordenadas (`latitud`/`longitud` en `Domicilio`) ya existen.
- A futuro: endpoint `GET /mapa/ruta` podría devolver polyline para dibujar ruta óptima.

### Frontend (Mobile)
- Nueva dependencia: `@rnmapbox/maps` + `expo-location`
- Nueva dependencia: `expo-dev-client` para builds nativos
- `features/mapa/screens/MapaScreen.tsx`: reemplazar placeholder View por MapView de Mapbox
- `features/mapa/components/MapaMarker.tsx`: nuevo componente para PointAnnotation coloreado por status
- `features/mapa/hooks/useMapa.ts`: nuevo hook para calcular región y lógica de mapa
- `app.json`: agregar plugin `@rnmapbox/maps` con access token
- `.env`: agregar `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN`
- `features/mapa/screens/__tests__/MapaScreen.test.tsx`: actualizar mocks para `@rnmapbox/maps`

### Infraestructura / Compartido
- Variable de entorno `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` en todos los entornos
- El access token de Mapbox debe almacenarse de forma segura (no commitearlo)
- Builds de CI/CD deben incluir el access token como secret

---

## Reglas Derivadas

- El access token de Mapbox se configura vía entorno (`EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN`)
- Nunca committear el access token al repositorio
- Usar `PointAnnotation` en lugar de `Marker` para puntos en el mapa
- Los colores de los marcadores siguen `constants/theme.ts` (pendiente→ambar, entregado→verde, noEntregado→rojo, enCurso→azul)
- El mapa DEBE funcionar offline con datos cacheados (por ahora es suficiente mostrar los markers; a futuro implementar tiles offline)
- La app requiere Dev Client: no se puede testear el mapa en Expo Go
