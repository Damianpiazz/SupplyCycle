import { useState, useCallback } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import {
  Card,
  Button,
  LoadingSpinner,
  ErrorMessage,
  Header,
} from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  usePedidoDetalle,
  useConfirmarEntrega,
  useCancelarPedido,
} from '@/features/pedidos/hooks/usePedidos';
import { useToast } from '@/hooks/useToast';
import { handleApiError } from '@/services/handleApiError';
import { getItemsRequest } from '@/services/items';
import { MOCK_MOTIVOS } from '@/mocks/mockData';
import type { EstadoPedido, MotivoCancelacion } from '@/types';
import type { Item } from '@/types/item';
import type { PedidoItem } from '@/types/item';

const MOTIVO_LABELS: Record<string, string> = {};
for (const m of MOCK_MOTIVOS) {
  MOTIVO_LABELS[m.value] = m.label;
}

function getMotivoLabel(motivo: string): string {
  return MOTIVO_LABELS[motivo] ?? motivo;
}

function getEstadoColor(estado: EstadoPedido, theme: typeof Colors.light): string {
  switch (estado) {
    case 'PENDIENTE':
      return theme.pendiente;
    case 'EN_RUTA':
      return theme.tint;
    case 'ENTREGADO':
      return theme.entregado;
    case 'NO_ENTREGADO':
      return theme.noEntregado;
    case 'CANCELADO':
      return theme.muted;
  }
}

function getEstadoLabel(estado: EstadoPedido): string {
  switch (estado) {
    case 'PENDIENTE':
      return 'Pendiente';
    case 'EN_RUTA':
      return 'En ruta';
    case 'ENTREGADO':
      return 'Entregado';
    case 'NO_ENTREGADO':
      return 'No entregado';
    case 'CANCELADO':
      return 'Cancelado';
  }
}

function formatPrecio(valor: number): string {
  return `$${valor.toLocaleString('es-AR')}`;
}

