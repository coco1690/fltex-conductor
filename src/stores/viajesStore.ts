// import { create } from 'zustand'




import { create } from 'zustand'
import { supabase } from '../supabase/client'
import type { Database } from '../supabase/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

type ViajeRow = Database['public']['Tables']['viajes']['Row']

export type Viaje = ViajeRow & {
  rutas?: { nombre: string; agencia_origen_id: string; agencia_destino_id: string }
  puntos_abordaje?: { nombre: string; descripcion: string | null; latitud: number | null; longitud: number | null }
}

interface CrearViajeParams {
  conductor_id: string
  vehiculo_id: string
  ruta_id: string
  punto_abordaje_id: string | null  // ← era string, ahora acepta null
  hora_salida: string
  acepta_encomiendas: boolean
  carga_disponible_kg?: number
}

interface ViajesState {
  viajes: Viaje[]
  viajeActivo: Viaje | null
  cargando: boolean
  error: string | null
  viajesManana: Viaje[]
  viajeEnCurso: Viaje | null
  _canal: RealtimeChannel | null  // nuevo

  cargarViajeEnCurso: (conductorId: string) => Promise<void>
  cargarViajesManana: (conductorId: string) => Promise<void>
  buscarViajes: (rutaId: string) => Promise<void>
  cargarViajeDetalle: (viajeId: string) => Promise<void>
  cargarViajesDelDia: (conductorId: string) => Promise<void>
  crearViaje: (datos: CrearViajeParams) => Promise<string | null>
  iniciarAbordaje: (viajeId: string) => Promise<void>
  iniciarViaje: (viajeId: string, conductorId: string) => Promise<void>
  completarViaje: (viajeId: string, novedad?: string) => Promise<void>
  cancelarViaje: (viajeId: string, motivo: string, userId: string) => Promise<void>
  cargarHistorialViajes: (conductorId: string) => Promise<void>
  suscribirCuposRealtime: (conductorId: string) => void  // nuevo
  desuscribirCuposRealtime: () => void                   // nuevo
  limpiarError: () => void
}

