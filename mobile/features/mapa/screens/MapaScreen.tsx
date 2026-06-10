import { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { LoadingSpinner, ErrorMessage, Header } from '@/components/ui';
import { Colors, FontFamily, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePedidosDelDia } from '@/features/pedidos/hooks/usePedidos';
import type { Pedido, EstadoPedido } from '@/types';

function getEstadoColor(estado: EstadoPedido, theme: typeof Colors.light): string {
  switch (estado) {
    case 'PENDIENTE':
      return theme.pendiente;
    case 'ENTREGADO':
      return theme.entregado;
    case 'NO_ENTREGADO':
      return theme.noEntregado;
  }
}

function getEstadoLabel(estado: EstadoPedido): string {
  switch (estado) {
    case 'PENDIENTE':
      return 'Pendiente';
    case 'ENTREGADO':
      return 'Entregado';
    case 'NO_ENTREGADO':
      return 'No entregado';
  }
}

// Simple marker rendered as a colored dot with a label
function MarkerPunto({
  pedido,
  theme,
  isSelected,
  onPress,
}: {
  pedido: Pedido;
  theme: typeof Colors.light;
  isSelected: boolean;
  onPress: () => void;
}) {
  const color = getEstadoColor(pedido.estado, theme);

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

export default function MapaScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [selectedPedidoId, setSelectedPedidoId] = useState<string | null>(null);
  const { data: pedidos, isLoading, isError, error } = usePedidosDelDia();

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
                {selectedPedido.numeroPedido}
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

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
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
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
  },
  mapPlaceholderHint: {
    fontSize: FontSizes.sm,
    fontFamily: FontFamily.inter,
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
    fontFamily: FontFamily.inter,
    fontWeight: '500',
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
