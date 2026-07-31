import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { Header, LoadingSpinner, ErrorMessage, Card } from '@/components/ui';
import { Colors, FontFamily, FontSizes, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDemanda } from '@/features/estadisticas/hooks/useEstadisticas';
import { LucideIcon } from '@/components/ui/lucide-icon';
import PeriodoSelector from '@/features/estadisticas/components/PeriodoSelector';
import DemandaCardResumen from '@/features/estadisticas/components/DemandaCardResumen';
import DemandaProductoRow from '@/features/estadisticas/components/DemandaProductoRow';
import ClienteDemandaRow from '@/features/estadisticas/components/ClienteDemandaRow';

export default function EstadisticasDemandaScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [periodo, setPeriodo] = useState(30);
  const [busquedaCliente, setBusquedaCliente] = useState('');

  const { data, isLoading, error, refetch } = useDemanda(periodo, true);
  const productos = useMemo(() => data?.demandaPorProducto ?? [], [data]);
  const clientes = useMemo(() => {
    if (!data?.clientes) return [];
    if (!busquedaCliente) return data.clientes;
    const q = busquedaCliente.toLowerCase();
    return data.clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        c.apellido.toLowerCase().includes(q)
    );
  }, [data, busquedaCliente]);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Header title="Demanda estimada" />
        <LoadingSpinner message="Calculando demanda..." />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <Header title="Demanda estimada" />
        <ErrorMessage message="Error al cargar la demanda" onRetry={refetch} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header title="Demanda estimada" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <PeriodoSelector valor={periodo} onChange={setPeriodo} />

        {data && (
          <DemandaCardResumen
            totalClientes={data.totalClientes}
            clientesConEstimacion={data.clientesConEstimacion}
            demandaTotalUnidades={data.demandaTotalUnidades}
            frecuenciaPromedioGlobal={data.frecuenciaPromedioGlobal}
            fechaDesde={data.fechaDesde}
            fechaHasta={data.fechaHasta}
          />
        )}

        <Card style={styles.seccion}>
          <View style={styles.seccionHeader}>
            <LucideIcon name="Package" size={20} color={theme.tint} />
            <Text style={[styles.seccionTitulo, { color: theme.text }]}>
              Productos con mayor demanda
            </Text>
          </View>
          {productos.length === 0 ? (
            <Text style={[styles.vacio, { color: theme.muted }]}>
              No hay estimaciones para este período
            </Text>
          ) : (
            productos.map((p, i) => (
              <DemandaProductoRow key={p.itemId} producto={p} index={i} />
            ))
          )}
        </Card>

        {clientes.length > 0 && (
          <Card style={styles.seccion}>
            <View style={styles.seccionHeader}>
              <LucideIcon name="Users" size={20} color={theme.tint} />
              <Text style={[styles.seccionTitulo, { color: theme.text }]}>
                Clientes con mayor demanda
              </Text>
            </View>
            <View
              style={[
                styles.buscador,
                { backgroundColor: theme.inputBackground, borderColor: theme.border },
              ]}
            >
              <LucideIcon name="Search" size={16} color={theme.muted} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Buscar cliente..."
                placeholderTextColor={theme.textDisabled}
                value={busquedaCliente}
                onChangeText={setBusquedaCliente}
              />
            </View>
            {clientes.map((c) => (
              <ClienteDemandaRow key={c.clienteId} cliente={c} />
            ))}
          </Card>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  seccion: {
    marginBottom: Spacing.md,
  },
  seccionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  seccionTitulo: {
    fontSize: FontSizes.md,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
  },
  vacio: {
    fontSize: FontSizes.sm,
    fontFamily: FontFamily.inter,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.md,
    fontFamily: FontFamily.inter,
    paddingVertical: 0,
  },
});
