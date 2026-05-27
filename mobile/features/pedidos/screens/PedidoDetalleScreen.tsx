import { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { ThemedView } from '@/components/themed-view';
import { LoadingSpinner, ErrorMessage, Header, Button, ConfirmModal } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  usePedidoDetalle,
  useConfirmarEntrega,
  useCancelarPedido,
  useQuitarItem,
  useAgregarItem,
  useActualizarCantidadItem,
} from '@/features/pedidos/hooks/usePedidos';
import { useToast } from '@/hooks/useToast';
import { handleApiError } from '@/services/handleApiError';
import type { MotivoCancelacion, Pedido } from '@/types';
import type { Item } from '@/types/item';
import type { PedidoItem } from '@/types/item';
import EstadoBadge from '@/features/pedidos/components/EstadoBadge';
import InfoCliente from '@/features/pedidos/components/InfoCliente';
import ItemsList from '@/features/pedidos/components/ItemsList';
import CancelModal from '@/features/pedidos/components/CancelModal';
import AddItemModal from '@/features/pedidos/components/AddItemModal';
import TotalCard from '@/features/pedidos/components/TotalCard';
import MotivoFallaCard from '@/features/pedidos/components/MotivoFallaCard';
import ConfirmarAccionButtons from '@/features/pedidos/components/ConfirmarAccionButtons';

interface PedidoDetalleScreenProps {
  id: string;
  onBack?: () => void;
}

