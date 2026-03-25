import { useRef } from 'react'
import {
  View, StyleSheet, TouchableOpacity,
  Text, ActivityIndicator,
} from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/theme/useTheme'
import { useViajeRutaStore } from '../../src/stores/viajeRutaStore'
import { optimizeRouteMapbox } from '../../src/utils/mapboxApi'

type Props = { viajeId: string }

export function MapaAbordaje({ viajeId }: Props) {
  const { theme } = useTheme()
  const mapRef = useRef<MapView>(null)

  const {
    driverLocation,
    routeCoords,
    stops,
    isOptimizing,
    error,
    setError,
    applyMapboxOrder,
    saveRutaOptimizada,
  } = useViajeRutaStore()

  const stopsActivos = stops.filter((s) => s.estadoReserva === 'reservada')

  const handleOptimizar = async () => {
    if (!driverLocation || stopsActivos.length === 0) return

    try {
      setError(null)

      const result = await optimizeRouteMapbox(
        driverLocation,
        stopsActivos.map((s) => ({ latitude: s.latitud, longitude: s.longitud }))
      )

      applyMapboxOrder(result.waypoints)

      await saveRutaOptimizada({
        viajeId,
        routeCoords: result.routeCoords,
        distancia: result.distance,
        duracion: result.duration,
      })

      mapRef.current?.fitToCoordinates(
        [driverLocation, ...stopsActivos.map((s) => ({
          latitude: s.latitud,
          longitude: s.longitud,
        }))],
        { edgePadding: { top: 40, right: 40, bottom: 60, left: 40 }, animated: true }
      )
    } catch (e: any) {
      setError(e.message ?? 'Error al optimizar')
    }
  }

  const regionInicial = driverLocation
    ? {
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }
    : {
        latitude: 4.3135,
        longitude: -72.0816,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={regionInicial}
      >
        {/* Marcador conductor */}
        {driverLocation && (
          <Marker coordinate={driverLocation} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.markerConductor}>
              <Ionicons name="car" size={15} color="#fff" />
            </View>
          </Marker>
        )}

        {/* Marcadores de reservas */}
        {stops.map((stop, index) => {
          const abordada = stop.estadoReserva === 'abordada'
          const noShow = stop.estadoReserva === 'no_show'
          const bgColor = abordada
            ? theme.success
            : noShow
            ? theme.textMuted
            : theme.warning
          const numero = stop.ordenMapbox !== null
            ? stop.ordenMapbox + 1
            : index + 1

          return (
            <Marker
              key={stop.reservaId}
              coordinate={{ latitude: stop.latitud, longitude: stop.longitud }}
              title={stop.nombrePasajero}
              description={stop.nombrePunto}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={[styles.markerStop, { backgroundColor: bgColor }]}>
                {abordada
                  ? <Ionicons name="checkmark" size={14} color="#fff" />
                  : <Text style={styles.markerNumero}>{numero}</Text>
                }
              </View>
            </Marker>
          )
        })}

        {/* Ruta optimizada */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={4}
            strokeColor={theme.primary}
          />
        )}
      </MapView>

      {/* Botón optimizar */}
      <TouchableOpacity
        style={[
          styles.btnOptimizar,
          { backgroundColor: theme.primary },
          (isOptimizing || stopsActivos.length === 0) && styles.btnDeshabilitado,
        ]}
        onPress={handleOptimizar}
        disabled={isOptimizing || stopsActivos.length === 0}
      >
        {isOptimizing
          ? <ActivityIndicator color="#fff" size="small" />
          : <>
              <Ionicons name="navigate-outline" size={16} color="#fff" />
              <Text style={styles.btnTexto}>Optimizar ruta</Text>
            </>
        }
      </TouchableOpacity>

      {/* Error */}
      {error && (
        <View style={[styles.errorBanner, { backgroundColor: theme.errorLight }]}>
          <Text style={[styles.errorTexto, { color: theme.error }]}>{error}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  markerConductor: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#E24B4A',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: '#fff',
  },
  markerStop: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  markerNumero: { color: '#fff', fontSize: 13, fontWeight: '800' },
  btnOptimizar: {
    position: 'absolute',
    bottom: 14, right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 22,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  btnDeshabilitado: { opacity: 0.4 },
  btnTexto: { color: '#fff', fontWeight: '700', fontSize: 14 },
  errorBanner: {
    position: 'absolute',
    top: 10, left: 12, right: 12,
    padding: 10, borderRadius: 10,
  },
  errorTexto: { fontSize: 13, fontWeight: '500', textAlign: 'center' },
})