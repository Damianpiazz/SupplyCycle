import { useState, useMemo } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Card, LoadingSpinner, ErrorMessage, Header } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRepartosAdmin } from '@/features/repartos/hooks/useRepartoAdmin';
import { formatFechaDisplay } from '@/utils/date';
import type { EstadoReparto } from '@/types';

function getEstadoColor(estado: EstadoReparto, theme: typeof Colors.light): string {
  switch (estado) {
    case 'PENDIENTE':
      return theme.pendiente;
    case 'EN_CURSO':
      return theme.enCurso;
    case 'COMPLETADO':
      return theme.completado;
  }
}

function getEstadoLabel(estado: EstadoReparto): string {
  switch (estado) {
    case 'PENDIENTE':
      return 'Pendiente';
    case 'EN_CURSO':
      return 'En curso';
    case 'COMPLETADO':
      return 'Completado';
  }
}

/** Formatted date for filter matching (DD/MM/YYYY) */
function formatFechaFilter(iso: string): string {
  return formatFechaDisplay(iso);
}

export default function AdminRepartosListScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [fechaFiltro, setFechaFiltro] = useState('');

  const { data: repartos, isLoading, isError, error } = useRepartosAdmin();

  const filtered = useMemo(() => {
    if (!repartos) return [];
    if (!fechaFiltro.trim()) return repartos;
    const q = fechaFiltro.trim();
    return repartos.filter((r) => formatFechaFilter(r.fecha).includes(q));
  }, [repartos, fechaFiltro]);

  return (
    <ThemedView style={styles.container}>
      <Header />
      <View style={styles.filterContainer}>
        <TextInput
          style={[
            styles.filterInput,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder="Filtrar por fecha (DD/MM/YYYY)"
          placeholderTextColor={theme.muted}
          value={fechaFiltro}
          onChangeText={setFechaFiltro}
          keyboardType="default"
        />
        {fechaFiltro ? (
          <TouchableOpacity
            style={[styles.clearButton, { backgroundColor: theme.surface }]}
            onPress={() => setFechaFiltro('')}
          >
            <Text style={[styles.clearButtonText, { color: theme.text }]}>Limpiar</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.buttonPrimary }]}
          onPress={() => router.push('/repartos/crear')}
        >
          <Text style={[styles.addButtonText, { color: theme.headerText }]}>+</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <LoadingSpinner message="Cargando repartos..." />
      ) : isError ? (
        <ErrorMessage message={error?.message || 'Error al cargar repartos'} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card onPress={() => router.push(`/repartos/detalle-admin/${item.id}`)}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardFecha, { color: theme.text }]}>
                  {formatFechaDisplay(item.fecha)}
                </Text>
                <View
                  style={[
                    styles.estadoBadge,
                    { backgroundColor: getEstadoColor(item.estado, theme) + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.estadoText,
                      { color: getEstadoColor(item.estado, theme) },
                    ]}
                  >
                    {getEstadoLabel(item.estado)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.cardRepartidor, { color: theme.text }]}>
                {item.repartidor.nombre} {item.repartidor.apellido}
              </Text>
              <Text style={[styles.cardMeta, { color: theme.muted }]}>
                {item.pedidosCount} pedido{item.pedidosCount !== 1 ? 's' : ''} —{' '}
                {item.resumen.completados} completados, {item.resumen.pendientes} pendientes
              </Text>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.muted }]}>
                {fechaFiltro ? 'No hay repartos para la fecha indicada' : 'No hay repartos registrados'}
              </Text>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  filterInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.sm,
  },
  clearButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  clearButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
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
  cardFecha: {
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
  cardRepartidor: {
    fontSize: FontSizes.sm,
    marginBottom: 2,
  },
  cardMeta: {
    fontSize: FontSizes.xs,
  },
  emptyContainer: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSizes.md,
  },
});
