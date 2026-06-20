import { useState, useCallback } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Card, Header, LoadingSpinner, ErrorMessage } from '@/components/ui';
import { Colors, FontFamily, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEstadisticasMensuales } from '@/features/estadisticas/hooks/useEstadisticas';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function getCurrentMonth() {
  const now = new Date();
  return { anio: now.getFullYear(), mes: now.getMonth() + 1 };
}

function formatMes(anio: number, mes: number): string {
  return `${MESES[mes - 1]} ${anio}`;
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function EstadisticasMensualesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [{ anio, mes }, setFecha] = useState(getCurrentMonth);

  const { data, isLoading, isError, error, refetch } = useEstadisticasMensuales(anio, mes);

  const handlePrevMonth = useCallback(() => {
    setFecha((prev) => {
      if (prev.mes === 1) return { anio: prev.anio - 1, mes: 12 };
      return { anio: prev.anio, mes: prev.mes - 1 };
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setFecha((prev) => {
      if (prev.mes === 12) return { anio: prev.anio + 1, mes: 1 };
      return { anio: prev.anio, mes: prev.mes + 1 };
    });
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Header
        title="SupplyCycle"
        onBack={() => router.back()}
      />

      {/* Month navigation */}
      <View style={[styles.monthBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity
          onPress={handlePrevMonth}
          style={[styles.navBtn, { backgroundColor: theme.surface }]}
          activeOpacity={0.7}
          accessibilityLabel="Mes anterior"
        >
          <Text style={[styles.navText, { color: theme.tint }]}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={[styles.monthTitle, { color: theme.text }]}>
          {formatMes(anio, mes)}
        </Text>

        <TouchableOpacity
          onPress={handleNextMonth}
          style={[styles.navBtn, { backgroundColor: theme.surface }]}
          activeOpacity={0.7}
          accessibilityLabel="Mes siguiente"
        >
          <Text style={[styles.navText, { color: theme.tint }]}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner message="Cargando estadísticas mensuales..." />
      ) : isError ? (
        <ErrorMessage
          message={error?.message || 'Error al cargar estadísticas mensuales'}
          onRetry={refetch}
        />
      ) : data ? (
        <FlatList
          data={data.dias}
          keyExtractor={(item) => String(item.dia)}
          ListHeaderComponent={
            <>
              {/* Resumen del mes */}
              <Card style={styles.resumenCard}>
                <Text style={[styles.resumenTitle, { color: theme.text }]}>
                  Resumen del mes
                </Text>
                <View style={styles.resumenGrid}>
                  <ResumenItem label="Pedidos" value={data.totalPedidos} color={theme.text} />
                  <ResumenItem label="Entregados" value={data.entregasRealizadas} color={theme.entregado} />
                  <ResumenItem
                    label="No entregados"
                    value={data.entregasNoRealizadas}
                    color={theme.noEntregado}
                  />
                  <ResumenItem
                    label="Rep. iniciados"
                    value={data.totalRepartosIniciados}
                    color={theme.enCurso}
                  />
                  <ResumenItem
                    label="Rep. finalizados"
                    value={data.totalRepartosFinalizados}
                    color={theme.completado}
                  />
                </View>
              </Card>

              {/* Table header */}
              <View style={[styles.tableHeader, { borderBottomColor: theme.border }]}>
                <Text style={[styles.thDia, { color: theme.muted }]}>Día</Text>
                <Text style={[styles.thNum, { color: theme.muted }]}>Pedidos</Text>
                <Text style={[styles.thNum, { color: theme.entregado }]}>Entreg.</Text>
                <Text style={[styles.thNum, { color: theme.noEntregado }]}>Fallidos</Text>
              </View>
            </>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.tableRow,
                { borderBottomColor: theme.borderSubtle },
              ]}
            >
              <Text style={[styles.tdDia, { color: theme.text }]}>
                {item.dia}
              </Text>
              <Text style={[styles.tdNum, { color: theme.text }]}>
                {item.totalPedidos}
              </Text>
              <Text style={[styles.tdNum, { color: theme.entregado }]}>
                {item.entregasRealizadas}
              </Text>
              <Text style={[styles.tdNum, { color: theme.noEntregado }]}>
                {item.entregasNoRealizadas}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
        />
      ) : null}
    </ThemedView>
  );
}

// ─── Subcomponentes ──────────────────────────────────────────────────────────

function ResumenItem({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={styles.resumenItem}>
      <Text style={[styles.resumenValue, { color }]}>{value}</Text>
      <Text style={[styles.resumenLabel, { color }]}>{label}</Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: 20,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
  },
  monthTitle: {
    fontSize: FontSizes.lg,
    fontFamily: FontFamily.interBold,
    fontWeight: 'bold',
  },
  resumenCard: {
    marginBottom: Spacing.md,
  },
  resumenTitle: {
    fontSize: FontSizes.md,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  resumenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  resumenItem: {
    minWidth: 80,
    alignItems: 'center',
    flex: 1,
  },
  resumenValue: {
    fontSize: FontSizes.xl,
    fontFamily: FontFamily.interBold,
    fontWeight: 'bold',
  },
  resumenLabel: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.interMedium,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    marginHorizontal: Spacing.lg,
  },
  thDia: {
    flex: 0.5,
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  thNum: {
    flex: 1,
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.lg,
    borderBottomWidth: 1,
  },
  tdDia: {
    flex: 0.5,
    fontSize: FontSizes.sm,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
  },
  tdNum: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontFamily: FontFamily.inter,
    textAlign: 'center',
  },
  listPadding: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
});
