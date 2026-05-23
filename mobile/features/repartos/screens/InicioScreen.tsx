import { StyleSheet, Text, View, Linking, Platform } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { Card, Button, LoadingSpinner, ErrorMessage, Header } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useReparto } from '@/features/repartos/hooks/useReparto';
import type { Pedido } from '@/types';

function getEstadoColor(estado: string, theme: typeof Colors.light): string {
  switch (estado) {
    case 'PENDIENTE':
      return theme.pendiente;
    case 'ENTREGADO':
      return theme.entregado;
    case 'NO_ENTREGADO':
      return theme.noEntregado;
    default:
      return theme.text;
  }
}

function ProximaEntregaCard({
  pedido,
  theme,
}: {
  pedido: Pedido;
  theme: typeof Colors.light;
}) {
  const handleCall = (phone: string) => {
    const url = Platform.OS === 'android' ? `tel:${phone}` : `telprompt:${phone}`;
    Linking.openURL(url);
  };

  const handleOpenMaps = (lat: number, lng: number) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}`,
      default: `https://www.google.com/maps?q=${lat},${lng}`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <Card>
      <View style={styles.entregaHeader}>
        <View
          style={[
            styles.estadoBadge,
            { backgroundColor: getEstadoColor(pedido.estado, theme) + '20' },
          ]}
        >
          <Text
            style={[
              styles.estadoText,
              { color: getEstadoColor(pedido.estado, theme) },
            ]}
          >
            {pedido.estado === 'PENDIENTE'
              ? 'Pendiente'
              : pedido.estado === 'ENTREGADO'
              ? 'Entregado'
              : 'No entregado'}
          </Text>
        </View>
        <Text style={[styles.ordenText, { color: theme.muted }]}>
          #{pedido.orden}
        </Text>
      </View>

      <Text style={[styles.clienteNombre, { color: theme.text }]}>
        {pedido.cliente.nombre} {pedido.cliente.apellido}
      </Text>

      <Text style={[styles.direccion, { color: theme.muted }]}>
        {pedido.cliente.domicilio.calle} {pedido.cliente.domicilio.numero},{' '}
        {pedido.cliente.domicilio.localidad}
      </Text>

      <Text style={[styles.horario, { color: theme.info }]}>
        {pedido.cliente.horarioDesde} - {pedido.cliente.horarioHasta}
      </Text>

      <View style={styles.itemsList}>
        {pedido.items.map((item, idx) => (
          <Text key={idx} style={[styles.itemText, { color: theme.text }]}>
            • {item.cantidad}x {item.item.nombre}
          </Text>
        ))}
      </View>

      <View style={styles.actionButtons}>
        <Button
          title="Llamar"
          variant="secondary"
          onPress={() => handleCall(pedido.cliente.telefono)}
          style={styles.actionButton}
        />
        <Button
          title="Abrir mapa"
          variant="ghost"
          onPress={() =>
            handleOpenMaps(
              pedido.cliente.domicilio.latitud,
              pedido.cliente.domicilio.longitud
            )
          }
          style={styles.actionButton}
        />
      </View>
    </Card>
  );
}

function BarraProgreso({
  completados,
  total,
  theme,
}: {
  completados: number;
  total: number;
  theme: typeof Colors.light;
}) {
  const porcentaje = total > 0 ? (completados / total) * 100 : 0;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={[styles.progressLabel, { color: theme.text }]}>
          Progreso del día
        </Text>
        <Text style={[styles.progressCount, { color: theme.muted }]}>
          {completados} de {total} entregas
        </Text>
      </View>
      <View style={[styles.progressBar, { backgroundColor: theme.surface }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(porcentaje, 100)}%`,
              backgroundColor: theme.entregado,
            },
          ]}
        />
      </View>
    </View>
  );
}

export default function InicioScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { data: reparto, isLoading, isError, error } = useReparto();

  if (isLoading) {
    return <LoadingSpinner message="Cargando reparto..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message={error?.message || 'Error al cargar el reparto'}
        onRetry={() => {}}
      />
    );
  }

  if (!reparto || !reparto.pedidos || reparto.pedidos.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <Header />
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No hay ningún reparto activo en este momento
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
            Tus entregas del día aparecerán aquí cuando tengas un reparto
            asignado.
          </Text>
        </View>
      </ThemedView>
    );
  }

  const pendientes = reparto.pedidos.filter((p) => p.estado === 'PENDIENTE');
  const completados = reparto.pedidos.filter((p) => p.estado !== 'PENDIENTE');
  const proximaEntrega = pendientes[0];

  return (
    <ThemedView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <BarraProgreso
          completados={completados.length}
          total={reparto.pedidos.length}
          theme={theme}
        />

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Próxima entrega
        </Text>

        {proximaEntrega ? (
          <ProximaEntregaCard pedido={proximaEntrega} theme={theme} />
        ) : (
          <Card>
            <Text style={[styles.noPendingText, { color: theme.success }]}>
              ¡Todas las entregas están completadas!
            </Text>
          </Card>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  entregaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  estadoBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  estadoText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  ordenText: {
    fontSize: FontSizes.xs,
  },
  clienteNombre: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  direccion: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  horario: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    marginBottom: Spacing.md,
  },
  itemsList: {
    marginBottom: Spacing.md,
  },
  itemText: {
    fontSize: FontSizes.sm,
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  progressContainer: {
    marginBottom: Spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  progressCount: {
    fontSize: FontSizes.sm,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  emptySubtitle: {
    fontSize: FontSizes.md,
    textAlign: 'center',
  },
  noPendingText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    textAlign: 'center',
  },
});
