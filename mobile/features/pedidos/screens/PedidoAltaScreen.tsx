import { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Button, Header, LoadingSpinner, ErrorMessage } from '@/components/ui';
import DatePickerField from '@/components/ui/DatePickerField';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCrearPedido } from '@/features/pedidos/hooks/usePedidos';
import { listClientesRequest } from '@/features/clientes/services/clienteService';
import { getItemsRequest } from '@/services/items';

import { handleApiError } from '@/services/handleApiError';
import { useToast } from '@/hooks/useToast';
import { ddmmyyyyToISO } from '@/utils/date';
import type { Cliente } from '@/types/cliente';
import type { Item } from '@/types/item';

interface ItemSeleccionado {
  item: Item;
  cantidad: number;
}

function formatTotal(valor: number): string {
  return `$${valor.toLocaleString('es-AR')}`;
}

export default function PedidoAltaScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  // ─── Data ──────────────────────────────────────────────────────────────────
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // ─── Form state ────────────────────────────────────────────────────────────
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [selectedItems, setSelectedItems] = useState<ItemSeleccionado[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const [fecha, setFecha] = useState(`${dd}/${mm}/${yyyy}`);

  // ─── Modal state ───────────────────────────────────────────────────────────
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [searchCliente, setSearchCliente] = useState('');

  // ─── Submit ────────────────────────────────────────────────────────────────
  const crearPedido = useCrearPedido();
  const { showToast } = useToast();

  // ─── Fetch initial data ────────────────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      try {
        const [clientesData, itemsData] = await Promise.all([
          listClientesRequest(),
          getItemsRequest(),
        ]);
        setClientes(clientesData);
        setItems(itemsData);
      } catch {
        setDataError('Error al cargar datos iniciales');
      }
      setLoadingData(false);
    }
    loadData();
  }, []);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const toggleItem = useCallback(
    (item: Item) => {
      setValidationError(null);
      setSelectedItems((prev) => {
        const existing = prev.find((s) => s.item.id === item.id);
        if (existing) {
          return prev.filter((s) => s.item.id !== item.id);
        }
        return [...prev, { item, cantidad: 1 }];
      });
    },
    []
  );

  const updateCantidad = useCallback(
    (itemId: string, delta: number) => {
      setSelectedItems((prev) =>
        prev.map((s) => {
          if (s.item.id !== itemId) return s;
          const nueva = Math.max(1, s.cantidad + delta);
          return { ...s, cantidad: nueva };
        })
      );
    },
    []
  );

  const totalEstimado = selectedItems.reduce(
    (sum, s) => sum + (s.item.precio ?? 0) * s.cantidad,
    0
  );

  const handleSubmit = useCallback(() => {
    if (!selectedCliente) {
      setValidationError('Debés seleccionar un cliente para el pedido');
      showToast('Seleccioná un cliente', 'warning');
      return;
    }
    if (selectedItems.length === 0) {
      setValidationError('Agregá al menos un ítem al pedido');
      showToast('Agregá al menos un ítem', 'warning');
      return;
    }

    // Validar fecha
    const iso = ddmmyyyyToISO(fecha);
    if (!iso) {
      setValidationError('Formato de fecha inválido. Usá DD/MM/YYYY');
      showToast('Formato de fecha inválido', 'warning');
      return;
    }
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaDate = new Date(iso + 'T00:00:00');
    if (fechaDate < hoy) {
      setValidationError('La fecha no puede ser anterior a hoy');
      showToast('La fecha no puede ser anterior a hoy', 'warning');
      return;
    }

    setValidationError(null);

    const payload = {
      clienteId: selectedCliente.id,
      fecha: iso,
      items: selectedItems.map((s) => ({
        itemId: s.item.id,
        cantidad: s.cantidad,
      })),
    };

    crearPedido.mutate(payload, {
      onSuccess: (pedido) => {
        showToast(
          `${pedido.numeroPedido} creado para ${pedido.cliente.nombre} ${pedido.cliente.apellido}`,
          'success'
        );
        router.replace('/pedidos');
      },
      onError: (error) => {
        const parsed = handleApiError(error);
        showToast(parsed.message, 'error');
      },
    });
  }, [selectedCliente, selectedItems, fecha, crearPedido, showToast]);

  // ─── Loading / Error ───────────────────────────────────────────────────────

  if (loadingData) {
    return (
      <ThemedView style={styles.container}>
        <Header onBack={() => router.back()} />
        <LoadingSpinner message="Cargando datos..." />
      </ThemedView>
    );
  }

  if (dataError) {
    return (
      <ThemedView style={styles.container}>
        <Header onBack={() => router.back()} />
        <ErrorMessage message={dataError} />
      </ThemedView>
    );
  }

  // ─── Filtered clientes for modal ────────────────────────────────────────────
  const filteredClientes = clientes.filter((c) => {
    if (!searchCliente) return true;
    const q = searchCliente.toLowerCase();
    return (
      c.nombre.toLowerCase().includes(q) ||
      c.apellido.toLowerCase().includes(q)
    );
  });

  return (
    <ThemedView style={styles.container}>
      <Header onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ─── Cliente ──────────────────────────────────────────────────── */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Cliente
        </Text>
        <TouchableOpacity
          style={[
            styles.selectField,
            {
              backgroundColor: theme.inputBackground,
              borderColor: validationError && !selectedCliente ? theme.error : theme.border,
            },
          ]}
          onPress={() => { setValidationError(null); setShowClienteModal(true); }}
        >
          <Text style={[styles.selectFieldText, { color: selectedCliente ? theme.text : theme.muted }]}>
            {selectedCliente
              ? `${selectedCliente.nombre} ${selectedCliente.apellido}`
              : 'Seleccionar cliente...'}
          </Text>
        </TouchableOpacity>
        {validationError && !selectedCliente && (
          <Text style={[styles.errorText, { color: theme.error }]}>
            {validationError}
          </Text>
        )}

        {/* ─── Fecha del pedido ─────────────────────────────────────────── */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Fecha del pedido
        </Text>
        <DatePickerField
          value={fecha}
          onChange={setFecha}
          minimumDate={new Date()}
          placeholder="DD/MM/YYYY"
          error={
            !!(
              validationError &&
              (!fecha || !ddmmyyyyToISO(fecha))
            )
          }
          theme={theme}
        />

        {/* ─── Items ────────────────────────────────────────────────────── */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Items del pedido
        </Text>
        {items.map((item) => {
          const sel = selectedItems.find((s) => s.item.id === item.id);
          const isSelected = !!sel;
          return (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                {
                  backgroundColor: isSelected ? theme.tint + '15' : theme.card,
                  borderColor: isSelected ? theme.tint : theme.cardBorder,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.itemInfo}
                onPress={() => toggleItem(item)}
              >
                <Text style={[styles.itemNombre, { color: theme.text }]}>
                  {item.nombre}
                </Text>
                <Text style={[styles.itemPrecio, { color: theme.muted }]}>
                  {item.precio ? formatTotal(item.precio) : '—'} / {item.unidad}
                </Text>
              </TouchableOpacity>

              {isSelected ? (
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={[styles.stepperBtn, { backgroundColor: theme.surface }]}
                    onPress={() => updateCantidad(item.id, -1)}
                  >
                    <Text style={[styles.stepperBtnText, { color: theme.text }]}>−</Text>
                  </TouchableOpacity>
                  <Text style={[styles.stepperValue, { color: theme.text }]}>
                    {sel!.cantidad}
                  </Text>
                  <TouchableOpacity
                    style={[styles.stepperBtn, { backgroundColor: theme.surface }]}
                    onPress={() => updateCantidad(item.id, 1)}
                  >
                    <Text style={[styles.stepperBtnText, { color: theme.text }]}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.addItemBtn, { backgroundColor: theme.buttonPrimary }]}
                  onPress={() => toggleItem(item)}
                >
                  <Text style={[styles.addItemBtnText, { color: theme.headerText }]}>Agregar</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {/* ─── Total y submit ────────────────────────────────────────────── */}
        <View style={[styles.totalContainer, { borderTopColor: theme.border }]}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>
            Total estimado
          </Text>
          <Text style={[styles.totalValue, { color: theme.tint }]}>
            {formatTotal(totalEstimado)}
          </Text>
        </View>

        <Button
          title={crearPedido.isPending ? 'Creando...' : 'Crear Pedido'}
          onPress={handleSubmit}
          disabled={crearPedido.isPending}
          style={styles.submitButton}
        />
      </ScrollView>

      {/* ─── Modal: Seleccionar Cliente ─────────────────────────────────── */}
      <Modal visible={showClienteModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Seleccionar Cliente
              </Text>
              <TouchableOpacity onPress={() => setShowClienteModal(false)}>
                <Text style={[styles.modalClose, { color: theme.tint }]}>
                  Cerrar
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.modalSearch,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="Buscar cliente..."
              placeholderTextColor={theme.muted}
              value={searchCliente}
              onChangeText={setSearchCliente}
            />

            <FlatList
              data={filteredClientes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    {
                      backgroundColor:
                        selectedCliente?.id === item.id
                          ? theme.tint + '20'
                          : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    setSelectedCliente(item);
                    setValidationError(null);
                    setShowClienteModal(false);
                    setSearchCliente('');
                  }}
                >
                  <Text style={[styles.modalItemText, { color: theme.text }]}>
                    {item.nombre} {item.apellido}
                  </Text>
                  <Text style={[styles.modalItemSub, { color: theme.muted }]}>
                    {item.domicilio.calle} {item.domicilio.numero},{' '}
                    {item.domicilio.localidad}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={[styles.modalEmpty, { color: theme.muted }]}>
                  No se encontraron clientes
                </Text>
              }
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  selectField: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  selectFieldText: {
    fontSize: FontSizes.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  itemInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  itemNombre: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  itemPrecio: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
  stepperValue: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  addItemBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  addItemBtnText: {
    fontWeight: '600',
    fontSize: FontSizes.sm,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
  },
  submitButton: {
    marginTop: Spacing.lg,
  },

  errorText: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
    fontWeight: '500',
  },

  // ─── Modal styles ────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '75%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  modalClose: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  modalSearch: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.md,
    marginBottom: Spacing.md,
  },
  modalItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: 2,
  },
  modalItemText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  modalItemSub: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  modalEmpty: {
    textAlign: 'center',
    paddingVertical: Spacing.xl,
    fontSize: FontSizes.md,
  },
});
