import { useCallback } from 'react'
import { optimizeRouteMapbox } from '../utils/mapboxApi'
import { useViajeRutaStore } from '../stores/viajeRutaStore'

export function useMapboxRoute() {
  const driverLocation = useViajeRutaStore(s => s.driverLocation)
  const stops = useViajeRutaStore(s => s.stops)
  const setRouteCoords = useViajeRutaStore(s => s.setRouteCoords)
  const setError = useViajeRutaStore(s => s.setError)

  const optimize = useCallback(async () => {
    if (!driverLocation || stops.length === 0) return

    try {
      const result = await optimizeRouteMapbox(
        driverLocation,
        stops.map(s => ({
          latitude: s.latitud,
          longitude: s.longitud,
        }))
      )

      setRouteCoords(result.routeCoords)

      return result
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Error Mapbox'
      )
    }
  }, [driverLocation, stops])

  return { optimize }
}