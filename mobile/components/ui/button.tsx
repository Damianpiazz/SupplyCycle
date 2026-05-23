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

  const backgroundColor = {
    primary: theme.tint,
    secondary: theme.surface,
    danger: theme.error,
    ghost: 'transparent',
    success: theme.success,
    warning: theme.warning,
  }[variant];

  const textColor = variant === 'primary' || variant === 'danger' || variant === 'success'
    ? '#FFFFFF'
    : variant === 'ghost'
    ? theme.tint
    : theme.text;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled ? theme.muted : backgroundColor,
          borderWidth: variant === 'ghost' ? 0 : 1,
          borderColor: variant === 'secondary' ? theme.border : 'transparent',
        },
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      <Text style={[styles.text, { color: disabled ? '#FFFFFF' : textColor }]}>
        {loading ? 'Cargando...' : title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
