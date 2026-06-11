import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSizes, FontFamily } from '@/constants/theme';
import { LucideIcon } from '@/components/ui/lucide-icon';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
}

export default function Header({ title = 'SupplyCycle', onBack }: HeaderProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { backgroundColor: theme.headerBackground, paddingTop: Spacing.xxl + insets.top }]}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={[styles.backButton, { backgroundColor: theme.headerText + '25' }]} activeOpacity={0.7}>
          <LucideIcon name="arrow-left" size={18} strokeWidth={2} color={theme.headerText} />
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
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 12,
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
  title: {
    fontSize: FontSizes.xl,
    fontFamily: FontFamily.interBold,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  titleWithBack: {
    marginHorizontal: 40,
  },
});
