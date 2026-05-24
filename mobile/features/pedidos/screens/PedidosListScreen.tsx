import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Card, LoadingSpinner, ErrorMessage, Header } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useBuscarPedidos } from '@/features/pedidos/hooks/usePedidos';
import type { EstadoPedido } from '@/types';

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

function formatFecha(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function PedidosListScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoPedido | undefined>();

  const { data, isLoading, isError, error } = useBuscarPedidos({
    clienteNombre: search || undefined,
    estado: filtroEstado,
  });

  const pedidos = data?.data ?? [];

  return (
    <ThemedView style={styles.container}>
      <Header />
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder="Buscar por nombre de cliente..."
          placeholderTextColor={theme.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filtrosContainer}>
        {(['PENDIENTE', 'ENTREGADO', 'NO_ENTREGADO'] as EstadoPedido[]).map(
          (estado) => (
            <TouchableOpacity
              key={estado}
              style={[
                styles.filtroButton,
                {
                  backgroundColor:
                    filtroEstado === estado ? getEstadoColor(estado, theme) : theme.surface,
                },
              ]}
              onPress={() =>
                setFiltroEstado(filtroEstado === estado ? undefined : estado)
              }
            >
              <Text
                style={[
                  styles.filtroText,
                  {
                    color: filtroEstado === estado ? '#FFFFFF' : theme.text,
                  },
                ]}
              >
                {getEstadoLabel(estado)}
              </Text>
            </TouchableOpacity>
          )
        )}
        {filtroEstado && (
          <TouchableOpacity
            style={[styles.filtroButton, { backgroundColor: theme.surface }]}
            onPress={() => setFiltroEstado(undefined)}
          >
            <Text style={[styles.filtroText, { color: theme.text }]}>
              Limpiar
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <LoadingSpinner message="Buscando pedidos..." />
      ) : isError ? (
        <ErrorMessage
          message={error?.message || 'Error al cargar pedidos'}
        />
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card onPress={() => router.push(`/pedidos/${item.id}`)}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardNombre, { color: theme.text }]}>
                  {item.cliente.nombre} {item.cliente.apellido}
                </Text>
                <View
                  style={[
                    styles.estadoBadge,
                    {
                      backgroundColor:
                        getEstadoColor(item.estado, theme) + '20',
                    },
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
              <Text style={[styles.cardDireccion, { color: theme.muted }]}>
                {item.cliente.domicilio.calle} {item.cliente.domicilio.numero}
              </Text>
              <Text style={[styles.cardFecha, { color: theme.muted }]}>
                {formatFecha(item.fecha)}
              </Text>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.muted }]}>
                {search || filtroEstado
                  ? 'No se encontraron pedidos con esos filtros'
                  : 'No hay pedidos registrados'}
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
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
  },
  filtrosContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  filtroButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
  },
  filtroText: {
    fontSize: FontSizes.xs,
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
  cardFecha: {
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
