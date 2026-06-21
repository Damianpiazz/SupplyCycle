import type { LineString } from 'geojson';

const MAX_WAYPOINTS = 24;

export async function fetchRoute(
  origin: [number, number],
  destinations: [number, number][]
): Promise<LineString | null> {
  const token = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) return null;

  const coordsStr = [origin, ...destinations.slice(0, MAX_WAYPOINTS)]
    .map((c) => `${c[0]},${c[1]}`)
    .join(';');

  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsStr}` +
    `?geometries=geojson&overview=full&access_token=${token}`;

  try {
    const res = await fetch(url);
    const data = await res.json() as { routes?: Array<{ geometry: LineString }> };
    return data.routes?.[0]?.geometry ?? null;
  } catch {
    return null;
  }
}
