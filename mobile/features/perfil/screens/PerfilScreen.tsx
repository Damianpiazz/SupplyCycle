import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Card, Button, Header, Input } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/authStore';
import { clearToken } from '@/features/auth/services/authStorage';
import { updateMeRequest } from '@/features/auth/services/authService';

export default function PerfilScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { usuario, logout, setUser } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const initialForm = useMemo(() => {
    if (!usuario) return { nombre: '', apellido: '', email: '' };
    return { nombre: usuario.nombre, apellido: usuario.apellido, email: usuario.email };
  }, [usuario]);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');

  const handleLogout = async () => {
    // 1. Actualizar store primero (el usuario queda deslogueado inmediatamente)
    logout();

    // 2. Limpiar token de SecureStore (con manejo de errores)
    try {
      await clearToken();
    } catch (e) {
      console.warn('Error al limpiar token:', e);
    }

    // 3. Redirigir al login (Zustand es síncrono, el auth gate en _layout.tsx también redirige)
    router.replace('/login');
  };

  const startEditing = () => {
    setSaveError(null);
    setNombre(initialForm.nombre);
    setApellido(initialForm.apellido);
    setEmail(initialForm.email);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setSaveError(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!usuario) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      const updated = await updateMeRequest({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
      });
      setUser(updated);
      setIsEditing(false);
    } catch (e: any) {
      const message =
        e?.response?.data?.message ||
        e?.message ||
        'No se pudo actualizar el perfil';
      setSaveError(String(message));
    } finally {
      setIsSaving(false);
    }
  };

  if (!usuario) {
    return (
      <ThemedView style={styles.container}>
        <Header />
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            No hay datos de usuario disponibles
          </Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header />
      <View style={styles.content}>
        {/* Avatar placeholder */}
        <View style={[styles.avatarContainer, { backgroundColor: theme.buttonPrimary }]}>
          <Text style={[styles.avatarText, { color: theme.headerText }]}>
            {usuario.nombre.charAt(0)}
            {usuario.apellido.charAt(0)}
          </Text>
        </View>

        <Card>
          {!isEditing ? (
            <>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.muted }]}>
                  Nombre
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {usuario.nombre} {usuario.apellido}
                </Text>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: theme.muted }]}>
                  Email
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {usuario.email}
                </Text>
              </View>
            </>
          ) : (
            <>
              <Input
                label="Nombre"
                value={nombre}
                onChangeText={setNombre}
                autoCapitalize="words"
                testID="perfil-input-nombre"
              />
              <Input
                label="Apellido"
                value={apellido}
                onChangeText={setApellido}
                autoCapitalize="words"
                testID="perfil-input-apellido"
              />
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                testID="perfil-input-email"
              />
              {saveError ? (
                <Text style={[styles.saveError, { color: theme.error }]}>
                  {saveError}
                </Text>
              ) : null}
            </>
          )}

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.muted }]}>
              Rol
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {usuario.rol === 'ADMIN' ? 'Administrador' : 'Repartidor'}
            </Text>
          </View>
        </Card>

        {!isEditing ? (
          <Button
            title="Modificar perfil"
            onPress={startEditing}
            style={styles.editButton}
          />
        ) : (
          <View style={styles.editActions}>
            <Button
              title={isSaving ? 'Guardando...' : 'Guardar'}
              onPress={handleSave}
              disabled={isSaving}
              style={styles.editActionButton}
            />
            <Button
              title="Cancelar"
              variant="secondary"
              onPress={cancelEditing}
              disabled={isSaving}
              style={styles.editActionButton}
            />
          </View>
        )}

        <Button
          title="Cerrar sesión"
          variant="danger"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.lg,
  },
  avatarText: {
    fontSize: FontSizes.title,
    fontWeight: 'bold',
  },
  infoRow: {
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FontSizes.md,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.xs,
  },
  editButton: {
    marginTop: Spacing.lg,
    width: '100%',
  },
  editActions: {
    marginTop: Spacing.lg,
    width: '100%',
    gap: Spacing.sm,
  },
  editActionButton: {
    width: '100%',
  },
  saveError: {
    marginTop: Spacing.xs,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: Spacing.xxl,
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSizes.md,
  },
});
