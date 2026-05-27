import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import Mapbox, { MapView, Camera, UserLocation } from '@rnmapbox/maps';
import { ThemedView } from '@/components/themed-view';
import { LoadingSpinner, ErrorMessage, Header } from '@/components/ui';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '');

const BUENOS_AIRES_COORDS: [number, number] = [-58.3816, -34.6037];

export default function MapaScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'loading' | 'denied' | 'granted'>('loading');

  return (
    <TouchableOpacity
      style={[styles.markerContainer, isSelected && { backgroundColor: theme.tint + '26', borderWidth: 1, borderColor: theme.tint }]}
      onPress={onPress}
    >
      <View style={[styles.markerDot, { backgroundColor: color }]} />
      <Text style={[styles.markerLabel, { color: theme.text }]}>
        {pedido.cliente.nombre}
      </Text>
    </TouchableOpacity>
  );
}

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionStatus('denied');
        return;
      }
      setPermissionStatus('granted');
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  // --- WEB fallback ---
  if (Platform.OS === 'web') {
    return (
      <ThemedView style={styles.container}>
        <Header />
        <View style={styles.center}>
          <ErrorMessage message="El mapa no está disponible en la versión web." />
        </View>
      </ThemedView>
    );
  }

  // --- Loading ---
  if (permissionStatus === 'loading' || (permissionStatus === 'granted' && !location)) {
    return (
      <ThemedView style={styles.container}>
        <Header />
        <LoadingSpinner message="Obteniendo ubicación..." />
      </ThemedView>
    );
  }

  // --- Permission denied ---
  if (permissionStatus === 'denied') {
    const fallbackCoords = BUENOS_AIRES_COORDS;
    return (
      <ThemedView style={styles.container}>
        <Header />
        <View style={styles.mapWrapper}>
          <MapView style={styles.map}>
            <Camera
              defaultSettings={{
                centerCoordinate: fallbackCoords,
                zoomLevel: 10,
              }}
            />
          </MapView>
        </View>
      </ThemedView>
    );
  }

  // --- Map with GPS ---
  const coords: [number, number] = location
    ? [location.longitude, location.latitude]
    : BUENOS_AIRES_COORDS;

  return (
    <ThemedView style={styles.container}>
      <Header />
      <View style={styles.mapContainer}>
        {/* Map placeholder - real Google Maps integration will be added later */}
        <View style={[styles.mapPlaceholder, { backgroundColor: theme.surface }]}>
          <Text style={[styles.mapPlaceholderText, { color: theme.muted }]}>
            Mapa de entregas
          </Text>
          <Text style={[styles.mapPlaceholderHint, { color: theme.muted }]}>
            {pedidos?.length ?? 0} puntos de entrega
          </Text>
        </View>

        {/* Markers list as fallback (when map is not available) */}
        <View style={styles.markersList}>
          {pedidos?.map((pedido) => (
            <MarkerPunto
              key={pedido.id}
              pedido={pedido}
              theme={theme}
              isSelected={selectedPedidoId === pedido.id}
              onPress={() => setSelectedPedidoId(pedido.id)}
            />
          ))}
        </View>

        {/* Info card for selected pedido */}
        {selectedPedido && (
          <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.infoCardHeader}>
              <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(selectedPedido.estado, theme) + '20' }]}>
                <Text style={[styles.estadoBadgeText, { color: getEstadoColor(selectedPedido.estado, theme) }]}>
                  {getEstadoLabel(selectedPedido.estado)}
                </Text>
              </View>
              <Text style={[styles.ordenText, { color: theme.muted }]}>
                #{selectedPedido.orden}
              </Text>
            </View>
            <Text style={[styles.infoCardNombre, { color: theme.text }]}>
              {selectedPedido.cliente.nombre} {selectedPedido.cliente.apellido}
            </Text>
            <Text style={[styles.infoCardDireccion, { color: theme.muted }]}>
              {selectedPedido.cliente.domicilio.calle}{' '}
              {selectedPedido.cliente.domicilio.numero}
            </Text>
            <TouchableOpacity
              style={[styles.verDetalleButton, { backgroundColor: theme.buttonPrimary }]}
              onPress={() => router.push(`/mapa/${selectedPedido.id}`)}
            >
              <Text style={[styles.verDetalleText, { color: theme.headerText }]}>Ver detalle</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  mapPlaceholderText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  mapPlaceholderHint: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
  },
  markersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  markerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    backgroundColor: 'rgba(0,0,0,0.05)',
    gap: Spacing.sm,
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  markerLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verDetalleText: {
    fontWeight: '600',
    fontSize: FontSizes.sm,
  },
});
