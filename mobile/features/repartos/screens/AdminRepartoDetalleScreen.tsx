import { useState, useCallback } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Card, LoadingSpinner, ErrorMessage, Header } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useToast } from '@/hooks/useToast';
import {
  useRepartoAdminDetalleData,
  type RepartoDetalleProcesado,
  type GrupoPedidos,
} from '@/features/repartos/hooks/useRepartoAdminDetalleData';
import { useEditarReparto } from '@/features/repartos/hooks/useEditarReparto';
import { formatFechaDisplay } from '@/utils/date';
import { useQueryClient } from '@tanstack/react-query';
import { handleApiError } from '@/services/handleApiError';
import type { Pedido, EstadoPedido } from '@/types';

// ─── Colores por estado ─────────────────────────────────────────────────────

function estadoPedidoColor(estado: EstadoPedido, theme: typeof Colors.light): string {
  switch (estado) {
    case 'PENDIENTE': return theme.pendiente;
    case 'EN_RUTA': return theme.tint;
    case 'ENTREGADO': return theme.entregado;
    case 'NO_ENTREGADO': return theme.noEntregado;
    case 'CANCELADO': return theme.muted;
  }
}

function estadoPedidoLabel(estado: EstadoPedido): string {
  switch (estado) {
    case 'PENDIENTE': return 'Pendiente';
    case 'EN_RUTA': return 'En ruta';
    case 'ENTREGADO': return 'Entregado';
    case 'NO_ENTREGADO': return 'No entregado';
    case 'CANCELADO': return 'Cancelado';
  }
}

function estadoRepartoColor(estado: string, theme: typeof Colors.light): string {
  switch (estado) {
    case 'PENDIENTE': return theme.pendiente;
    case 'EN_CURSO': return theme.enCurso;
    case 'COMPLETADO': return theme.completado;
    default: return theme.muted;
  }
}

function estadoRepartoLabel(estado: string): string {
  switch (estado) {
    case 'PENDIENTE': return 'Pendiente';
    case 'EN_CURSO': return 'En curso';
    case 'COMPLETADO': return 'Finalizado';
    default: return estado;
  }
}

// ─── Badge atómico ──────────────────────────────────────────────────────────

function EstadoBadge({ label, color, style }: { label: string; color: string; style?: object }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }, style]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

// ─── Header: fecha + estado + repartidor ────────────────────────────────────

function RepartoDetailHeader({ reparto, theme }: { reparto: RepartoDetalleProcesado; theme: typeof Colors.light }) {
  return (
    <Card>
      <View style={styles.detailHeaderTop}>
        <Text style={[styles.detailTitle, { color: theme.text }]}>
          Reparto del {formatFechaDisplay(reparto.fecha)}
        </Text>
        <EstadoBadge label={estadoRepartoLabel(reparto.estado)} color={estadoRepartoColor(reparto.estado, theme)} />
      </View>
      <View style={styles.detailRow}>
        <Text style={[styles.detailLabel, { color: theme.muted }]}>Repartidor</Text>
        <Text style={[styles.detailValue, { color: theme.text }]}>{reparto.repartidor.nombre} {reparto.repartidor.apellido}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={[styles.detailLabel, { color: theme.muted }]}>Email</Text>
        <Text style={[styles.detailValue, { color: theme.text }]}>{reparto.repartidor.email}</Text>
      </View>
      {reparto.horaInicio && (
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.muted }]}>Inicio</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>{reparto.horaInicio}</Text>
        </View>
      )}
      {reparto.horaFin && (
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.muted }]}>Fin</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>{reparto.horaFin}</Text>
        </View>
      )}
    </Card>
  );
}

// ─── Métricas ──────────────────────────────────────────────────────────────

