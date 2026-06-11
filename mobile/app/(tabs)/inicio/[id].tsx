import { useLocalSearchParams, router } from 'expo-router';
import PedidoDetalleScreen from '@/features/pedidos/screens/PedidoDetalleScreen';

export default function InicioPedidoDetalleRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <PedidoDetalleScreen
      id={id}
      onBack={() => router.back()}
    />
  );
}
