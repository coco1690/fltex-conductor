import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/theme/useTheme'
import { ModalNovedad } from './ModalNovedad'

const MOTIVOS_CANCELACION = [
  'Problema mecánico',
  'Emergencia personal',
  'Condiciones climáticas',
  'Sin pasajeros suficientes',
  'Otro',
]
interface Props {
  estado: string
  cargando: boolean
  todosAbordaron: boolean  // 👈
  onIniciarAbordaje: () => void
  onIniciarViaje: () => void
  onCancelar?: (motivo: string) => void
  onFinalizar: (novedad?: string) => void
}

export function BotonesAccion({ estado, cargando, todosAbordaron, onIniciarAbordaje, onIniciarViaje, onCancelar, onFinalizar }: Props) {
  const { theme } = useTheme()
  const [modalNovedadVisible, setModalNovedadVisible] = useState(false)

  const handleCancelar = () => {
    Alert.alert(
      'Cancelar viaje',
      '¿Por qué vas a cancelar el viaje?',
      [
        ...MOTIVOS_CANCELACION.map(motivo => ({
          text: motivo,
          onPress: () => confirmarCancelacion(motivo)
        })),
        { text: 'Volver', style: 'cancel' as const }
      ]
    )
  }

  const confirmarCancelacion = (motivo: string) => {
    Alert.alert(
      'Confirmar cancelación',
      `¿Confirmas cancelar el viaje por: "${motivo}"?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Sí, cancelar', style: 'destructive', onPress: () => onCancelar?.(motivo) }
      ]
    )
  }

  const handleFinalizar = (novedad?: string) => {
    setModalNovedadVisible(false)
    onFinalizar(novedad)
  }

  return (
    <View style={styles.container}>
      {estado === 'programado' && (
        <TouchableOpacity
          style={[styles.botonAccion, { backgroundColor: theme.warning }]}
          onPress={onIniciarAbordaje}
          disabled={cargando}
        >
          <Ionicons name="people-outline" size={20} color="#FFFFFF" />
          <Text style={styles.botonAccionTexto}>Iniciar abordaje</Text>
        </TouchableOpacity>
      )}

      {estado === 'abordando' && (
        <>
          <TouchableOpacity
            style={[
              styles.botonAccion,
              {
                backgroundColor: todosAbordaron ? theme.success : theme.backgroundCard,
                borderWidth: todosAbordaron ? 0 : 1,
                borderColor: theme.border,
              }
            ]}
            onPress={onIniciarViaje}
            disabled={cargando || !todosAbordaron}
          >
            <Ionicons
              name="car-outline"
              size={20}
              color={todosAbordaron ? '#FFFFFF' : theme.textMuted}
            />
            <Text style={[
              styles.botonAccionTexto,
              { color: todosAbordaron ? '#FFFFFF' : theme.textMuted }
            ]}>
              Iniciar viaje
            </Text>
          </TouchableOpacity>

          {/* Indicador cuando faltan pasajeros por abordar */}
          {!todosAbordaron && (
            <View style={[styles.aviso, { backgroundColor: theme.warningLight }]}>
              <Ionicons name="time-outline" size={15} color={theme.warning} />
              <Text style={[styles.avisoTexto, { color: theme.warning }]}>
                Esperando que todos los pasajeros aborden
              </Text>
            </View>
          )}
        </>
      )}

      {estado === 'en_curso' && (
        <TouchableOpacity
          style={[styles.botonAccion, { backgroundColor: theme.primary }]}
          onPress={() => setModalNovedadVisible(true)}
          disabled={cargando}
        >
          <Ionicons name="flag-outline" size={20} color="#FFFFFF" />
          <Text style={styles.botonAccionTexto}>Finalizar viaje</Text>
        </TouchableOpacity>
      )}

      {/* {(estado === 'programado' || estado === 'abordando') && (
        <TouchableOpacity
          style={[styles.botonCancelar, { borderColor: theme.error }]}
          onPress={handleCancelar}
          disabled={cargando}
        >
          <Ionicons name="close-circle-outline" size={20} color={theme.error} />
          <Text style={[styles.botonCancelarTexto, { color: theme.error }]}>Cancelar viaje</Text>
        </TouchableOpacity>
      )} */}

      <ModalNovedad
        visible={modalNovedadVisible}
        onConfirmar={handleFinalizar}
        onCerrar={() => setModalNovedadVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  botonAccion: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12 },
  botonAccionTexto: { fontSize: 16, fontWeight: '700' },
  botonCancelar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
  botonCancelarTexto: { fontSize: 16, fontWeight: '700' },
  aviso: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10 },
  avisoTexto: { fontSize: 13, fontWeight: '500', flex: 1 },
})