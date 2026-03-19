import { useState, useRef, useCallback } from 'react'
import {
  View, Text, StyleSheet, Modal,
  TouchableOpacity, Vibration, ActivityIndicator
} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/theme/useTheme'
import { useReservasStore } from '../../src/stores/reservasStore'

interface Props {
  visible: boolean
  viajeId: string
  conductorUserId: string
  reservas: any[]
  onCerrar: () => void
  onAbordajeExitoso: () => void
}

type Resultado = {
  tipo: 'exito' | 'error' | 'advertencia'
  mensaje: string
  nombre?: string
  cupos?: number
}

export function ModalQRScanner({ visible, viajeId, conductorUserId, reservas, onCerrar, onAbordajeExitoso }: Props) {
  const { theme } = useTheme()
  const [permission, requestPermission] = useCameraPermissions()
  const [procesando, setProcesando] = useState(false)
  const [resultado, setResultado] = useState<Resultado | null>(null)

  // FIX: usar ref para bloquear el scanner — más confiable que estado
  // porque no depende del ciclo de render
  const bloqueado = useRef(false)

  const resetear = () => {
    bloqueado.current = false
    setResultado(null)
    setProcesando(false)
  }

  const cerrar = () => {
    // FIX: bloquear antes de cerrar para evitar que la cámara
    // escanee durante la animación de cierre del modal
    bloqueado.current = true
    setResultado(null)
    setProcesando(false)
    onCerrar()
    // Resetear el bloqueo después de que el modal esté cerrado
    setTimeout(() => { bloqueado.current = false }, 500)
  }

  // FIX: useCallback para evitar que re-renders recreen esta función
  // y reactiven el scanner involuntariamente
  const handleBarCodeScanned = useCallback(async ({ data }: { data: string }) => {
    if (bloqueado.current || procesando) return

    // FIX: bloquear SINCRÓNICAMENTE antes de cualquier await
    // El problema original era que el bloqueo se hacía con setState
    // que es asíncrono y permitía un segundo escaneo antes del re-render
    bloqueado.current = true
    setProcesando(true)
    Vibration.vibrate(80)

    try {
      // Parsear QR
      let qrData: any
      try {
        qrData = JSON.parse(data)
      } catch {
        setResultado({ tipo: 'error', mensaje: 'QR no válido — no es de Fletex' })
        setProcesando(false)
        // No desbloquear — dejar que el usuario elija "Escanear otro"
        return
      }

      const reservaId = qrData.reserva_id
      const qrViajeId = qrData.viaje_id

      if (!reservaId) {
        setResultado({ tipo: 'error', mensaje: 'QR inválido — sin ID de reserva' })
        setProcesando(false)
        return
      }

      if (qrViajeId && qrViajeId !== viajeId) {
        setResultado({ tipo: 'error', mensaje: 'Esta reserva es de otro viaje' })
        setProcesando(false)
        return
      }

      const reserva = reservas.find(r => r.id === reservaId)

      if (!reserva) {
        setResultado({ tipo: 'error', mensaje: 'Reserva no encontrada en este viaje' })
        setProcesando(false)
        return
      }

      if (reserva.estado === 'abordada') {
        const nombre = reserva.reserva_pasajeros?.[0]?.nombres ?? 'Pasajero'
        setResultado({ tipo: 'advertencia', mensaje: `${nombre} ya había abordado` })
        setProcesando(false)
        return
      }

      if (reserva.estado === 'no_show') {
        setResultado({ tipo: 'error', mensaje: 'Esta reserva fue marcada como no show' })
        setProcesando(false)
        return
      }

      // Ejecutar abordaje
      await useReservasStore.getState().abordarPasajero(reservaId, conductorUserId)

      const error = useReservasStore.getState().error
      if (error) {
        setResultado({ tipo: 'error', mensaje: error })
        useReservasStore.getState().limpiarError()
        setProcesando(false)
        return
      }

      // Éxito
      const nombre = reserva.reserva_pasajeros?.[0]?.nombres ?? 'Pasajero'
      const cupos = reserva.cupos_solicitados ?? 1
      setResultado({ tipo: 'exito', mensaje: '¡Abordaje confirmado!', nombre, cupos })
      setProcesando(false)

      // FIX: llamar onAbordajeExitoso DESPUÉS de setResultado
      // para que el panel de éxito ya esté visible cuando el padre
      // recargue las reservas y re-renderice este componente
      onAbordajeExitoso()

    } catch (e: any) {
      setResultado({ tipo: 'error', mensaje: e.message ?? 'Error inesperado' })
      setProcesando(false)
    }
  }, [viajeId, conductorUserId, reservas, procesando])

  const resultadoConfig = resultado ? {
    exito: { color: '#FFFFFF', bg: '#16A34A', icono: 'checkmark-circle' },
    error: { color: '#FFFFFF', bg: '#DC2626', icono: 'close-circle' },
    advertencia: { color: '#FFFFFF', bg: '#D97706', icono: 'warning' },
  }[resultado.tipo] : null

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={cerrar}
      // FIX: al abrir el modal siempre resetear estado previo
      onShow={resetear}
    >
      <View style={[styles.container, { backgroundColor: '#000000' }]}>

        {/* Header */}
        <View style={[styles.header, { backgroundColor: '#000000' }]}>
          <TouchableOpacity onPress={cerrar} style={styles.backBtn}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Escanear QR de abordaje</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Cámara o permisos */}
        {!permission ? (
          <View style={styles.centrado}>
            <ActivityIndicator color="#FFFFFF" size="large" />
          </View>
        ) : !permission.granted ? (
          <View style={styles.centrado}>
            <Ionicons name="camera-outline" size={64} color="#FFFFFF" style={{ opacity: 0.5 }} />
            <Text style={styles.permisosTexto}>Se necesita acceso a la cámara</Text>
            <TouchableOpacity style={styles.botonPermiso} onPress={requestPermission}>
              <Text style={styles.botonPermisoTexto}>Dar permiso</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <CameraView
              style={{ flex: 1 }}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              // FIX: deshabilitar scanner cuando está bloqueado O hay resultado O procesando
              onBarcodeScanned={bloqueado.current || resultado || procesando
                ? undefined
                : handleBarCodeScanned
              }
            />

            {/* Overlay con visor */}
            <View style={styles.overlay} pointerEvents="none">
              <View style={styles.visor}>
                <View style={[styles.esquina, styles.esquinaTL]} />
                <View style={[styles.esquina, styles.esquinaTR]} />
                <View style={[styles.esquina, styles.esquinaBL]} />
                <View style={[styles.esquina, styles.esquinaBR]} />
              </View>
              <Text style={styles.instruccion}>
                Apunta al QR del pasajero
              </Text>
            </View>

            {/* Procesando */}
            {procesando && (
              <View style={styles.procesandoOverlay}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.procesandoTexto}>Verificando reserva...</Text>
              </View>
            )}

            {/* Resultado */}
            {resultado && resultadoConfig && (
              <View style={[styles.resultadoPanel, { backgroundColor: resultadoConfig.bg }]}>
                <Ionicons name={resultadoConfig.icono as any} size={48} color={resultadoConfig.color} />

                {resultado.nombre && (
                  <Text style={[styles.resultadoNombre, { color: resultadoConfig.color }]}>
                    {resultado.nombre}
                  </Text>
                )}
                <Text style={[styles.resultadoMensaje, { color: resultadoConfig.color }]}>
                  {resultado.mensaje}
                </Text>
                {resultado.cupos && resultado.tipo === 'exito' && (
                  <Text style={[styles.resultadoCupos, { color: resultadoConfig.color }]}>
                    {resultado.cupos} cupo{resultado.cupos > 1 ? 's' : ''}
                  </Text>
                )}

                <View style={styles.resultadoBotones}>
                  {resultado.tipo === 'exito' ? (
                    <TouchableOpacity style={styles.botonResultado} onPress={cerrar}>
                      <Text style={styles.botonResultadoTexto}>Cerrar</Text>
                    </TouchableOpacity>
                  ) : (
                    <>
                      <TouchableOpacity style={styles.botonResultado} onPress={resetear}>
                        <Ionicons name="qr-code-outline" size={16} color="#FFFFFF" />
                        <Text style={styles.botonResultadoTexto}>Escanear otro</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.botonResultado, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                        onPress={cerrar}
                      >
                        <Text style={styles.botonResultadoTexto}>Cerrar</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTitulo: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 },
  permisosTexto: { color: '#FFFFFF', fontSize: 16, textAlign: 'center', opacity: 0.8 },
  botonPermiso: {
    backgroundColor: '#FFFFFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12,
  },
  botonPermisoTexto: { color: '#000000', fontWeight: '700', fontSize: 15 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  visor: {
    width: 240,
    height: 240,
    position: 'relative',
  },
  esquina: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#FFFFFF',
  },
  esquinaTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 4 },
  esquinaTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 4 },
  esquinaBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 4 },
  esquinaBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 4 },
  instruccion: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.9,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  procesandoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  procesandoTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  resultadoPanel: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 32,
    paddingBottom: 48,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    alignItems: 'center',
    gap: 8,
  },
  resultadoNombre: { fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  resultadoMensaje: { fontSize: 16, fontWeight: '600', opacity: 0.9 },
  resultadoCupos: { fontSize: 14, opacity: 0.8 },
  resultadoBotones: { flexDirection: 'row', gap: 12, marginTop: 16 },
  botonResultado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  botonResultadoTexto: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
})