export const useViajesStore = create<ViajesState>((set, get) => ({
  viajes: [],
  viajesManana: [],
  viajeActivo: null,
  cargando: false,
  error: null,
  viajeEnCurso: null,
  _canal: null,

  // ── REALTIME CUPOS ────────────────────────────────────────────
  suscribirCuposRealtime: (conductorId: string) => {
    if (get()._canal) return

    const canal = supabase
      .channel(`viajes_cupos:${conductorId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'viajes',
          // solo escuchar viajes de este conductor
          filter: `conductor_id=eq.${conductorId}`,
        },
        (payload) => {
          const viajeActualizado = payload.new as ViajeRow

          set(state => {
            // actualizar en la lista de viajes del día
            const viajes = state.viajes.map(v =>
              v.id === viajeActualizado.id
                ? {
                  ...v,
                  cupos_reservados: viajeActualizado.cupos_reservados,
                  cupos_confirmados: viajeActualizado.cupos_confirmados,
                  cupos_totales: viajeActualizado.cupos_totales,
                  estado: viajeActualizado.estado,
                }
                : v
            )

            // actualizar viajeActivo si es el mismo viaje
            const viajeActivo = state.viajeActivo?.id === viajeActualizado.id
              ? {
                ...state.viajeActivo,
                cupos_reservados: viajeActualizado.cupos_reservados,
                cupos_confirmados: viajeActualizado.cupos_confirmados,
                cupos_totales: viajeActualizado.cupos_totales,
                estado: viajeActualizado.estado,
              }
              : state.viajeActivo

            // actualizar viajeEnCurso si es el mismo viaje
            const viajeEnCurso = state.viajeEnCurso?.id === viajeActualizado.id
              ? {
                ...state.viajeEnCurso,
                cupos_reservados: viajeActualizado.cupos_reservados,
                cupos_confirmados: viajeActualizado.cupos_confirmados,
                cupos_totales: viajeActualizado.cupos_totales,
                estado: viajeActualizado.estado,
              }
              : state.viajeEnCurso

            return { viajes, viajeActivo, viajeEnCurso }
          })
        }
      )
      .subscribe()

    set({ _canal: canal })
  },

  desuscribirCuposRealtime: () => {
    const canal = get()._canal
    if (canal) {
      supabase.removeChannel(canal)
      set({ _canal: null })
    }
  },
  // ─────────────────────────────────────────────────────────────

  cargarViajeEnCurso: async (conductorId: string) => {
    try {
      const { data, error } = await supabase
        .from('viajes')
        .select(`*, rutas (nombre), puntos_abordaje (nombre)`)
        .eq('conductor_id', conductorId)
        .in('estado', ['abordando', 'en_curso'])
        .order('hora_salida_programada', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error
      set({ viajeEnCurso: data as unknown as Viaje ?? null })
    } catch (error: any) {
      console.log('❌ cargarViajeEnCurso error:', error.message)
    }
  },

  buscarViajes: async (rutaId: string) => {
    set({ cargando: true, error: null })
    try {
      const ahora = new Date().toISOString()
      const { data, error } = await supabase
        .from('viajes')
        .select(`
          *,
          rutas (nombre, agencia_origen_id, agencia_destino_id),
          puntos_abordaje (nombre, descripcion, latitud, longitud)
        `)
        .eq('ruta_id', rutaId)
        .in('estado', ['programado', 'abordando'])
        .gte('hora_salida_programada', ahora)
        .order('hora_salida_programada', { ascending: true })

      if (error) throw error
      set({ viajes: (data || []) as unknown as Viaje[] })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  cargarViajeDetalle: async (viajeId: string) => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase
        .from('viajes')
        .select(`
          *,
          rutas (nombre, agencia_origen_id, agencia_destino_id),
          puntos_abordaje (nombre, descripcion, latitud, longitud)
        `)
        .eq('id', viajeId)
        .single()

      if (error) throw error
      set({ viajeActivo: data as unknown as Viaje })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  cargarViajesDelDia: async (conductorId: string) => {
    set({ cargando: true, error: null })
    try {
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      const manana = new Date(hoy)
      manana.setDate(manana.getDate() + 1)

      const { data, error } = await supabase
        .from('viajes')
        .select(`*, rutas (nombre), puntos_abordaje (nombre)`)
        .eq('conductor_id', conductorId)
        .in('estado', ['programado', 'abordando', 'en_curso'])
        .gte('hora_salida_programada', hoy.toISOString())
        .lt('hora_salida_programada', manana.toISOString())
        .order('hora_salida_programada', { ascending: true })

      if (error) throw error

      const viajes = (data || []) as unknown as Viaje[]
      set({ viajes })

      const activo = viajes.find(v =>
        v.estado === 'abordando' || v.estado === 'en_curso'
      )
      if (activo) set({ viajeActivo: activo })

    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  cargarViajesManana: async (conductorId: string) => {
    try {
      const manana = new Date()
      manana.setDate(manana.getDate() + 1)
      manana.setHours(0, 0, 0, 0)
      const pasadoManana = new Date(manana)
      pasadoManana.setDate(pasadoManana.getDate() + 1)

      const { data, error } = await supabase
        .from('viajes')
        .select(`*, rutas (nombre), puntos_abordaje (nombre)`)
        .eq('conductor_id', conductorId)
        .in('estado', ['programado', 'abordando', 'en_curso'])
        .gte('hora_salida_programada', manana.toISOString())
        .lt('hora_salida_programada', pasadoManana.toISOString())
        .order('hora_salida_programada', { ascending: true })

      if (error) throw error
      set({ viajesManana: (data || []) as unknown as Viaje[] })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  crearViaje: async (datos: CrearViajeParams) => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase.rpc('crear_viaje', {
        p_conductor_id: datos.conductor_id,
        p_vehiculo_id: datos.vehiculo_id,
        p_ruta_id: datos.ruta_id,
        p_punto_abordaje_id: (datos.punto_abordaje_id || null) as any,
        p_hora_salida: datos.hora_salida,
        p_acepta_encomiendas: datos.acepta_encomiendas,
        p_carga_disponible_kg: datos.carga_disponible_kg ?? 0
      })

      if (error) throw error
      await get().cargarViajesDelDia(datos.conductor_id)
      return data?.id ?? null
    } catch (error: any) {
      set({ error: error.message })
      return null
    } finally {
      set({ cargando: false })
    }
  },

  iniciarAbordaje: async (viajeId: string) => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase
        .from('viajes')
        .update({ estado: 'abordando' })
        .eq('id', viajeId)
        .select()
        .single()

      if (error) throw error
      set({ viajeActivo: data as unknown as Viaje })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  iniciarViaje: async (viajeId: string, conductorId: string) => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase.rpc('iniciar_viaje', {
        p_viaje_id: viajeId,
        p_conductor_id: conductorId
      })

      if (error) throw error

      const viajeActualizado = data as unknown as Viaje
      set(state => ({
        viajeActivo: viajeActualizado,
        viajeEnCurso: viajeActualizado,
        viajes: state.viajes.map(v =>
          v.id === viajeId ? { ...v, estado: 'en_curso' } : v
        ),
      }))
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  completarViaje: async (viajeId: string, novedad?: string) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase
        .from('viajes')
        .update({
          estado: 'completado',
          hora_llegada_real: new Date().toISOString(),
          observaciones: novedad ?? null
        })
        .eq('id', viajeId)

      if (error) throw error
      set({ viajeActivo: null, viajes: [] })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  cancelarViaje: async (viajeId: string, motivo: string, userId: string) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase
        .from('viajes')
        .update({
          estado: 'cancelado',
          motivo_cancelacion: motivo,
          cancelado_por: userId
        })
        .eq('id', viajeId)

      if (error) throw error
      set({ viajeActivo: null })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  cargarHistorialViajes: async (conductorId: string) => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase
        .from('viajes')
        .select(`*, rutas (nombre)`)
        .eq('conductor_id', conductorId)
        .in('estado', ['completado', 'cancelado', 'en_curso'])
        .order('hora_salida_programada', { ascending: false })
        .limit(5)

      if (error) throw error
      set({ viajes: (data || []) as unknown as Viaje[] })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  limpiarError: () => set({ error: null })
}))