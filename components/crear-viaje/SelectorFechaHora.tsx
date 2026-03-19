import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useTheme } from '../../src/theme/useTheme'

const FRANJAS = [
  {
    label: 'Madrugada',
    icon: '🌙',
    horas: ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30']
  },
  {
    label: 'Mañana',
    icon: '🌅',
    horas: ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30']
  },
  {
    label: 'Tarde',
    icon: '☀️',
    horas: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']
  },
  {
    label: 'Noche',
    icon: '🌆',
    horas: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30']
  },
]

interface Props {
  fecha: number
  hora: string | null
  onFecha: (index: number) => void
  onHora: (hora: string) => void
}

export function SelectorFechaHora({ fecha, hora, onFecha, onHora }: Props) {
  const { theme } = useTheme()
  const [franjaActiva, setFranjaActiva] = useState(1)

  // Verifica si una hora ya pasó — solo aplica cuando fecha === 0 (Hoy)
  const horaYaPaso = (h: string): boolean => {
    if (fecha !== 0) return false
    const ahora = new Date()
    const [horaStr, minStr] = h.split(':')
    const horaViaje = new Date()
    horaViaje.setHours(Number(horaStr), Number(minStr), 0, 0)
    return horaViaje <= ahora
  }

  // Verifica si toda la franja ya pasó — para atenuar el botón de franja
  const franjaYaPaso = (franja: typeof FRANJAS[0]): boolean => {
    if (fecha !== 0) return false
    return franja.horas.every(h => horaYaPaso(h))
  }

  // Cuando cambian a "Hoy", si la franja activa ya pasó, saltar a la siguiente disponible
  const handleFecha = (index: number) => {
    onFecha(index)
    if (index === 0) {
      const primeraDisponible = FRANJAS.findIndex(f => !f.horas.every(h => horaYaPaso(h)))
      if (primeraDisponible !== -1) setFranjaActiva(primeraDisponible)
    }
  }

  return (
    <View style={styles.container}>
      {/* Fecha */}
      <Text style={[styles.label, { color: theme.textPrimary }]}>Fecha de salida</Text>
      <View style={styles.fechaRow}>
        {['Hoy', 'Mañana'].map((label, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.fechaBtn,
              {
                backgroundColor: fecha === index ? theme.primary : theme.backgroundCard,
                borderColor: fecha === index ? theme.primary : theme.border,
              }
            ]}
            onPress={() => handleFecha(index)}
          >
            <Text style={[styles.fechaBtnTexto, { color: fecha === index ? '#FFFFFF' : theme.textPrimary }]}>
              {label}
            </Text>
            <Text style={[styles.fechaBtnFecha, { color: fecha === index ? '#BFDBFE' : theme.textSecondary }]}>
              {new Date(Date.now() + index * 86400000).toLocaleDateString('es-CO', {
                weekday: 'short', day: 'numeric', month: 'short'
              })}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Hora */}
      <Text style={[styles.label, { color: theme.textPrimary }]}>Hora de salida</Text>

      {/* Selector de franja */}
      <View style={styles.franjaRow}>
        {FRANJAS.map((franja, index) => {
          const pasada = franjaYaPaso(franja)
          const activa = franjaActiva === index
          return (
            <TouchableOpacity
              key={index}
              disabled={pasada}
              style={[
                styles.franjaBtn,
                {
                  backgroundColor: activa ? theme.primary : theme.backgroundCard,
                  borderColor: activa ? theme.primary : theme.border,
                  opacity: pasada ? 0.35 : 1,
                }
              ]}
              onPress={() => setFranjaActiva(index)}
            >
              <Text style={styles.franjaIcono}>{franja.icon}</Text>
              <Text style={[styles.franjaLabel, { color: activa ? '#FFFFFF' : theme.textSecondary }]}>
                {franja.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Grid de horas */}
      <View style={styles.horasGrid}>
        {FRANJAS[franjaActiva].horas.map((h) => {
          const pasada = horaYaPaso(h)
          const seleccionada = hora === h
          return (
            <TouchableOpacity
              key={h}
              disabled={pasada}
              style={[
                styles.horaChip,
                {
                  backgroundColor: seleccionada ? theme.primary : theme.backgroundCard,
                  borderColor: seleccionada ? theme.primary : theme.border,
                  opacity: pasada ? 0.35 : 1,
                }
              ]}
              onPress={() => onHora(h)}
            >
              <Text style={[styles.horaChipTexto, { color: seleccionada ? '#FFFFFF' : theme.textPrimary }]}>
                {h}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {hora && (
        <View style={[styles.horaResumen, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.horaResumenTexto, { color: theme.primary }]}>
            ✓ Hora seleccionada: {hora}
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  label: { fontSize: 15, fontWeight: '600' },
  fechaRow: { flexDirection: 'row', gap: 10 },
  fechaBtn: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center', gap: 4 },
  fechaBtnTexto: { fontSize: 15, fontWeight: '700' },
  fechaBtnFecha: { fontSize: 12 },
  franjaRow: { flexDirection: 'row', gap: 8 },
  franjaBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12, borderWidth: 1, gap: 2 },
  franjaIcono: { fontSize: 18 },
  franjaLabel: { fontSize: 11, fontWeight: '600' },
  horasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  horaChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  horaChipTexto: { fontSize: 14, fontWeight: '500' },
  horaResumen: { padding: 12, borderRadius: 10, alignItems: 'center' },
  horaResumenTexto: { fontSize: 14, fontWeight: '600' },
})