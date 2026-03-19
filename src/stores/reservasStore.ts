// import { create } from 'zustand'
// import { supabase } from '../supabase/client'
// import type { Database, Tables } from '../supabase/types'
// import type { PasajeroForm } from './useReservaFormStore'

// type ReservaRow = Tables<'reservas'>
// type ReservaPasajero = Tables<'reserva_pasajeros'>

// type Reserva = ReservaRow & {
//   viajes?: {
//     hora_salida_programada: string
//     rutas?: { nombre: string }
//     puntos_abordaje?: { nombre: string }
//     conductores?: {
//       numero_licencia: string
//       usuarios?: { nombre: string; telefono: string | null }
//       vehiculos?: { placa: string; tipo: string; capacidad_pasajeros: number }
//     }
//   }
//   reserva_pasajeros?: ReservaPasajero[]
// }

// interface ReservasState {
//   reservasActivas: Reserva[]
//   historial: Reserva[]
//   cargando: boolean
//   error: string | null

//   cargarReservasActivas: (pasajeroId: string) => Promise<void>
//   crearReserva: (
//     viajeId: string,
//     pasajeroId: string,
//     cupos: number,
//     pasajeros: PasajeroForm[]
//   ) => Promise<boolean>
//   cancelarReserva: (reservaId: string, userId: string) => Promise<void>
//   cargarHistorial: (pasajeroId: string) => Promise<void>
//   cargarReservasViaje: (viajeId: string) => Promise<Reserva[]>
//   abordarPasajero: (reservaId: string, conductorUserId: string) => Promise<void>
//   agregarPasajeroDirecto: (viajeId: string, conductorUsuarioId: string, nombre: string, telefono?: string) => Promise<boolean>
//   marcarNoShowPasajero: (reservaPasajeroId: string, conductorUsuarioId: string) => Promise<void>
//   marcarNoShow: (reservaId: string, conductorUserId: string) => Promise<void>
//   limpiarError: () => void
// }

// export const useReservasStore = create<ReservasState>((set) => ({
//   reservasActivas: [],
//   historial: [],
//   cargando: false,
//   error: null,

//   cargarReservasActivas: async (pasajeroId) => {
//     set({ cargando: true, error: null })
//     try {
//       const { data, error } = await supabase
//         .from('reservas')
//         .select(`
//           *,
//           reserva_pasajeros (*),
//           viajes (
//             hora_salida_programada,
//             rutas (nombre),
//             puntos_abordaje (nombre),
//             conductores (
//               numero_licencia,
//               usuarios (nombre, telefono),
//               vehiculos!conductores_vehiculo_id_fkey (placa, tipo, capacidad_pasajeros)
//             )
//           )
//         `)
//         .eq('pasajero_id', pasajeroId)
//         .eq('estado', 'reservada')
//         .order('fecha_reserva', { ascending: false })

//       if (error) throw error
//       set({ reservasActivas: (data || []) as unknown as Reserva[] })
//     } catch (error: any) {
//       set({ error: error.message })
//     } finally {
//       set({ cargando: false })
//     }
//   },

//   crearReserva: async (viajeId, pasajeroId, cupos, pasajeros) => {
//     set({ cargando: true, error: null })
//     try {
//       const { data, error } = await supabase.rpc('crear_reserva', {
//         p_viaje_id: viajeId,
//         p_pasajero_id: pasajeroId,
//         p_cupos: cupos,
//         p_pasajeros: pasajeros,
//       })

//       if (error) throw error

//       // Recargar todas las reservas activas
//       const { data: reservas, error: errorReservas } = await supabase
//         .from('reservas')
//         .select(`
//           *,
//           reserva_pasajeros (*),
//           viajes (
//             hora_salida_programada,
//             rutas (nombre),
//             puntos_abordaje (nombre),
//             conductores (
//               numero_licencia,
//               usuarios (nombre, telefono),
//               vehiculos!conductores_vehiculo_id_fkey (placa, tipo, capacidad_pasajeros)
//             )
//           )
//         `)
//         .eq('pasajero_id', pasajeroId)
//         .eq('estado', 'reservada')
//         .order('fecha_reserva', { ascending: false })

//       if (errorReservas) throw errorReservas
//       set({ reservasActivas: (reservas || []) as unknown as Reserva[] })
//       return true
//     } catch (error: any) {
//       set({ error: error.message })
//       return false
//     } finally {
//       set({ cargando: false })
//     }
//   },

//   cancelarReserva: async (reservaId, userId) => {
//     set({ cargando: true, error: null })
//     try {
//       const { error } = await supabase.rpc('cancelar_reserva', {
//         p_reserva_id: reservaId,
//         p_cancelado_por: userId,
//         p_motivo: 'Cancelada por el pasajero',
//       })
//       if (error) throw error
//       // Quitar la reserva cancelada de la lista
//       set((state) => ({
//         reservasActivas: state.reservasActivas.filter((r) => r.id !== reservaId)
//       }))
//     } catch (error: any) {
//       set({ error: error.message })
//     } finally {
//       set({ cargando: false })
//     }
//   },

