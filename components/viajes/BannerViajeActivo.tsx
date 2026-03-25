import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useTheme } from '../../src/theme/useTheme'
import { useViajesStore } from '../../src/stores/viajesStore'
import { useAuthStore } from '../../src/stores/authStore'

interface Props {
  titulo?: string
}

export function BannerViajeActivo({ titulo }: Props) {
  const { theme } = useTheme()
  const { viajeEnCurso, completarViaje, iniciarViaje, cargando } = useViajesStore()
  const { usuario } = useAuthStore()

  if (!viajeEnCurso) return null
  if (viajeEnCurso.estado !== 'en_curso' && viajeEnCurso.estado !== 'abordando') return null

  const esAbordando = viajeEnCurso.estado === 'abordando'
  const esEnCurso = viajeEnCurso.estado === 'en_curso'

  const acento = esAbordando ? theme.warning : theme.primary
  const acentoLight = esAbordando ? theme.warningLight : theme.primaryLight

  const calcularProgreso = (): number => {
    if (!esEnCurso || !viajeEnCurso.hora_llegada_estimada) return 0
    const salida = new Date(viajeEnCurso.hora_salida_programada).getTime()
    const llegada = new Date(viajeEnCurso.hora_llegada_estimada).getTime()
    const ahora = Date.now()
    return Math.min(Math.max((ahora - salida) / (llegada - salida), 0), 1)
  }

  const porcentaje = Math.round(calcularProgreso() * 100)

  const formatHora = (iso: string) =>
    new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

  const formatFecha = (iso: string) => {
    const f = new Date(iso)
    const hoy = new Date()
    if (f.toDateString() === hoy.toDateString()) return 'Hoy'
    return f.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const confirmarFinalizar = () => {
    Alert.alert(
      'Finalizar viaje',
      '¿Confirmas que el viaje llegó a su destino?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí, finalizar', style: 'destructive', onPress: () => completarViaje(viajeEnCurso.id) },
      ]
    )
  }

  const confirmarIniciar = () => {
    Alert.alert(
      'Iniciar viaje',
      '¿Vas a salir ahora?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí, iniciar', onPress: () => { if (usuario) iniciarViaje(viajeEnCurso.id, usuario.id) } },
      ]
    )
  }

  return (
    <View style={styles.wrapper}>
      {titulo && (
        <Text style={[styles.tituloSeccion, { color: theme.textPrimary }]}>
          {titulo}
        </Text>
      )}

      <View style={[styles.card, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>

        {/* Header: estado + porcentaje */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.statusDot, { backgroundColor: acento }]} />
            <Text style={[styles.statusLabel, { color: acento }]}>
              {esAbordando ? 'ABORDANDO' : 'EN CURSO'}
            </Text>
          </View>
          {esEnCurso && (
            <View style={[styles.pctBadge, { backgroundColor: acentoLight, borderColor: acento + '40' }]}>
              <Text style={[styles.pctTexto, { color: acento }]}>{porcentaje}%</Text>
            </View>
          )}
        </View>

        {/* Ruta */}
        {viajeEnCurso.rutas && (
          <Text style={[styles.ruta, { color: theme.textPrimary }]} numberOfLines={1}>
            {viajeEnCurso.rutas.nombre}
          </Text>
        )}

        {/* Info: fecha · hora · cupos */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={13} color={theme.textMuted} />
            <Text style={[styles.infoTexto, { color: theme.textSecondary }]}>
              {formatFecha(viajeEnCurso.hora_salida_programada)}
            </Text>
          </View>
          <View style={[styles.infoDivider, { backgroundColor: theme.border }]} />
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={13} color={theme.textMuted} />
            <Text style={[styles.infoTexto, { color: theme.textSecondary }]}>
              {formatHora(viajeEnCurso.hora_salida_programada)}
              {viajeEnCurso.hora_llegada_estimada ? ` → ${formatHora(viajeEnCurso.hora_llegada_estimada)}` : ''}
            </Text>
          </View>
          <View style={[styles.infoDivider, { backgroundColor: theme.border }]} />
          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={13} color={theme.textMuted} />
            <Text style={[styles.infoTexto, { color: theme.textSecondary }]}>
              {viajeEnCurso.cupos_reservados}/{viajeEnCurso.cupos_totales}
            </Text>
          </View>
        </View>

        {/* Progress bar — solo en_curso */}
        {esEnCurso && (
          <View style={styles.progressSection}>
            <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
              <View style={[styles.progressFill, { width: `${porcentaje}%` as any, backgroundColor: acento }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={[styles.progressLabel, { color: theme.textMuted }]}>Origen</Text>
              <Text style={[styles.progressLabel, { color: theme.textMuted }]}>Destino</Text>
            </View>
          </View>
        )}

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Botones */}
        <View style={styles.botonesRow}>
          {esAbordando && (
            <>
              <TouchableOpacity
                style={[styles.botonSecundario, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}
                onPress={() => router.push({ pathname: '/abordaje', params: { viajeId: viajeEnCurso.id } })}
              >
                <Ionicons name="map-outline" size={16} color={theme.textPrimary} />
                <Text style={[styles.botonSecundarioTexto, { color: theme.textPrimary }]}>
                  Ver mapa
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botonPrimario, { backgroundColor: acento }]}
                onPress={confirmarIniciar}
                disabled={cargando}
              >
                <Ionicons name="play-circle" size={18} color={theme.textInverse} />
                <Text style={[styles.botonPrimarioTexto, { color: theme.textInverse }]}>
                  {cargando ? 'Iniciando…' : 'Iniciar viaje'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {esEnCurso && (
            <>
              <TouchableOpacity
                style={[styles.botonSecundario, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}
                onPress={() => router.push({ pathname: '/viaje-curso', params: { viajeId: viajeEnCurso.id } })}
              >
                <Ionicons name="people-outline" size={16} color={theme.textPrimary} />
                <Text style={[styles.botonSecundarioTexto, { color: theme.textPrimary }]}>
                  Pasajeros
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botonPrimario, { backgroundColor: acento }]}
                onPress={confirmarFinalizar}
                disabled={cargando}
              >
                <Ionicons name="flag" size={16} color={theme.textInverse} />
                <Text style={[styles.botonPrimarioTexto, { color: theme.textInverse }]}>
                  {cargando ? 'Finalizando…' : 'Finalizar'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { gap: 10 },
  tituloSeccion: { fontSize: 18, fontWeight: '600' },
  card: { borderRadius: 20, borderWidth: 1, padding: 18, gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  pctBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  pctTexto: { fontSize: 12, fontWeight: '700' },
  ruta: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoTexto: { fontSize: 12, fontWeight: '500' },
  infoDivider: { width: 1, height: 12 },
  progressSection: { gap: 5 },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  divider: { height: 1 },
  botonesRow: { flexDirection: 'row', gap: 10 },
  botonPrimario: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6, paddingVertical: 13, borderRadius: 12,
  },
  botonPrimarioTexto: { fontSize: 14, fontWeight: '800' },
  botonSecundario: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6, paddingVertical: 13, borderRadius: 12, borderWidth: 1,
  },
  botonSecundarioTexto: { fontSize: 14, fontWeight: '700' },
})