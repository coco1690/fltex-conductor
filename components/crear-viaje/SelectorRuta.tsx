import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/theme/useTheme'

interface Ruta {
  id: string
  nombre: string
  precio_pasaje: number
  agencia_origen_id: string
  agencia_destino_id: string
}

interface Props {
  rutas: Ruta[]
  rutaId: string | null
  onSelect: (id: string) => void
}

export function SelectorRuta({ rutas, rutaId, onSelect }: Props) {
  const { theme } = useTheme()

  const pares = rutas.reduce((acc, ruta) => {
    const inversa = rutas.find(
      r => r.agencia_origen_id === ruta.agencia_destino_id &&
           r.agencia_destino_id === ruta.agencia_origen_id
    )
    const key = [ruta.id, inversa?.id].sort().join('-')
    if (!acc.find(p => p.key === key)) {
      acc.push({ key, ruta, inversa: inversa ?? null })
    }
    return acc
  }, [] as { key: string; ruta: Ruta; inversa: Ruta | null }[])

  if (rutas.length === 0) {
    return <ActivityIndicator color={theme.primary} />
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.textPrimary }]}>Ruta</Text>
      {pares.map(({ key, ruta, inversa }) => (
        <ParRuta
          key={key}
          ruta={ruta}
          inversa={inversa}
          rutaId={rutaId}
          onSelect={onSelect}
        />
      ))}
    </View>
  )
}

function ParRuta({ ruta, inversa, rutaId, onSelect }: {
  ruta: Ruta
  inversa: Ruta | null
  rutaId: string | null
  onSelect: (id: string) => void
}) {
  const { theme } = useTheme()
  const [invertido, setInvertido] = useState(false)

  const rutaActual = invertido && inversa ? inversa : ruta
  const partes = rutaActual.nombre.split('→').map(s => s.trim())
  const origen = partes[0] ?? rutaActual.nombre
  const destino = partes[1] ?? ''
  const seleccionada = rutaId === rutaActual.id

  const handleInvertir = () => {
    if (!inversa) return
    const nuevaRuta = invertido ? ruta : inversa
    setInvertido(v => !v)
    if (seleccionada) onSelect(nuevaRuta.id)
  }

  return (
    <TouchableOpacity
      onPress={() => onSelect(rutaActual.id)}
      activeOpacity={0.8}
      style={[
        styles.wrapper,
        { borderColor: seleccionada ? theme.primary : theme.border }
      ]}
    >
      <View style={styles.fila}>
        {/* Origen */}
        <View style={[
          styles.lugarcContainer,
          { backgroundColor: seleccionada ? theme.primary : theme.backgroundCard }
        ]}>
          <Ionicons
            name="radio-button-on-outline"
            size={18}
            color={seleccionada ? '#FFFFFF' : theme.primary}
          />
          <Text
            style={[styles.lugarTexto, { color: seleccionada ? '#FFFFFF' : theme.textPrimary }]}
            numberOfLines={2}
          >
            {origen}
          </Text>
        </View>

        {/* Botón intercambiar */}
        <TouchableOpacity
          style={[styles.botonInvertir, { backgroundColor: theme.primaryLight }]}
          onPress={handleInvertir}
          disabled={!inversa}
        >
          <Ionicons name="swap-horizontal-outline" size={20} color={theme.primary} />
        </TouchableOpacity>

        {/* Destino */}
        <View style={[
          styles.lugarcContainer,
          { backgroundColor: seleccionada ? theme.primary : theme.backgroundCard }
        ]}>
          <Ionicons
            name="location-outline"
            size={18}
            color={seleccionada ? '#FFFFFF' : theme.error}
          />
          <Text
            style={[styles.lugarTexto, { color: seleccionada ? '#FFFFFF' : theme.textPrimary }]}
            numberOfLines={2}
          >
            {destino}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  label: { fontSize: 15, fontWeight: '600' },
  wrapper: { borderRadius: 14,  overflow: 'hidden' },
  fila: { flexDirection: 'row', alignItems: 'center' },
  lugarcContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
  },
  lugarTexto: { fontSize: 13, fontWeight: '700', flex: 1 },
  botonInvertir: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
})