function formatFecha(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface PedidoDetalleScreenProps {
  id: string;
}

export default function PedidoDetalleScreen({ id }: PedidoDetalleScreenProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { showToast } = useToast();

  // ─── Data ──────────────────────────────────────────────────────────────────
  const { data: pedido, isLoading, isError, error } = usePedidoDetalle(id);
  const confirmarMutation = useConfirmarEntrega();
  const cancelarMutation = useCancelarPedido();

  // ─── Modo edición ──────────────────────────────────────────────────────────
  const [modoEdicion, setModoEdicion] = useState(false);
  const [itemsEdit, setItemsEdit] = useState<PedidoItem[]>([]);
  const [guardando, setGuardando] = useState(false);

  // ─── Modal agregar item ────────────────────────────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemsDisponibles, setItemsDisponibles] = useState<Item[]>([]);
  const [nuevoItem, setNuevoItem] = useState<Item | null>(null);
  const [nuevaCantidad, setNuevaCantidad] = useState('1');

  // ─── Modal cancelar ────────────────────────────────────────────────────────
  const [showCancelModal, setShowCancelModal] = useState(false);

  // ─── Handlers de vista ─────────────────────────────────────────────────────

  const handleCall = (phone: string) => {
    const url = Platform.OS === 'android' ? `tel:${phone}` : `telprompt:${phone}`;
    Linking.openURL(url);
  };

  const handleOpenMaps = (lat: number, lng: number) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}`,
      default: `https://www.google.com/maps?q=${lat},${lng}`,
    });
    if (url) Linking.openURL(url);
  };

  const handleConfirmar = () => {
    confirmarMutation.mutate(id, {
      onSuccess: () => {
        showToast('Entrega confirmada', 'success');
        router.back();
      },
      onError: (err) => {
        const parsed = handleApiError(err);
        showToast(parsed.message, 'error');
      },
    });
  };

  const handleCancelar = (motivo: MotivoCancelacion) => {
    cancelarMutation.mutate(
      { pedidoId: id, motivo },
      {
        onSuccess: () => {
          setShowCancelModal(false);
          showToast('Entrega cancelada', 'success');
          router.back();
        },
        onError: (err) => {
          const parsed = handleApiError(err);
          showToast(parsed.message, 'error');
        },
      }
    );
  };

  // ─── Handlers de edición ───────────────────────────────────────────────────

  const entrarEdicion = useCallback(() => {
    if (!pedido) return;
    setItemsEdit(pedido.items.map((i) => ({ ...i })));
    setModoEdicion(true);
  }, [pedido]);

  const cancelarEdicion = useCallback(() => {
    setModoEdicion(false);
    setItemsEdit([]);
  }, []);

  const handleCambiarCantidad = useCallback(
    (itemId: string, delta: number) => {
      setItemsEdit((prev) =>
        prev.map((item) => {
          if (item.id !== itemId) return item;
          const nueva = Math.max(1, item.cantidad + delta);
          return { ...item, cantidad: nueva };
        })
      );
    },
    []
  );

  const handleEliminarItem = useCallback((itemId: string) => {
    setItemsEdit((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const abrirModalAgregar = useCallback(async () => {
    try {
      const items = await getItemsRequest();
      setItemsDisponibles(items.filter((i) => i.activo));
    } catch {
      setItemsDisponibles([]);
    }
    setNuevoItem(null);
    setNuevaCantidad('1');
    setShowAddModal(true);
  }, []);

  const handleAgregarItem = useCallback(() => {
    if (!nuevoItem) return;
    const cantidad = parseInt(nuevaCantidad, 10);
    if (isNaN(cantidad) || cantidad < 1) return;

    // Verificar si ya está en la lista de edición
    if (itemsEdit.some((i) => i.item.id === nuevoItem.id)) {
      showToast('El ítem ya está en el pedido', 'warning');
      return;
    }

    const nuevoPedidoItem: PedidoItem = {
      id: `temp-${Date.now()}`,
      item: nuevoItem,
      cantidad,
      precioUnitario: nuevoItem.precio,
    };

    setItemsEdit((prev) => [...prev, nuevoPedidoItem]);
    setShowAddModal(false);
    setNuevoItem(null);
  }, [nuevoItem, nuevaCantidad, itemsEdit, showToast]);

  const guardarCambios = useCallback(() => {
    if (!pedido) return;

    Alert.alert(
      'Confirmar cambios',
      '¿Estás seguro de que querés modificar los items del pedido?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: async () => {
          setGuardando(true);
          try {
            const itemsOriginal = pedido.items;

            // 1. Items eliminados
            const deletedIds = itemsOriginal
              .filter((oi) => !itemsEdit.find((ni) => ni.id === oi.id))
              .map((oi) => oi.id);

            // 2. Items agregados (tienen id temporal)
            const addedItems = itemsEdit.filter((ni) => ni.id.startsWith('temp-'));

            // 3. Items con cantidad cambiada
            const changedItems = itemsEdit.filter((ni) => {
              const original = itemsOriginal.find((oi) => oi.id === ni.id);
              return original && original.cantidad !== ni.cantidad;
            });

            // Ejecutar en orden: DELETE → POST → PATCH
            for (const itemId of deletedIds) {
              const res = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/pedidos/${id}/items/${itemId}`,
                {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
                }
              );
              if (!res.ok) throw new Error('Error al eliminar item');
            }

            for (const item of addedItems) {
              const res = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/pedidos/${id}/items`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useAuthStore.getState().token}`,
                  },
                  body: JSON.stringify({ itemId: item.item.id, cantidad: item.cantidad }),
                }
              );
              if (!res.ok) throw new Error('Error al agregar item');
            }

            for (const item of changedItems) {
              const res = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/pedidos/${id}/items/${item.id}`,
                {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useAuthStore.getState().token}`,
                  },
                  body: JSON.stringify({ cantidad: item.cantidad }),
                }
              );
              if (!res.ok) throw new Error('Error al actualizar cantidad');
            }

            showToast('Items actualizados correctamente', 'success');
            setModoEdicion(false);
            setItemsEdit([]);
          } catch (err) {
            const parsed = handleApiError(err);
            showToast(parsed.message, 'error');
          } finally {
            setGuardando(false);
          }
        }},
      ]
    );
  }, [pedido, itemsEdit, id, showToast]);

  // ─── Loading / Error ───────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Header />
        <LoadingSpinner message="Cargando detalle del pedido..." />
      </ThemedView>
    );
  }

  if (isError || !pedido) {
    return (
      <ThemedView style={styles.container}>
        <Header />
        <ErrorMessage
          message={error?.message || 'Error al cargar el pedido'}
          onRetry={() => router.back()}
        />
      </ThemedView>
    );
  }

  const mostrarAcciones =
    (pedido.estado === 'PENDIENTE' || pedido.estado === 'EN_RUTA') && !modoEdicion;
  const mostrarBotonEditar =
    (pedido.estado === 'PENDIENTE' || pedido.estado === 'EN_RUTA') && !modoEdicion;

  const totalEdit = itemsEdit.reduce(
    (sum, item) => sum + (item.precioUnitario ?? 0) * item.cantidad,
    0
  );

  return (
    <ThemedView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ─── Estado ──────────────────────────────────────────────────────── */}
        <View style={styles.estadoContainer}>
          <View
            style={[
              styles.estadoBadge,
              {
                backgroundColor: getEstadoColor(pedido.estado, theme) + '20',
              },
            ]}
          >
            <Text
              style={[
                styles.estadoText,
                { color: getEstadoColor(pedido.estado, theme) },
              ]}
            >
              {getEstadoLabel(pedido.estado)}
            </Text>
          </View>
          <Text style={[styles.ordenText, { color: theme.muted }]}>
            Pedido #{pedido.orden}
          </Text>
        </View>

        {/* ─── Cliente ────────────────────────────────────────────────────── */}
        <Card>
          <Text style={[styles.clienteNombre, { color: theme.text }]}>
            {pedido.cliente.nombre} {pedido.cliente.apellido}
          </Text>

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() =>
              handleOpenMaps(
                pedido.cliente.domicilio.latitud,
                pedido.cliente.domicilio.longitud
              )
            }
          >
            <Text style={[styles.infoLabel, { color: theme.muted }]}>
              Dirección
            </Text>
            <Text style={[styles.infoValue, { color: theme.info }]}>
              {pedido.cliente.domicilio.calle}{' '}
              {pedido.cliente.domicilio.numero},{' '}
              {pedido.cliente.domicilio.localidad}
              {'\n'}Tocar para abrir en mapas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => handleCall(pedido.cliente.telefono)}
          >
            <Text style={[styles.infoLabel, { color: theme.muted }]}>
              Contacto
            </Text>
            <Text style={[styles.infoValue, { color: theme.info }]}>
              {pedido.cliente.telefono}
              {'\n'}Tocar para llamar
            </Text>
          </TouchableOpacity>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.muted }]}>
              Horario
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {pedido.cliente.horarioDesde} - {pedido.cliente.horarioHasta}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.muted }]}>
              Fecha
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {formatFecha(pedido.fecha)}
            </Text>
          </View>
        </Card>

        {/* ─── Items ──────────────────────────────────────────────────────── */}
        <Card>
          <View style={styles.itemsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Items del pedido
            </Text>
            {mostrarBotonEditar && (
              <TouchableOpacity onPress={entrarEdicion}>
                <Text style={[styles.editarBtn, { color: theme.info }]}>
                  Editar items
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {(modoEdicion ? itemsEdit : pedido.items).length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              No hay items en el pedido
            </Text>
          ) : (
            (modoEdicion ? itemsEdit : pedido.items).map((item, idx) => (
              <View
                key={item.id ?? idx}
                style={[
                  styles.itemRow,
                  modoEdicion && styles.itemRowEditing,
                ]}
              >
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemNombre, { color: theme.text }]}>
                    {item.item.nombre}
                  </Text>
                  {item.precioUnitario != null && (
                    <Text style={[styles.itemPrecio, { color: theme.muted }]}>
                      {formatPrecio(item.precioUnitario)} c/u
                    </Text>
                  )}
                </View>

                {modoEdicion ? (
                  <View style={styles.editControls}>
                    {/* Stepper */}
                    <View style={styles.stepper}>
                      <TouchableOpacity
                        style={[
                          styles.stepperBtn,
                          { backgroundColor: theme.surface },
                        ]}
                        onPress={() => handleCambiarCantidad(item.id, -1)}
                      >
                        <Text style={[styles.stepperBtnText, { color: theme.text }]}>
                          −
                        </Text>
                      </TouchableOpacity>
                      <Text style={[styles.stepperValue, { color: theme.text }]}>
                        {item.cantidad}
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.stepperBtn,
                          { backgroundColor: theme.surface },
                        ]}
                        onPress={() => handleCambiarCantidad(item.id, 1)}
                      >
                        <Text style={[styles.stepperBtnText, { color: theme.text }]}>
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {/* Botón eliminar */}
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleEliminarItem(item.id)}
                    >
                      <Text style={styles.deleteBtnText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={[styles.itemCantidad, { color: theme.text }]}>
                    {item.cantidad} {item.item.unidad}
                  </Text>
                )}
              </View>
            ))
          )}

          {/* Botón agregar item en modo edición */}
          {modoEdicion && (
            <TouchableOpacity
              style={[styles.agregarBtn, { borderColor: theme.info }]}
              onPress={abrirModalAgregar}
            >
              <Text style={[styles.agregarBtnText, { color: theme.info }]}>
                + Agregar item
              </Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* ─── Motivo de falla ────────────────────────────────────────────── */}
        {pedido.motivoFalla && (
          <Card>
            <Text style={[styles.sectionTitle, { color: theme.noEntregado }]}>
              Motivo de no entrega
            </Text>
            <Text style={[styles.motivoText, { color: theme.text }]}>
              {getMotivoLabel(pedido.motivoFalla)}
            </Text>
          </Card>
        )}

        {/* ─── Total ──────────────────────────────────────────────────────── */}
        <Card>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: theme.text }]}>
              Total del pedido
            </Text>
            <Text style={[styles.totalValue, { color: theme.tint }]}>
              {modoEdicion
                ? formatPrecio(totalEdit)
                : pedido.total != null
                  ? formatPrecio(pedido.total)
                  : '—'}
            </Text>
          </View>
        </Card>

        {/* ─── Acciones ───────────────────────────────────────────────────── */}
        {mostrarAcciones && (
          <View style={styles.actionContainer}>
            <Button
              title="Confirmar entrega"
              variant="success"
              onPress={handleConfirmar}
              loading={confirmarMutation.isPending}
              disabled={confirmarMutation.isPending}
            />
            <Button
              title="Cancelar entrega"
              variant="danger"
              onPress={() => setShowCancelModal(true)}
              loading={cancelarMutation.isPending}
              disabled={cancelarMutation.isPending}
              style={styles.cancelButton}
            />
          </View>
        )}

        {/* ─── Botones de edición ─────────────────────────────────────────── */}
        {modoEdicion && (
          <View style={styles.actionContainer}>
            <Button
              title={guardando ? 'Guardando...' : 'Guardar cambios'}
              variant="primary"
              onPress={guardarCambios}
              disabled={guardando}
            />
            <Button
              title="Cancelar"
              variant="ghost"
              onPress={cancelarEdicion}
              disabled={guardando}
              style={styles.cancelButton}
            />
          </View>
        )}
      </ScrollView>

      {/* ─── Modal de cancelación ─────────────────────────────────────────── */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: 'rgba(0,0,0,0.5)' },
          ]}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.background },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Seleccionar motivo
            </Text>
            <Text style={[styles.modalSubtitle, { color: theme.muted }]}>
              ¿Por qué no se pudo realizar la entrega?
            </Text>

            {MOCK_MOTIVOS.map((motivo) => (
              <TouchableOpacity
                key={motivo.value}
                style={[
                  styles.motivoOption,
                  { borderColor: theme.border },
                ]}
                onPress={() => handleCancelar(motivo.value)}
              >
                <Text style={[styles.motivoOptionText, { color: theme.text }]}>
                  {motivo.label}
                </Text>
              </TouchableOpacity>
            ))}

            <Button
              title="Volver"
              variant="ghost"
              onPress={() => setShowCancelModal(false)}
            />
          </View>
        </View>
      </Modal>

      {/* ─── Modal de agregar item ────────────────────────────────────────── */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.background },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Agregar item
            </Text>

            {nuevoItem ? (
              <View>
                <Text style={[styles.modalSubtitle, { color: theme.text }]}>
                  {nuevoItem.nombre} — {nuevoItem.precio ? formatPrecio(nuevoItem.precio) : '—'} / {nuevoItem.unidad}
                </Text>

                <Text style={[styles.label, { color: theme.muted }]}>
                  Cantidad
                </Text>
                <TextInput
                  style={[
                    styles.quantityInput,
                    {
                      backgroundColor: theme.inputBackground,
                      borderColor: theme.border,
                      color: theme.text,
                    },
                  ]}
                  value={nuevaCantidad}
                  onChangeText={setNuevaCantidad}
                  keyboardType="number-pad"
                  placeholder="1"
                  placeholderTextColor={theme.muted}
                />

                <View style={styles.addModalActions}>
                  <Button
                    title="Agregar"
                    onPress={handleAgregarItem}
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Cambiar item"
                    variant="ghost"
                    onPress={() => setNuevoItem(null)}
                    style={{ flex: 1, marginLeft: Spacing.sm }}
                  />
                </View>
              </View>
            ) : (
              <ScrollView style={styles.itemsListModal}>
                {itemsDisponibles.length === 0 ? (
                  <Text style={[styles.emptyText, { color: theme.muted }]}>
                    No hay items disponibles
                  </Text>
                ) : (
                  itemsDisponibles.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.modalItemOption,
                        { borderColor: theme.border },
                      ]}
                      onPress={() => setNuevoItem(item)}
                    >
                      <Text style={[styles.modalItemText, { color: theme.text }]}>
                        {item.nombre}
                      </Text>
                      <Text style={[styles.modalItemSub, { color: theme.muted }]}>
                        {item.precio ? formatPrecio(item.precio) : '—'} / {item.unidad}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            )}

            <Button
              title="Cerrar"
              variant="ghost"
              onPress={() => setShowAddModal(false)}
            />
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

// ─── useAuthStore para las fetch directas en guardarCambios ──────────────────
import { useAuthStore } from '@/stores/authStore';

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  estadoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  estadoBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  estadoText: {
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  ordenText: {
    fontSize: FontSizes.sm,
  },
  clienteNombre: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.lg,
  },
  infoRow: {
    marginBottom: Spacing.md,
  },
  infoLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FontSizes.md,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  editarBtn: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  itemRowEditing: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  itemInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  itemNombre: {
    fontSize: FontSizes.md,
  },
  itemPrecio: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  itemCantidad: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  editControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnText: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  stepperValue: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
  deleteBtn: {
    padding: Spacing.xs,
  },
  deleteBtnText: {
    fontSize: 18,
  },
  agregarBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  agregarBtnText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: FontSizes.sm,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
  },
  motivoText: {
    fontSize: FontSizes.md,
    fontStyle: 'italic',
  },
  actionContainer: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  cancelButton: {
    marginTop: 0,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  quantityInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.md,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  // ─── Modal ────────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  modalSubtitle: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xl,
  },
  motivoOption: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  motivoOptionText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
  },
  itemsListModal: {
    maxHeight: 300,
    marginBottom: Spacing.md,
  },
  modalItemOption: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  modalItemText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  modalItemSub: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  addModalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
