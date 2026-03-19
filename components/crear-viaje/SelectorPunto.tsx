import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/theme/useTheme'

interface Punto {
  id: string
  nombre: string
  descripcion: string | null
}

interface Props {
  puntos: Punto[]
  puntoId: string | null
  onSelect: (id: string) => void
}

export function SelectorPunto({ puntos, puntoId, onSelect }: Props) {
  const { theme } = useTheme()

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.textPrimary }]}>Punto de abordaje</Text>

      {puntos.length === 0 ? (
        <ActivityIndicator color={theme.primary} />
      ) : (
        puntos.map((punto) => (
          <TouchableOpacity
            key={punto.id}
            style={[
              styles.opcionCard,
              {
                backgroundColor: puntoId === punto.id ? theme.primary : theme.backgroundCard,
                borderColor: puntoId === punto.id ? theme.primary : theme.border,
              }
            ]}
            onPress={() => onSelect(punto.id)}
          >
            <Ionicons
              name="location-outline"
              size={16}
              color={puntoId === punto.id ? '#FFFFFF' : theme.primary}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.opcionNombre, { color: puntoId === punto.id ? '#FFFFFF' : theme.textPrimary }]}>
                {punto.nombre}
              </Text>
              {punto.descripcion && (
                <Text style={[styles.opcionDetalle, { color: puntoId === punto.id ? '#BFDBFE' : theme.textSecondary }]}>
                  {punto.descripcion}
                </Text>
              )}
            </View>
            {puntoId === punto.id && (
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        ))
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  label: { fontSize: 15, fontWeight: '600' },
  opcionCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12, borderWidth: 1 },
  opcionNombre: { fontSize: 14, fontWeight: '600' },
  opcionDetalle: { fontSize: 12, marginTop: 2 },
})