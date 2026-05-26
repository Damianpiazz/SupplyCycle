import { StyleSheet, Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius, Spacing, FontSizes } from '@/constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'warning';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
}

export default function Button({
  title,
  variant = 'primary',
  loading = false,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const variantColors: Record<ButtonVariant, string> = {
    primary: theme.buttonPrimary,
    secondary: theme.surface,
    danger: theme.noEntregado,
    ghost: 'transparent',
    success: theme.entregado,
    warning: theme.warning,
  };

  const isGhost = variant === 'ghost';
  const backgroundColor = disabled
    ? theme.muted
    : isGhost
      ? 'transparent'
      : variantColors[variant];
  const textColor = disabled
    ? '#FFFFFF'
    : isGhost
      ? theme.text
      : '#FFFFFF';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor },
        isGhost && { borderWidth: 1, borderColor: theme.border },
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      <Text style={[styles.text, { color: textColor }]}>
        {loading ? 'Cargando...' : title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  text: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
});
