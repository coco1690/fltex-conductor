// import { useCallback } from 'react'
// import { useFocusEffect } from 'expo-router'
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native'
// import { useTheme } from '../../src/theme/useTheme'
// import { useAuthStore } from '../../src/stores/authStore'
// import { useViajesStore } from '../../src/stores/viajesStore'
// import { Ionicons } from '@expo/vector-icons'

// export default function Historial() {
//   const { theme } = useTheme()
//   const { conductor } = useAuthStore()
//   const { viajes, cargando, cargarHistorialViajes } = useViajesStore()

//   useFocusEffect(
//     useCallback(() => {
//       if (conductor) cargarHistorialViajes(conductor.id)
//     }, [conductor])
//   )

//   const formatFecha = (iso: string) =>
//     new Date(iso).toLocaleDateString('es-CO', {
//       weekday: 'short', day: 'numeric', month: 'short'
//     })

//   const formatHora = (iso: string) =>
//     new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

//   const getEstadoColor = (estado: string) => {
//     switch (estado) {
//       case 'completado': return theme.success
//       case 'cancelado': return theme.error
//       case 'en_curso': return theme.warning
//       default: return theme.textMuted
//     }
//   }

//   const getEstadoLabel = (estado: string) => {
//     switch (estado) {
//       case 'completado': return 'Completado'
//       case 'cancelado': return 'Cancelado'
//       case 'en_curso': return 'En curso'
//       default: return estado
//     }
//   }

//   if (cargando) {
//     return (
//       <View style={[styles.centrado, { backgroundColor: theme.background }]}>
//         <ActivityIndicator color={theme.primary} size="large" />
//       </View>
//     )
//   }

//   return (
//     <ScrollView
//       style={[styles.container, { backgroundColor: theme.background }]}
//       contentContainerStyle={styles.content}
//     >
//       <Text style={[styles.titulo, { color: theme.textPrimary }]}>Historial</Text>

//       {viajes.length === 0 ? (
//         <View style={[styles.sinViajes, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
//           <Ionicons name="time-outline" size={40} color={theme.textMuted} />
//           <Text style={[styles.sinViajesTexto, { color: theme.textMuted }]}>
//             No tienes viajes registrados aún
//           </Text>
//         </View>
//       ) : (
//         viajes.map((viaje) => (
//           <View
//             key={viaje.id}
//             style={[styles.card, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}
//           >
//             <View style={styles.cardHeader}>
//               <View>
//                 <Text style={[styles.fecha, { color: theme.textSecondary }]}>
//                   {formatFecha(viaje.hora_salida_programada)}
//                 </Text>
//                 <Text style={[styles.hora, { color: theme.textPrimary }]}>
//                   {formatHora(viaje.hora_salida_programada)}
//                 </Text>
//               </View>
//               <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(viaje.estado) + '20' }]}>
//                 <Text style={[styles.estadoTexto, { color: getEstadoColor(viaje.estado) }]}>
//                   {getEstadoLabel(viaje.estado)}
//                 </Text>
//               </View>
//             </View>

//             {viaje.rutas && (
//               <View style={styles.infoFila}>
//                 <Ionicons name="navigate-outline" size={14} color={theme.textSecondary} />
//                 <Text style={[styles.infoTexto, { color: theme.textSecondary }]}>
//                   {viaje.rutas.nombre}
//                 </Text>
//               </View>
//             )}

//             <View style={[styles.separador, { backgroundColor: theme.border }]} />

