import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/theme/useTheme'

interface Props {
  vehiculoId: string | null | undefined
}

export function InfoVehiculo({ vehiculoId }: Props) {
  const { theme } = useTheme()

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
      <Text style={[styles.cardTitulo, { color: theme.textSecondary }]}>Vehículo asignado</Text>
      {vehiculoId ? (
        <View style={styles.infoFila}>
          <Ionicons name="car-outline" size={18} color={theme.primary} />
          <Text style={[styles.infoTexto, { color: theme.textPrimary }]}>
            Vehículo registrado ✓
          </Text>
        </View>
      ) : (
        <View style={styles.infoFila}>
          <Ionicons name="warning-outline" size={18} color={theme.error} />
          <Text style={[styles.sinVehiculo, { color: theme.error }]}>
            Sin vehículo asignado — contacta a tu agencia
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 8 },
  cardTitulo: { fontSize: 12, fontWeight: '600' },
  infoFila: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoTexto: { fontSize: 15 },
  sinVehiculo: { fontSize: 14, flex: 1 },
})