/**
 * Genera el HTML completo para el mapa Leaflet dentro del WebView.
 * El HTML es estático — los datos se reciben via `postMessage`
 * desde React Native (web o nativo).
 */

export function generateMapHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"
    crossorigin=""
  />
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"
    crossorigin=""
  ></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    #map { width: 100%; height: 100%; }
    .user-location-btn {
      position: absolute;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background: #fff;
      border: 2px solid rgba(0,0,0,0.12);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 20px;
      color: #333;
    }
    .user-location-btn:active {
      background: #f0f0f0;
    }
    .leaflet-control-zoom { display: none; }
    .leaflet-popup-content-wrapper {
      border-radius: 10px;
      padding: 4px;
    }
    .leaflet-popup-content {
      margin: 8px 12px;
      font-size: 13px;
      line-height: 1.4;
    }
    .leaflet-popup-content strong {
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <button class="user-location-btn" id="locateBtn" aria-label="Centrar en mi ubicación">⟐</button>

  <script>
    /* ── Helper: enviar mensaje a la app (nativa o web) ──────── */
    function sendMsg(msg) {
      var data = JSON.stringify(msg);
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(data);
      } else if (window.parent && window.parent !== window) {
        window.parent.postMessage(data, '*');
      }
    }

    /* ── Configuración de tiles ────────────────────────────── */
    var TILES = {
      light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      dark:  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    };
    var TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> / <a href="https://carto.com/">CARTO</a>';

    /* ── Estado interno ────────────────────────────────────── */
    var _markers = {};           // { pedidoId: L.circleMarker }
    var _routeLayer = null;      // L.geoJSON | null
    var _userMarker = null;      // L.circleMarker | null
    var _tileLayer = null;       // L.tileLayer actual
    var _darkMode = false;
    var _map = null;             // L.Map (se asigna al inicializar)

    /* ── Funciones del mapa ───────────────────────────────── */

    /** Actualiza todos los marcadores. */
    function setPedidos(pedidos, selectedId, colorMap) {
      var newIds = new Set(pedidos.map(function (p) { return p.id; }));
      for (var id in _markers) {
        if (!newIds.has(id)) {
          _map.removeLayer(_markers[id]);
          delete _markers[id];
        }
      }
      pedidos.forEach(function (p) {
        var color = (colorMap && colorMap[p.estado]) || '#639922';
        var isSelected = p.id === selectedId;
        var radius = isSelected ? 16 : 11;
        var borderColor = isSelected ? '#3B82F6' : '#ffffff';
        var borderWidth = isSelected ? 3 : 2;
        if (_markers[p.id]) {
          var m = _markers[p.id];
          m.setLatLng([p.latitud, p.longitud]);
          m.setStyle({ radius: radius, fillColor: color, color: borderColor, weight: borderWidth });
          m._pedidoData = p;
        } else {
          var marker = L.circleMarker([p.latitud, p.longitud], {
            radius: radius, fillColor: color, color: borderColor, weight: borderWidth,
            opacity: 1, fillOpacity: 0.9,
          }).addTo(_map);
          marker._pedidoData = p;
          marker.on('click', function (e) {
            L.DomEvent.stopPropagation(e);
            sendMsg({ type: 'SELECT_PEDIDO', pedidoId: this._pedidoData.id });
          });
          _markers[p.id] = marker;
        }
      });
    }

    /** Dibuja o limpia la línea de ruta. */
    function setRoute(geojson) {
      if (_routeLayer) { _map.removeLayer(_routeLayer); _routeLayer = null; }
      if (geojson) {
        _routeLayer = L.geoJSON(geojson, {
          style: { color: '#3B82F6', weight: 5, opacity: 0.85 },
        }).addTo(_map);
      }
    }

    /** Cambia entre tiles light y dark. */
    function setTiles(darkMode) {
      if (_darkMode === darkMode) return;
      _darkMode = darkMode;
      var url = darkMode ? TILES.dark : TILES.light;
      if (_tileLayer) _map.removeLayer(_tileLayer);
      _tileLayer = L.tileLayer(url, { attribution: TILE_ATTR, maxZoom: 19 }).addTo(_map);
    }

    /** Mueve o crea el marcador de ubicación del usuario. */
    function setUserLoc(lng, lat) {
      if (_userMarker) {
        _userMarker.setLatLng([lat, lng]);
      } else {
        _userMarker = L.circleMarker([lat, lng], {
          radius: 8, fillColor: '#2563EB', color: '#ffffff', weight: 3,
          opacity: 1, fillOpacity: 0.9,
        }).addTo(_map);
      }
    }

    /** Centra el mapa en una coordenada. */
    function flyTo(lng, lat, zoom) {
      _map.flyTo([lat, lng], zoom || 14, { duration: 1 });
    }

    /* ── Receptor de comandos desde React (via postMessage) ── */
    window.addEventListener('message', function (e) {
      var msg = e.data;
      if (!msg || !msg.type) return;
      switch (msg.type) {
        case 'UPDATE_PEDIDOS':  setPedidos(msg.pedidos, msg.selectedId, msg.colorMap); break;
        case 'UPDATE_ROUTE':    setRoute(msg.geojson); break;
        case 'SET_TILES':       setTiles(msg.darkMode); break;
        case 'SET_USER_LOC':    setUserLoc(msg.lng, msg.lat); break;
        case 'FLY_TO':          flyTo(msg.lng, msg.lat, msg.zoom); break;
      }
    });

    /* ── Inicializar mapa ──────────────────────────────────── */
    _map = L.map('map', {
      center: [-34.9215, -57.9546],
      zoom: 12,
      zoomControl: false,
      attributionControl: true,
    });

    _tileLayer = L.tileLayer(TILES.light, {
      attribution: TILE_ATTR,
      maxZoom: 19,
    }).addTo(_map);

    /* ── Botón centrar ubicación ───────────────────────────── */
    document.getElementById('locateBtn').addEventListener('click', function () {
      if (_userMarker) {
        _map.flyTo(_userMarker.getLatLng(), 15, { duration: 1 });
      }
    });

    /* ── Click en mapa vacío → deseleccionar ──────────────── */
    _map.on('click', function () {
      sendMsg({ type: 'DESELECT_PEDIDO' });
    });

    /* ── Avisar a RN que el mapa está listo ───────────────── */
    _map.whenReady(function () {
      sendMsg({ type: 'MAP_READY' });
    });

    /* ── Geolocalización directa en el iframe ─────────────── */
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(function (pos) {
        setUserLoc(pos.coords.longitude, pos.coords.latitude);
        if (pos.coords.accuracy <= 100) {
          flyTo(pos.coords.longitude, pos.coords.latitude, 14);
        }
      }, function (err) {
        // Error silencioso — la geolocalización no es crítica
      }, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000,
      });
    }
  </script>
</body>
</html>`;
}