function RepartoMetricasCards({ metricas, theme }: { metricas: RepartoDetalleProcesado['metricas']; theme: typeof Colors.light }) {
  const cards = [
    { label: 'Total', value: metricas.totalPedidos, color: theme.text },
    { label: 'Entregados', value: metricas.entregados, color: theme.entregado },
    { label: 'En ruta', value: metricas.enRuta, color: theme.tint },
    { label: 'Pendientes', value: metricas.pendientes, color: theme.pendiente },
    { label: 'Fallidos', value: metricas.fallidos, color: theme.noEntregado },
  ];

  return (
    <View style={styles.metricasContainer}>
      <View style={styles.metricasRow}>
        {cards.slice(0, 3).map((c) => (
          <View key={c.label} style={[styles.metricaCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.metricaNumber, { color: c.color }]}>{c.value}</Text>
            <Text style={[styles.metricaLabel, { color: theme.muted }]}>{c.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.metricasRow}>
        {cards.slice(3).map((c) => (
          <View key={c.label} style={[styles.metricaCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.metricaNumber, { color: c.color }]}>{c.value}</Text>
            <Text style={[styles.metricaLabel, { color: theme.muted }]}>{c.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Resumen operativo ──────────────────────────────────────────────────────

function RepartoResumenOperativo({ resumen, theme }: { resumen: RepartoDetalleProcesado['resumenOperativo']; theme: typeof Colors.light }) {
  return (
    <Card>
      <Text style={[styles.sectionCardTitle, { color: theme.text }]}>Resumen operativo</Text>
      <View style={styles.resumenOpRow}>
        <View style={styles.resumenOpItem}>
          <Text style={[styles.resumenOpNumber, { color: theme.text }]}>{resumen.totalClientes}</Text>
          <Text style={[styles.resumenOpLabel, { color: theme.muted }]}>Clientes</Text>
        </View>
        <View style={styles.resumenOpDivider} />
        <View style={styles.resumenOpItem}>
          <Text style={[styles.resumenOpNumber, { color: theme.text }]}>{resumen.totalItems}</Text>
          <Text style={[styles.resumenOpLabel, { color: theme.muted }]}>Ítems totales</Text>
        </View>
      </View>
    </Card>
  );
}

// ─── Acciones / edit toggle / add pedido ────────────────────────────────────

function RepartoAcciones({
  editando,
  onToggleEdit,
  onAgregarPedido,
  agregando,
  theme,
}: {
  editando: boolean;
  onToggleEdit: () => void;
  onAgregarPedido: () => void;
  agregando: boolean;
  theme: typeof Colors.light;
}) {
  if (editando) {
    return (
      <Card>
        <Text style={[styles.sectionCardTitle, { color: theme.text }]}>Acciones</Text>
        <TouchableOpacity
          style={[styles.botonPrimario, { backgroundColor: theme.buttonPrimary }]}
          onPress={onAgregarPedido}
          disabled={agregando}
        >
          <Text style={styles.botonPrimarioText}>{agregando ? 'Agregando...' : 'Agregar pedido'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botonPrimario, { backgroundColor: theme.muted }]}
          onPress={onToggleEdit}
        >
          <Text style={styles.botonPrimarioText}>Terminar edición</Text>
        </TouchableOpacity>
      </Card>
    );
  }

  return (
    <Card>
      <Text style={[styles.sectionCardTitle, { color: theme.text }]}>Acciones</Text>
      <TouchableOpacity
        style={[styles.botonPrimario, { backgroundColor: theme.buttonPrimary }]}
        onPress={onToggleEdit}
      >
        <Text style={styles.botonPrimarioText}>Editar reparto</Text>
      </TouchableOpacity>
    </Card>
  );
}

// ─── Modal para agregar pedidos disponibles ─────────────────────────────────

function AgregarPedidoModal({
  visible,
  onClose,
  pedidosDisponibles,
  isLoading,
  isError,
  error,
  onAgregar,
  agregandoIds,
  theme,
}: {
  visible: boolean;
  onClose: () => void;
  pedidosDisponibles: Pedido[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onAgregar: (pedidoId: string) => void;
  agregandoIds: string[];
  theme: typeof Colors.light;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Pedidos disponibles</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.modalClose, { color: theme.muted }]}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          {isLoading && <LoadingSpinner message="Cargando pedidos..." />}

          {isError && (
            <ErrorMessage
              message={error?.message || 'Error al cargar pedidos disponibles'}
              onRetry={onClose}
            />
          )}

          {!isLoading && !isError && pedidosDisponibles.length === 0 && (
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              No hay pedidos pendientes para esta fecha
            </Text>
          )}

          {!isLoading && !isError && pedidosDisponibles.length > 0 && (
            <ScrollView style={styles.modalList}>
              {pedidosDisponibles.map((pedido) => (
                <View key={pedido.id} style={[styles.pedidoDisponibleCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                  <View style={styles.pedidoDisponibleInfo}>
                    <Text style={[styles.pedidoDisponibleCliente, { color: theme.text }]} numberOfLines={1}>
                      {pedido.numeroPedido} — {pedido.cliente.nombre} {pedido.cliente.apellido}
                    </Text>
                    <Text style={[styles.pedidoDisponibleDireccion, { color: theme.muted }]} numberOfLines={1}>
                      {pedido.domicilio.calle} {pedido.domicilio.numero}, {pedido.domicilio.localidad}
                    </Text>
                    <Text style={[styles.pedidoDisponibleItems, { color: theme.muted }]}>
                      {pedido.items.length} ítem(s)
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.botonAgregar, { backgroundColor: theme.entregado }]}
                    onPress={() => onAgregar(pedido.id)}
                    disabled={agregandoIds.includes(pedido.id)}
                  >
                    <Text style={styles.botonAgregarText}>
                      {agregandoIds.includes(pedido.id) ? '...' : 'Agregar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── PedidoCard individual ──────────────────────────────────────────────────

function PedidoCard({
  pedido,
  editando,
  onQuitar,
  quitandoIds,
  theme,
}: {
  pedido: Pedido;
  editando: boolean;
  onQuitar: (pedidoId: string) => void;
  quitandoIds: string[];
  theme: typeof Colors.light;
}) {
  const quitando = quitandoIds.includes(pedido.id);

  return (
    <View style={[styles.pedidoCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={styles.pedidoHeader}>
        <Text style={[styles.pedidoCliente, { color: theme.text }]} numberOfLines={1}>
          {pedido.numeroPedido} — {pedido.cliente.nombre} {pedido.cliente.apellido}
        </Text>
        {editando ? (
          <TouchableOpacity
            style={[styles.botonQuitar, { backgroundColor: theme.noEntregado }]}
            onPress={() => onQuitar(pedido.id)}
            disabled={quitando}
          >
            <Text style={styles.botonQuitarText}>{quitando ? '...' : 'Quitar'}</Text>
          </TouchableOpacity>
        ) : (
          <EstadoBadge label={estadoPedidoLabel(pedido.estado)} color={estadoPedidoColor(pedido.estado, theme)} style={styles.pedidoBadge} />
        )}
      </View>
      <Text style={[styles.pedidoDireccion, { color: theme.muted }]} numberOfLines={1}>
        {pedido.domicilio.calle} {pedido.domicilio.numero}, {pedido.domicilio.localidad}
      </Text>
      {pedido.items.length > 0 && (
        <View style={[styles.pedidoItemsList, { borderTopColor: theme.border }]}>
          {pedido.items.map((item, idx) => (
            <Text key={idx} style={[styles.pedidoItemText, { color: theme.text }]}>
              • {item.cantidad}x {item.item.nombre}
            </Text>
          ))}
        </View>
      )}
      {pedido.motivoFalla && (
        <Text style={[styles.pedidoFalla, { color: theme.noEntregado }]}>
          Motivo: {pedido.motivoFalla}
        </Text>
      )}
    </View>
  );
}

// ─── Grupo de pedidos ───────────────────────────────────────────────────────

function GrupoSection({
  grupo,
  editando,
  onQuitar,
  quitandoIds,
  theme,
}: {
  grupo: GrupoPedidos;
  editando: boolean;
  onQuitar: (pedidoId: string) => void;
  quitandoIds: string[];
  theme: typeof Colors.light;
}) {
  return (
    <View style={styles.grupoContainer}>
      <EstadoBadge
        label={`${grupo.label} (${grupo.count})`}
        color={estadoPedidoColor(grupo.estado, theme)}
        style={styles.grupoBadge}
      />
      {grupo.pedidos.map((pedido) => (
        <PedidoCard
          key={pedido.id}
          pedido={pedido}
          editando={editando}
          onQuitar={onQuitar}
          quitandoIds={quitandoIds}
          theme={theme}
        />
      ))}
    </View>
  );
}

// ─── Screen principal ───────────────────────────────────────────────────────

export default function AdminRepartoDetalleScreen({ id, onBack }: { id: string; onBack?: () => void }) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data: reparto, isLoading, isError, error } = useRepartoAdminDetalleData(id);

  const {
    editando,
    toggleEdit,
    pedidosDisponiblesQuery,
    agregarMutation,
    quitarMutation,
  } = useEditarReparto(id, reparto?.fecha ?? '');

  const [modalVisible, setModalVisible] = useState(false);
  const [quitandoIds, setQuitandoIds] = useState<string[]>([]);

  const handleQuitar = useCallback(async (pedidoId: string) => {
    console.log('[handleQuitar] called with', pedidoId);
    showToast('Quitando pedido...', 'info');
    setQuitandoIds((prev) => [...prev, pedidoId]);
    try {
      console.log('[handleQuitar] executing mutateAsync');
      await quitarMutation.mutateAsync(pedidoId);
      console.log('[handleQuitar] mutateAsync succeeded, invalidating queries');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['repartos', 'admin', 'detalle', id] }),
        queryClient.invalidateQueries({ queryKey: ['pedidos', 'disponibles', reparto?.fecha ?? ''] }),
      ]);
      showToast('Pedido quitado del reparto', 'success');
    } catch (err) {
      console.log('[handleQuitar] error:', err);
      const parsed = handleApiError(err);
      showToast(parsed.message, 'error');
    } finally {
      setQuitandoIds((prev) => prev.filter((p) => p !== pedidoId));
    }
  }, [quitarMutation, id, reparto?.fecha, showToast, queryClient]);

  const handleAgregar = useCallback((pedidoId: string) => {
    agregarMutation.mutate(pedidoId, {
      onSuccess: () => {
        showToast('Pedido agregado al reparto', 'success');
        setModalVisible(false);
      },
      onError: (err) => {
        const parsed = handleApiError(err);
        showToast(parsed.message, 'error');
      },
    });
  }, [agregarMutation, showToast]);

  // Estados de carga/error
  if (isLoading) {
    return (
      <ThemedView style={styles.screen}>
        <Header onBack={onBack ?? (() => router.back())} />
        <LoadingSpinner message="Cargando detalle del reparto..." />
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.screen}>
        <Header onBack={onBack ?? (() => router.back())} />
        <ErrorMessage message={error?.message || 'Error al cargar el reparto'} />
      </ThemedView>
    );
  }

  if (!reparto) {
    return (
      <ThemedView style={styles.screen}>
        <Header onBack={onBack ?? (() => router.back())} />
        <LoadingSpinner message="Cargando detalle del reparto..." />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <Header onBack={onBack ?? (() => router.back())} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <RepartoDetailHeader reparto={reparto} theme={theme} />
        <RepartoMetricasCards metricas={reparto.metricas} theme={theme} />
        <RepartoResumenOperativo resumen={reparto.resumenOperativo} theme={theme} />

        {reparto.estado === 'PENDIENTE' && (
          <RepartoAcciones
            editando={editando}
            onToggleEdit={toggleEdit}
            onAgregarPedido={() => setModalVisible(true)}
            agregando={agregarMutation.isPending}
            theme={theme}
          />
        )}

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Pedidos</Text>

        {reparto.grupos.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.muted }]}>No hay pedidos en este reparto</Text>
        ) : (
          reparto.grupos.map((grupo) => (
            <GrupoSection
              key={grupo.estado}
              grupo={grupo}
              editando={editando}
              onQuitar={handleQuitar}
              quitandoIds={quitandoIds}
              theme={theme}
            />
          ))
        )}
      </ScrollView>

      <AgregarPedidoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        pedidosDisponibles={pedidosDisponiblesQuery.data ?? []}
        isLoading={pedidosDisponiblesQuery.isLoading}
        isError={pedidosDisponiblesQuery.isError}
        error={pedidosDisponiblesQuery.error}
        onAgregar={handleAgregar}
        agregandoIds={[]}
        theme={theme}
      />
    </ThemedView>
  );
}

// ─── Estilos ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.lg, paddingTop: 0, paddingBottom: Spacing.xxl },

  // Badge
  badge: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.xl },
  badgeText: { fontSize: FontSizes.xs, fontWeight: '700' },

  // Header
  detailHeaderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md, gap: Spacing.sm },
  detailTitle: { fontSize: FontSizes.lg, fontWeight: 'bold', flexShrink: 1 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.xs },
  detailLabel: { fontSize: FontSizes.sm },
  detailValue: { fontSize: FontSizes.sm, fontWeight: '600' },

  // Métricas
  metricasContainer: { marginBottom: Spacing.md, gap: Spacing.sm },
  metricasRow: { flexDirection: 'row', gap: Spacing.sm },
  metricaCard: { flex: 1, borderWidth: 1, borderRadius: BorderRadius.md, paddingVertical: Spacing.md, paddingHorizontal: Spacing.sm, alignItems: 'center' },
  metricaNumber: { fontSize: FontSizes.xl, fontWeight: 'bold' },
  metricaLabel: { fontSize: FontSizes.xs, fontWeight: '600', marginTop: Spacing.xs },

  sectionCardTitle: { fontSize: FontSizes.sm, fontWeight: '700' },

  // Resumen operativo
  resumenOpRow: { flexDirection: 'row', marginTop: Spacing.sm },
  resumenOpItem: { flex: 1, alignItems: 'center' },
  resumenOpNumber: { fontSize: FontSizes.xl, fontWeight: 'bold' },
  resumenOpLabel: { fontSize: FontSizes.xs, fontWeight: '600', marginTop: Spacing.xs },
  resumenOpDivider: { width: 1, backgroundColor: 'transparent' },

  // Acciones / Botones
  botonPrimario: { paddingVertical: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center', marginTop: Spacing.sm },
  botonPrimarioText: { color: '#FFFFFF', fontSize: FontSizes.md, fontWeight: '700' },


  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { maxHeight: '80%', borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, padding: Spacing.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  modalTitle: { fontSize: FontSizes.lg, fontWeight: 'bold' },
  modalClose: { fontSize: FontSizes.md, fontWeight: '600' },
  modalList: { maxHeight: 400 },

  // Pedido disponible en modal
  pedidoDisponibleCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm },
  pedidoDisponibleInfo: { flex: 1, marginRight: Spacing.sm },
  pedidoDisponibleCliente: { fontSize: FontSizes.md, fontWeight: '600' },
  pedidoDisponibleDireccion: { fontSize: FontSizes.sm, marginTop: 2 },
  pedidoDisponibleItems: { fontSize: FontSizes.xs, marginTop: 2 },
  botonAgregar: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.sm },
  botonAgregarText: { color: '#FFFFFF', fontSize: FontSizes.sm, fontWeight: '700' },

  // Grupo
  grupoContainer: { marginBottom: Spacing.md },
  grupoBadge: { alignSelf: 'flex-start', marginBottom: Spacing.sm },

  // Pedido
  pedidoCard: { borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm },
  pedidoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs, gap: Spacing.sm },
  pedidoCliente: { fontSize: FontSizes.md, fontWeight: '600', flexShrink: 1 },
  pedidoBadge: { flexShrink: 0 },
  botonQuitar: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.sm },
  botonQuitarText: { color: '#FFFFFF', fontSize: FontSizes.xs, fontWeight: '700' },
  pedidoDireccion: { fontSize: FontSizes.sm },
  pedidoItemsList: { borderTopWidth: 1, paddingTop: Spacing.sm, marginTop: Spacing.sm },
  pedidoItemText: { fontSize: FontSizes.sm, marginBottom: 2 },
  pedidoFalla: { fontSize: FontSizes.sm, marginTop: Spacing.xs, fontStyle: 'italic' },

  // Section title
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: 'bold', marginBottom: Spacing.md, marginTop: Spacing.sm },

  // Empty
  emptyText: { fontSize: FontSizes.md, textAlign: 'center', paddingVertical: Spacing.xxl },
});
