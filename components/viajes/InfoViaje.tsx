// import { View, Text, StyleSheet } from 'react-native'
// import { Ionicons } from '@expo/vector-icons'
// import { useTheme } from '../../src/theme/useTheme'
// import { useViajesStore } from '../../src/stores/viajesStore'

// export function InfoViaje() {
//   const { theme } = useTheme()
//   const viaje = useViajesStore(state => state.viajeActivo)

//   if (!viaje) return null

//   const formatHora = (iso: string) =>
//     new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

//   const getEstadoColor = (estado: string) => {
//     switch (estado) {
//       case 'programado': return theme.info
//       case 'abordando': return theme.warning
//       case 'en_curso': return theme.success
//       case 'completado': return theme.textMuted
//       default: return theme.textMuted
//     }
//   }

//   const getEstadoLabel = (estado: string) => {
//     switch (estado) {
//       case 'programado': return 'Programado'
//       case 'abordando': return 'Abordando'
//       case 'en_curso': return 'En curso'
//       case 'completado': return 'Completado'
//       default: return estado
//     }
//   }

//   return (
//     <View style={[styles.card, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
//       <View style={styles.cardHeader}>
//         <Text style={[styles.horaViaje, { color: theme.textPrimary }]}>
//           {formatHora(viaje.hora_salida_programada)}
//         </Text>
//         <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(viaje.estado) + '20' }]}>
//           <Text style={[styles.estadoTexto, { color: getEstadoColor(viaje.estado) }]}>
//             {getEstadoLabel(viaje.estado)}
//           </Text>
//         </View>
//       </View>

//       {viaje.rutas && (
//         <View style={styles.infoFila}>
//           <Ionicons name="navigate-outline" size={14} color={theme.textSecondary} />
//           <Text style={[styles.infoTexto, { color: theme.textSecondary }]}>
//             {viaje.rutas.nombre}
//           </Text>
//         </View>
//       )}

//       {viaje.puntos_abordaje && (
//         <View style={styles.infoFila}>
//           <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
//           <Text style={[styles.infoTexto, { color: theme.textSecondary }]}>
//             {viaje.puntos_abordaje.nombre}
//           </Text>
//         </View>
//       )}

//       <View style={[styles.separador, { backgroundColor: theme.border }]} />

//       <View style={styles.cuposRow}>
//         <View style={styles.cupoItem}>
//           <Text style={[styles.cupoNumero, { color: theme.primary }]}>
//             {viaje.cupos_reservados}
//           </Text>
//           <Text style={[styles.cupoLabel, { color: theme.textSecondary }]}>Reservados</Text>
//         </View>
//         <View style={styles.cupoItem}>
//           <Text style={[styles.cupoNumero, { color: theme.success }]}>
//             {viaje.cupos_confirmados}
//           </Text>
//           <Text style={[styles.cupoLabel, { color: theme.textSecondary }]}>Abordados</Text>
//         </View>
//         <View style={styles.cupoItem}>
//           <Text style={[styles.cupoNumero, { color: theme.textMuted }]}>
//             {viaje.cupos_totales}
//           </Text>
//           <Text style={[styles.cupoLabel, { color: theme.textSecondary }]}>Total</Text>
//         </View>
//       </View>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   card: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 10 },
//   cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   horaViaje: { fontSize: 24, fontWeight: 'bold' },
//   estadoBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
//   estadoTexto: { fontSize: 12, fontWeight: '600' },
//   infoFila: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   infoTexto: { fontSize: 13 },
//   separador: { height: 1 },
//   cuposRow: { flexDirection: 'row', justifyContent: 'space-around' },
//   cupoItem: { alignItems: 'center', gap: 2 },
//   cupoNumero: { fontSize: 24, fontWeight: 'bold' },
//   cupoLabel: { fontSize: 12 },
// })

import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/theme/useTheme'
import { useViajesStore } from '../../src/stores/viajesStore'

export function InfoViaje() {
  const { theme } = useTheme()
  const viaje = useViajesStore(state => state.viajeActivo)

  if (!viaje) return null

  const formatHora = (iso: string) =>
    new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

  const getEstadoConfig = (estado: string) => {
    switch (estado) {
      case 'programado': return { label: 'PROGRAMADO', color: theme.info }
      case 'abordando':  return { label: 'ABORDANDO',  color: theme.warning }
      case 'en_curso':   return { label: 'EN CURSO',   color: theme.success }
      case 'completado': return { label: 'COMPLETADO', color: theme.textMuted }
      case 'cancelado':  return { label: 'CANCELADO',  color: theme.error }
      default:           return { label: estado.toUpperCase(), color: theme.textMuted }
    }
  }

  const estadoConfig = getEstadoConfig(viaje.estado)
  const acento = estadoConfig.color

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>

      {/* Header: estado dot + hora */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.statusDot, { backgroundColor: acento }]} />
          <Text style={[styles.statusLabel, { color: acento }]}>
            {estadoConfig.label}
          </Text>
        </View>
        <View style={[styles.horaBadge, { backgroundColor: acento + '20', borderColor: acento + '40' }]}>
          <Text style={[styles.horaTexto, { color: acento }]}>
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
        {viaje.puntos_abordaje && (
          <>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={13} color={theme.textMuted} />
              <Text style={[styles.infoTexto, { color: theme.textSecondary }]}>
                {viaje.puntos_abordaje.nombre}
              </Text>
            </View>
            <View style={[styles.infoDivider, { backgroundColor: theme.border }]} />
          </>
        )}
        <View style={styles.infoItem}>
          <Ionicons name="people-outline" size={13} color={theme.textMuted} />
          <Text style={[styles.infoTexto, { color: theme.textSecondary }]}>
            {viaje.cupos_reservados}/{viaje.cupos_totales} cupos
          </Text>
        </View>
      </View>

      {/* Separador */}
      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Cupos stats */}
      <View style={styles.cuposRow}>
        <View style={styles.cupoItem}>
          <Text style={[styles.cupoNumero, { color: theme.primary }]}>
            {viaje.cupos_reservados}
          </Text>
          <Text style={[styles.cupoLabel, { color: theme.textMuted }]}>Reservados</Text>
        </View>

        <View style={[styles.cupoSeparador, { backgroundColor: theme.border }]} />

        <View style={styles.cupoItem}>
          <Text style={[styles.cupoNumero, { color: theme.success }]}>
            {viaje.cupos_confirmados}
          </Text>
          <Text style={[styles.cupoLabel, { color: theme.textMuted }]}>Abordados</Text>
        </View>

        <View style={[styles.cupoSeparador, { backgroundColor: theme.border }]} />

        <View style={styles.cupoItem}>
          <Text style={[styles.cupoNumero, { color: theme.textSecondary }]}>
            {viaje.cupos_totales}
          </Text>
          <Text style={[styles.cupoLabel, { color: theme.textMuted }]}>Total</Text>
        </View>
      </View>

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

  // Header
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
    borderWidth: 1,
  },
  horaTexto: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Ruta
  ruta: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },

  // Info row
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

  // Divider
  divider: {
    height: 1,
  },

  // Cupos
  cuposRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  cupoItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  cupoNumero: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  cupoLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  cupoSeparador: {
    width: 1,
    height: 36,
  },
})