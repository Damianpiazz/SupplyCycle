import { useState } from 'react';
import {
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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
} from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  usePedidoDetalle,
  useConfirmarEntrega,
  useCancelarPedido,
} from '@/features/pedidos/hooks/usePedidos';
import { MOCK_MOTIVOS } from '@/mocks/mockData';
import type { EstadoPedido, MotivoCancelacion } from '@/types';

function getEstadoColor(estado: EstadoPedido, theme: typeof Colors.light): string {
  switch (estado) {
    case 'PENDIENTE':
      return theme.pendiente;
    case 'ENTREGADO':
      return theme.entregado;
    case 'NO_ENTREGADO':
      return theme.noEntregado;
  }
}

function getEstadoLabel(estado: EstadoPedido): string {
  switch (estado) {
    case 'PENDIENTE':
      return 'Pendiente';
    case 'ENTREGADO':
      return 'Entregado';
    case 'NO_ENTREGADO':
      return 'No entregado';
  }
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
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { data: pedido, isLoading, isError, error } = usePedidoDetalle(id);
  const confirmarMutation = useConfirmarEntrega();
  const cancelarMutation = useCancelarPedido();

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
        router.back();
      },
    });
  };

  const handleCancelar = (motivo: MotivoCancelacion) => {
    cancelarMutation.mutate(
      { pedidoId: id, motivo },
      {
        onSuccess: () => {
          setShowCancelModal(false);
          router.back();
        },
      }
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando detalle del pedido..." />;
  }

  if (isError || !pedido) {
    return (
      <ErrorMessage
        message={error?.message || 'Error al cargar el pedido'}
        onRetry={() => router.back()}
      />
    );
  }

  const isPending = pedido.estado === 'PENDIENTE';

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Estado */}
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

        {/* Cliente */}
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

        {/* Ítems */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Items del pedido
          </Text>
          {pedido.items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={[styles.itemNombre, { color: theme.text }]}>
                {item.item.nombre}
              </Text>
              <Text style={[styles.itemCantidad, { color: theme.muted }]}>
                {item.cantidad} {item.item.unidad}
              </Text>
            </View>
          ))}
        </Card>

        {/* Motivo de falla si existe */}
        {pedido.motivoFalla && (
          <Card>
            <Text style={[styles.sectionTitle, { color: theme.noEntregado }]}>
              Motivo de no entrega
            </Text>
            <Text style={[styles.motivoText, { color: theme.text }]}>
              {pedido.motivoFalla}
            </Text>
          </Card>
        )}

        {/* Acciones */}
        {isPending && (
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
      </ScrollView>

      {/* Modal de cancelación */}
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
    </ThemedView>
  );
}

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
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  itemNombre: {
    fontSize: FontSizes.md,
  },
  itemCantidad: {
    fontSize: FontSizes.md,
    fontWeight: '600',
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
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
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
});
