import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Card, Button, Header } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/authStore';
import { clearToken } from '@/features/auth/services/authStorage';

export default function PerfilScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { usuario, logout } = useAuthStore();

  const handleLogout = async () => {
    // 1. Actualizar store primero (el usuario queda deslogueado inmediatamente)
    logout();

    // 2. Limpiar token de SecureStore (con manejo de errores)
    try {
      await clearToken();
    } catch (e) {
      console.warn('Error al limpiar token:', e);
    }

    // 3. Redirigir al login
    // Usamos setTimeout por si React no ha procesado aún el cambio de estado
    setTimeout(() => {
      router.replace('/login');
    }, 0);
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
        <View style={[styles.avatarContainer, { backgroundColor: theme.tint }]}>
          <Text style={styles.avatarText}>
            {usuario.nombre.charAt(0)}
            {usuario.apellido.charAt(0)}
          </Text>
        </View>

        <Card>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.muted }]}>
              Nombre
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {usuario.nombre} {usuario.apellido}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.muted }]}>
              Email
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {usuario.email}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.muted }]}>
              Rol
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              Repartidor
            </Text>
          </View>
        </Card>

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
    color: '#FFFFFF',
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
    backgroundColor: '#E2E8F0',
    marginVertical: Spacing.xs,
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
