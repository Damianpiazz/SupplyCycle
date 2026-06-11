import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, FontFamily } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? { ...styles.link, color: Colors[colorScheme].tint, fontFamily: FontFamily.interSemiBold } : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FontFamily.inter,
    letterSpacing: 0.16,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FontFamily.interSemiBold,
    fontWeight: '600',
    letterSpacing: 0.16,
  },
  title: {
    fontSize: 32,
    fontFamily: FontFamily.interBold,
    fontWeight: 'bold',
    lineHeight: 40,
    letterSpacing: 0.32,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: FontFamily.interBold,
    fontWeight: 'bold',
    lineHeight: 30,
    letterSpacing: 0.2,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    letterSpacing: 0.16,
  },
});
