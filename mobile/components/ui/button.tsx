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
  loading = false,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const backgroundColor = disabled ? theme.muted : theme.surface;
  const textColor = disabled ? '#FFFFFF' : theme.text;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor },
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