export default function PedidoDetalleScreen({ id, onBack }: PedidoDetalleScreenProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data: pedido, isLoading, isError, error } = usePedidoDetalle(id);
  const confirmarMutation = useConfirmarEntrega();
  const cancelarMutation = useCancelarPedido();
  const quitarItemMutation = useQuitarItem(id);
  const agregarItemMutation = useAgregarItem(id);
  const actualizarCantidadMutation = useActualizarCantidadItem(id);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [itemsEdit, setItemsEdit] = useState<PedidoItem[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmar = () => {
    confirmarMutation.mutate(id, {
      onSuccess: () => { showToast('Entrega confirmada', 'success'); router.back(); },
      onError: (err) => { showToast(handleApiError(err).message, 'error'); },
    });
  };

  const handleCancelar = (motivo: MotivoCancelacion) => {
    cancelarMutation.mutate(
      { pedidoId: id, motivo },
      {
        onSuccess: () => { setShowCancelModal(false); showToast('Entrega cancelada', 'success'); router.back(); },
        onError: (err) => { showToast(handleApiError(err).message, 'error'); },
      }
    );
  };

  const entrarEdicion = useCallback(() => {
    if (!pedido) return;
    setItemsEdit(pedido.items.map((i) => ({ ...i })));
    setModoEdicion(true);
  }, [pedido]);

  const cancelarEdicion = useCallback(() => {
    setModoEdicion(false);
    setItemsEdit([]);
  }, []);

  const handleCambiarCantidad = useCallback((itemId: string, delta: number) => {
    setItemsEdit((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return { ...item, cantidad: Math.max(1, item.cantidad + delta) };
      })
    );
  }, []);

  const handleEliminarItem = useCallback((itemId: string) => {
    setItemsEdit((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const abrirModalAgregar = useCallback(() => {
    setShowAddModal(true);
  }, []);

  const handleAgregarItem = useCallback((item: Item, cantidad: number) => {
    if (itemsEdit.some((i) => i.item.id === item.id)) {
      showToast('El ítem ya está en el pedido', 'warning');
      return;
    }
    const nuevoPedidoItem: PedidoItem = {
      id: `temp-${Date.now()}`,
      item,
      cantidad,
      precioUnitario: item.precio,
    };
    setItemsEdit((prev) => [...prev, nuevoPedidoItem]);
    setShowAddModal(false);
  }, [itemsEdit, showToast]);

  const guardarCambios = () => setShowConfirmModal(true);

  const handleConfirmGuardar = async () => {
    if (!pedido) return;
    setGuardando(true);
    setShowConfirmModal(false);
    try {
      const itemsOriginal = pedido.items;
      const deletedIds = itemsOriginal.filter((oi) => !itemsEdit.find((ni) => ni.id === oi.id)).map((oi) => oi.id);
      const addedItems = itemsEdit.filter((ni) => ni.id.startsWith('temp-'));
      const changedItems = itemsEdit.filter((ni) => {
        const original = itemsOriginal.find((oi) => oi.id === ni.id);
        return original && original.cantidad !== ni.cantidad;
      });

      for (const itemId of deletedIds) await quitarItemMutation.mutateAsync(itemId);
      for (const item of addedItems) await agregarItemMutation.mutateAsync({ itemId: item.item.id, cantidad: item.cantidad });
      for (const item of changedItems) await actualizarCantidadMutation.mutateAsync({ itemId: item.id, cantidad: item.cantidad });

      queryClient.setQueryData<Pedido>(['pedido', id], (old) => {
        if (!old) return old;
        const newTotal = itemsEdit.reduce((sum, item) => sum + (item.precioUnitario ?? 0) * item.cantidad, 0);
        return { ...old, items: itemsEdit, total: newTotal };
      });

      showToast('Items actualizados correctamente', 'success');
      setModoEdicion(false);
      setItemsEdit([]);
    } catch (err) {
      showToast(handleApiError(err).message, 'error');
    } finally {
      setGuardando(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Header onBack={onBack ?? (() => router.back())} />
        <LoadingSpinner message="Cargando detalle del pedido..." />
      </ThemedView>
    );
  }

  if (isError || !pedido) {
    return (
      <ThemedView style={styles.container}>
        <Header onBack={onBack ?? (() => router.back())} />
        <ErrorMessage message={error?.message || 'Error al cargar el pedido'} onRetry={() => router.back()} />
      </ThemedView>
    );
  }

  const mostrarAcciones = (pedido.estado === 'PENDIENTE' || pedido.estado === 'EN_RUTA') && !modoEdicion;
  const mostrarBotonEditar = (pedido.estado === 'PENDIENTE' || pedido.estado === 'EN_RUTA') && !modoEdicion;
  const totalEdit = itemsEdit.reduce((sum, item) => sum + (item.precioUnitario ?? 0) * item.cantidad, 0);

  return (
    <ThemedView style={styles.container}>
      <Header onBack={onBack ?? (() => router.back())} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <EstadoBadge estado={pedido.estado} orden={pedido.orden} />
        <InfoCliente cliente={pedido.cliente} fecha={pedido.fecha} />

        <ItemsList
          items={modoEdicion ? itemsEdit : pedido.items}
          modoEdicion={modoEdicion}
          onCambiarCantidad={handleCambiarCantidad}
          onEliminarItem={handleEliminarItem}
          onAgregarItem={abrirModalAgregar}
          mostrarBotonEditar={mostrarBotonEditar}
          onEntrarEdicion={entrarEdicion}
        />

        {pedido.motivoFalla && <MotivoFallaCard motivo={pedido.motivoFalla} />}

        <TotalCard total={modoEdicion ? totalEdit : (pedido.total ?? 0)} />

        {mostrarAcciones && (
          <ConfirmarAccionButtons
            onConfirmar={handleConfirmar}
            onCancelar={() => setShowCancelModal(true)}
            confirmarLoading={confirmarMutation.isPending}
            cancelarLoading={cancelarMutation.isPending}
          />
        )}

        {modoEdicion && (
          <View style={styles.actionContainer}>
            <Button title={guardando ? 'Guardando...' : 'Guardar cambios'} variant="primary" onPress={guardarCambios} disabled={guardando} />
            <Button title="Cancelar" variant="ghost" onPress={cancelarEdicion} disabled={guardando} style={styles.cancelButton} />
          </View>
        )}
      </ScrollView>

      <CancelModal visible={showCancelModal} onClose={() => setShowCancelModal(false)} onConfirmar={handleCancelar} />
      <AddItemModal visible={showAddModal} onClose={() => setShowAddModal(false)} onAgregar={handleAgregarItem} />
      <ConfirmModal visible={showConfirmModal} title="Confirmar cambios" message="¿Estás seguro de que querés modificar los items del pedido?" confirmText="Confirmar" cancelText="Cancelar" onConfirm={handleConfirmGuardar} onCancel={() => setShowConfirmModal(false)} loading={guardando} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  actionContainer: { marginTop: Spacing.lg },
  cancelButton: { marginTop: Spacing.md },
});