//   cargarHistorial: async (pasajeroId) => {
//     set({ cargando: true, error: null })
//     try {
//       const { data, error } = await supabase
//         .from('reservas')
//         .select(`
//           *,
//           reserva_pasajeros (*),
//           viajes (hora_salida_programada, rutas (nombre), puntos_abordaje (nombre))
//         `)
//         .eq('pasajero_id', pasajeroId)
//         .order('fecha_reserva', { ascending: false })

//       if (error) throw error
//       set({ historial: (data || []) as unknown as Reserva[] })
//     } catch (error: any) {
//       set({ error: error.message })
//     } finally {
//       set({ cargando: false })
//     }
//   },

//   cargarReservasViaje: async (viajeId) => {
//     try {
//       const { data, error } = await supabase
//         .from('reservas')
//         .select(`
//         *,
//         reserva_pasajeros (*),
//         puntos_abordaje (id, nombre, descripcion) 
//       `)
//         .eq('viaje_id', viajeId)
//         .in('estado', ['reservada', 'abordada', 'no_show'])  // 👈 todos los estados
//         .order('fecha_reserva', { ascending: true })

//       if (error) throw error
//       return (data || []) as unknown as Reserva[]
//     } catch (error: any) {
//       set({ error: error.message })
//       return []
//     }
//   },

//   abordarPasajero: async (reservaId, conductorUserId) => {
//     try {
//       const { data, error } = await supabase.rpc('abordar_pasajero', {
//         p_reserva_id: reservaId,
//         p_conductor_usuario_id: conductorUserId,
//       })
//       console.log('abordar resultado:', data, error)  // 👈
//       if (error) throw error
//     } catch (error: any) {
//       console.log('abordar error:', error.message)  // 👈
//       set({ error: error.message })
//     }
//   },

//   agregarPasajeroDirecto: async (viajeId: string, conductorUsuarioId: string, nombre: string, telefono?: string) => {
//     try {
//       const { data, error } = await supabase.rpc('agregar_pasajero_directo', {
//         p_viaje_id: viajeId,
//         p_conductor_usuario_id: conductorUsuarioId,
//         p_nombre: nombre,
//         p_telefono: telefono ?? null,
//       })
//       if (error) throw error
//       return true
//     } catch (error: any) {
//       set({ error: error.message })
//       return false
//     }
//   },

//   marcarNoShowPasajero: async (reservaPasajeroId: string, conductorUsuarioId: string) => {
//     try {
//       const { error } = await supabase.rpc('marcar_no_show_pasajero', {
//         p_reserva_pasajero_id: reservaPasajeroId,
//         p_conductor_usuario_id: conductorUsuarioId,
//       })
//       if (error) throw error
//     } catch (error: any) {
//       set({ error: error.message })
//     }
//   },

//   marcarNoShow: async (reservaId, conductorUserId) => {
//     try {
//       const { error } = await supabase.rpc('marcar_no_show', {
//         p_reserva_id: reservaId,
//         p_conductor_usuario_id: conductorUserId,
//       })
//       if (error) throw error
//     } catch (error: any) {
//       set({ error: error.message })
//     }
//   },

//   limpiarError: () => set({ error: null }),
// }))

import { create } from 'zustand'
import { supabase } from '../supabase/client'
import type { Database, Tables } from '../supabase/types'
import type { PasajeroForm } from './useReservaFormStore'

type ReservaRow = Tables<'reservas'>
type ReservaPasajero = Tables<'reserva_pasajeros'>

type Reserva = ReservaRow & {
  viajes?: {
    hora_salida_programada: string
    rutas?: { nombre: string }
    puntos_abordaje?: { nombre: string }
    conductores?: {
      numero_licencia: string
      usuarios?: { nombre: string; telefono: string | null }
      vehiculos?: { placa: string; tipo: string; capacidad_pasajeros: number }
    }
  }
  reserva_pasajeros?: ReservaPasajero[]
}

interface ReservasState {
  reservasActivas: Reserva[]
  historial: Reserva[]
  cargando: boolean
  error: string | null

  cargarReservasActivas: (pasajeroId: string) => Promise<void>
  crearReserva: (viajeId: string, pasajeroId: string, cupos: number, pasajeros: PasajeroForm[]) => Promise<boolean>
  cancelarReserva: (reservaId: string, userId: string) => Promise<void>
  cargarHistorial: (pasajeroId: string) => Promise<void>
  cargarReservasViaje: (viajeId: string) => Promise<Reserva[]>
  abordarPasajero: (reservaId: string, conductorUserId: string) => Promise<void>
  agregarPasajeroDirecto: (viajeId: string, conductorUsuarioId: string, nombre: string, telefono?: string) => Promise<boolean>
  marcarNoShowPasajero: (reservaPasajeroId: string, conductorUsuarioId: string) => Promise<void>
  marcarNoShow: (reservaId: string, conductorUserId: string) => Promise<void>
  limpiarError: () => void
}

