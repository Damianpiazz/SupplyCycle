import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing, FontSizes } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
}

export default function Header({ title = 'SupplyCycle', onBack }: HeaderProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Text style={[styles.backIcon, { color: theme.headerText }]}>{'<'}</Text>
        </TouchableOpacity>
      )}
      <Text
        style={[
          styles.title,
          { color: theme.headerText },
          onBack && styles.titleWithBack,
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  backButton: {
    position: 'absolute',
    left: Spacing.lg,
    bottom: Spacing.lg,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 22,
    fontWeight: '700',
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  titleWithBack: {
    marginHorizontal: 40,
  },
});
