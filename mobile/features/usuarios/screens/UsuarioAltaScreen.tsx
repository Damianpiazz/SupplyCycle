import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Button, Header, Input } from '@/components/ui';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useToast } from '@/hooks/useToast';
import { handleApiError } from '@/services/handleApiError';
import { useCrearUsuario } from '@/features/usuarios/hooks/useUsuarios';
import type { Rol } from '@/types';

export default function UsuarioAltaScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { showToast } = useToast();
  const crear = useCrearUsuario();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<Rol>('REPARTIDOR');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    try {
      await crear.mutateAsync({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        password,
        rol,
      });
      showToast('Usuario creado', 'success');
      router.back();
    } catch (e) {
      const parsed = handleApiError(e);
      setError(parsed.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="Nuevo usuario" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Input label="Nombre" value={nombre} onChangeText={setNombre} autoCapitalize="words" />
        <Input label="Apellido" value={apellido} onChangeText={setApellido} autoCapitalize="words" />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
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

        {error ? (
          <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
        ) : null}

        <Button
          title={crear.isPending ? 'Guardando...' : 'Crear usuario'}
          onPress={handleSubmit}
          disabled={crear.isPending}
          style={styles.submit}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg },
  rolLabel: { fontSize: FontSizes.sm, fontWeight: '600', marginBottom: Spacing.xs },
  rolRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  rolChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
  },
  error: { fontSize: FontSizes.sm, marginBottom: Spacing.md },
  submit: { marginTop: Spacing.md },
});