//             <View style={styles.statsRow}>
//               <View style={styles.statItem}>
//                 <Ionicons name="people-outline" size={14} color={theme.textSecondary} />
//                 <Text style={[styles.statTexto, { color: theme.textSecondary }]}>
//                   {viaje.cupos_confirmados} pasajeros
//                 </Text>
//               </View>
//               <View style={styles.statItem}>
//                 <Ionicons name="cash-outline" size={14} color={theme.textSecondary} />
//                 <Text style={[styles.statTexto, { color: theme.textSecondary }]}>
//                   ${(viaje.precio_pasaje * viaje.cupos_confirmados).toLocaleString('es-CO')}
//                 </Text>
//               </View>
//             </View>
//           </View>
//         ))
//       )}
//     </ScrollView>
//   )
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   content: { padding: 20, paddingTop: 110, gap: 12 },
//   centrado: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
//   sinViajes: { alignItems: 'center', padding: 40, borderRadius: 12, borderWidth: 1, gap: 12 },
//   sinViajesTexto: { fontSize: 14, textAlign: 'center' },
//   card: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 10 },
//   cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
//   fecha: { fontSize: 12 },
//   hora: { fontSize: 20, fontWeight: 'bold' },
//   estadoBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
//   estadoTexto: { fontSize: 12, fontWeight: '600' },
//   infoFila: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   infoTexto: { fontSize: 13 },
//   separador: { height: 1 },
//   statsRow: { flexDirection: 'row', gap: 16 },
//   statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
//   statTexto: { fontSize: 13 },
// })

import { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { useTheme } from '../../src/theme/useTheme'
import { useAuthStore } from '../../src/stores/authStore'
import { useViajesStore } from '../../src/stores/viajesStore'
import { Ionicons } from '@expo/vector-icons'

export default function Historial() {
  const { theme } = useTheme()
  const { conductor } = useAuthStore()
  const { viajes, cargando, cargarHistorialViajes } = useViajesStore()
  const [refreshing, setRefreshing] = useState(false)

  const cargarTodo = useCallback(async () => {
    if (!conductor) return
    await cargarHistorialViajes(conductor.id)
  }, [conductor])

  useFocusEffect(
    useCallback(() => { cargarTodo() }, [cargarTodo])
  )

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await cargarTodo()
    setRefreshing(false)
  }, [cargarTodo])

  const formatFecha = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })

  const formatHora = (iso: string) =>
    new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

  const getEstadoConfig = (estado: string) => {
    switch (estado) {
      case 'completado': return { label: 'COMPLETADO', color: theme.success }
      case 'cancelado':  return { label: 'CANCELADO',  color: theme.error }
      case 'en_curso':   return { label: 'EN CURSO',   color: theme.warning }
      default:           return { label: estado.toUpperCase(), color: theme.textMuted }
    }
  }

  if (cargando && !refreshing) {
    return (
      <View style={[styles.centrado, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} size="large" />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* Header fijo */}
      <View style={[styles.headerFijo, { backgroundColor: theme.background }]}>
        <Text style={[styles.titulo, { color: theme.textPrimary }]}>Historial</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        {viajes.length === 0 ? (
          <View style={[styles.sinViajes, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
            <Ionicons name="time-outline" size={40} color={theme.textMuted} />
            <Text style={[styles.sinViajesTexto, { color: theme.textMuted }]}>
              No tienes viajes registrados aún
            </Text>
          </View>
        ) : (
          viajes.map((viaje) => {
            const estadoConfig = getEstadoConfig(viaje.estado)
            const acento = estadoConfig.color
            const totalRecaudado = (viaje.precio_pasaje * viaje.cupos_confirmados).toLocaleString('es-CO')

            return (
              <View
                key={viaje.id}
                style={[styles.card, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}
              >
                {/* Header: estado dot + label · hora badge */}
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

                {/* Info row: fecha · pasajeros · recaudado */}
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
                      {viaje.cupos_confirmados} pasajeros
                    </Text>
                  </View>

                  <View style={[styles.infoDivider, { backgroundColor: theme.border }]} />

                  <View style={styles.infoItem}>
                    <Ionicons name="cash-outline" size={13} color={theme.textMuted} />
                    <Text style={[styles.infoTexto, { color: theme.textSecondary }]}>
                      ${totalRecaudado}
                    </Text>
                  </View>
                </View>

              </View>
            )
          })
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerFijo: {
    paddingHorizontal: 20,
    paddingTop: 110,
    paddingBottom: 12,
  },
  titulo: { fontSize: 24, fontWeight: '800', letterSpacing: -0.4 },
  content: { padding: 20, paddingTop: 12, gap: 12, flexGrow: 1 },
  sinViajes: { alignItems: 'center', padding: 40, borderRadius: 20, borderWidth: 1, gap: 12 },
  sinViajesTexto: { fontSize: 14, textAlign: 'center' },

  // Card
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
    flexWrap: 'wrap',
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
})