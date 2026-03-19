// // src/stores/notificacionesConductorStore.ts
// import { create } from 'zustand'
// import { supabase } from '../supabase/client'
// import type { Database } from '../supabase/types'
// import type { RealtimeChannel } from '@supabase/supabase-js'

// export type Notificacion = Database['public']['Tables']['notificaciones']['Row']
// export type TipoNotificacion = Database['public']['Enums']['tipo_notificacion']

// // tipos relevantes para el conductor
// const TIPOS_CONDUCTOR: TipoNotificacion[] = [
//   'vencimiento_suscripcion',
//   'suscripcion_suspendida',
//   'suscripcion_renovada',
//   'viaje_nuevo',
//   'viaje_cancelado',
//   'viaje_iniciado',
//   'liquidacion_pendiente',
//   'liquidacion_pagada',
// ]

// interface NotificacionesConductorState {
//   notificaciones: Notificacion[]
//   noLeidas: number
//   cargando: boolean
//   error: string | null
//   _canal: RealtimeChannel | null

//   cargarNotificaciones: (usuarioId: string) => Promise<void>
//   marcarLeida: (id: string, usuarioId: string) => Promise<void>
//   marcarTodasLeidas: (usuarioId: string) => Promise<void>
//   suscribirRealtime: (usuarioId: string) => void
//   desuscribirRealtime: () => void
//   limpiarError: () => void
// }

// export const useNotificacionesConductorStore =
//   create<NotificacionesConductorState>((set, get) => ({
//     notificaciones: [],
//     noLeidas: 0,
//     cargando: false,
//     error: null,
//     _canal: null,

//     cargarNotificaciones: async (usuarioId: string) => {
//       set({ cargando: true, error: null })
//       try {
//         const { data, error } = await supabase
//           .from('notificaciones')
//           .select('*')
//           .eq('usuario_id', usuarioId)
//           .in('tipo', TIPOS_CONDUCTOR)
//           .order('fecha_envio', { ascending: false })
//           .limit(50)

//         if (error) throw error

//         const lista = (data ?? []) as Notificacion[]
//         set({
//           notificaciones: lista,
//           noLeidas: lista.filter(n => !n.leida).length,
//         })
//       } catch (e: any) {
//         set({ error: e.message })
//       } finally {
//         set({ cargando: false })
//       }
//     },

//     marcarLeida: async (id: string, usuarioId: string) => {
//       try {
//         const { error } = await supabase.rpc('marcar_notificacion_leida', {
//           p_notificacion_id: id,
//           p_usuario_id: usuarioId,
//         })
//         if (error) throw error

//         set(state => {
//           const notificaciones = state.notificaciones.map(n =>
//             n.id === id
//               ? { ...n, leida: true, fecha_lectura: new Date().toISOString() }
//               : n
//           )
//           return {
//             notificaciones,
//             noLeidas: notificaciones.filter(n => !n.leida).length,
//           }
//         })
//       } catch (e: any) {
//         set({ error: e.message })
//       }
//     },

//     marcarTodasLeidas: async (usuarioId: string) => {
//       try {
//         const { error } = await supabase.rpc('marcar_todas_leidas', {
//           p_usuario_id: usuarioId,
//         })
//         if (error) throw error

//         set(state => ({
//           notificaciones: state.notificaciones.map(n => ({
//             ...n,
//             leida: true,
//             fecha_lectura: n.fecha_lectura ?? new Date().toISOString(),
//           })),
//           noLeidas: 0,
//         }))
//       } catch (e: any) {
//         set({ error: e.message })
//       }
//     },

//     suscribirRealtime: (usuarioId: string) => {
//       if (get()._canal) return

//       const canal = supabase
//         .channel(`notificaciones_conductor:${usuarioId}`)
//         .on(
//           'postgres_changes',
//           {
//             event: 'INSERT',
//             schema: 'public',
//             table: 'notificaciones',
//             filter: `usuario_id=eq.${usuarioId}`,
//           },
//           (payload) => {
//             const nueva = payload.new as Notificacion
//             if (!TIPOS_CONDUCTOR.includes(nueva.tipo)) return

//             set(state => ({
//               notificaciones: [nueva, ...state.notificaciones],
//               noLeidas: state.noLeidas + 1,
//             }))
//           }
//         )
//         .on('system', {}, (status: any) => {
//           if (
//             status.extension === 'postgres_changes' &&
//             status.status === 'CLOSED'
//           ) {
//             console.warn('Realtime conductor desconectado — reconectando...')
//             get().desuscribirRealtime()
//             get().suscribirRealtime(usuarioId)
//             get().cargarNotificaciones(usuarioId)
//           }
//         })
//         .subscribe()

//       set({ _canal: canal })
//     },

//     desuscribirRealtime: () => {
//       const canal = get()._canal
//       if (canal) {
//         supabase.removeChannel(canal)
//         set({ _canal: null })
//       }
//     },

//     limpiarError: () => set({ error: null }),
//   }))

