import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Header, Card } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHistorialEnvases } from '@/features/clientes/hooks/useHistorialEnvases';
import {
  MOCK_RESUMEN_CONSUMO,
  MOCK_PEDIDOS,
} from '@/mocks/historialMock';
import type { MovimientoEnvase, PedidoHistorialResumen } from '@/types/historial';

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function movimientoColor(tipo: MovimientoEnvase['tipo'], theme: typeof Colors.light) {
  return tipo === 'ENTREGA' ? theme.tint : theme.success;
}

function movimientoLabel(tipo: MovimientoEnvase['tipo']): string {
  return tipo === 'ENTREGA' ? 'Entregó' : 'Devolvió';
}

function estadoColor(estado: string, theme: typeof Colors.light): string {
  const map: Record<string, string> = {
    ENTREGADO: theme.entregado,
    PENDIENTE: theme.pendiente,
    CANCELADO: theme.noEntregado,
    EN_RUTA: theme.enCurso,
    NO_ENTREGADO: theme.noEntregado,
  };
  return map[estado] ?? theme.text;
}

function estadoLabel(estado: string): string {
  const map: Record<string, string> = {
    ENTREGADO: 'Entregado',
    PENDIENTE: 'Pendiente',
    CANCELADO: 'Cancelado',
    EN_RUTA: 'En ruta',
    NO_ENTREGADO: 'No entregado',
  };
  return map[estado] ?? estado;
}

