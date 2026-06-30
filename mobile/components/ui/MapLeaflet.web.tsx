/**
 * MapLeaflet.web.tsx
 *
 * Leaflet map rendered DIRECTLY in the React DOM — no iframe, no postMessage.
 * Loads Leaflet 1.9.4 from CDN in a useEffect, then manages markers, routes,
 * dark mode, and user location through standard React state/refs.
 *
 * Web-only (.web.tsx). Native uses MapWebView.tsx (react-native-webview).
 */
import { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import type { MapWebViewProps, LineString } from './MapWebView.types';

/* ── CDN loaders ──────────────────────────────────────────── */

function loadCSS(): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector('link[href*="leaflet"]')) {
      resolve();
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
    link.crossOrigin = '';
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });
}

function loadJS(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).L) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src =
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
    s.crossOrigin = '';
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });
}

/* ── Constants ────────────────────────────────────────────── */

const TILES_LIGHT =
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILES_DARK =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; OSM / CARTO';

/* ── Component ────────────────────────────────────────────── */

export default function MapLeaflet({
  pedidos,
  routeGeoJSON,
  selectedPedidoId,
  darkMode,
  colorMap,
  userLocation,
  onSelectPedido,
}: MapWebViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const routeLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const tileRef = useRef<any>(null);
  const initDone = useRef(false);

  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Always-fresh reference for onSelectPedido (avoids stale closures)
  const onSelectRef = useRef(onSelectPedido);
  onSelectRef.current = onSelectPedido;

  /* ── 1. Load Leaflet + init map ─────────────────────────── */

  useEffect(() => {
    if (initDone.current) return;

    let cancelled = false;

    (async () => {
      await Promise.all([loadCSS(), loadJS()]);

      if (cancelled || !containerRef.current) return;

      const L = (window as any).L;
      if (!L) {
        setLoadError(true);
        return;
      }

      initDone.current = true;

      const map = L.map(containerRef.current, {
        center: [-34.9215, -57.9546],
        zoom: 12,
        zoomControl: false,
        attributionControl: true,
      });

      const tile = L.tileLayer(TILES_LIGHT, {
        attribution: TILE_ATTR,
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      tileRef.current = tile;

      // Click on empty map → deselect
      map.on('click', () => onSelectRef.current(null));

      setReady(true);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        initDone.current = false;
        setReady(false);
      }
    };
  }, []);

  /* ── 2. User location → blue dot ────────────────────────── */

  useEffect(() => {
    if (!ready || !userLocation) return;

    const L = (window as any).L;
    const map = mapRef.current;
    if (!L || !map) return;

    const [lng, lat] = userLocation;

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: '#2563EB',
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(map);
      map.flyTo([lat, lng], 14, { duration: 1 });
    } else {
      userMarkerRef.current.setLatLng([lat, lng]);
    }
  }, [ready, userLocation]);

  /* ── 3. Markers (pedidos) ───────────────────────────────── */

  useEffect(() => {
    if (!ready) return;

    const L = (window as any).L;
    const map = mapRef.current;
    if (!L || !map) return;

    const currentIds = new Set(pedidos.map((p) => p.id));

    // Remove stale markers
    for (const id of Object.keys(markersRef.current)) {
      if (!currentIds.has(id)) {
        map.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    }

    // Add / update markers
    pedidos.forEach((p) => {
      const color = colorMap[p.estado] || '#639922';
      const isSel = p.id === selectedPedidoId;
      const radius = isSel ? 16 : 11;
      const border = isSel ? '#3B82F6' : '#ffffff';
      const bw = isSel ? 3 : 2;

      if (markersRef.current[p.id]) {
        const m = markersRef.current[p.id];
        m.setLatLng([p.latitud, p.longitud]);
        m.setStyle({
          radius,
          fillColor: color,
          color: border,
          weight: bw,
        });
      } else {
        const marker = L.circleMarker([p.latitud, p.longitud], {
          radius,
          fillColor: color,
          color: border,
          weight: bw,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(map);

        // Capture id at creation; use ref for always-fresh callback
        const pid = p.id;
        marker.on('click', (e: any) => {
          L.DomEvent.stopPropagation(e);
          onSelectRef.current(pid);
        });

        markersRef.current[p.id] = marker;
      }
    });
  }, [ready, pedidos, selectedPedidoId, colorMap]);

  /* ── 4. Route line ──────────────────────────────────────── */

  useEffect(() => {
    if (!ready) return;

    const L = (window as any).L;
    const map = mapRef.current;
    if (!L || !map) return;

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (routeGeoJSON) {
      routeLayerRef.current = L.geoJSON(
        routeGeoJSON as unknown as GeoJSON.Geometry,
        {
          style: { color: '#3B82F6', weight: 5, opacity: 0.85 },
        },
      ).addTo(map);
    }
  }, [ready, routeGeoJSON]);

  /* ── 5. Dark-mode tiles ─────────────────────────────────── */

  useEffect(() => {
    if (!ready) return;

    const L = (window as any).L;
    const map = mapRef.current;
    if (!L || !map || !tileRef.current) return;

    const url = darkMode ? TILES_DARK : TILES_LIGHT;
    map.removeLayer(tileRef.current);
    tileRef.current = L.tileLayer(url, {
      attribution: TILE_ATTR,
      maxZoom: 19,
    }).addTo(map);
  }, [ready, darkMode]);

  /* ── Render ─────────────────────────────────────────────── */

  return (
    <View style={{ flex: 1 }}>
      {/* Leaflet mounts here */}
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%' }}
      />

      {/* Locate button */}
      <button
        type="button"
        onClick={() => {
          const map = mapRef.current;
          if (!map) return;
          if (userMarkerRef.current) {
            map.flyTo(userMarkerRef.current.getLatLng(), 15, {
              duration: 1,
            });
          } else if (userLocation) {
            map.flyTo([userLocation[1], userLocation[0]], 15, {
              duration: 1,
            });
          }
        }}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          width: 44,
          height: 44,
          borderRadius: 8,
          backgroundColor: '#fff',
          border: '2px solid rgba(0,0,0,0.12)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: 20,
          color: '#333',
        }}
      >
        ⟐
      </button>

      {/* Load-error fallback */}
      {loadError && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>
            No se pudo cargar el mapa
          </Text>
        </View>
      )}
    </View>
  );
}
