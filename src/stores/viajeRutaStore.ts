import { create } from 'zustand'
import { supabase } from '../supabase/client'

export type RouteCoord = { latitude: number; longitude: number }

export type StopAbordaje = {
  reservaId: string
  puntoAbordajeId: string | null
  nombrePunto: string
  nombrePasajero: string
  telefonoPasajero: string | null
  cuposSolicitados: number
  latitud: number
  longitud: number
  estadoReserva: 'reservada' | 'abordada' | 'no_show' | 'cancelada'
  ordenMapbox: number | null
}

type ViajeRutaStore = {
  driverLocation: RouteCoord | null
  routeCoords: RouteCoord[]
  stops: StopAbordaje[]
  isOptimizing: boolean
  error: string | null

  setDriverLocation: (loc: RouteCoord | null) => void
  setError: (e: string | null) => void

  buildStops: (reservas: any[]) => void
  applyMapboxOrder: (waypoints: { waypoint_index: number }[]) => void
  saveRutaOptimizada: (params: {
    viajeId: string
    routeCoords: RouteCoord[]
    distancia: number
    duracion: number
  }) => Promise<void>
  markStopAsAbordado: (reservaId: string) => void
  reset: () => void
}

export const useViajeRutaStore = create<ViajeRutaStore>((set, get) => ({
  driverLocation: null,
  routeCoords: [],
  stops: [],
  isOptimizing: false,
  error: null,

  setDriverLocation: (driverLocation) => set({ driverLocation }),
  setError: (error) => set({ error }),

  buildStops: (reservas) => {
    const stops: StopAbordaje[] = []

    for (const reserva of reservas) {
      if (reserva.estado === 'cancelada') continue

      // Prioridad 1: punto de abordaje fijo con coords
      const pto = reserva.puntos_abordaje
      if (pto?.latitud != null && pto?.longitud != null) {
        stops.push({
          reservaId: reserva.id,
          puntoAbordajeId: pto.id ?? null,
          nombrePunto: pto.nombre,
          nombrePasajero: reserva.reserva_pasajeros?.[0]?.nombres ?? 'Pasajero',
          telefonoPasajero: reserva.reserva_pasajeros?.[0]?.telefono ?? null,
          cuposSolicitados: reserva.cupos_solicitados ?? 1,
          latitud: pto.latitud,
          longitud: pto.longitud,
          estadoReserva: reserva.estado,
          ordenMapbox: null,
        })
        continue
      }

      // Prioridad 2: ubicación GPS del pasajero
      const titular = reserva.reserva_pasajeros?.[0]
      if (titular?.latitud != null && titular?.longitud != null) {
        stops.push({
          reservaId: reserva.id,
          puntoAbordajeId: null,
          nombrePunto: 'Ubicación del pasajero',
          nombrePasajero: titular.nombres ?? 'Pasajero',
          telefonoPasajero: titular.telefono ?? null,
          cuposSolicitados: reserva.cupos_solicitados ?? 1,
          latitud: titular.latitud,
          longitud: titular.longitud,
          estadoReserva: reserva.estado,
          ordenMapbox: null,
        })
      }
      // Sin coords → no aparece en el mapa
    }

    set({ stops })
  },

  applyMapboxOrder: (waypoints) => {
    const { stops } = get()
    const ordenPorPosicion = new Map<number, number>()
    waypoints.forEach((wp, visitOrder) => {
      ordenPorPosicion.set(wp.waypoint_index, visitOrder)
    })

    const stopsConOrden = stops.map((stop, posOriginal) => {
      const ordenVisita = ordenPorPosicion.get(posOriginal + 1) ?? null
      return { ...stop, ordenMapbox: ordenVisita }
    })

    stopsConOrden.sort((a, b) => (a.ordenMapbox ?? 999) - (b.ordenMapbox ?? 999))
    set({ stops: stopsConOrden })
  },

  saveRutaOptimizada: async ({ viajeId, routeCoords, distancia, duracion }) => {
    try {
      set({ isOptimizing: true, error: null })
      const { error } = await supabase
        .from('viajes')
        .update({
          ruta_optimizada_json: routeCoords,
          distancia_total_metros: distancia,
          duracion_total_segundos: duracion,
          ultima_optimizacion: new Date().toISOString(),
        })
        .eq('id', viajeId)

      if (error) throw error
      set({ routeCoords })
    } catch (e: any) {
      set({ error: e.message ?? 'Error al guardar ruta' })
    } finally {
      set({ isOptimizing: false })
    }
  },

  markStopAsAbordado: (reservaId) =>
    set((state) => ({
      stops: state.stops.map((s) =>
        s.reservaId === reservaId ? { ...s, estadoReserva: 'abordada' } : s
      ),
    })),

  reset: () =>
    set({
      driverLocation: null,
      routeCoords: [],
      stops: [],
      isOptimizing: false,
      error: null,
    }),
}))