import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { LoadingSpinner, ErrorMessage, Header } from '@/components/ui';
import { Colors, FontFamily, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePedidosDelDia } from '@/features/pedidos/hooks/usePedidos';
import { getEstadoColor, getEstadoLabel } from '@/features/pedidos/utils/estadoPedido';
import Mapbox, { MapView, Camera, PointAnnotation, ShapeSource, LineLayer } from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { useRouteLine } from '@/features/mapa/hooks/useRouteLine';

export default function MapaScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [selectedPedidoId, setSelectedPedidoId] = useState<string | null>(null);
  const { data: pedidos, isLoading, isError, error } = usePedidosDelDia();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted' && !userLocationRef.current) {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        userLocationRef.current = [loc.coords.longitude, loc.coords.latitude];
        setUserLocation([loc.coords.longitude, loc.coords.latitude]);
      }
    })();
  }, []);

  const pedidosConCoordenadas = pedidos?.filter(
    (p) => p.domicilio.latitud && p.domicilio.longitud
  ) ?? [];

  const userLocationRef = useRef<[number, number] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { nearestPedido, routeGeoJSON } = useRouteLine(userLocation, pedidos);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Header />
        <LoadingSpinner message="Cargando mapa..." />
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.container}>
        <Header />
        <ErrorMessage message={error?.message || 'Error al cargar el mapa'} />
      </ThemedView>
    );
  }

  const selectedPedido = pedidos?.find((p) => p.id === selectedPedidoId) ?? null;

  return (
    <ThemedView style={styles.container}>
      <Header />
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          styleURL={
            colorScheme === 'dark'
              ? 'mapbox://styles/mapbox/dark-v11'
              : 'mapbox://styles/mapbox/streets-v12'
          }
          compassEnabled
          logoEnabled={false}
          showUserLocation
          onPress={() => setSelectedPedidoId(null)}
        >
          <Camera
            defaultSettings={{
              centerCoordinate: [-57.9546, -34.9215],
              zoomLevel: 12,
            }}
          />

          {pedidosConCoordenadas.map((pedido) => (
            <PointAnnotation
              key={pedido.id}
              id={pedido.id}
              coordinate={[pedido.domicilio.longitud!, pedido.domicilio.latitud!]}
              onSelected={() => setSelectedPedidoId(pedido.id)}
            >
              <View style={[
                styles.markerDot,
                { backgroundColor: getEstadoColor(pedido.estado, theme) },
                nearestPedido?.id === pedido.id && styles.markerNearest,
              ]} />
            </PointAnnotation>
          ))}

          {routeGeoJSON && (
            <ShapeSource id="routeSource" shape={routeGeoJSON}>
              <LineLayer
                id="routeLine"
                style={{
                  lineColor: '#3B82F6',
                  lineWidth: 5,
                  lineOpacity: 0.85,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            </ShapeSource>
          )}
        </MapView>

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
                {selectedPedido.numeroPedido}
              </Text>
            </View>
            <Text style={[styles.infoCardNombre, { color: theme.text }]}>
              {selectedPedido.cliente.nombre} {selectedPedido.cliente.apellido}
            </Text>
            <Text style={[styles.infoCardDireccion, { color: theme.muted }]}>
              {selectedPedido.domicilio.calle}{' '}
              {selectedPedido.domicilio.numero}
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  markerDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
    borderColor: '#fff',
  },
  markerNearest: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  // Info card at bottom
  infoCard: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  infoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  estadoBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  estadoBadgeText: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.interMedium,
    fontWeight: '500',
  },
  ordenText: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.inter,
  },
  infoCardNombre: {
    fontSize: FontSizes.md,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: 0.16,
    lineHeight: 24,
  },
  infoCardDireccion: {
    fontSize: FontSizes.cardSecondary,
    fontFamily: FontFamily.inter,
    lineHeight: 19.5,
    marginBottom: Spacing.md,
  },
  verDetalleButton: {
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  verDetalleText: {
    fontWeight: '600',
    fontFamily: FontFamily.interSemiBold,
    fontSize: FontSizes.sm,
  },
});
