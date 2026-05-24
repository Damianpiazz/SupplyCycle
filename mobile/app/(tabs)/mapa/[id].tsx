import { useLocalSearchParams } from 'expo-router';
import PedidoDetalleScreen from '@/features/pedidos/screens/PedidoDetalleScreen';

export default function MapaPedidoDetalleRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PedidoDetalleScreen id={id} />;
}
