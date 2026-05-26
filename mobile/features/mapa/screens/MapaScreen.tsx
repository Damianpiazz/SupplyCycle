import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import Mapbox, { MapView, Camera, UserLocation } from '@rnmapbox/maps';
import { ThemedView } from '@/components/themed-view';
import { LoadingSpinner, ErrorMessage, Header } from '@/components/ui';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '');

const BUENOS_AIRES_COORDS: [number, number] = [-58.3816, -34.6037];

export default function MapaScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'loading' | 'denied' | 'granted'>('loading');

  useEffect(() => {
    if (Platform.OS === 'web') {
      setPermissionStatus('denied');
      return;
    }

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionStatus('denied');
        return;
      }
      setPermissionStatus('granted');
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  // --- WEB fallback ---
  if (Platform.OS === 'web') {
    return (
      <ThemedView style={styles.container}>
        <Header />
        <View style={styles.center}>
          <ErrorMessage message="El mapa no está disponible en la versión web." />
        </View>
      </ThemedView>
    );
  }

  // --- Loading ---
  if (permissionStatus === 'loading' || (permissionStatus === 'granted' && !location)) {
    return (
      <ThemedView style={styles.container}>
        <Header />
        <LoadingSpinner message="Obteniendo ubicación..." />
      </ThemedView>
    );
  }

  // --- Permission denied ---
  if (permissionStatus === 'denied') {
    const fallbackCoords = BUENOS_AIRES_COORDS;
    return (
      <ThemedView style={styles.container}>
        <Header />
        <View style={styles.mapWrapper}>
          <MapView style={styles.map}>
            <Camera
              defaultSettings={{
                centerCoordinate: fallbackCoords,
                zoomLevel: 10,
              }}
            />
          </MapView>
        </View>
      </ThemedView>
    );
  }

  // --- Map with GPS ---
  const coords: [number, number] = location
    ? [location.longitude, location.latitude]
    : BUENOS_AIRES_COORDS;

  return (
    <ThemedView style={styles.container}>
      <Header />
      <View style={styles.mapWrapper}>
        <MapView style={styles.map}>
          <Camera
            defaultSettings={{
              centerCoordinate: coords,
              zoomLevel: 14,
            }}
          />
          <UserLocation visible={true} showsUserHeadingIndicator={true} />
        </MapView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapWrapper: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
