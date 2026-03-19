import { create } from 'zustand'
import { supabase } from '../supabase/client'
import type { Database } from '../supabase/types'

type EncomiendaRow = Database['public']['Tables']['encomiendas']['Row']
type EstadoEncomienda = Database['public']['Enums']['estado_encomienda']

type Encomienda = EncomiendaRow & {
  eventos_encomienda?: {
    id: string
    estado_nuevo: EstadoEncomienda
    descripcion: string
    fecha: string
  }[]
}

interface EncomiendasState {
  encomiendas: Encomienda[]
  encomiendaActiva: Encomienda | null
  cargando: boolean
  error: string | null

  cargarEncomiendas: (usuarioId: string) => Promise<void>
  cargarEncomiendasViaje: (viajeId: string) => Promise<void>
  buscarPorCodigo: (codigo: string) => Promise<void>
  actualizarEstado: (
    encomiendaId: string,
    estado: EstadoEncomienda,
    descripcion: string,
    registradoPor: string,
    recibidaPor?: string,
    firmaEntrega?: string
  ) => Promise<void>
  limpiarError: () => void
}

export const useEncomiendasStore = create<EncomiendasState>((set) => ({
  encomiendas: [],
  encomiendaActiva: null,
  cargando: false,
  error: null,

  cargarEncomiendas: async (usuarioId: string) => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase
        .from('encomiendas')
        .select('*')
        .eq('remitente_id', usuarioId)
        .order('fecha_registro', { ascending: false })

      if (error) throw error
      set({ encomiendas: (data || []) as Encomienda[] })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  cargarEncomiendasViaje: async (viajeId: string) => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase
        .from('encomiendas')
        .select('*')
        .eq('viaje_id', viajeId)
        .order('fecha_registro', { ascending: true })

      if (error) throw error
      set({ encomiendas: (data || []) as Encomienda[] })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  buscarPorCodigo: async (codigo: string) => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase
        .from('encomiendas')
        .select(`
          *,
          eventos_encomienda (
            id, estado_nuevo, descripcion, fecha
          )
        `)
        .eq('codigo_rastreo', codigo.toUpperCase())
        .single()

      if (error) throw error
      set({ encomiendaActiva: data as unknown as Encomienda })
    } catch (error: any) {
      set({ error: 'Encomienda no encontrada' })
    } finally {
      set({ cargando: false })
    }
  },

  actualizarEstado: async (
    encomiendaId: string,
    estado: EstadoEncomienda,
    descripcion: string,
    registradoPor: string,
    recibidaPor?: string,
    firmaEntrega?: string
  ) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase.rpc('actualizar_estado_encomienda', {
        p_encomienda_id: encomiendaId,
        p_estado_nuevo: estado,
        p_descripcion: descripcion,
        p_registrado_por: registradoPor,
        p_recibida_por: recibidaPor,
        p_firma_entrega: firmaEntrega
      })

      if (error) throw error
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  limpiarError: () => set({ error: null })
}))