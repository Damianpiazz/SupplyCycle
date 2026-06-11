import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { LucideIcon } from '@/components/ui/lucide-icon';

import { HapticTab } from '@/components/haptic-tab';
import { ConnectivityBanner } from '@/components/ui';
import { Colors, FontFamily, FontSizes } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/authStore';
import useNetworkStatus from '@/hooks/useNetworkStatus';

const TAB_ICON_SIZE = 22;
const TAB_ICON_STROKE = 1.5;
const INACTIVE_COLOR = '#9E9E9E';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.usuario?.rol === 'ADMIN');
  const { isConnected } = useNetworkStatus();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <>
      <ConnectivityBanner isConnected={isConnected} />
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].card,
          borderTopColor: Colors[colorScheme].border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          href: isAdmin ? null : undefined,
          tabBarIcon: ({ color }) => (
            <LucideIcon name="house" size={TAB_ICON_SIZE} strokeWidth={TAB_ICON_STROKE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="clientes"
        options={{
          title: 'Clientes',
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color }) => (
            <LucideIcon name="users" size={TAB_ICON_SIZE} strokeWidth={TAB_ICON_STROKE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="repartos"
        options={{
          title: 'Repartos',
          tabBarIcon: ({ color }) => (
            <LucideIcon name="truck" size={TAB_ICON_SIZE} strokeWidth={TAB_ICON_STROKE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color }) => (
            <LucideIcon name="clipboard-list" size={TAB_ICON_SIZE} strokeWidth={TAB_ICON_STROKE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inicio"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          href: isAdmin ? null : undefined,
          tabBarIcon: ({ color }) => (
            <LucideIcon name="map" size={TAB_ICON_SIZE} strokeWidth={TAB_ICON_STROKE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="usuarios"
        options={{
          title: 'Usuarios',
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color }) => (
            <LucideIcon name="user-cog" size={TAB_ICON_SIZE} strokeWidth={TAB_ICON_STROKE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <LucideIcon name="circle-user" size={TAB_ICON_SIZE} strokeWidth={TAB_ICON_STROKE} color={color} />
          ),
        }}
      />
    </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: FontSizes.tabLabel,
    fontWeight: '500',
    fontFamily: FontFamily.interMedium,
  },
});
