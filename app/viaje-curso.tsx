
import { useEffect, useState, useMemo } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../src/theme/useTheme'
import { useAuthStore } from '../src/stores/authStore'
import { useViajesStore } from '../src/stores/viajesStore'
import { useReservasStore } from '../src/stores/reservasStore'
import { InfoViaje } from '../components/viajes/InfoViaje'
import { BotonesAccion } from '../components/viajes/BotonesAccion'
import { ListaPasajeros } from '../components/viajes/ListaPasajeros'

export default function ViajeCurso() {
  const { theme } = useTheme()
  const { viajeId } = useLocalSearchParams<{ viajeId: string }>()
  const { usuario, conductor } = useAuthStore()
  const { viajeActivo, cargando, cargarViajeDetalle, iniciarAbordaje, iniciarViaje, cancelarViaje } = useViajesStore()
  const { cargarReservasViaje } = useReservasStore()
  const [reservas, setReservas] = useState<any[]>([])
  const [cargandoReservas, setCargandoReservas] = useState(false)

  useEffect(() => {
    if (viajeId) recargarTodo()
  }, [viajeId])

  const recargarTodo = async () => {
    if (!viajeId) return
    setCargandoReservas(true)
    try {
      // FIX: paralelo en vez de secuencial — más rápido y reduce renders
      const [_, data] = await Promise.all([
        cargarViajeDetalle(viajeId),
        cargarReservasViaje(viajeId)
      ])
      setReservas(data ?? [])
    } finally {
      setCargandoReservas(false)
    }
  }
  const todosAbordaron = useMemo(() => {
    if (reservas.length === 0) return false
    return reservas.every(reserva => {
      const pasajeros = reserva.reserva_pasajeros ?? []
      if (pasajeros.length === 0) return reserva.estado === 'abordada'
      return pasajeros
        .filter((p: any) => p.estado !== 'no_show')
        .every((p: any) => p.estado === 'abordada')
    })
  }, [reservas])

  // FIX: logs fuera del render, solo cuando el valor cambia
  useEffect(() => {
    if (__DEV__) {
      console.log('todosAbordaron:', todosAbordaron)
    }
  }, [todosAbordaron])

  const handleIniciarAbordaje = () => {
    Alert.alert(
      'Iniciar abordaje',
      '¿Confirmas que vas a iniciar el abordaje de pasajeros?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            await iniciarAbordaje(viajeId!)
            router.push({ pathname: '/abordaje', params: { viajeId: viajeId! } })
          },
        },
      ]
    )
  }

  const handleIniciarViaje = () => {
    Alert.alert(
      'Iniciar viaje',
      '¿Confirmas que todos los pasajeros abordaron y vas a salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir ahora',
          onPress: async () => {
            await iniciarViaje(viajeId!, conductor!.id)
            router.back()
          }
        }
      ]
    )
  }

  const handleFinalizar = async (novedad?: string) => {
    await useViajesStore.getState().completarViaje(viajeId!, novedad)
    router.back()
  }

  const handleCancelar = async (motivo: string) => {
    await cancelarViaje(viajeId!, motivo, usuario!.id)
    router.back()
  }

  if (cargando && !viajeActivo) {
    return (
      <View style={[styles.centrado, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} size="large" />
      </View>
    )
  }

  if (!viajeActivo) return null

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.titulo, { color: theme.textPrimary }]}>
          Detalle del viaje
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <InfoViaje />

      <BotonesAccion
        estado={viajeActivo.estado}
        cargando={cargando}
        todosAbordaron={todosAbordaron}
        // viajeId={viajeId!}          // ← nuevo
        onIniciarAbordaje={handleIniciarAbordaje}
        onIniciarViaje={handleIniciarViaje}
        onFinalizar={handleFinalizar}
      />

      <ListaPasajeros
        reservas={reservas}
        viajeId={viajeId!}
        viajeEstado={viajeActivo.estado}
        cargando={cargandoReservas}
        usuarioId={usuario!.id}
        onRecargar={recargarTodo}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, gap: 12 },
  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  titulo: { fontSize: 20, fontWeight: 'bold' },
})