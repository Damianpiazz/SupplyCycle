import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '@/components/ui';
import { LucideIcon } from '@/components/ui/lucide-icon';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatFechaLarga } from '@/utils/date';
import type { Cliente } from '@/types';

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

  const primaryColor = theme.tint;

  return (
    <Card>
      <Text style={[styles.nombre, { color: theme.text }]}>
        {cliente.nombre} {cliente.apellido}
      </Text>

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, { color: theme.muted }]}>Dirección</Text>
        <Text style={[styles.infoValue, { color: theme.text }]}>
          {cliente.domicilio.calle} {cliente.domicilio.numero}, {cliente.domicilio.localidad}
        </Text>
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: primaryColor }]}
          onPress={() => handleOpenMaps(cliente.domicilio.latitud, cliente.domicilio.longitud)}
          activeOpacity={0.7}
        >
          <LucideIcon name="map-pin" size={16} strokeWidth={1.5} color={primaryColor} />
          <Text style={[styles.actionButtonText, { color: primaryColor }]}>Abrir en mapas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, { color: theme.muted }]}>Contacto</Text>
        <Text style={[styles.infoValue, { color: theme.text }]}>
          {cliente.telefono}
        </Text>
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: primaryColor }]}
          onPress={() => handleCall(cliente.telefono)}
          activeOpacity={0.7}
        >
          <LucideIcon name="phone" size={16} strokeWidth={1.5} color={primaryColor} />
          <Text style={[styles.actionButtonText, { color: primaryColor }]}>Llamar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, { color: theme.muted }]}>Horario</Text>
        <Text style={[styles.infoValue, { color: theme.text }]}>
          {cliente.horarioDesde} - {cliente.horarioHasta}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, { color: theme.muted }]}>Fecha</Text>
        <Text style={[styles.infoValue, { color: theme.text }]}>{formatFechaLarga(fecha)}</Text>
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
    marginBottom: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    width: '100%',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
