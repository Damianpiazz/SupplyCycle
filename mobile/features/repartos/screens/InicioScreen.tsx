import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Card, Button, LoadingSpinner, ErrorMessage, Header } from '@/components/ui';
import { Colors, FontFamily, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useReparto, useIniciarReparto } from '@/features/repartos/hooks/useReparto';
import { useConfirmarEntrega, useCancelarPedido, useIniciarEntrega } from '@/features/pedidos/hooks/usePedidos';
import ConfirmarAccionButtons from '@/features/pedidos/components/ConfirmarAccionButtons';
import CancelModal from '@/features/pedidos/components/CancelModal';
import { useToast } from '@/hooks/useToast';
import { handleApiError } from '@/services/handleApiError';
import { getEstadoColor, getEstadoLabel } from '@/features/pedidos/utils/estadoPedido';
import type { Pedido, MotivoCancelacion } from '@/types';

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState({ theme }: { theme: typeof Colors.light }) {
  return (
    <ThemedView style={styles.container}>
      <Header />
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyTitle, { color: theme.text }]}>
          No hay repartos asignados para hoy
        </Text>
        <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
          Tus entregas del día aparecerán aquí cuando tengas un reparto asignado.
        </Text>
      </View>
    </ThemedView>
  );
}

// ─── BarraProgreso ────────────────────────────────────────────────────────────

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

// ─── RepartoPendienteView ─────────────────────────────────────────────────────

function RepartoPendienteView({
  repartoId,
  totalPedidos,
  onIniciar,
  loading,
  theme,
}: {
  repartoId: string;
  totalPedidos: number;
  onIniciar: () => void;
  loading: boolean;
  theme: typeof Colors.light;
}) {
  return (
    <ThemedView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Reparto del día
          </Text>

          <View style={styles.resumenRow}>
            <Text style={[styles.resumenLabel, { color: theme.muted }]}>
              Estado
            </Text>
            <View style={[styles.estadoBadge, { backgroundColor: theme.pendiente + '20' }]}>
              <Text style={[styles.estadoBadgeText, { color: theme.pendiente }]}>
                Pendiente
              </Text>
            </View>
          </View>

          <View style={styles.resumenRow}>
            <Text style={[styles.resumenLabel, { color: theme.muted }]}>
              Pedidos
            </Text>
            <Text style={[styles.resumenValue, { color: theme.text }]}>
              {totalPedidos} {totalPedidos === 1 ? 'pedido' : 'pedidos'}
            </Text>
          </View>

          <View style={styles.resumenDivider} />

          <Text style={[styles.resumenHint, { color: theme.muted }]}>
            Al iniciar el reparto podrás ver la próxima entrega y comenzar con el recorrido.
          </Text>

          <Button
            title="Iniciar reparto"
            variant="primary"
            onPress={onIniciar}
            loading={loading}
            disabled={loading}
            style={styles.iniciarButton}
          />
        </Card>
      </ScrollView>
    </ThemedView>
  );
}

// ─── ProximaEntregaCard ───────────────────────────────────────────────────────

