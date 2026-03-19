import { useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/theme/useTheme'
import { CardPasajero } from './CardPasajero'
import { ModalAgregarPasajero } from './ModalAgregarPasajero'
import { ModalQRScanner } from './ModalQRScanner'
import { useReservasStore } from '../../src/stores/reservasStore'

interface Props {
  reservas: any[]
  viajeId: string
  viajeEstado: string
  cargando: boolean
  usuarioId: string
  onRecargar: () => void
}

export function ListaPasajeros({ reservas, viajeId, viajeEstado, cargando, usuarioId, onRecargar }: Props) {
  const { theme } = useTheme()
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false)
  const [modalQRVisible, setModalQRVisible] = useState(false)
  const [cargandoAgregar, setCargandoAgregar] = useState(false)

  const handleAbordar = async (reservaId: string) => {
    await useReservasStore.getState().abordarPasajero(reservaId, usuarioId)
    onRecargar()
  }

  const handleNoShowPasajero = (reservaPasajeroId: string, nombre: string) => {
    Alert.alert(
      'No Show',
      `¿Confirmas que ${nombre} no se presentó?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            await useReservasStore.getState().marcarNoShowPasajero(reservaPasajeroId, usuarioId)
            onRecargar()
          }
        }
      ]
    )
  }

  const handleAgregarPasajero = async (nombre: string, telefono?: string) => {
    setCargandoAgregar(true)
    const ok = await useReservasStore.getState().agregarPasajeroDirecto(viajeId, usuarioId, nombre, telefono)
    setCargandoAgregar(false)
    if (ok) {
      setModalAgregarVisible(false)
      onRecargar()
    } else {
      const errorMsg = useReservasStore.getState().error
      Alert.alert('Error', errorMsg || 'No se pudo agregar el pasajero.')
    }
  }

  // FIX: cerrar el modal PRIMERO, luego recargar después de que
  // React procese el cierre — evita que CameraView se remonte
  // con nuevas props mientras el modal sigue visible
  const handleAbordajeExitoso = () => {
    setModalQRVisible(false)
    setTimeout(() => onRecargar(), 400)
  }

  const totalPasajeros = reservas.reduce((acc, reserva) => {
    const activos = reserva.reserva_pasajeros?.filter(
      (p: any) => p.estado !== 'no_show'
    ).length ?? reserva.cupos_solicitados
    return acc + activos
  }, 0)

  if (cargando) {
    return <ActivityIndicator color={theme.primary} style={{ marginTop: 16 }} />
  }

  return (
    <View style={styles.container}>
      {/* Título + botones */}
      <View style={styles.tituloFila}>
        <Text style={[styles.titulo, { color: theme.textPrimary }]}>
          Pasajeros ({totalPasajeros})
        </Text>

        {viajeEstado === 'abordando' && (
          <View style={styles.botonesHeader}>
            <TouchableOpacity
              style={[styles.botonQR, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
              onPress={() => setModalQRVisible(true)}
            >
              <Ionicons name="qr-code-outline" size={16} color={theme.primary} />
              <Text style={[styles.botonQRTexto, { color: theme.primary }]}>QR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botonAgregar, { backgroundColor: theme.success }]}
              onPress={() => setModalAgregarVisible(true)}
            >
              <Ionicons name="person-add-outline" size={16} color="#FFFFFF" />
              <Text style={styles.botonAgregarTexto}>Agregar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {reservas.length === 0 ? (
        <View style={[styles.sinPasajeros, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
          <Ionicons name="people-outline" size={32} color={theme.textMuted} />
          <Text style={[styles.sinPasajerosTexto, { color: theme.textMuted }]}>
            Sin pasajeros reservados aún
          </Text>
        </View>
      ) : (
        reservas.map((reserva) => (
          <CardPasajero
            key={reserva.id}
            reserva={reserva}
            viajeEstado={viajeEstado}
            onAbordar={handleAbordar}
            onNoShowPasajero={handleNoShowPasajero}
          />
        ))
      )}

      <ModalAgregarPasajero
        visible={modalAgregarVisible}
        cargando={cargandoAgregar}
        onAgregar={handleAgregarPasajero}
        onCerrar={() => setModalAgregarVisible(false)}
      />

      <ModalQRScanner
        visible={modalQRVisible}
        viajeId={viajeId}
        conductorUserId={usuarioId}
        reservas={reservas}
        onCerrar={() => setModalQRVisible(false)}
        onAbordajeExitoso={handleAbordajeExitoso}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  tituloFila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { fontSize: 17, fontWeight: '600' },
  botonesHeader: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  botonQR: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1,
  },
  botonQRTexto: { fontSize: 13, fontWeight: '700' },
  botonAgregar: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
  },
  botonAgregarTexto: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  sinPasajeros: { alignItems: 'center', padding: 32, borderRadius: 12, borderWidth: 1, gap: 8 },
  sinPasajerosTexto: { fontSize: 14, textAlign: 'center' },
})