export default function ClienteHistorialScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const { saldoEnvases, historial, loading, error } = useHistorialEnvases(id ?? '');

  return (
    <ThemedView style={styles.container}>
      <Header title="Historial" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Loading ── */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.tint} />
            <Text style={[styles.loadingText, { color: theme.muted }]}>
              Cargando historial...
            </Text>
          </View>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.error }]}>
              Error al cargar el historial: {error}
            </Text>
          </View>
        )}

        {/* ── Contenido ── */}
        {!loading && !error && (
          <>
            {/* ── Sección 1: Saldo de Envases (RF-06.4) ── */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Saldo de Envases
            </Text>
            <Card>
              {saldoEnvases.length === 0 ? (
                <Text style={[styles.emptyText, { color: theme.muted }]}>
                  Sin envases registrados
                </Text>
              ) : (
                saldoEnvases.map((item) => (
                  <View
                    key={item.itemId}
                    style={[
                      styles.saldoRow,
                      item.cantidad > 0 && {
                        backgroundColor: theme.warningBg,
                        borderRadius: BorderRadius.sm,
                      },
                    ]}
                  >
                    <Text style={[styles.saldoNombre, { color: theme.text }]}>
                      {item.nombre}
                    </Text>
                    <Text
                      style={[
                        styles.saldoCantidad,
                        {
                          color: item.cantidad > 0 ? theme.warning : theme.muted,
                          fontWeight: item.cantidad > 0 ? '700' : '400',
                        },
                      ]}
                    >
                      {item.cantidad > 0
                        ? `${item.cantidad} pendiente${item.cantidad !== 1 ? 's' : ''}`
                        : 'Al día'}
                    </Text>
                  </View>
                ))
              )}
            </Card>

            {/* ── Sección 2: Historial de Entregas y Devoluciones (RF-06.3) ── */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Historial de Entregas y Devoluciones
            </Text>
            <Card>
              {historial.length === 0 ? (
                <Text style={[styles.emptyText, { color: theme.muted }]}>
                  Sin movimientos registrados
                </Text>
              ) : (
                historial.map((mov) => (
                  <View key={mov.id} style={styles.movimientoRow}>
                    <View style={styles.movimientoHeader}>
                      <Text
                        style={[
                          styles.movimientoTipo,
                          { color: movimientoColor(mov.tipo, theme) },
                        ]}
                      >
                        {movimientoLabel(mov.tipo)}
                      </Text>
                      <Text style={[styles.movimientoFecha, { color: theme.muted }]}>
                        {formatFecha(mov.fecha)}
                      </Text>
                    </View>
                    <Text style={[styles.movimientoDetalle, { color: theme.text }]}>
                      {mov.cantidad} × {mov.tipoEnvase}
                    </Text>
                    {mov.pedidoId && (
                      <Text style={[styles.movimientoPedido, { color: theme.info }]}>
                        Pedido: {mov.pedidoId}
                      </Text>
                    )}
                  </View>
                ))
              )}
            </Card>

            {/* ── Sección 3: Historial de Pedidos (RF-07.1 / RF-07.2) ── */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Historial de Pedidos
            </Text>
            <Card>
              {MOCK_PEDIDOS.length === 0 ? (
                <Text style={[styles.emptyText, { color: theme.muted }]}>
                  Sin pedidos registrados
                </Text>
              ) : (
                MOCK_PEDIDOS.map((pedido: PedidoHistorialResumen) => (
                  <View key={pedido.id} style={styles.pedidoRow}>
                    <View style={styles.pedidoHeader}>
                      <Text style={[styles.pedidoEstado, { color: estadoColor(pedido.estado, theme) }]}>
                        {estadoLabel(pedido.estado)}
                      </Text>
                      <Text style={[styles.pedidoFecha, { color: theme.muted }]}>
                        {formatFecha(pedido.fecha)}
                      </Text>
                    </View>
                    <Text style={[styles.pedidoBidones, { color: theme.text }]}>
                      {pedido.totalBidones} bidón{pedido.totalBidones !== 1 ? 'es' : ''}
                    </Text>
                  </View>
                ))
              )}
            </Card>
            {/* TODO RF-07.1: conectar con endpoint de pedidos por cliente */}

            {/* ── Sección 4: Resumen de Consumo (RF-07.5) ── */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Resumen de Consumo
            </Text>
            <Card>
              <View style={styles.resumenRow}>
                <Text style={[styles.resumenLabel, { color: theme.muted }]}>
                  Total de pedidos
                </Text>
                <Text style={[styles.resumenValor, { color: theme.text }]}>
                  {MOCK_RESUMEN_CONSUMO.totalPedidos}
                </Text>
              </View>
              <View style={styles.resumenRow}>
                <Text style={[styles.resumenLabel, { color: theme.muted }]}>
                  Total de bidones consumidos
                </Text>
                <Text style={[styles.resumenValor, { color: theme.text }]}>
                  {MOCK_RESUMEN_CONSUMO.totalBidones}
                </Text>
              </View>
              <View style={styles.resumenRow}>
                <Text style={[styles.resumenLabel, { color: theme.muted }]}>
                  Promedio de bidones por pedido
                </Text>
                <Text style={[styles.resumenValor, { color: theme.text }]}>
                  {MOCK_RESUMEN_CONSUMO.promedioBidonesPorPedido}
                </Text>
              </View>
            </Card>
            {/* TODO RF-07.5: calcular desde historial real de pedidos */}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg },

  /* ── Secciones ── */
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  emptyText: { fontSize: FontSizes.sm, fontStyle: 'italic' },

  /* ── Loading / Error ── */
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.md,
  },
  loadingText: { fontSize: FontSizes.sm },
  errorContainer: {
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
  },
  errorText: { fontSize: FontSizes.sm, textAlign: 'center' },

  /* ── Saldo de Envases ── */
  saldoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    marginBottom: 2,
  },
  saldoNombre: { fontSize: FontSizes.md, fontWeight: '600' },
  saldoCantidad: { fontSize: FontSizes.sm },

  /* ── Movimientos ── */
  movimientoRow: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'transparent',
    marginBottom: Spacing.xs,
  },
  movimientoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  movimientoTipo: { fontSize: FontSizes.sm, fontWeight: '700' },
  movimientoFecha: { fontSize: FontSizes.xs },
  movimientoDetalle: { fontSize: FontSizes.md, marginBottom: 2 },
  movimientoPedido: { fontSize: FontSizes.xs },

  /* ── Pedidos ── */
  pedidoRow: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'transparent',
    marginBottom: Spacing.xs,
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  pedidoEstado: { fontSize: FontSizes.sm, fontWeight: '700' },
  pedidoFecha: { fontSize: FontSizes.xs },
  pedidoBidones: { fontSize: FontSizes.md },

  /* ── Resumen de Consumo ── */
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  resumenLabel: { fontSize: FontSizes.sm },
  resumenValor: { fontSize: FontSizes.md, fontWeight: '700' },
});