export const useReservasStore = create<ReservasState>((set) => ({
  reservasActivas: [],
  historial: [],
  cargando: false,
  error: null,

  cargarReservasActivas: async (pasajeroId) => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase
        .from('reservas')
        .select(`
          *,
          reserva_pasajeros (*),
          viajes (
            hora_salida_programada,
            rutas (nombre),
            puntos_abordaje (nombre),
            conductores (
              numero_licencia,
              usuarios (nombre, telefono),
              vehiculos!conductores_vehiculo_id_fkey (placa, tipo, capacidad_pasajeros)
            )
          )
        `)
        .eq('pasajero_id', pasajeroId)
        .eq('estado', 'reservada')
        .order('fecha_reserva', { ascending: false })

      if (error) throw error
      set({ reservasActivas: (data || []) as unknown as Reserva[] })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  crearReserva: async (viajeId, pasajeroId, cupos, pasajeros) => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase.rpc('crear_reserva', {
        p_viaje_id: viajeId,
        p_pasajero_id: pasajeroId,
        p_cupos: cupos,
        p_pasajeros: pasajeros as any,
      })

      if (error) throw error

      const { data: reservas, error: errorReservas } = await supabase
        .from('reservas')
        .select(`
          *,
          reserva_pasajeros (*),
          viajes (
            hora_salida_programada,
            rutas (nombre),
            puntos_abordaje (nombre),
            conductores (
              numero_licencia,
              usuarios (nombre, telefono),
              vehiculos!conductores_vehiculo_id_fkey (placa, tipo, capacidad_pasajeros)
            )
          )
        `)
        .eq('pasajero_id', pasajeroId)
        .eq('estado', 'reservada')
        .order('fecha_reserva', { ascending: false })

      if (errorReservas) throw errorReservas
      set({ reservasActivas: (reservas || []) as unknown as Reserva[] })
      return true
    } catch (error: any) {
      set({ error: error.message })
      return false
    } finally {
      set({ cargando: false })
    }
  },

  cancelarReserva: async (reservaId, userId) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase.rpc('cancelar_reserva', {
        p_reserva_id: reservaId,
        p_cancelado_por: userId,
        p_motivo: 'Cancelada por el pasajero',
      })
      if (error) throw error
      set((state) => ({
        reservasActivas: state.reservasActivas.filter((r) => r.id !== reservaId)
      }))
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  cargarHistorial: async (pasajeroId) => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase
        .from('reservas')
        .select(`
          *,
          reserva_pasajeros (*),
          viajes (hora_salida_programada, rutas (nombre), puntos_abordaje (nombre))
        `)
        .eq('pasajero_id', pasajeroId)
        .order('fecha_reserva', { ascending: false })

      if (error) throw error
      set({ historial: (data || []) as unknown as Reserva[] })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  cargarReservasViaje: async (viajeId) => {
    try {
      const { data, error } = await supabase
        .from('reservas')
        .select(`
          *,
          reserva_pasajeros (*),
          puntos_abordaje (id, nombre, descripcion)
        `)
        .eq('viaje_id', viajeId)
        .in('estado', ['reservada', 'abordada', 'no_show'])
        .order('fecha_reserva', { ascending: true })

      if (error) throw error
      return (data || []) as unknown as Reserva[]
    } catch (error: any) {
      set({ error: error.message })
      return []
    }
  },

  // FIX: abordarPasajero ya NO recarga viajeActivo internamente.
  // La recarga la maneja siempre el componente (ViajeCurso → recargarTodo)
  // para evitar doble llamada a cargarViajeDetalle que causaba
  // cupos_confirmados = 4 en lugar de 2.
  abordarPasajero: async (reservaId, conductorUserId) => {
    try {
      const { error } = await supabase.rpc('abordar_pasajero', {
        p_reserva_id: reservaId,
        p_conductor_usuario_id: conductorUserId,
      })
      if (error) throw error
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  // FIX: igual — agregarPasajeroDirecto tampoco recarga viajeActivo.
  // El componente llama onRecargar() después de que esta función retorna.
  agregarPasajeroDirecto: async (viajeId, conductorUsuarioId, nombre, telefono) => {
    try {
      const { error } = await supabase.rpc('agregar_pasajero_directo', {
        p_viaje_id: viajeId,
        p_conductor_usuario_id: conductorUsuarioId,
        p_nombre: nombre,
        p_telefono: telefono,
      })
      if (error) throw error
      return true
    } catch (error: any) {
      set({ error: error.message })
      return false
    }
  },

  marcarNoShowPasajero: async (reservaPasajeroId, conductorUsuarioId) => {
    try {
      const { error } = await supabase.rpc('marcar_no_show_pasajero', {
        p_reserva_pasajero_id: reservaPasajeroId,
        p_conductor_usuario_id: conductorUsuarioId,
      })
      if (error) throw error
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  marcarNoShow: async (reservaId, conductorUserId) => {
    try {
      const { error } = await supabase.rpc('marcar_no_show', {
        p_reserva_id: reservaId,
        p_conductor_usuario_id: conductorUserId,
      })
      if (error) throw error
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  limpiarError: () => set({ error: null }),
}))