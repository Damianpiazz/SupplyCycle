import { useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import {
  Header,
  LoadingSpinner,
  ErrorMessage,
  Card,
} from '@/components/ui';
import CalendarModal from '@/components/ui/CalendarModal';
import { Colors, FontFamily, FontSizes, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEstadisticasDiarias } from '@/features/estadisticas/hooks/useEstadisticas';
import { LucideIcon } from '@/components/ui/lucide-icon';
import StatCard from '@/features/estadisticas/components/StatCard';
import DesempenioCard from '@/features/estadisticas/components/DesempenioCard';
import VolumenList from '@/features/estadisticas/components/VolumenList';

// ─── Helpers de fecha ────────────────────────────────────────────────────────

function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatFechaDisplay(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
}

function formatFechaLarga(iso: string): string {
  const [y, m, d] = iso.split('-');
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ];
  return `${parseInt(d!, 10)} de ${meses[parseInt(m!, 10) - 1]} de ${y}`;
}

function sumarDia(iso: string, delta: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y!, m! - 1, d! + delta);
  const ny = date.getFullYear();
  const nm = String(date.getMonth() + 1).padStart(2, '0');
  const nd = String(date.getDate()).padStart(2, '0');
  return `${ny}-${nm}-${nd}`;
}

function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y!, m! - 1, d!);
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function EstadisticasDiariasScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [fecha, setFecha] = useState(todayISO);
  const [showCalendar, setShowCalendar] = useState(false);

  const { data, isLoading, isError, error, refetch } = useEstadisticasDiarias(fecha);

  const handlePrevDay = useCallback(() => {
    setFecha((prev) => sumarDia(prev, -1));
  }, []);

  const handleNextDay = useCallback(() => {
    setFecha((prev) => sumarDia(prev, 1));
  }, []);

  const handleCalendarSelect = useCallback((date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    setFecha(`${y}-${m}-${d}`);
  }, []);

  const goToMonth = useCallback(() => {
    const [y, m] = fecha.split('-').map(Number);
    router.push({ pathname: '/estadisticas/mensual', params: { anio: y, mes: m } });
  }, [fecha]);

  const isToday = fecha === todayISO();

  return (
    <ThemedView style={styles.container}>
      <Header title="SupplyCycle" />

      {/* Date navigation bar */}
      <View style={[styles.dateBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity
          onPress={handlePrevDay}
          style={[styles.navBtn, { backgroundColor: theme.surface }]}
          activeOpacity={0.7}
          accessibilityLabel="Día anterior"
        >
          <Text style={[styles.navText, { color: theme.tint }]}>{'<'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowCalendar(true)}
          style={styles.dateContainer}
          activeOpacity={0.7}
        >
          <Text style={[styles.dateText, { color: theme.text }]}>
            {formatFechaLarga(fecha)}
          </Text>
          {isToday && (
            <Text style={[styles.todayBadge, { color: theme.tint }]}>
              Hoy
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNextDay}
          style={[styles.navBtn, { backgroundColor: theme.surface }]}
          activeOpacity={0.7}
          accessibilityLabel="Día siguiente"
        >
          <Text style={[styles.navText, { color: theme.tint }]}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={() => setShowCalendar(true)}
          style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.actionBtnText, { color: theme.text }]}>
            <LucideIcon name="calendar" size={16} color={theme.text} />{' '}Seleccionar fecha
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToMonth}
          style={[styles.actionBtn, { backgroundColor: theme.buttonPrimary }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.actionBtnText, { color: theme.headerText }]}>
            Ver mes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner message="Cargando estadísticas..." />
      ) : isError ? (
        <ErrorMessage
          message={error?.message || 'Error al cargar estadísticas'}
          onRetry={refetch}
        />
      ) : data ? (
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollPadding}
          showsVerticalScrollIndicator={false}
        >
          {/* Main stat cards */}
          <StatCard
            icon={<LucideIcon name="package" size={28} color={theme.tint} />}
            label="Pedidos totales"
            value={data.totalPedidos}
            color={theme.text}
          />
          <StatCard
            icon={<LucideIcon name="check-circle" size={28} color={theme.entregado} />}
            label="Entregas realizadas"
            value={data.entregasRealizadas}
            color={theme.entregado}
          />
          <StatCard
            icon={<LucideIcon name="x-circle" size={28} color={theme.noEntregado} />}
            label="Entregas no realizadas"
            value={data.entregasNoRealizadas}
            color={theme.noEntregado}
          />

          {/* Delivery performance */}
          <DesempenioCard
            total={data.desempenioRepartos.total}
            iniciados={data.desempenioRepartos.iniciados}
            finalizados={data.desempenioRepartos.finalizados}
          />

          {/* Product volume */}
          <VolumenList items={data.volumenProductos} />
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <LucideIcon name="bar-chart-3" size={48} color={theme.muted} />
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            No hay datos disponibles para esta fecha
          </Text>
        </View>
      )}

      {/* Calendar modal */}
      <CalendarModal
        visible={showCalendar}
        selectedDate={isoToDate(fecha)}
        onSelect={handleCalendarSelect}
        onClose={() => setShowCalendar(false)}
        theme={theme}
      />
    </ThemedView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
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
  dateContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dateText: {
    fontSize: FontSizes.md,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
  },
  todayBadge: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.interMedium,
    fontWeight: '500',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  actionBtnText: {
    fontSize: FontSizes.sm,
    fontFamily: FontFamily.interMedium,
    fontWeight: '500',
  },
  scrollContent: {
    flex: 1,
  },
  scrollPadding: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  emptyText: {
    fontSize: FontSizes.md,
    fontFamily: FontFamily.inter,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