function ProximaEntregaCard({
  pedido,
  onIniciarEntrega,
  onConfirmar,
  onCancelar,
  onVerDetalle,
  theme,
  iniciarLoading,
  confirmarLoading,
  cancelarLoading,
}: {
  pedido: Pedido;
  onIniciarEntrega: () => void;
  onConfirmar: () => void;
  onCancelar: () => void;
  onVerDetalle: () => void;
  theme: typeof Colors.light;
  iniciarLoading: boolean;
  confirmarLoading: boolean;
  cancelarLoading: boolean;
}) {
  const handleCall = useCallback((phone: string) => {
    const url = Platform.OS === 'android' ? `tel:${phone}` : `telprompt:${phone}`;
    Linking.openURL(url);
  }, []);

  const handleOpenMaps = useCallback((lat: number | undefined, lng: number | undefined) => {
    if (lat === undefined || lng === undefined) return;
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}`,
      default: `https://www.google.com/maps?q=${lat},${lng}`,
    });
    if (url) Linking.openURL(url);
  }, []);

  const estadoColor = getEstadoColor(pedido.estado, theme);

  return (
    <Card>
      <View style={styles.entregaHeader}>
        <View style={[styles.estadoBadge, { backgroundColor: estadoColor + '20' }]}>
          <Text style={[styles.estadoBadgeText, { color: estadoColor }]}>
            {getEstadoLabel(pedido.estado)}
          </Text>
        </View>
        <Text style={[styles.ordenText, { color: theme.muted }]}>
          {pedido.numeroPedido}
        </Text>
      </View>

      <Text style={[styles.clienteNombre, { color: theme.text }]}>
        {pedido.cliente.nombre} {pedido.cliente.apellido}
      </Text>

      <Text style={[styles.direccion, { color: theme.muted }]}>
        {pedido.domicilio.calle} {pedido.domicilio.numero},{' '}
        {pedido.domicilio.localidad}
      </Text>

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, { color: theme.muted }]}>Teléfono</Text>
        <TouchableOpacity onPress={() => handleCall(pedido.cliente.telefono)}>
          <Text style={[styles.infoValue, { color: theme.info }]}>
            {pedido.cliente.telefono}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, { color: theme.muted }]}>Horario</Text>
        <Text style={[styles.infoValue, { color: theme.text }]}>
          {pedido.domicilio.dias[0]?.horarios[0]?.inicio ?? ''} - {pedido.domicilio.dias[0]?.horarios[0]?.fin ?? ''}
        </Text>
      </View>

      {/* Items */}
      <View style={styles.itemsList}>
        {pedido.items.map((item, idx) => (
          <Text key={idx} style={[styles.itemText, { color: theme.text }]}>
            • {item.cantidad}x {item.item.nombre}
          </Text>
        ))}
      </View>

      {/* Acciones rápidas: llamar / mapa */}
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
              pedido.domicilio.latitud,
              pedido.domicilio.longitud
            )
          }
          style={styles.actionButton}
        />
      </View>

      {/* Acciones operativas según estado */}
      {pedido.estado === 'PENDIENTE' && (
        <View style={styles.operacionButtons}>
          <Button
            title="Iniciar entrega"
            variant="primary"
            onPress={onIniciarEntrega}
            loading={iniciarLoading}
            disabled={iniciarLoading}
            style={styles.actionButton}
          />
          <Button
            title="Ver detalle"
            variant="ghost"
            onPress={onVerDetalle}
            style={styles.actionButton}
          />
        </View>
      )}

      {pedido.estado === 'EN_RUTA' && (
        <View style={styles.operacionButtons}>
          <ConfirmarAccionButtons
            onConfirmar={onConfirmar}
            onCancelar={onCancelar}
            confirmarLoading={confirmarLoading}
            cancelarLoading={cancelarLoading}
          />
          <Button
            title="Ver detalle"
            variant="ghost"
            onPress={onVerDetalle}
            style={styles.verDetalleButton}
          />
        </View>
      )}
    </Card>
  );
}

// ─── ProximasEntregasList ─────────────────────────────────────────────────────

