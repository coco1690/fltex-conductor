// import { create } from 'zustand'
// import { supabase } from '../supabase/client'
// import type { Database } from '../supabase/types'

// export type RutaRow = Database['public']['Tables']['rutas']['Row']

// interface RutasState {
//   rutas: RutaRow[]
//   cargando: boolean
//   error: string | null

//   cargarRutas: () => Promise<void>
//   limpiarError: () => void
// }

// export const useRutasStore = create<RutasState>((set) => ({
//   rutas: [],
//   cargando: false,
//   error: null,

//   cargarRutas: async () => {
//     set({ cargando: true, error: null })
//     try {
//       const { data, error } = await supabase
//         .from('rutas')
//         .select('*')
//         .eq('activa', true)
//         .order('nombre')

//       if (error) throw error
//       set({ rutas: data || [] })
//     } catch (error: any) {
//       set({ error: error.message })
//     } finally {
//       set({ cargando: false })
//     }
//   },

//   limpiarError: () => set({ error: null })
// }))


import { create } from 'zustand'
import { supabase } from '../supabase/client'
import type { Database } from '../supabase/types'

export type RutaRow = Database['public']['Tables']['rutas']['Row']
export type PuntoAbordajeRow = Database['public']['Tables']['puntos_abordaje']['Row']

interface RutasState {
  rutas: RutaRow[]
  puntosAbordaje: PuntoAbordajeRow[]
  cargando: boolean
  error: string | null

  cargarRutas: () => Promise<void>
  cargarRutasPorAgencia: (agenciaId: string) => Promise<void>
  cargarPuntosAbordaje: (agenciaId: string) => Promise<void>
  limpiarError: () => void
}

export const useRutasStore = create<RutasState>((set) => ({
  rutas: [],
  puntosAbordaje: [],
  cargando: false,
  error: null,

  cargarRutas: async () => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase
        .from('rutas')
        .select('*')
        .eq('activa', true)
        .order('nombre')

      if (error) throw error
      set({ rutas: data || [] })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  // cargarRutasPorAgencia: async (agenciaId: string) => {
  //   set({ cargando: true, error: null })
  //   try {
  //     const { data, error } = await supabase
  //       .from('rutas')
  //       .select('*')
  //       .eq('activa', true)
  //       .or(`agencia_origen_id.eq.${agenciaId},agencia_destino_id.eq.${agenciaId}`)
  //       .order('nombre')

  //     if (error) throw error
  //     set({ rutas: data || [] })
  //   } catch (error: any) {
  //     set({ error: error.message })
  //   } finally {
  //     set({ cargando: false })
  //   }
  // },

  cargarRutasPorAgencia: async (agenciaId: string) => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase
        .from('rutas')
        .select('*')
        .eq('activa', true)
        .order('nombre')

      if (error) throw error
      set({ rutas: data || [] })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },
  cargarPuntosAbordaje: async (agenciaId: string) => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase
        .from('puntos_abordaje')
        .select('*')
        .eq('agencia_id', agenciaId)
        .eq('activo', true)
        .order('nombre')

      if (error) throw error
      set({ puntosAbordaje: data || [] })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  limpiarError: () => set({ error: null })
}))  