

// import { create } from 'zustand'
// import { supabase } from '../supabase/client'
// import type { Database } from '../supabase/types'

// type UsuarioRow = Database['public']['Tables']['usuarios']['Row']
// type ConductorRow = Database['public']['Tables']['conductores']['Row']

// interface AuthState {
//   usuario: UsuarioRow | null
//   // undefined = no cargado aún | null = no existe en DB | ConductorRow = cargado
//   conductor: ConductorRow | null | undefined
//   cargando: boolean
//   error: string | null
//   listo: boolean  // para el splash y el guardia de navegación

//   iniciarSesion: (telefono: string) => Promise<void>
//   verificarCodigo: (telefono: string, codigo: string) => Promise<void>
//   cerrarSesion: () => Promise<void>
//   cargarPerfil: () => Promise<void>
//   actualizarTokenPush: (token: string) => Promise<void>
//   limpiarError: () => void
// }

// export const useAuthStore = create<AuthState>((set, get) => ({
//   usuario: null,
//   conductor: undefined,  // undefined = estado inicial, aún no consultado
//   cargando: false,
//   error: null,
//   listo: false,

//   iniciarSesion: async (telefono: string) => {
//     set({ cargando: true, error: null })
//     try {
//       const { error } = await supabase.auth.signInWithOtp({ phone: telefono })
//       if (error) throw error
//     } catch (error: any) {
//       set({ error: error.message })
//     } finally {
//       set({ cargando: false })
//     }
//   },

//   verificarCodigo: async (telefono: string, codigo: string) => {
//     set({ cargando: true, error: null })
//     try {
//       const { data, error } = await supabase.auth.verifyOtp({
//         phone: telefono,
//         token: codigo,
//         type: 'sms'
//       })
//       if (error) throw error
//       if (!data?.session || !data?.user) {
//         throw new Error('No se recibió sesión tras verificar el código.')
//       }
//       await supabase.rpc('ensure_usuario_profile' as any)
//       await get().cargarPerfil()
//     } catch (error: any) {
//       set({ error: error.message })
//     } finally {
//       set({ cargando: false })
//     }
//   },

//   cargarPerfil: async () => {
//     // FIX: no resetear usuario/conductor a null antes de cargar
//     // solo marcamos cargando para el spinner
//     set({ cargando: true, error: null })
//     try {
//       const { data: { user } } = await supabase.auth.getUser()
//       if (!user) throw new Error('No hay sesión activa')

//       const { data: usuarioData, error: usuarioError } = await supabase
//         .from('usuarios')
//         .select('*')
//         .eq('id', user.id)
//         .maybeSingle()

//       if (usuarioError) throw usuarioError
//       if (!usuarioData) throw new Error('No se pudo leer el perfil.')

//       set({ usuario: usuarioData })

//       if (usuarioData.rol === 'conductor') {
//         const { data: conductorData, error: conductorError } = await supabase
//           .from('conductores')
//           .select('*')
//           .eq('usuario_id', user.id)
//           .maybeSingle()

//         if (conductorError) throw conductorError
//         // null aquí significa que el usuario tiene rol conductor pero
//         // no tiene registro en la tabla conductores todavía
//         set({ conductor: conductorData ?? null })
//       } else {
//         // no es conductor — dejamos conductor en null explícitamente
//         set({ conductor: null })
//       }

//     } catch (error: any) {
//       set({ error: error.message, usuario: null, conductor: undefined })
//     } finally {
//       set({ cargando: false })
//     }
//   },

//   cerrarSesion: async () => {
//     set({ cargando: true })
//     try {
//       await supabase.auth.signOut()
//       // FIX: no reseteamos usuario/conductor aquí manualmente.
//       // el onAuthStateChange en _layout dispara SIGNED_OUT y lo hace.
//       // si lo hacemos aquí también, es un doble reset con posible race.
//     } catch (error: any) {
//       set({ error: error.message })
//     } finally {
//       set({ cargando: false })
//     }
//   },

//   actualizarTokenPush: async (token: string) => {
//     try {
//       const { usuario } = get()
//       if (!usuario) return
//       const { error } = await supabase
//         .from('usuarios')
//         .update({ token_push: token })
//         .eq('id', usuario.id)
//       if (error) throw error
//       set({ usuario: { ...usuario, token_push: token } })
//     } catch (error: any) {
//       set({ error: error.message })
//     }
//   },

