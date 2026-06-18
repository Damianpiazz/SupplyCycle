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
import { Colors, FontFamily, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useBuscarPedidos } from '@/features/pedidos/hooks/usePedidos';
import { getEstadoColor, getEstadoLabel } from '@/features/pedidos/utils/estadoPedido';
import { parseISODate } from '@/utils/date';
import type { EstadoPedido } from '@/types';

function formatFecha(iso: string): string {
  const { year, month, day } = parseISODate(iso);
  const date = new Date(Number(year), Number(month) - 1, Number(day));
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
              flex: 1,
            },
          ]}
          placeholder="Buscar por nombre de cliente..."
          placeholderTextColor={theme.muted}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.buttonPrimary }]}
          onPress={() => router.push('/pedidos/alta')}
        >
          <Text style={[styles.addButtonText, { color: theme.headerText }]}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtrosContainer}>
        {(['PENDIENTE', 'EN_RUTA', 'ENTREGADO', 'NO_ENTREGADO', 'CANCELADO'] as EstadoPedido[]).map(
          (estado) => (
            <TouchableOpacity
              key={estado}
              style={[
                styles.filtroButton,
                { backgroundColor: theme.surface },
              ]}
              onPress={() =>
                setFiltroEstado(filtroEstado === estado ? undefined : estado)
              }
            >
              <Text style={[styles.filtroText, { color: theme.text }]}>              
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
                {item.domicilio.calle} {item.domicilio.numero}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
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
    fontFamily: FontFamily.interBold,
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
    fontWeight: '500',
    fontFamily: FontFamily.interMedium,
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
    fontFamily: FontFamily.interSemiBold,
    letterSpacing: 0.16,
    lineHeight: 24,
  },
  estadoBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  estadoText: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
    fontFamily: FontFamily.interMedium,
  },
  cardDireccion: {
    fontSize: FontSizes.cardSecondary,
    lineHeight: 19.5,
    marginBottom: 2,
  },
  cardFecha: {
    fontSize: FontSizes.cardSecondary,
    lineHeight: 19.5,
  },
  emptyContainer: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSizes.md,
  },
});
