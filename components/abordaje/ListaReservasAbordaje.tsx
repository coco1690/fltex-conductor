import { useState } from 'react'
import {
  View, Text, StyleSheet,
  ScrollView, TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/theme/useTheme'
import { useViajeRutaStore } from '../../src/stores/viajeRutaStore'
import { ModalQRScanner } from '../viajes/ModalQRScanner'

type Props = {
  viajeId: string
  reservas: any[]
  conductorUserId: string
  onAbordajeExitoso: () => Promise<void>
}

export function ListaReservasAbordaje({
  viajeId,
  reservas,
  conductorUserId,
  onAbordajeExitoso,
}: Props) {
  const { theme } = useTheme()
  const { stops, markStopAsAbordado } = useViajeRutaStore()
  const [reservaIdQR, setReservaIdQR] = useState<string | null>(null)

  // Si Mapbox ya ordenó → usar ese orden
  // Si no → usar el orden original de la query
  const stopsOrdenados =
    stops.length > 0
      ? stops
      : reservas
          .filter((r) => {
            const pto = r.puntos_abordaje
            const titular = r.reserva_pasajeros?.[0]
            return (
              (pto?.latitud != null && pto?.longitud != null) ||
              (titular?.latitud != null && titular?.longitud != null)
            )
          })
          .map((r) => {
            const pto = r.puntos_abordaje
            const titular = r.reserva_pasajeros?.[0]
            const nombrePunto = pto?.nombre ?? 'Ubicación del pasajero'
            return {
              reservaId: r.id,
              nombrePunto,
              nombrePasajero: titular?.nombres ?? 'Pasajero',
              cuposSolicitados: r.cupos_solicitados ?? 1,
              estadoReserva: r.estado,
              ordenMapbox: null,
            }
          })

  const pendientes = stopsOrdenados.filter((s) => s.estadoReserva === 'reservada')
  const completados = stopsOrdenados.filter((s) => s.estadoReserva !== 'reservada')

  const handleAbordajeExitoso = async () => {
    if (reservaIdQR) markStopAsAbordado(reservaIdQR)
    setReservaIdQR(null)
    await onAbordajeExitoso()
  }

  return (
    <>
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {pendientes.length > 0 && (
          <View style={styles.seccion}>
            <Text style={[styles.seccionLabel, { color: theme.textMuted }]}>
              POR RECOGER — {pendientes.length}
            </Text>
            {pendientes.map((stop, index) => (
              <FilaStop
                key={stop.reservaId}
                stop={stop}
                numero={index + 1}
                onPresQR={() => setReservaIdQR(stop.reservaId)}
                theme={theme}
              />
            ))}
          </View>
        )}

        {completados.length > 0 && (
          <View style={styles.seccion}>
            <Text style={[styles.seccionLabel, { color: theme.textMuted }]}>
              COMPLETADOS — {completados.length}
            </Text>
            {completados.map((stop) => (
              <FilaStop
                key={stop.reservaId}
                stop={stop}
                numero={null}
                onPresQR={null}
                theme={theme}
              />
            ))}
          </View>
        )}

        {stopsOrdenados.length === 0 && (
          <View style={styles.vacio}>
            <Ionicons name="people-outline" size={44} color={theme.textMuted} />
            <Text style={[styles.vacioTexto, { color: theme.textMuted }]}>
              No hay pasajeros con ubicación para este viaje
            </Text>
          </View>
        )}
      </ScrollView>

      <ModalQRScanner
        visible={reservaIdQR !== null}
        viajeId={viajeId}
        conductorUserId={conductorUserId}
        reservas={reservas}
        onCerrar={() => setReservaIdQR(null)}
        onAbordajeExitoso={handleAbordajeExitoso}
      />
    </>
  )
}

type FilaProps = {
  stop: any
  numero: number | null
  onPresQR: (() => void) | null
  theme: any
}

function FilaStop({ stop, numero, onPresQR, theme }: FilaProps) {
  const abordada = stop.estadoReserva === 'abordada'
  const noShow = stop.estadoReserva === 'no_show'

  const badgeBg = abordada
    ? theme.successLight
    : noShow
    ? theme.backgroundCard
    : theme.warningLight

  const badgeColor = abordada
    ? theme.success
    : noShow
    ? theme.textMuted
    : theme.warning

  return (
    <View style={[
      styles.fila,
      {
        backgroundColor: theme.backgroundSecondary,
        borderColor: theme.border,
        opacity: noShow ? 0.55 : 1,
      },
    ]}>
      <View style={[styles.badge, { backgroundColor: badgeBg }]}>
        {abordada
          ? <Ionicons name="checkmark" size={15} color={badgeColor} />
          : noShow
          ? <Ionicons name="close" size={15} color={badgeColor} />
          : <Text style={[styles.badgeNumero, { color: badgeColor }]}>{numero}</Text>
        }
      </View>

      <View style={styles.info}>
        <Text
          style={[
            styles.nombrePasajero,
            {
              color: abordada || noShow ? theme.textMuted : theme.textPrimary,
              textDecorationLine: noShow ? 'line-through' : 'none',
            },
          ]}
          numberOfLines={1}
        >
          {stop.nombrePasajero}
        </Text>
        <Text
          style={[styles.detalle, { color: theme.textSecondary }]}
          numberOfLines={1}
        >
          {stop.nombrePunto}
          {stop.cuposSolicitados > 1 ? ` · ${stop.cuposSolicitados} cupos` : ''}
        </Text>
      </View>

      {onPresQR && (
        <TouchableOpacity
          style={[styles.btnQR, { backgroundColor: theme.primaryLight }]}
          onPress={onPresQR}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="qr-code-outline" size={22} color={theme.primary} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 14, gap: 14, paddingBottom: 30 },
  seccion: { gap: 8 },
  seccionLabel: {
    fontSize: 11, fontWeight: '700',
    letterSpacing: 0.8, paddingHorizontal: 2,
  },
  fila: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, padding: 14,
    borderRadius: 14, borderWidth: 1,
  },
  badge: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeNumero: { fontSize: 14, fontWeight: '800' },
  info: { flex: 1, gap: 3 },
  nombrePasajero: { fontSize: 15, fontWeight: '600' },
  detalle: { fontSize: 12 },
  btnQR: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  vacio: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 40, gap: 12,
  },
  vacioTexto: { fontSize: 14, textAlign: 'center' },
})