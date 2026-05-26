import { useState, useEffect } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Button } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getItemsRequest } from '@/services/items';
import type { Item } from '@/types/item';

function formatPrecio(valor: number): string {
  return `$${valor.toLocaleString('es-AR')}`;
}

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAgregar: (item: Item, cantidad: number) => void;
}

export default function AddItemModal({ visible, onClose, onAgregar }: AddItemModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [itemsDisponibles, setItemsDisponibles] = useState<Item[]>([]);
  const [nuevoItem, setNuevoItem] = useState<Item | null>(null);
  const [nuevaCantidad, setNuevaCantidad] = useState('1');

  useEffect(() => {
    if (visible) {
      getItemsRequest()
        .then((items) => setItemsDisponibles(items.filter((i) => i.activo)))
        .catch(() => setItemsDisponibles([]));
      setNuevoItem(null);
      setNuevaCantidad('1');
    }
  }, [visible]);

  const handleAgregar = () => {
    if (!nuevoItem) return;
    const cantidad = parseInt(nuevaCantidad, 10);
    if (isNaN(cantidad) || cantidad < 1) return;
    onAgregar(nuevoItem, cantidad);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Agregar item</Text>

          {nuevoItem ? (
            <View>
              <Text style={[styles.modalSubtitle, { color: theme.text }]}>
                {nuevoItem.nombre} — {nuevoItem.precio ? formatPrecio(nuevoItem.precio) : '—'} / {nuevoItem.unidad}
              </Text>

              <Text style={[styles.label, { color: theme.muted }]}>Cantidad</Text>
              <TextInput
                style={[styles.quantityInput, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text }]}
                value={nuevaCantidad}
                onChangeText={setNuevaCantidad}
                keyboardType="number-pad"
                placeholder="1"
                placeholderTextColor={theme.muted}
              />

              <View style={styles.addModalActions}>
                <Button title="Agregar" onPress={handleAgregar} style={{ flex: 1 }} />
                <Button title="Cambiar item" variant="ghost" onPress={() => setNuevoItem(null)} style={{ flex: 1, marginLeft: Spacing.sm }} />
              </View>
            </View>
          ) : (
            <ScrollView style={styles.itemsListModal}>
              {itemsDisponibles.length === 0 ? (
                <Text style={[styles.emptyText, { color: theme.muted }]}>No hay items disponibles</Text>
              ) : (
                itemsDisponibles.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.modalItemOption, { borderColor: theme.border }]}
                    onPress={() => setNuevoItem(item)}
                  >
                    <Text style={[styles.modalItemText, { color: theme.text }]}>{item.nombre}</Text>
                    <Text style={[styles.modalItemSub, { color: theme.muted }]}>
                      {item.precio ? formatPrecio(item.precio) : '—'} / {item.unidad}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}

          <Button title="Cerrar" variant="ghost" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  addModalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
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
  emptyText: {
    fontSize: FontSizes.sm,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
});
