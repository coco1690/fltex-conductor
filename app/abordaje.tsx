import { useEffect, useState, useCallback } from 'react'
import {
  View, Text, StyleSheet,
  ActivityIndicator, TouchableOpacity,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../src/theme/useTheme'
import { useAuthStore } from '../src/stores/authStore'
import { useReservasStore } from '../src/stores/reservasStore'
import { useViajeRutaStore } from '../src/stores/viajeRutaStore'
import { MapaAbordaje } from '../components/abordaje/MapaAbordaje'
import { ListaReservasAbordaje } from '../components/abordaje/ListaReservasAbordaje'


export default function AbordajeScreen() {
  const { theme } = useTheme()
  const { viajeId } = useLocalSearchParams<{ viajeId: string }>()
  const { usuario } = useAuthStore()
  const { cargarReservasViaje } = useReservasStore()
  const { buildStops, setDriverLocation, reset } = useViajeRutaStore()

  const [reservas, setReservas] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!viajeId) return
    cargar()
    obtenerUbicacion()
    return () => reset()
  }, [viajeId])

  const cargar = async () => {
    setCargando(true)
    try {
      const data = await cargarReservasViaje(viajeId!)
      setReservas(data)
      buildStops(data)
    } finally {
      setCargando(false)
    }
  }

  const obtenerUbicacion = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') return
      const loc = await Location.getCurrentPositionAsync({})
      setDriverLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      })
    } catch {
      // El mapa funciona igual sin ubicación del conductor
    }
  }

  const handleAbordajeExitoso = useCallback(async () => {
    const data = await cargarReservasViaje(viajeId!)
    setReservas(data)
    buildStops(data)
  }, [viajeId])

  const pendientes = reservas.filter((r) => r.estado === 'reservada').length

  if (cargando) {
    return (
      <View style={[styles.centrado, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} size="large" />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (router.canGoBack()) {
              router.back()
            } else {
              router.replace('/(tabs)')
            }
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.titulo, { color: theme.textPrimary }]}>
          Abordaje
        </Text>
        <View style={[styles.badge, { backgroundColor: theme.warningLight }]}>
          <Text style={[styles.badgeTexto, { color: theme.warning }]}>
            {pendientes} pendiente{pendientes !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      <View style={styles.mapa}>
        <MapaAbordaje viajeId={viajeId!} />
      </View>

      <View style={styles.lista}>
        <ListaReservasAbordaje
          viajeId={viajeId!}
          reservas={reservas}
          conductorUserId={usuario!.id}
          onAbordajeExitoso={handleAbordajeExitoso}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  titulo: { fontSize: 17, fontWeight: '700' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeTexto: { fontSize: 12, fontWeight: '700' },
  mapa: { flex: 55 },
  lista: { flex: 45 },
})