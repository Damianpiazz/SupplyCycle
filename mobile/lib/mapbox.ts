import Mapbox from '@rnmapbox/maps';

export function initMapbox() {
  const token = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!token) {
    console.warn(
      '[Mapbox] EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN no está configurado. El mapa no funcionará.'
    );
    return;
  }

  Mapbox.setAccessToken(token);
}
