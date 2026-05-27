import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Input, Button, Header } from '@/components/ui';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, FontSizes } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLogin } from '@/features/auth/hooks/useLogin';

export default function LoginScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const loginMutation = useLogin();

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El email no tiene un formato válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
    loginMutation.mutate({ email: email.trim(), password });
  };

  const serverError =
    loginMutation.error && typeof loginMutation.error === 'object'
      ? (() => {
          const err = loginMutation.error as { response?: { data?: { error?: { message?: string } } }; code?: string; message?: string };
          // Mensaje del backend (ej: "Credenciales inválidas")
          if (err?.response?.data?.error?.message) {
            return err.response.data.error.message;
          }
          // Error de red (backend caído)
          if (err?.code === 'ERR_NETWORK' || !err?.response) {
            return 'No se pudo conectar con el servidor';
          }
          // Otro error
          return err?.message || 'Error al iniciar sesión';
        })()
      : null;

  return (
    <ThemedView style={styles.container}>
      <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.formContainer}>
          <Text style={[styles.welcome, { color: theme.text }]}>Iniciar sesión</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            Ingresá tus credenciales para acceder
          </Text>

          {serverError && (
            <View style={[styles.serverError, { backgroundColor: theme.error + '15' }]}>
              <Text style={[styles.serverErrorText, { color: theme.error }]}>
                {serverError}
              </Text>
            </View>
          )}

          <Input
            label="Email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
          />

          <Input
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            secureTextEntry
            error={errors.password}
          />

          <Button
            title="Ingresar"
            onPress={handleLogin}
            loading={loginMutation.isPending}
            disabled={loginMutation.isPending}
          />
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  welcome: {
    fontSize: FontSizes.title,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    marginBottom: Spacing.xxl,
  },
  serverError: {
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
  },
  serverErrorText: {
    fontSize: FontSizes.sm,
    textAlign: 'center',
    fontWeight: '500',
  },
});
