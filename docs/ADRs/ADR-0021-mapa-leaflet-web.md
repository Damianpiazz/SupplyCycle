---
autor: Equipo SupplyCycle
fecha: 2026-06-30
titulo: Reemplazo de Mapbox por Leaflet en el mapa web
---

# ADR-0021: Reemplazo de Mapbox por Leaflet en el mapa web

## Contexto

La pantalla de Mapa en la app mobile necesita mostrar ubicación del repartidor, marcadores de pedidos, y ruta optimizada. Inicialmente se configuró Mapbox (`@rnmapbox/maps`) como proveedor de mapas. Sin embargo, el uso real demostró que:

1. **Mapbox requiere access token** — obliga a gestionar `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` en .env y exponerlo en el bundle del cliente web.
2. **Pricing por uso** — Mapbox tiene free tier limitado (50K loadcharges/mes). Para una app interna con repartidores que abren el mapa múltiples veces por día, esto puede escalar rápido.
3. **Complejidad innecesaria** — Mapbox GL JS es pesado (~800KB) y optimizado para 3D / visualizaciones complejas. Para mostrar círculos en un mapa 2D de La Plata, es sobredimensionado.
4. **El mapa web live en iframe** causaba problemas de comunicación cross-frame (postMessage no funcionaba confiablemente), lo que forzó replantear la estrategia completa.

---

## Decisión

Se reemplaza Mapbox por **Leaflet 1.9.4** cargado desde CDN (`cdnjs.cloudflare.com`), renderizado directamente en el DOM de React (sin iframe).

Leaflet se carga en un `useEffect` via `<script>` y `<link>` dinámicos. Los marcadores, rutas, y tiles se gestionan como objetos JavaScript en el mismo contexto que React.

---

## Opciones Consideradas

### Opción 1: Leaflet directo en DOM (seleccionada)
Librería open-source (~40KB), sin token, sin pricing. Tiles de CARTO (gratuitos). Renderizado en un `<div ref>` controlado por React.

### Opción 2: Mapbox GL JS
Librería pesada con token obligatorio. Mejor rendimiento para mapas 3D o vectores complejos, pero innecesaria para nuestro caso de uso.

### Opción 3: Google Maps JavaScript API
Requiere API key, facturación por uso, TOS restrictivo. Sobredimensionado para mapa interno de delivery.

### Opción 4: React-Leaflet (npm)
Wrapper de React para Leaflet. Agrega dependencia npm y complica el bundling con Metro (lib DOM-heavy). CDN es más simple y confiable.

### Opción seleccionada
Opción 1. Leaflet desde CDN cumple todos los requisitos: gratis, liviano, sin dependencias de API keys, y funciona tanto en dev como en producción.

---

## Consecuencias

### Positivas
- **Sin API key** — no hay token que gestionar ni exponer en el bundle
- **Sin costo** — CARTO tiles son gratuitos con attribution
- **Liviano** — Leaflet ~40KB gzipped vs Mapbox GL ~800KB
- **Rápido de implementar** — CDN load en `useEffect`, sin configuración de bundler
- **Funciona en dev y prod** — el mismo approach CDN funciona en Expo web (Metro) y en el build de producción
- **Tiles light/dark** — CARTO ofrece dark_all y light_all gratuitamente

### Negativas
- **Dependencia de CDN** — sin internet, no carga (compensado: los tiles de cualquier forma requieren internet)
- **Sin soporte 3D** — Leaflet es 2D only (aceptable para我们的 caso)
- **Sin vector tiles** — usa raster tiles (aceptable para La Plata)
- **CDN puede caer** — risk mitigado con fallback visual (mensaje "No se pudo cargar el mapa")

---

## Impacto en el Sistema

### Backend
- Sin impacto.

### Frontend (Mobile)
- `mobile/lib/mapbox.ts` → eliminado
- `mobile/components/ui/MapLeaflet.web.tsx` → creado (Leaflet directo)
- `mobile/components/ui/MapWebView.web.tsx` → reescrito (wrapper fino → MapLeaflet)
- `mobile/components/ui/MapWebView.tsx` → creado (nativo, usa WebView + mapHtml.ts)
- `mobile/components/ui/mapHtml.ts` → creado (HTML estático para WebView nativo)
- `mobile/components/ui/MapWebView.types.ts` → creado (tipos compartidos)
- `mobile/features/mapa/screens/MapaScreen.tsx` → modificado (filtro ESTADOS_ACTIVOS)
- Sin cambio en `package.json` — Leaflet se carga desde CDN, no como dependencia npm

### Infraestructura / Compartido
- Sin cambios.

---

## Reglas Derivadas

- **Web**: usar `MapLeaflet.web.tsx` (Leaflet directo en DOM)
- **Nativo**: usar `MapWebView.tsx` (react-native-webview + mapHtml.ts)
- **No agregar Leaflet como dependencia npm** — se carga desde CDN
- **Tiles**: CARTO light_all / dark_all (gratuitos, requieren attribution OSM/CARTO)
- **API keys**: no se necesitan para el mapa básico. Si se necesita geocoding o routing premium, evaluar Mapbox o GraphHopper en ese momento.
- **OSRM**: se usa el demo server público (`router.project-osrm.org`) para rutas. En producción, considerar servidor propio o GraphHopper.
