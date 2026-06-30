import type { LineString } from 'geojson';

const MAX_WAYPOINTS = 24;

/**
 * Fetch de ruta usando OSRM (Open Source Routing Machine) demo server.
 * Devuelve un GeoJSON LineString con la ruta optimizada entre origin y destinations.
 *
 * En producción, reemplazar por un servidor OSRM propio o GraphHopper.
 */
export async function fetchRoute(
  origin: [number, number],
  destinations: [number, number][]
): Promise<LineString | null> {
  const coordsStr = [origin, ...destinations.slice(0, MAX_WAYPOINTS)]
    .map((c) => `${c[0]},${c[1]}`)
    .join(';');

  const url =
    `https://router.project-osrm.org/route/v1/driving/${coordsStr}` +
    `?geometries=geojson&overview=full`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      code?: string;
      routes?: Array<{ geometry: LineString }>;
    };
    if (data.code !== 'Ok' || !data.routes?.length) return null;
    return data.routes[0]!.geometry;
  } catch {
    return null;
  }
}
