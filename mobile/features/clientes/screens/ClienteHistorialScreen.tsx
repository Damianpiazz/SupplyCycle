import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Header, Card } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHistorialEnvases } from '@/features/clientes/hooks/useHistorialEnvases';
import { usePedidosCliente } from '@/features/clientes/hooks/usePedidosCliente';
import { useConsumoCliente } from '@/features/clientes/hooks/useConsumoCliente';
import type { RetenidoResponse } from '@/types/historial';

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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

function itemsText(items: Array<{ nombre: string; cantidad: number }>): string {
  return items.map((i) => `${i.cantidad}× ${i.nombre}`).join(', ');
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

/** Color del badge de estado retenido */
function retenidoEstadoColor(estado: RetenidoResponse['estado'], theme: typeof Colors.light): string {
  return estado === 'RETENIDO' ? theme.warning : theme.entregado;
}

/** Label del badge de estado retenido */
function retenidoEstadoLabel(estado: RetenidoResponse['estado']): string {
  return estado === 'RETENIDO' ? 'Pendiente' : 'Devuelto';
}

export default function ClienteHistorialScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const { saldoEnvases, retenidos, loading, error } = useHistorialEnvases(id ?? '');
  const { data: pedidos, isLoading: loadingPedidos, isError: errorPedidos } = usePedidosCliente(id ?? '');
  const { data: consumo, isLoading: loadingConsumo, isError: errorConsumo } = useConsumoCliente(id ?? '');
  const frecuencia = consumo?.frecuencia ?? null;

  const pendientes = saldoEnvases.filter((s) => s.cantidad > 0);

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
            {/* ═══ Sección 1: Envases Pendientes ═══ */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Envases Pendientes
            </Text>
            <Card>
              {pendientes.length === 0 ? (
                <Text style={[styles.emptyText, { color: theme.muted }]}>
                  Todos los envases están al día
                </Text>
              ) : (
                pendientes.map((item) => (
                  <View
                    key={item.itemId}
                    style={[
                      styles.saldoRow,
                      {
                        backgroundColor: theme.warningBg,
                        borderRadius: BorderRadius.sm,
                      },
                    ]}
                  >
                    <Text style={[styles.saldoNombre, { color: theme.text }]}>
                      {item.nombre}
                    </Text>
                    <Text style={[styles.saldoCantidad, { color: theme.warning, fontWeight: '700' }]}>
                      {item.cantidad} pendiente{item.cantidad !== 1 ? 's' : ''}
                    </Text>
                  </View>
                ))
              )}
            </Card>

            {/* ═══ Sección 2: Resumen de Consumo (RF-07.5 / RF-10) ═══ */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Resumen de Consumo
            </Text>
            <Card>
              {loadingConsumo ? (
                <ActivityIndicator size="small" color={theme.tint} />
              ) : errorConsumo ? (
                <Text style={[styles.emptyText, { color: theme.error }]}>
                  Error al cargar resumen de consumo
                </Text>
              ) : consumo ? (
                <>
                  <View style={styles.resumenRow}>
                    <Text style={[styles.resumenLabel, { color: theme.muted }]}>
                      Total de pedidos
                    </Text>
                    <Text style={[styles.resumenValor, { color: theme.text }]}>
                      {consumo.totalPedidos}
                    </Text>
                  </View>
                  <View style={styles.resumenRow}>
                    <Text style={[styles.resumenLabel, { color: theme.muted }]}>
                      Total de bidones consumidos
                    </Text>
                    <Text style={[styles.resumenValor, { color: theme.text }]}>
                      {consumo.totalBidones}
                    </Text>
                  </View>
                  <View style={styles.resumenRow}>
                    <Text style={[styles.resumenLabel, { color: theme.muted }]}>
                      Promedio de bidones por pedido
                    </Text>
                    <Text style={[styles.resumenValor, { color: theme.text }]}>
                      {consumo.promedioBidonesPorPedido}
                    </Text>
                  </View>

                  {/* RF-10: Frecuencia de Pedidos */}
                  {frecuencia && (
                    <>
                      <View style={[styles.separator, { backgroundColor: theme.border }]} />
                      <Text style={[styles.subsectionTitle, { color: theme.text }]}>
                        Frecuencia de Pedidos
                      </Text>

                      {frecuencia.intervaloPromedioDias !== null && (
                        <View style={styles.resumenRow}>
                          <Text style={[styles.resumenLabel, { color: theme.muted }]}>
                            Intervalo promedio
                          </Text>
                          <Text style={[styles.resumenValor, { color: theme.text }]}>
                            cada {frecuencia.intervaloPromedioDias} día{frecuencia.intervaloPromedioDias !== 1 ? 's' : ''}
                          </Text>
                        </View>
                      )}

                      {frecuencia.diaSemanaFrecuente !== null && (
                        <View style={styles.resumenRow}>
                          <Text style={[styles.resumenLabel, { color: theme.muted }]}>
                            Día más frecuente
                          </Text>
                          <Text style={[styles.resumenValor, { color: theme.tint }]}>
                            {frecuencia.diaSemanaFrecuente.charAt(0) + frecuencia.diaSemanaFrecuente.slice(1).toLowerCase()}
                          </Text>
                        </View>
                      )}

                      {frecuencia.ultimoPedido && (
                        <View style={styles.resumenRow}>
                          <Text style={[styles.resumenLabel, { color: theme.muted }]}>
                            Último pedido
                          </Text>
                          <Text style={[styles.resumenValor, { color: theme.text }]}>
                            {formatFecha(frecuencia.ultimoPedido)}
                          </Text>
                        </View>
                      )}

                      {Object.keys(frecuencia.distribucionDias).length > 0 && (
                        <View style={styles.distribucionContainer}>
                          <Text style={[styles.distribucionLabel, { color: theme.muted }]}>
                            Distribución por día
                          </Text>
                          {Object.entries(frecuencia.distribucionDias)
                            .sort(([, a], [, b]) => b - a)
                            .map(([dia, count]) => {
                              const maxCount = Math.max(...Object.values(frecuencia.distribucionDias));
                              const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
                              return (
                                <View key={dia} style={styles.distribucionRow}>
                                  <Text style={[styles.distribucionDia, { color: theme.muted }]}>
                                    {dia.charAt(0) + dia.slice(1).toLowerCase()}
                                  </Text>
                                  <View style={[styles.distribucionBar, { backgroundColor: theme.tint + '30' }]}>
                                    <View
                                      style={[
                                        styles.distribucionBarFill,
                                        {
                                          width: `${barWidth}%`,
                                          backgroundColor: dia === frecuencia.diaSemanaFrecuente ? theme.tint : theme.tint + '60',
                                        },
                                      ]}
                                    />
                                  </View>
                                  <Text style={[styles.distribucionCount, { color: theme.text }]}>
                                    {count}
                                  </Text>
                                </View>
                              );
                            })}
                        </View>
                      )}
                    </>
                  )}
                </>
              ) : (
                <Text style={[styles.emptyText, { color: theme.muted }]}>
                  Sin datos de consumo
                </Text>
              )}
            </Card>
            {/* CONECTADO: GET /api/v1/clientes/:id/consumo */}

            {/* ═══ Sección 3: Historial de Pedidos (RF-07.1 / RF-07.2) ═══ */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Historial de Pedidos
            </Text>
            <Card>
              {loadingPedidos ? (
                <ActivityIndicator size="small" color={theme.tint} />
              ) : errorPedidos ? (
                <Text style={[styles.emptyText, { color: theme.error }]}>
                  Error al cargar pedidos
                </Text>
              ) : !pedidos || pedidos.length === 0 ? (
                <Text style={[styles.emptyText, { color: theme.muted }]}>
                  Sin pedidos registrados
                </Text>
              ) : (
                pedidos.map((pedido, index) => (
                  <TouchableOpacity
                    key={pedido.id}
                    style={[
                      styles.pedidoRow,
                      index < pedidos.length - 1 && {
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: theme.border,
                      },
                    ]}
                    onPress={() => router.push(`/pedidos/${pedido.id}`)}
                    activeOpacity={0.6}
                  >
                    <View style={styles.pedidoHeader}>
                      <View style={styles.pedidoInfoLeft}>
                        <View style={styles.pedidoEstadoRow}>
                          <View style={[styles.pedidoEstadoDot, { backgroundColor: estadoColor(pedido.estado, theme) }]} />
                          <Text style={[styles.pedidoEstado, { color: estadoColor(pedido.estado, theme) }]}>
                            {estadoLabel(pedido.estado)}
                          </Text>
                        </View>
                        <Text style={[styles.pedidoFecha, { color: theme.muted }]}>
                          {formatFecha(pedido.fecha)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.verDetalleBtn, { backgroundColor: theme.tint + '15' }]}
                        onPress={() => router.push(`/pedidos/${pedido.id}`)}
                        activeOpacity={0.5}
                      >
                        <Text style={[styles.verDetalleText, { color: theme.tint }]}>
                          Detalle
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.pedidoItemsRow}>
                      <Text style={[styles.pedidoNumero, { color: theme.muted }]}>
                        {pedido.numeroPedido}
                      </Text>
                      <Text style={[styles.pedidoItems, { color: theme.text }]}>
                        {itemsText(pedido.items ?? [])}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </Card>
            {/* CONECTADO: GET /api/v1/clientes/:id/pedidos */}

            {/* ═══ Sección 4: Historial de Envases Retenidos ═══ */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Historial de Envases Retenidos
            </Text>
            {retenidos.length === 0 ? (
              <Card>
                <Text style={[styles.emptyText, { color: theme.muted }]}>
                  Sin envases registrados
                </Text>
              </Card>
            ) : (
              retenidos.map((r) => {
                const badgeColor = retenidoEstadoColor(r.estado, theme);
                const badgeLabel = retenidoEstadoLabel(r.estado);
                const esPendiente = r.estado === 'RETENIDO';
                return (
                  <View
                    key={r.id}
                    style={[
                      styles.retenidoCard,
                      {
                        backgroundColor: esPendiente ? theme.warningBg : theme.successBg,
                        borderColor: badgeColor + '40',
                      },
                    ]}
                  >
                    {/* Item + badge */}
                    <View style={styles.retenidoHeader}>
                      <Text style={[styles.retenidoNombre, { color: theme.text }]}>
                        {r.item.nombre}
                      </Text>
                      <View style={[styles.retenidoBadge, { backgroundColor: badgeColor }]}>
                        <Text style={styles.retenidoBadgeText}>
                          {badgeLabel}
                        </Text>
                      </View>
                    </View>

                    {/* Fecha de inicio */}
                    <View style={styles.retenidoDateRow}>
                      <Text style={[styles.retenidoDateLabel, { color: theme.muted }]}>
                        Desde:
                      </Text>
                      <Text style={[styles.retenidoDateValue, { color: theme.text }]}>
                        {formatFecha(r.inicio)}
                      </Text>
                    </View>

                    {/* Fecha de devolución o estado pendiente */}
                    {esPendiente ? (
                      <Text style={[styles.retenidoPendienteText, { color: badgeColor }]}>
                        Pendiente de devolución
                      </Text>
                    ) : r.fin ? (
                      <View style={styles.retenidoDateRow}>
                        <Text style={[styles.retenidoDateLabel, { color: theme.muted }]}>
                          Devuelto:
                        </Text>
                        <Text style={[styles.retenidoDateValue, { color: theme.text }]}>
                          {formatFecha(r.fin)}
                        </Text>
                      </View>
                    ) : null}

                    {/* Pedido */}
                    <View style={[styles.retenidoPedidoChip, { backgroundColor: theme.tint + '15' }]}>
                      <Text style={[styles.retenidoPedidoText, { color: theme.tint }]}>
                        Pedido {r.pedido.numeroPedido}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
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

  /* ── Envases Pendientes ── */
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

  /* ── Pedidos ── */
  pedidoRow: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  pedidoInfoLeft: {
    flexDirection: 'column',
    gap: 6,
  },
  pedidoEstadoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pedidoEstadoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pedidoEstado: { fontSize: FontSizes.md, fontWeight: '700' },
  pedidoFecha: { fontSize: FontSizes.sm },
  verDetalleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  verDetalleText: { fontSize: FontSizes.sm, fontWeight: '600' },
  pedidoItemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  pedidoNumero: { fontSize: FontSizes.sm },
  pedidoItems: { fontSize: FontSizes.sm, fontWeight: '500', flexShrink: 1 },

  /* ── Resumen de Consumo ── */
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  resumenLabel: { fontSize: FontSizes.sm },
  resumenValor: { fontSize: FontSizes.md, fontWeight: '700' },

  /* ── RF-10: Frecuencia de Pedidos ── */
  separator: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  subsectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  distribucionContainer: {
    marginTop: Spacing.sm,
  },
  distribucionLabel: {
    fontSize: FontSizes.xs,
    marginBottom: Spacing.xs,
  },
  distribucionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  distribucionDia: {
    width: 80,
    fontSize: FontSizes.xs,
  },
  distribucionBar: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    marginHorizontal: Spacing.sm,
    overflow: 'hidden',
  },
  distribucionBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  distribucionCount: {
    width: 24,
    fontSize: FontSizes.xs,
    textAlign: 'right',
    fontWeight: '600',
  },

  /* ── Historial de Envases Retenidos ── */
  retenidoCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  retenidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  retenidoNombre: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    flex: 1,
    marginRight: Spacing.sm,
  },
  retenidoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
  },
  retenidoBadgeText: {
    color: '#FFFFFF',
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  retenidoDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  retenidoDateLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    marginRight: 4,
  },
  retenidoDateValue: {
    fontSize: FontSizes.sm,
  },
  retenidoPendienteText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },
  retenidoPedidoChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
  },
  retenidoPedidoText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
});
