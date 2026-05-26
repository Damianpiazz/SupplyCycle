import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '@/components/ui';
import { Colors, Spacing, FontSizes } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Cliente } from '@/types';

function formatFecha(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface InfoClienteProps {
  cliente: Cliente;
  fecha: string;
}

export default function InfoCliente({ cliente, fecha }: InfoClienteProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const handleCall = (phone: string) => {
    const url = Platform.OS === 'android' ? `tel:${phone}` : `telprompt:${phone}`;
    Linking.openURL(url);
  };

  const handleOpenMaps = (lat: number, lng: number) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}`,
      default: `https://www.google.com/maps?q=${lat},${lng}`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <Card>
      <Text style={[styles.nombre, { color: theme.text }]}>
        {cliente.nombre} {cliente.apellido}
      </Text>

      <TouchableOpacity
        style={styles.infoRow}
        onPress={() => handleOpenMaps(cliente.domicilio.latitud, cliente.domicilio.longitud)}
      >
        <Text style={[styles.infoLabel, { color: theme.muted }]}>Dirección</Text>
        <Text style={[styles.infoValue, { color: theme.info }]}>
          {cliente.domicilio.calle} {cliente.domicilio.numero}, {cliente.domicilio.localidad}
          {'\n'}Tocar para abrir en mapas
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.infoRow}
        onPress={() => handleCall(cliente.telefono)}
      >
        <Text style={[styles.infoLabel, { color: theme.muted }]}>Contacto</Text>
        <Text style={[styles.infoValue, { color: theme.info }]}>
          {cliente.telefono}
          {'\n'}Tocar para llamar
        </Text>
      </TouchableOpacity>

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, { color: theme.muted }]}>Horario</Text>
        <Text style={[styles.infoValue, { color: theme.text }]}>
          {cliente.horarioDesde} - {cliente.horarioHasta}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, { color: theme.muted }]}>Fecha</Text>
        <Text style={[styles.infoValue, { color: theme.text }]}>{formatFecha(fecha)}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  nombre: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.lg,
  },
  infoRow: {
    marginBottom: Spacing.md,
  },
  infoLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FontSizes.md,
  },
});
