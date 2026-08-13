import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Pedido } from '@/types';
import { haversineDistance } from '@/lib/haversine';
import { fetchRoute } from '@/features/mapa/services/directionsService';

const NUM_WAYPOINTS = 12;

export function useRouteLine(
  userLocation: [number, number] | null,
  pedidos: Pedido[] | undefined
) {
  const nearestPedidos = useMemo(() => {
    if (!userLocation || !pedidos) return [];

    const pendientes = pedidos
      .filter(
        (p) =>
          p.estado === 'PENDIENTE' &&
          p.domicilio.latitud &&
          p.domicilio.longitud
      )
      .map((p) => ({
        pedido: p,
        distance: haversineDistance(userLocation, [
          p.domicilio.longitud!,
          p.domicilio.latitud!,
        ]),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, NUM_WAYPOINTS)
      .map((item) => item.pedido);

    return pendientes;
  }, [userLocation, pedidos]);

  const nearestPedido = nearestPedidos[0] ?? null;

  const destinations = nearestPedidos.map(
    (p) => [p.domicilio.longitud!, p.domicilio.latitud!] as [number, number]
  );

  const { data: routeGeoJSON } = useQuery({
    queryKey: ['route-line', userLocation, destinations],
    queryFn: () => fetchRoute(userLocation!, destinations),
    enabled: !!userLocation && destinations.length > 0,
    staleTime: 10 * 60 * 1000,
  });

  return { nearestPedido, nearestPedidos, routeGeoJSON };
}