function ProximasEntregasList({
  pedidos,
  theme,
}: {
  pedidos: Pedido[];
  theme: typeof Colors.light;
}) {
  if (pedidos.length === 0) return null;

  return (
    <View style={styles.proximasContainer}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Próximas entregas
      </Text>

      {pedidos.map((pedido) => {
        const estadoColor = getEstadoColor(pedido.estado, theme);
        return (
          <TouchableOpacity
            key={pedido.id}
            style={[styles.proximaItem, { borderColor: theme.border }]}
            onPress={() => router.push(`/inicio/${pedido.id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.proximaItemLeft}>
              <Text style={[styles.proximaCliente, { color: theme.text }]}>
                {pedido.cliente.nombre} {pedido.cliente.apellido}
              </Text>
              <Text style={[styles.proximaDireccion, { color: theme.muted }]} numberOfLines={1}>
                {pedido.domicilio.calle} {pedido.domicilio.numero}
              </Text>
              <Text style={[styles.proximaHorario, { color: theme.info }]}>
          {pedido.domicilio.dias[0]?.horarios[0]?.inicio ?? ''} - {pedido.domicilio.dias[0]?.horarios[0]?.fin ?? ''}
              </Text>
            </View>
            <View style={[styles.proximaBadge, { backgroundColor: estadoColor + '20' }]}>
              <Text style={[styles.proximaBadgeText, { color: estadoColor }]}>
                {getEstadoLabel(pedido.estado)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── RepartoCompletadoView ────────────────────────────────────────────────────

function RepartoCompletadoView({ theme }: { theme: typeof Colors.light }) {
  return (
    <ThemedView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Card>
          <Text style={[styles.completadoText, { color: theme.success }]}>
            ¡Todas las entregas están completadas!
          </Text>
        </Card>
      </View>
    </ThemedView>
  );
}

// ─── RepartoEnCursoView ───────────────────────────────────────────────────────

function RepartoEnCursoView({
  repartoId,
  pedidos,
  theme,
  onIniciarEntrega,
  onConfirmarEntrega,
  onCancelarEntrega,
  iniciarLoading,
  confirmarLoading,
  cancelarLoading,
}: {
  repartoId: string;
  pedidos: Pedido[];
  theme: typeof Colors.light;
  onIniciarEntrega: (pedidoId: string) => void;
  onConfirmarEntrega: (pedidoId: string) => void;
  onCancelarEntrega: (pedidoId: string) => void;
  iniciarLoading: boolean;
  confirmarLoading: boolean;
  cancelarLoading: boolean;
}) {
  const completados = pedidos.filter(
    (p) => p.estado === 'ENTREGADO' || p.estado === 'NO_ENTREGADO'
  ).length;

  const pedidosActivos = pedidos
    .filter((p) => p.estado === 'PENDIENTE' || p.estado === 'EN_RUTA')
    .sort((a, b) => a.orden - b.orden);

  const proximaEntrega = pedidosActivos[0];
  const proximasEntregas = pedidosActivos.slice(1);

  return (
    <ThemedView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <BarraProgreso
          completados={completados}
          total={pedidos.length}
          theme={theme}
        />

        {proximaEntrega ? (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Próxima entrega
            </Text>

            <ProximaEntregaCard
              pedido={proximaEntrega}
              onIniciarEntrega={() => onIniciarEntrega(proximaEntrega.id)}
              onConfirmar={() => onConfirmarEntrega(proximaEntrega.id)}
              onCancelar={() => onCancelarEntrega(proximaEntrega.id)}
              onVerDetalle={() => router.push(`/inicio/${proximaEntrega.id}`)}
              theme={theme}
              iniciarLoading={iniciarLoading}
              confirmarLoading={confirmarLoading}
              cancelarLoading={cancelarLoading}
            />

            <ProximasEntregasList pedidos={proximasEntregas} theme={theme} />

            <View style={styles.verTodosContainer}>
              <Button
                title="Ver todos los pedidos"
                variant="ghost"
                onPress={() => router.push('/repartos')}
              />
            </View>
          </>
        ) : (
          <Card>
            <Text style={[styles.completadoText, { color: theme.success }]}>
              ¡Todas las entregas están completadas!
            </Text>
          </Card>
        )}
      </ScrollView>
    </ThemedView>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function InicioScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { showToast } = useToast();

  const { data: reparto, isLoading, isError, error, refetch } = useReparto();
  const iniciarReparto = useIniciarReparto();
  const iniciarEntrega = useIniciarEntrega();
  const confirmarEntrega = useConfirmarEntrega();
  const cancelarPedido = useCancelarPedido();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [pedidoACancelar, setPedidoACancelar] = useState<string | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleIniciarReparto = useCallback(() => {
    if (!reparto) return;
    iniciarReparto.mutate(reparto.id, {
      onSuccess: () => {
        showToast('Reparto iniciado correctamente', 'success');
      },
      onError: (err) => {
        showToast(handleApiError(err).message, 'error');
      },
    });
  }, [reparto, iniciarReparto, showToast]);

  const handleIniciarEntrega = useCallback((pedidoId: string) => {
    iniciarEntrega.mutate(pedidoId, {
      onSuccess: () => {
        showToast('Entrega iniciada', 'success');
      },
      onError: (err) => {
        showToast(handleApiError(err).message, 'error');
      },
    });
  }, [iniciarEntrega, showToast]);

  const handleConfirmarEntrega = useCallback((pedidoId: string) => {
    confirmarEntrega.mutate({ pedidoId }, {
      onSuccess: () => {
        showToast('Entrega confirmada', 'success');
      },
      onError: (err) => {
        showToast(handleApiError(err).message, 'error');
      },
    });
  }, [confirmarEntrega, showToast]);

  const handleCancelarEntrega = useCallback((pedidoId: string) => {
    setPedidoACancelar(pedidoId);
    setShowCancelModal(true);
  }, []);

  const handleConfirmarCancelacion = useCallback((motivo: MotivoCancelacion) => {
    if (!pedidoACancelar) return;
    cancelarPedido.mutate(
      { pedidoId: pedidoACancelar, motivo },
      {
        onSuccess: () => {
          setShowCancelModal(false);
          setPedidoACancelar(null);
          showToast('Entrega cancelada', 'success');
        },
        onError: (err) => {
          showToast(handleApiError(err).message, 'error');
        },
      }
    );
  }, [pedidoACancelar, cancelarPedido, showToast]);

  // ── Loading ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Header />
        <LoadingSpinner message="Cargando reparto..." />
      </ThemedView>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────

  if (isError) {
    return (
      <ThemedView style={styles.container}>
        <Header />
        <ErrorMessage
          message={error?.message || 'Error al cargar el reparto'}
          onRetry={() => refetch()}
        />
      </ThemedView>
    );
  }

  // ── Sin reparto ───────────────────────────────────────────────────────────

  if (!reparto || !reparto.pedidos || reparto.pedidos.length === 0) {
    return <EmptyState theme={theme} />;
  }

  // ── Reparto PENDIENTE ─────────────────────────────────────────────────────

  if (reparto.estado === 'PENDIENTE') {
    return (
      <RepartoPendienteView
        repartoId={reparto.id}
        totalPedidos={reparto.pedidos.length}
        onIniciar={handleIniciarReparto}
        loading={iniciarReparto.isPending}
        theme={theme}
      />
    );
  }

  // ── Reparto EN_CURSO ──────────────────────────────────────────────────────

  if (reparto.estado === 'EN_CURSO') {
    return (
      <>
        <RepartoEnCursoView
          repartoId={reparto.id}
          pedidos={reparto.pedidos}
          theme={theme}
          onIniciarEntrega={handleIniciarEntrega}
          onConfirmarEntrega={handleConfirmarEntrega}
          onCancelarEntrega={handleCancelarEntrega}
          iniciarLoading={iniciarEntrega.isPending}
          confirmarLoading={confirmarEntrega.isPending}
          cancelarLoading={cancelarPedido.isPending}
        />
        <CancelModal
          visible={showCancelModal}
          onClose={() => { setShowCancelModal(false); setPedidoACancelar(null); }}
          onConfirmar={handleConfirmarCancelacion}
        />
      </>
    );
  }

  // ── Reparto COMPLETADO ────────────────────────────────────────────────────

  return <RepartoCompletadoView theme={theme} />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    fontFamily: FontFamily.interBold,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  emptySubtitle: {
    fontSize: FontSizes.md,
    fontFamily: FontFamily.inter,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontFamily: FontFamily.interBold,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  // ── Resumen ──
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  resumenLabel: {
    fontSize: FontSizes.sm,
    fontFamily: FontFamily.inter,
  },
  resumenValue: {
    fontSize: FontSizes.md,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
  },
  resumenDivider: {
    height: 1,
    backgroundColor: 'transparent',
    marginVertical: Spacing.md,
  },
  resumenHint: {
    fontSize: FontSizes.sm,
    fontFamily: FontFamily.inter,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  iniciarButton: {
    marginTop: Spacing.sm,
  },
  // ── Próxima entrega ──
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
  estadoBadgeText: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.interMedium,
    fontWeight: '500',
  },
  ordenText: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.inter,
  },
  clienteNombre: {
    fontSize: FontSizes.lg,
    fontFamily: FontFamily.interBold,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
    letterSpacing: 0.18,
  },
  direccion: {
    fontSize: FontSizes.cardSecondary,
    fontFamily: FontFamily.inter,
    lineHeight: 19.5,
    marginBottom: Spacing.md,
  },
  infoRow: {
    marginBottom: Spacing.xs,
  },
  infoLabel: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.interMedium,
    fontWeight: '500',
    marginBottom: 1,
  },
  infoValue: {
    fontSize: FontSizes.md,
    fontFamily: FontFamily.inter,
  },
  itemsList: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  itemText: {
    fontSize: FontSizes.sm,
    fontFamily: FontFamily.inter,
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  operacionButtons: {
    marginTop: Spacing.sm,
  },
  verDetalleButton: {
    marginTop: Spacing.md,
  },
  // ── Progreso ──
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
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
  },
  progressCount: {
    fontSize: FontSizes.sm,
    fontFamily: FontFamily.inter,
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
  // ── Próximas entregas ──
  proximasContainer: {
    marginTop: Spacing.lg,
  },
  proximaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  proximaItemLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  proximaCliente: {
    fontSize: FontSizes.md,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: 0.16,
    lineHeight: 24,
  },
  proximaDireccion: {
    fontSize: FontSizes.cardSecondary,
    fontFamily: FontFamily.inter,
    lineHeight: 19.5,
    marginBottom: 2,
  },
  proximaHorario: {
    fontSize: FontSizes.cardSecondary,
    fontFamily: FontFamily.inter,
    lineHeight: 19.5,
  },
  proximaBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  proximaBadgeText: {
    fontSize: FontSizes.xs,
    fontFamily: FontFamily.interMedium,
    fontWeight: '500',
  },
  // ── Ver todos ──
  verTodosContainer: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  // ── Completado ──
  completadoText: {
    fontSize: FontSizes.md,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
    textAlign: 'center',
  },
});
