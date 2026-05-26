import { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Card, Header, LoadingSpinner, ErrorMessage } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useToast } from '@/hooks/useToast';
import { useAuthStore } from '@/stores/authStore';
import { handleApiError } from '@/services/handleApiError';
import { confirmAction } from '@/utils/confirmAction';
import {
  useUsuarios,
  useDesactivarUsuario,
  useReactivarUsuario,
} from '@/features/usuarios/hooks/useUsuarios';
import type { Usuario } from '@/types';

type FiltroActivo = 'todos' | 'activos' | 'inactivos';
type FiltroRol = 'todos' | 'repartidores' | 'administradores';

function getRolLabel(rol: Usuario['rol']): string {
  return rol === 'ADMIN' ? 'Administrador' : 'Repartidor';
}

export default function UsuariosListScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [search, setSearch] = useState('');
  const [filtroActivo, setFiltroActivo] = useState<FiltroActivo>('todos');
  const [filtroRol, setFiltroRol] = useState<FiltroRol>('todos');
  const { showToast } = useToast();
  const currentUserId = useAuthStore((state) => state.usuario?.id);

  const { data, isLoading, isError, error } = useUsuarios();
  const desactivar = useDesactivarUsuario();
  const reactivar = useReactivarUsuario();

  const usuarios = useMemo(() => {
    const list = data?.data ?? [];
    const term = search.trim().toLowerCase();

    return list.filter((u) => {
      if (currentUserId && u.id === currentUserId) return false;
      if (filtroActivo === 'activos' && !u.activo) return false;
      if (filtroActivo === 'inactivos' && u.activo) return false;
      if (filtroRol === 'repartidores' && u.rol !== 'REPARTIDOR') return false;
      if (filtroRol === 'administradores' && u.rol !== 'ADMIN') return false;
      if (!term) return true;
      const fullName = `${u.nombre} ${u.apellido}`.toLowerCase();
      return fullName.includes(term) || u.email.toLowerCase().includes(term);
    });
  }, [data?.data, search, filtroActivo, filtroRol, currentUserId]);

  const handleReactivar = (usuario: Usuario) => {
    confirmAction(
      'Reactivar usuario',
      `¿Reactivar a ${usuario.nombre} ${usuario.apellido}? Podrá volver a iniciar sesión.`,
      'Reactivar',
      async () => {
        try {
          await reactivar.mutateAsync(usuario.id);
          showToast('Usuario reactivado', 'success');
        } catch (e) {
          const parsed = handleApiError(e);
          showToast(parsed.message, 'error');
        }
      }
    );
  };

  const handleDesactivar = (usuario: Usuario) => {
    confirmAction(
      'Desactivar usuario',
      `¿Desactivar a ${usuario.nombre} ${usuario.apellido}? No podrá iniciar sesión.`,
      'Desactivar',
      async () => {
        try {
          await desactivar.mutateAsync(usuario.id);
          showToast('Usuario desactivado', 'success');
        } catch (e) {
          const parsed = handleApiError(e);
          showToast(parsed.message, 'error');
        }
      },
      { destructive: true }
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Header />
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
              color: theme.text,
              flex: 1,
            },
          ]}
          placeholder="Buscar por nombre o email..."
          placeholderTextColor={theme.muted}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.tint }]}
          onPress={() => router.push('/usuarios/alta')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtrosContainer}>
        {(
          [
            { key: 'todos', label: 'Todos' },
            { key: 'activos', label: 'Activos' },
            { key: 'inactivos', label: 'Inactivos' },
          ] as { key: FiltroActivo; label: string }[]
        ).map((filtro) => (
          <TouchableOpacity
            key={filtro.key}
            style={[
              styles.filtroButton,
              {
                backgroundColor:
                  filtroActivo === filtro.key ? theme.tint : theme.surface,
              },
            ]}
            onPress={() => setFiltroActivo(filtro.key)}
          >
            <Text
              style={[
                styles.filtroText,
                { color: filtroActivo === filtro.key ? '#FFFFFF' : theme.text },
              ]}
            >
              {filtro.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.filtrosContainer}>
        {(
          [
            { key: 'todos', label: 'Todos los roles' },
            { key: 'repartidores', label: 'Repartidores' },
            { key: 'administradores', label: 'Administradores' },
          ] as { key: FiltroRol; label: string }[]
        ).map((filtro) => (
          <TouchableOpacity
            key={filtro.key}
            style={[
              styles.filtroButton,
              {
                backgroundColor:
                  filtroRol === filtro.key ? theme.tint : theme.surface,
              },
            ]}
            onPress={() => setFiltroRol(filtro.key)}
          >
            <Text
              style={[
                styles.filtroText,
                { color: filtroRol === filtro.key ? '#FFFFFF' : theme.text },
              ]}
            >
              {filtro.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <LoadingSpinner message="Cargando usuarios..." />
      ) : isError ? (
        <ErrorMessage message={error?.message || 'Error al cargar usuarios'} />
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card>
              <TouchableOpacity onPress={() => router.push(`/usuarios/${item.id}`)}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardNombre, { color: theme.text }]}>
                    {item.nombre} {item.apellido}
                  </Text>
                  <View
                    style={[
                      styles.estadoBadge,
                      {
                        backgroundColor: item.activo
                          ? theme.entregado + '20'
                          : theme.muted + '30',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.estadoText,
                        { color: item.activo ? theme.entregado : theme.muted },
                      ]}
                    >
                      {item.activo ? 'Activo' : 'Inactivo'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.cardEmail, { color: theme.muted }]}>
                  {item.email}
                </Text>
                <Text style={[styles.cardRol, { color: theme.muted }]}>
                  {getRolLabel(item.rol)}
                </Text>
              </TouchableOpacity>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  onPress={() => router.push(`/usuarios/${item.id}`)}
                  style={styles.actionLink}
                >
                  <Text style={[styles.actionText, { color: theme.tint }]}>
                    Editar
                  </Text>
                </TouchableOpacity>
                {item.activo ? (
                  <TouchableOpacity
                    onPress={() => handleDesactivar(item)}
                    style={styles.actionLink}
                    accessibilityRole="button"
                  >
                    <Text style={[styles.actionText, { color: theme.error }]}>
                      Desactivar
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleReactivar(item)}
                    style={styles.actionLink}
                  >
                    <Text style={[styles.actionText, { color: theme.entregado }]}>
                      Reactivar
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.muted }]}>
                No se encontraron usuarios
              </Text>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  filtrosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  filtroButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
  },
  filtroText: { fontSize: FontSizes.xs, fontWeight: '600' },
  listContent: { padding: Spacing.lg, paddingTop: 0 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  cardNombre: { fontSize: FontSizes.md, fontWeight: '600', flex: 1 },
  estadoBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  estadoText: { fontSize: FontSizes.xs, fontWeight: '600' },
  cardEmail: { fontSize: FontSizes.sm, marginBottom: 2 },
  cardRol: { fontSize: FontSizes.xs },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  actionLink: { paddingVertical: Spacing.xs },
  actionText: { fontSize: FontSizes.sm, fontWeight: '600' },
  emptyContainer: { padding: Spacing.xxl, alignItems: 'center' },
  emptyText: { fontSize: FontSizes.md },
});
