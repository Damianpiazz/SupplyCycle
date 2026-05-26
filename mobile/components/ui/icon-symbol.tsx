import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'shippingbox.fill': 'local-shipping',
  'clipboard.fill': 'list-alt',
  'map.fill': 'map',
  'person.fill': 'person',
  'person.2.fill': 'people',
  'phone.fill': 'phone',
  'location.fill': 'location-on',
  'xmark': 'close',
  'checkmark': 'check',
  'arrow.clockwise': 'refresh',
  'magnifyingglass': 'search',
  'plus': 'add',
  'trash': 'delete',
  'ellipsis': 'more-horiz',
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
