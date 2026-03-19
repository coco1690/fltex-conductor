import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useTheme } from '../../src/theme/useTheme'

interface Props {
  viaje: any
}

export function CardViajeConductor({ viaje }: Props) {
  const { theme } = useTheme()

  const getEstadoConfig = (estado: string) => {
    switch (estado) {
      case 'programado': return { label: 'PROGRAMADO', color: theme.info,    bg: theme.infoLight }
      case 'abordando':  return { label: 'ABORDANDO',  color: theme.warning, bg: theme.warningLight }
      case 'en_curso':   return { label: 'EN CURSO',   color: theme.success, bg: theme.successLight }
      case 'completado': return { label: 'COMPLETADO', color: theme.textMuted, bg: theme.backgroundCard }
      case 'cancelado':  return { label: 'CANCELADO',  color: theme.error,   bg: theme.errorLight }
      default:           return { label: estado.toUpperCase(), color: theme.textMuted, bg: theme.backgroundCard }
    }
  }

  const formatHora = (iso: string) =>
    new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

  const formatFecha = (iso: string) => {
    const f = new Date(iso)
    const hoy = new Date()
    const manana = new Date()
    manana.setDate(hoy.getDate() + 1)
    if (f.toDateString() === hoy.toDateString()) return 'Hoy'
    if (f.toDateString() === manana.toDateString()) return 'Mañana'
    return f.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const estadoConfig = getEstadoConfig(viaje.estado)

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>

      {/* Header: estado dot + label */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.statusDot, { backgroundColor: estadoConfig.color }]} />
          <Text style={[styles.statusLabel, { color: estadoConfig.color }]}>
            {estadoConfig.label}
          </Text>
        </View>
        <View style={[styles.horaBadge, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.horaTexto, { color: theme.primary }]}>
            {formatHora(viaje.hora_salida_programada)}
          </Text>
        </View>
      </View>

      {/* Ruta */}
      {viaje.rutas && (
        <Text style={[styles.ruta, { color: theme.textPrimary }]} numberOfLines={1}>
          {viaje.rutas.nombre}
        </Text>
      )}

      {/* Info row */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={13} color={theme.textMuted} />
          <Text style={[styles.infoTexto, { color: theme.textSecondary }]}>
            {formatFecha(viaje.hora_salida_programada)}
          </Text>
        </View>

        <View style={[styles.infoDivider, { backgroundColor: theme.border }]} />

        <View style={styles.infoItem}>
          <Ionicons name="people-outline" size={13} color={theme.textMuted} />
          <Text style={[styles.infoTexto, { color: theme.textSecondary }]}>
            {viaje.cupos_reservados}/{viaje.cupos_totales} cupos
          </Text>
        </View>

        <View style={[styles.infoDivider, { backgroundColor: theme.border }]} />

        <View style={styles.infoItem}>
          <Ionicons name="cash-outline" size={13} color={theme.textMuted} />
          <Text style={[styles.infoTexto, { color: theme.textSecondary }]}>
            ${viaje.precio_pasaje.toLocaleString('es-CO')}
          </Text>
        </View>
      </View>

      {/* Separador */}
      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Botón ver detalle */}
      <TouchableOpacity
        style={[styles.boton, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}
        onPress={() => router.push({ pathname: '/viaje-curso', params: { viajeId: viaje.id } })}
      >
        <Ionicons name="eye-outline" size={16} color={theme.textPrimary} />
        <Text style={[styles.botonTexto, { color: theme.textPrimary }]}>Ver detalle</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  horaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  horaTexto: {
    fontSize: 12,
    fontWeight: '700',
  },
  ruta: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoTexto: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoDivider: {
    width: 1,
    height: 12,
  },
  divider: {
    height: 1,
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
  },
  botonTexto: {
    fontSize: 14,
    fontWeight: '700',
  },
})