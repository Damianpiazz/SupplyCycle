/**
 * Componente de iconos Lucide con SVG paths embebidos.
 * Carga solo los iconos que usamos, evitando problemas de resolución
 * de módulos del paquete lucide-react-native en Metro/Windows.
 *
 * Ver: https://lucide.dev
 */
import React from 'react';
import Svg, { Circle, Path, Rect, type SvgProps } from 'react-native-svg';

type IconName = 'house' | 'users' | 'truck' | 'clipboard-list' | 'map' | 'user-cog' | 'circle-user' | 'map-pin' | 'phone' | 'arrow-left' | 'bar-chart-3' | 'package' | 'check-circle' | 'x-circle' | 'calendar';

interface LucideIconProps extends SvgProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

/**
 * Cada icono se define como un array de elementos SVG.
 * Formato: [ [tipo, props], ... ]
 */
type SvgElement =
  | ['path', { d: string; key: string }]
  | ['circle', { cx: string; cy: string; r: string; key: string }]
  | ['rect', { x: string; y: string; width: string; height: string; rx?: string; ry?: string; key: string }];

const ICON_DATA: Record<IconName, SvgElement[]> = {
  house: [
    ['path', { d: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8', key: '5wwlr5' }],
    ['path', { d: 'M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', key: 'r6nss1' }],
  ],
  users: [
    ['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', key: '1yyitq' }],
    ['path', { d: 'M16 3.128a4 4 0 0 1 0 7.744', key: '16gr8j' }],
    ['path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87', key: 'kshegd' }],
    ['circle', { cx: '9', cy: '7', r: '4', key: 'nufk8' }],
  ],
  truck: [
    ['path', { d: 'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2', key: 'wrbu53' }],
    ['path', { d: 'M15 18H9', key: '1lyqi6' }],
    ['path', { d: 'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14', key: 'lysw3i' }],
    ['circle', { cx: '17', cy: '18', r: '2', key: '332jqn' }],
    ['circle', { cx: '7', cy: '18', r: '2', key: '19iecd' }],
  ],
  'clipboard-list': [
    ['rect', { x: '8', y: '2', width: '8', height: '4', rx: '1', ry: '1', key: 'tgr4d6' }],
    ['path', { d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2', key: '116196' }],
    ['path', { d: 'M12 11h4', key: '1jrz19' }],
    ['path', { d: 'M12 16h4', key: 'n85exb' }],
    ['path', { d: 'M8 11h.01', key: '1dfujw' }],
    ['path', { d: 'M8 16h.01', key: '18s6g9' }],
  ],
  map: [
    ['path', { d: 'M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z', key: '169xi5' }],
    ['path', { d: 'M15 5.764v15', key: '1pn4in' }],
    ['path', { d: 'M9 3.236v15', key: '1uimfh' }],
  ],
  'user-cog': [
    ['path', { d: 'M10 15H6a4 4 0 0 0-4 4v2', key: '1nfge6' }],
    ['path', { d: 'm14.305 16.53.923-.382', key: '1itpsq' }],
    ['path', { d: 'm15.228 13.852-.923-.383', key: 'eplpkm' }],
    ['path', { d: 'm16.852 12.228-.383-.923', key: '13v3q0' }],
    ['path', { d: 'm16.852 17.772-.383.924', key: '1i8mnm' }],
    ['path', { d: 'm19.148 12.228.383-.923', key: '1q8j1v' }],
    ['path', { d: 'm19.53 18.696-.382-.924', key: 'vk1qj3' }],
    ['path', { d: 'm20.772 13.852.924-.383', key: 'n880s0' }],
    ['path', { d: 'm20.772 16.148.924.383', key: '1g6xey' }],
    ['circle', { cx: '18', cy: '15', r: '3', key: 'gjjjvw' }],
    ['circle', { cx: '9', cy: '7', r: '4', key: 'nufk8' }],
  ],
  'circle-user': [
    ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
    ['circle', { cx: '12', cy: '10', r: '3', key: 'ilqhr7' }],
    ['path', { d: 'M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662', key: '154egf' }],
  ],
  'map-pin': [
    ['path', { d: 'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0', key: '1r0f0z' }],
    ['circle', { cx: '12', cy: '10', r: '3', key: 'ilqhr7' }],
  ],
  phone: [
    ['path', { d: 'M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384', key: '9njp5v' }],
  ],
  'arrow-left': [
    ['path', { d: 'm12 19-7-7 7-7', key: '1l729n' }],
    ['path', { d: 'M19 12H5', key: 'x3x0zl' }],
  ],
  'bar-chart-3': [
    ['path', { d: 'M3 3v18h18', key: 'bar-base' }],
    ['path', { d: 'M18 17V9', key: 'bar-1' }],
    ['path', { d: 'M13 17V5', key: 'bar-2' }],
    ['path', { d: 'M8 17v-3', key: 'bar-3' }],
  ],
  'package': [
    ['path', { d: 'M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z', key: 'pkg-1' }],
    ['path', { d: 'M12 22V12', key: 'pkg-2' }],
    ['path', { d: 'm3.3 7 8.7 5 8.7-5', key: 'pkg-3' }],
    ['path', { d: 'M7.5 9.5 3 7', key: 'pkg-4' }],
  ],
  'check-circle': [
    ['path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14', key: 'cc-1' }],
    ['path', { d: 'm9 11 3 3L22 4', key: 'cc-2' }],
  ],
  'x-circle': [
    ['path', { d: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z', key: 'xc-1' }],
    ['path', { d: 'm15 9-6 6', key: 'xc-2' }],
    ['path', { d: 'm9 9 6 6', key: 'xc-3' }],
  ],
  'calendar': [
    ['path', { d: 'M8 2v4', key: 'cal-1' }],
    ['path', { d: 'M16 2v4', key: 'cal-2' }],
    ['rect', { x: '3', y: '4', width: '18', height: '18', rx: '2', key: 'cal-3' }],
    ['path', { d: 'M3 10h18', key: 'cal-4' }],
  ],
};

function renderElements(elements: SvgElement[], strokeWidth: number, color: string) {
  return elements.map(([type, props]) => {
    const { key, ...svgProps } = props;
    switch (type) {
      case 'path':
        return <Path key={key} {...svgProps} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
      case 'circle':
        return <Circle key={key} {...svgProps} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
      case 'rect':
        return <Rect key={key} {...svgProps} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
      default:
        return null;
    }
  });
}

export function LucideIcon({
  name,
  size = 24,
  strokeWidth = 1.5,
  color = '#000000',
  ...svgProps
}: LucideIconProps) {
  const elements = ICON_DATA[name];
  if (!elements) return null;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...svgProps}
    >
      {renderElements(elements, strokeWidth, color)}
    </Svg>
  );
}