//   limpiarError: () => set({ error: null })
// }))


import { create } from 'zustand'
import { supabase } from '../supabase/client'
import type { Database } from '../supabase/types'

type UsuarioRow = Database['public']['Tables']['usuarios']['Row']
type ConductorRow = Database['public']['Tables']['conductores']['Row']

// tipo de la vista perfil_conductor
export interface PerfilConductor {
  usuario_id: string
  nombre: string
  telefono: string | null
  email: string | null
  rol: string
  estado: string
  token_push: string | null
  ultimo_acceso: string | null
  // conductor
  conductor_id: string | null
  numero_licencia: string | null
  categoria_licencia: string | null
  fecha_vencimiento_licencia: string | null
  fecha_corte: string | null
  estado_suscripcion: Database['public']['Enums']['estado_suscripcion'] | null
  numero_nequi: string | null
  foto_perfil: string | null
  agencia_id: string | null
  // vehículo
  vehiculo_id: string | null
  placa: string | null
  marca: string | null
  modelo: string | null
  anio: number | null
  vehiculo_tipo: Database['public']['Enums']['tipo_vehiculo'] | null
  capacidad_pasajeros: number | null
  capacidad_carga_kg: number | null
  vehiculo_estado: Database['public']['Enums']['estado_vehiculo'] | null
  vehiculo_foto: string | null
  // agencia
  agencia_nombre: string | null
  agencia_codigo: string | null
  agencia_telefono: string | null
  agencia_direccion: string | null
  // región
  region_nombre: string | null
}

interface AuthState {
  usuario: UsuarioRow | null
  conductor: ConductorRow | null | undefined
  perfil: PerfilConductor | null  // vista completa
  cargando: boolean
  error: string | null
  listo: boolean

  iniciarSesion: (telefono: string) => Promise<void>
  verificarCodigo: (telefono: string, codigo: string) => Promise<void>
  cerrarSesion: () => Promise<void>
  cargarPerfil: () => Promise<void>
  actualizarTokenPush: (token: string) => Promise<void>
  limpiarError: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  usuario: null,
  conductor: undefined,
  perfil: null,
  cargando: false,
  error: null,
  listo: false,

  iniciarSesion: async (telefono: string) => {
    set({ cargando: true, error: null })
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: telefono })
      if (error) throw error
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  verificarCodigo: async (telefono: string, codigo: string) => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: telefono,
        token: codigo,
        type: 'sms'
      })
      if (error) throw error
      if (!data?.session || !data?.user) {
        throw new Error('No se recibió sesión tras verificar el código.')
      }
      await supabase.rpc('ensure_usuario_profile' as any)
      await get().cargarPerfil()
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  cargarPerfil: async () => {
    set({ cargando: true, error: null })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No hay sesión activa')

      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (usuarioError) throw usuarioError
      if (!usuarioData) throw new Error('No se pudo leer el perfil.')

      set({ usuario: usuarioData })

      if (usuarioData.rol === 'conductor') {

        // cargar conductor base (para el guardia de navegación)
        const { data: conductorData, error: conductorError } = await supabase
          .from('conductores')
          .select('*')
          .eq('usuario_id', user.id)
          .maybeSingle()

        if (conductorError) throw conductorError
        set({ conductor: conductorData ?? null })

        // cargar vista completa con vehículo, agencia y región
        const { data: perfilData, error: perfilError } = await supabase
          .from('perfil_conductor')
          .select('*')
          .eq('usuario_id', user.id)
          .maybeSingle()

        if (perfilError) throw perfilError
        set({ perfil: perfilData as PerfilConductor ?? null })

      } else {
        set({ conductor: null, perfil: null })
      }

    } catch (error: any) {
      set({ error: error.message, usuario: null, conductor: undefined, perfil: null })
    } finally {
      set({ cargando: false })
    }
  },

  cerrarSesion: async () => {
    set({ cargando: true })
    try {
      await supabase.auth.signOut()
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ cargando: false })
    }
  },

  actualizarTokenPush: async (token: string) => {
    try {
      const { usuario } = get()
      if (!usuario) return
      const { error } = await supabase
        .from('usuarios')
        .update({ token_push: token })
        .eq('id', usuario.id)
      if (error) throw error
      set({ usuario: { ...usuario, token_push: token } })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  limpiarError: () => set({ error: null })
}))