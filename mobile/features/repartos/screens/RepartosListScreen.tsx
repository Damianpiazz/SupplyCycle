import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Card, LoadingSpinner, ErrorMessage, Header } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePedidosDelDia } from '@/features/pedidos/hooks/usePedidos';
import type { Pedido, EstadoPedido } from '@/types';

type FiltroEstado = 'TODAS' | 'PENDIENTE' | 'EN_RUTA' | 'ENTREGADO' | 'NO_ENTREGADO' | 'CANCELADO';

const FILTROS: { key: FiltroEstado; label: string }[] = [
  { key: 'TODAS', label: 'Todo' },
  { key: 'PENDIENTE', label: 'Pendientes' },
  { key: 'EN_RUTA', label: 'En ruta' },
  { key: 'ENTREGADO', label: 'Entregados' },
  { key: 'NO_ENTREGADO', label: 'No entregados' },
  { key: 'CANCELADO', label: 'Cancelados' },
];

function getEstadoColor(estado: EstadoPedido, theme: typeof Colors.light): string {
  switch (estado) {
    case 'PENDIENTE':
      return theme.pendiente;
    case 'EN_RUTA':
      return theme.tint;
    case 'ENTREGADO':
      return theme.entregado;
    case 'NO_ENTREGADO':
      return theme.noEntregado;
    case 'CANCELADO':
      return theme.muted;
  }
}

function getEstadoLabel(estado: EstadoPedido): string {
  switch (estado) {
    case 'PENDIENTE':
      return 'Pendiente';
    case 'EN_RUTA':
      return 'En ruta';
    case 'ENTREGADO':
      return 'Entregado';
    case 'NO_ENTREGADO':
      return 'No entregado';
    case 'CANCELADO':
      return 'Cancelado';
  }
}

function EntregaCard({
  pedido,
  theme,
}: {
  pedido: Pedido;
  theme: typeof Colors.light;
}) {
  return (
    <Card onPress={() => router.push(`/repartos/${pedido.id}`)}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardNombre, { color: theme.text }]}>
          {pedido.cliente.nombre} {pedido.cliente.apellido}
        </Text>
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
            {getEstadoLabel(pedido.estado)}
          </Text>
        </View>
      </View>
      <Text style={[styles.cardDireccion, { color: theme.muted }]}>
        {pedido.cliente.domicilio.calle} {pedido.cliente.domicilio.numero}
      </Text>
      <Text style={[styles.cardHorario, { color: theme.info }]}>
        {pedido.cliente.horarioDesde} - {pedido.cliente.horarioHasta}
      </Text>
    </Card>
  );
}

export default function RepartosListScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [filtro, setFiltro] = useState<FiltroEstado>('TODAS');
  const { data: pedidos, isLoading, isError, error } = usePedidosDelDia();

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Header />
        <LoadingSpinner message="Cargando entregas..." />
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.container}>
        <Header />
        <ErrorMessage
          message={error?.message || 'Error al cargar las entregas'}
        />
      </ThemedView>
    );
  }

  const filteredPedidos = (pedidos ?? []).filter((p) => {
    if (filtro === 'TODAS') return true;
    return p.estado === filtro;
  });

  return (
    <ThemedView style={styles.container}>
      <Header />
      <View style={styles.filtrosContainer}>
        {FILTROS.map((f) => (
          <TouchableOpacity
            key={f.key}
              style={[
                  styles.filtroButton,
                  {
                    backgroundColor:
                      filtro === f.key ? theme.headerBackground : theme.surface,
                  },
                ]}
                onPress={() => setFiltro(f.key)}
              >
                <Text
                  style={[
                    styles.filtroText,
                    {
                      color: filtro === f.key ? theme.headerText : theme.text,
                    },
                  ]}
                >
                  {f.label}
                </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredPedidos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <EntregaCard pedido={item} theme={theme} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              No hay entregas para mostrar
            </Text>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtrosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  filtroButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
  },
  filtroText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  listContent: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  cardNombre: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    flex: 1,
  },
  estadoBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  estadoText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  cardDireccion: {
    fontSize: FontSizes.sm,
    marginBottom: 2,
  },
  cardHorario: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSizes.md,
  },
});
