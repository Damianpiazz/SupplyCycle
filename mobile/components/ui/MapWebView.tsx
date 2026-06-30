import { useRef, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType } from 'react-native-webview';
import { generateMapHtml } from './mapHtml';
import type { MapWebViewProps } from './MapWebView.types';

/* ── Mensajes del WebView ──────────────────────────────────── */

type WebViewMessage =
  | { type: 'MAP_READY' }
  | { type: 'SELECT_PEDIDO'; pedidoId: string }
  | { type: 'DESELECT_PEDIDO' };

/* ── Componente ────────────────────────────────────────────── */

export default function MapWebView({
  pedidos,
  routeGeoJSON,
  selectedPedidoId,
  darkMode,
  colorMap,
  userLocation,
  onSelectPedido,
}: MapWebViewProps) {
  const webViewRef = useRef<WebViewType>(null);
  const [isReady, setIsReady] = useState(false);

  // Cola de datos acumulados antes de MAP_READY
  const pendingRef = useRef<(() => void)[]>([]);

  // Cuando el WebView está listo, enviamos todo lo pendiente
  const flushPending = useCallback(() => {
    pendingRef.current.forEach((fn) => fn());
    pendingRef.current = [];
  }, []);

  // Enviar comando al WebView (encola si no está ready)
  const inject = useCallback(
    (js: string) => {
      const cmd = `(() => { ${js} })();`;
      if (isReady) {
        webViewRef.current?.injectJavaScript(cmd);
      } else {
        pendingRef.current.push(() => webViewRef.current?.injectJavaScript(cmd));
      }
    },
    [isReady],
  );

  // Recibir mensajes del WebView
  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const msg: WebViewMessage = JSON.parse(event.nativeEvent.data);
        switch (msg.type) {
          case 'MAP_READY':
            setIsReady(true);
            break;
          case 'SELECT_PEDIDO':
            onSelectPedido(msg.pedidoId);
            break;
          case 'DESELECT_PEDIDO':
            onSelectPedido(null);
            break;
        }
      } catch {
        // Ignorar mensajes malformados
      }
    },
    [onSelectPedido],
  );

  // Flush cola cuando el WebView se marca como ready
  useEffect(() => {
    if (isReady) {
      flushPending();
    }
  }, [isReady, flushPending]);

  // Sincronizar pedidos + selectedId
  useEffect(() => {
    inject(
      `window.updatePedidos(${JSON.stringify(pedidos)}, ${JSON.stringify(selectedPedidoId)}, ${JSON.stringify(colorMap)});`,
    );
  }, [pedidos, selectedPedidoId, colorMap, inject]);

  // Sincronizar ruta
  useEffect(() => {
    inject(`window.updateRoute(${JSON.stringify(routeGeoJSON)});`);
  }, [routeGeoJSON, inject]);

  // Sincronizar dark mode
  useEffect(() => {
    inject(`window.setTileLayer(${JSON.stringify(darkMode)});`);
  }, [darkMode, inject]);

  // Sincronizar ubicación del usuario
  useEffect(() => {
    if (userLocation) {
      const [lng, lat] = userLocation;
      inject(`window.setUserLocation(${lng}, ${lat});`);
    }
  }, [userLocation, inject]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: generateMapHtml() }}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        androidLayerType="hardware"
        onMessage={handleMessage}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
