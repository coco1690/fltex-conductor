import { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../src/theme/useTheme'
import { useAuthStore } from '../src/stores/authStore'
import { useViajesStore } from '../src/stores/viajesStore'
import { useRutasStore } from '../src/stores/rutasStore'
import { InfoVehiculo } from '../components/crear-viaje/InfoVehiculo'
import { SelectorRuta } from '../components/crear-viaje/SelectorRuta'
import { SelectorPunto } from '../components/crear-viaje/SelectorPunto'
import { SelectorFechaHora } from '../components/crear-viaje/SelectorFechaHora'
import { ModalConfirmacion } from '../components/crear-viaje/ModalConfirmacion'


export default function CrearViaje() {
  const { theme } = useTheme()
  const { conductor } = useAuthStore()
  const { crearViaje, cargando } = useViajesStore()
  const { rutas, puntosAbordaje, cargarRutasPorAgencia, cargarPuntosAbordaje } = useRutasStore()

  const [rutaId, setRutaId] = useState<string | null>(null)
  const [puntoId, setPuntoId] = useState<string | null>(null)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(0)
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null)
  const [aceptaEncomiendas, setAceptaEncomiendas] = useState(true)
  const [intentoEnvio, setIntentoEnvio] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    if (conductor?.agencia_id) {
      cargarRutasPorAgencia(conductor.agencia_id)
    }
  }, [conductor?.agencia_id])

  useEffect(() => {
    if (rutaId) {
      const ruta = rutas.find(r => r.id === rutaId)
      if (ruta) {
        cargarPuntosAbordaje(ruta.agencia_origen_id)
        setPuntoId(null)
      }
    }
  }, [rutaId])

  const rutaSeleccionada = rutas.find(r => r.id === rutaId)
  const puntoSeleccionado = puntosAbordaje.find(p => p.id === puntoId)
  const fechaResumen = new Date(Date.now() + fechaSeleccionada * 86400000)
    .toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })

  const handleRevisar = () => {
    setIntentoEnvio(true)
    if (!rutaId || !puntoId || !horaSeleccionada) return
    if (!conductor?.vehiculo_id) return
    setModalVisible(true)
  }

  const handleConfirmar = async () => {
    if (!rutaId || !puntoId || !horaSeleccionada || !conductor?.vehiculo_id) return

    const fecha = new Date()
    fecha.setDate(fecha.getDate() + fechaSeleccionada)
    const [h, m] = horaSeleccionada.split(':')
    fecha.setHours(parseInt(h), parseInt(m), 0, 0)

    setModalVisible(false)

    const viajeId = await crearViaje({
      conductor_id: conductor.id,
      vehiculo_id: conductor.vehiculo_id,
      ruta_id: rutaId,
      punto_abordaje_id: puntoId,
      hora_salida: fecha.toISOString(),
      acepta_encomiendas: aceptaEncomiendas,
    })

    if (viajeId) {
      router.back()
    } else {
      const errorMsg = useViajesStore.getState().error
      setModalVisible(false)
    }
  }

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.titulo, { color: theme.textPrimary }]}>
            Crear viaje
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <InfoVehiculo vehiculoId={conductor?.vehiculo_id} />

        <SelectorRuta
          rutas={rutas}
          rutaId={rutaId}
          onSelect={setRutaId}
        />
        {intentoEnvio && !rutaId && (
          <ErrorCampo mensaje="Selecciona una ruta" />
        )}

        <SelectorPunto
          puntos={puntosAbordaje}
          puntoId={puntoId}
          onSelect={setPuntoId}
        />
        {intentoEnvio && !puntoId && (
          <ErrorCampo mensaje="Selecciona un punto de abordaje" />
        )}

        <SelectorFechaHora
          fecha={fechaSeleccionada}
          hora={horaSeleccionada}
          onFecha={setFechaSeleccionada}
          onHora={setHoraSeleccionada}
        />
        {intentoEnvio && !horaSeleccionada && (
          <ErrorCampo mensaje="Selecciona una hora de salida" />
        )}

        <View style={[styles.switchFila, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
          <View style={styles.switchInfo}>
            <Ionicons name="cube-outline" size={18} color={theme.primary} />
            <Text style={[styles.switchLabel, { color: theme.textPrimary }]}>
              Acepta encomiendas
            </Text>
          </View>
          <Switch
            value={aceptaEncomiendas}
            onValueChange={setAceptaEncomiendas}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <TouchableOpacity
          style={[styles.botonCrear, { backgroundColor: theme.primary }]}
          onPress={handleRevisar}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.botonCrearTexto}>Revisar viaje</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <ModalConfirmacion
        visible={modalVisible}
        cargando={cargando}
        datos={{
          rutaNombre: rutaSeleccionada?.nombre ?? '',
          puntoNombre: puntoSeleccionado?.nombre ?? '',
          fecha: fechaResumen,
          hora: horaSeleccionada ?? '',
          precio: rutaSeleccionada?.precio_pasaje ?? 0,
          aceptaEncomiendas,
        }}
        onConfirmar={handleConfirmar}
        onCerrar={() => setModalVisible(false)}
      />
    </>
  )
}

function ErrorCampo({ mensaje }: { mensaje: string }) {
  const { theme } = useTheme()
  return (
    <View style={styles.errorFila}>
      <Ionicons name="alert-circle-outline" size={14} color={theme.error} />
      <Text style={[styles.errorTexto, { color: theme.error }]}>{mensaje}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  titulo: { fontSize: 20, fontWeight: 'bold' },
  switchFila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 12, borderWidth: 1 },
  switchInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  switchLabel: { fontSize: 15 },
  botonCrear: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8, marginBottom: 32 },
  botonCrearTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  errorFila: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: -6 },
  errorTexto: { fontSize: 13 },
})