// src/stores/notificacionesConductorStore.ts
import { create } from 'zustand'
import { supabase } from '../supabase/client'
import type { Database } from '../supabase/types'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { createAudioPlayer  } from 'expo-audio'

export type Notificacion = Database['public']['Tables']['notificaciones']['Row']
export type TipoNotificacion = Database['public']['Enums']['tipo_notificacion']

const TIPOS_CONDUCTOR: TipoNotificacion[] = [
  'vencimiento_suscripcion',
  'suscripcion_suspendida',
  'suscripcion_renovada',
  'viaje_nuevo',
  'viaje_cancelado',
  'viaje_iniciado',
  'liquidacion_pendiente',
  'liquidacion_pagada',
]

// función para reproducir el sonido — fuera del store para no
// guardar referencias al Sound object en el estado de Zustand
async function reproducirSonido() {
  try {
    const player = createAudioPlayer(
      require('../../assets/sounds/notification.wav')
    )
    player.play()

    // liberar memoria después de reproducir
    // expo-audio maneja esto automáticamente pero lo hacemos explícito
    setTimeout(() => {
      player.remove()
    }, 3000) // 3s es suficiente para cualquier sonido corto
  } catch (e) {
    console.warn('Error reproduciendo sonido:', e)
  }
}

interface NotificacionesConductorState {
  notificaciones: Notificacion[]
  noLeidas: number
  cargando: boolean
  error: string | null
  _canal: RealtimeChannel | null

  cargarNotificaciones: (usuarioId: string) => Promise<void>
  marcarLeida: (id: string, usuarioId: string) => Promise<void>
  marcarTodasLeidas: (usuarioId: string) => Promise<void>
  suscribirRealtime: (usuarioId: string) => void
  desuscribirRealtime: () => void
  limpiarError: () => void
}

export const useNotificacionesConductorStore =
  create<NotificacionesConductorState>((set, get) => ({
    notificaciones: [],
    noLeidas: 0,
    cargando: false,
    error: null,
    _canal: null,

    cargarNotificaciones: async (usuarioId: string) => {
      set({ cargando: true, error: null })
      try {
        const { data, error } = await supabase
          .from('notificaciones')
          .select('*')
          .eq('usuario_id', usuarioId)
          .in('tipo', TIPOS_CONDUCTOR)
          .order('fecha_envio', { ascending: false })
          .limit(50)

        if (error) throw error
        const lista = (data ?? []) as Notificacion[]
        set({
          notificaciones: lista,
          noLeidas: lista.filter(n => !n.leida).length,
        })
      } catch (e: any) {
        set({ error: e.message })
      } finally {
        set({ cargando: false })
      }
    },

    marcarLeida: async (id: string, usuarioId: string) => {
      try {
        const { error } = await supabase.rpc('marcar_notificacion_leida', {
          p_notificacion_id: id,
          p_usuario_id: usuarioId,
        })
        if (error) throw error
        set(state => {
          const notificaciones = state.notificaciones.map(n =>
            n.id === id
              ? { ...n, leida: true, fecha_lectura: new Date().toISOString() }
              : n
          )
          return {
            notificaciones,
            noLeidas: notificaciones.filter(n => !n.leida).length,
          }
        })
      } catch (e: any) {
        set({ error: e.message })
      }
    },

    marcarTodasLeidas: async (usuarioId: string) => {
      try {
        const { error } = await supabase.rpc('marcar_todas_leidas', {
          p_usuario_id: usuarioId,
        })
        if (error) throw error
        set(state => ({
          notificaciones: state.notificaciones.map(n => ({
            ...n,
            leida: true,
            fecha_lectura: n.fecha_lectura ?? new Date().toISOString(),
          })),
          noLeidas: 0,
        }))
      } catch (e: any) {
        set({ error: e.message })
      }
    },

    suscribirRealtime: (usuarioId: string) => {
      if (get()._canal) return

      const canal = supabase
        .channel(`notificaciones_conductor:${usuarioId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notificaciones',
            filter: `usuario_id=eq.${usuarioId}`,
          },
          (payload) => {
            const nueva = payload.new as Notificacion
            if (!TIPOS_CONDUCTOR.includes(nueva.tipo)) return

            // FIX: reproducir sonido solo para notificaciones relevantes
            // viaje_nuevo es la más importante para el conductor
            reproducirSonido()

            set(state => ({
              notificaciones: [nueva, ...state.notificaciones],
              noLeidas: state.noLeidas + 1,
            }))
          }
        )
        .on('system', {}, (status: any) => {
          if (
            status.extension === 'postgres_changes' &&
            status.status === 'CLOSED'
          ) {
            console.warn('Realtime conductor desconectado — reconectando...')
            get().desuscribirRealtime()
            get().suscribirRealtime(usuarioId)
            get().cargarNotificaciones(usuarioId)
          }
        })
        .subscribe()

      set({ _canal: canal })
    },

    desuscribirRealtime: () => {
      const canal = get()._canal
      if (canal) {
        supabase.removeChannel(canal)
        set({ _canal: null })
      }
    },

    limpiarError: () => set({ error: null }),
  }))