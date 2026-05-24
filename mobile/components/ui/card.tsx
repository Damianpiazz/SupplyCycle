import type { PropsWithChildren } from 'react';
import { StyleSheet, TouchableOpacity, type ViewProps } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface CardProps extends PropsWithChildren<ViewProps> {
  onPress?: () => void;
}

export default function Card({ children, onPress, style, ...rest }: CardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const content = (
    <ThemedView
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </ThemedView>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
});
