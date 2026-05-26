import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Button, Header, Input, LoadingSpinner, ErrorMessage } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useToast } from '@/hooks/useToast';
import { handleApiError } from '@/services/handleApiError';
import { useAuthStore } from '@/stores/authStore';
import { confirmAction } from '@/utils/confirmAction';
import {
  useUsuario,
  useActualizarUsuario,
  useDesactivarUsuario,
  useReactivarUsuario,
} from '@/features/usuarios/hooks/useUsuarios';
import type { Rol } from '@/types';

export default function UsuarioEditarScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { showToast } = useToast();
  const currentUserId = useAuthStore((state) => state.usuario?.id);

  const { data: usuario, isLoading, isError, error } = useUsuario(id ?? '');
  const actualizar = useActualizarUsuario();
  const desactivar = useDesactivarUsuario();
  const reactivar = useReactivarUsuario();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState<Rol>('REPARTIDOR');
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (id && currentUserId && id === currentUserId) {
      router.replace('/usuarios');
    }
  }, [id, currentUserId]);

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre);
      setApellido(usuario.apellido);
      setEmail(usuario.email);
      setRol(usuario.rol);
    }
  }, [usuario]);

  const handleSave = async () => {
    if (!id) return;
    setSaveError(null);
    try {
      await actualizar.mutateAsync({
        id,
        input: {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          email: email.trim(),
          rol,
        },
      });
      showToast('Usuario actualizado', 'success');
      router.back();
    } catch (e) {
      const parsed = handleApiError(e);
      setSaveError(parsed.message);
    }
  };

  const handleDesactivar = () => {
    if (!usuario || !id) return;
    confirmAction(
      'Desactivar usuario',
      `¿Desactivar a ${usuario.nombre} ${usuario.apellido}?`,
      'Desactivar',
      async () => {
        try {
          await desactivar.mutateAsync(id);
          showToast('Usuario desactivado', 'success');
          router.replace('/usuarios');
        } catch (e) {
          const parsed = handleApiError(e);
          showToast(parsed.message, 'error');
        }
      },
      { destructive: true }
    );
  };

  const handleReactivar = () => {
    if (!usuario || !id) return;
    confirmAction(
      'Reactivar usuario',
      `¿Reactivar a ${usuario.nombre} ${usuario.apellido}? Podrá volver a iniciar sesión.`,
      'Reactivar',
      async () => {
        try {
          await reactivar.mutateAsync(id);
          showToast('Usuario reactivado', 'success');
          router.replace('/usuarios');
        } catch (e) {
          const parsed = handleApiError(e);
          showToast(parsed.message, 'error');
        }
      }
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Header title="Editar usuario" onBack={() => router.back()} />
        <LoadingSpinner message="Cargando usuario..." />
      </ThemedView>
    );
  }

  if (isError || !usuario) {
    return (
      <ThemedView style={styles.container}>
        <Header title="Editar usuario" onBack={() => router.back()} />
        <ErrorMessage message={error?.message || 'Usuario no encontrado'} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header title="Editar usuario" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        {!usuario.activo ? (
          <View style={[styles.inactiveBanner, { backgroundColor: theme.muted + '30' }]}>
            <Text style={[styles.inactiveText, { color: theme.muted }]}>
              Usuario inactivo (no puede iniciar sesión)
            </Text>
          </View>
        ) : null}

        <Input label="Nombre" value={nombre} onChangeText={setNombre} autoCapitalize="words" />
        <Input label="Apellido" value={apellido} onChangeText={setApellido} autoCapitalize="words" />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={[styles.rolLabel, { color: theme.text }]}>Rol</Text>
        <View style={styles.rolRow}>
          {(['REPARTIDOR', 'ADMIN'] as Rol[]).map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.rolChip,
                { backgroundColor: rol === r ? theme.buttonPrimary : theme.surface },
              ]}
              onPress={() => setRol(r)}
            >
              <Text style={{ color: rol === r ? '#FFFFFF' : theme.text, fontWeight: '600' }}>
                {r === 'ADMIN' ? 'Administrador' : 'Repartidor'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {saveError ? (
          <Text style={[styles.error, { color: theme.error }]}>{saveError}</Text>
        ) : null}

        <Button
          title={actualizar.isPending ? 'Guardando...' : 'Guardar cambios'}
          onPress={handleSave}
          disabled={actualizar.isPending}
          style={styles.submit}
        />

        {usuario.activo ? (
          <Button
            title="Desactivar usuario"
            variant="danger"
            onPress={handleDesactivar}
            disabled={desactivar.isPending}
            style={styles.deactivate}
          />
        ) : (
          <Button
            title={reactivar.isPending ? 'Reactivando...' : 'Reactivar usuario'}
            onPress={handleReactivar}
            disabled={reactivar.isPending}
            style={styles.deactivate}
          />
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg },
  inactiveBanner: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  inactiveText: { fontSize: FontSizes.sm, fontWeight: '600' },
  rolLabel: { fontSize: FontSizes.sm, fontWeight: '600', marginBottom: Spacing.xs },
  rolRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  rolChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
  },
  error: { fontSize: FontSizes.sm, marginBottom: Spacing.md },
  submit: { marginTop: Spacing.md },
  deactivate: { marginTop: Spacing.lg },
});
