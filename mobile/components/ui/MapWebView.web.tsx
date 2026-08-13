/**
 * MapWebView.web.tsx
 *
 * Thin wrapper that renders MapLeaflet (direct Leaflet, no iframe).
 * The web build resolves this file instead of MapWebView.tsx (native WebView).
 */
import MapLeaflet from './MapLeaflet';
import type { MapWebViewProps } from './MapWebView.types';

export default function MapWebView(props: MapWebViewProps) {
  return <MapLeaflet {...props} />;
}
