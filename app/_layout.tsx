// import { useEffect, useState } from 'react'
// import { Slot, useRouter, useSegments } from 'expo-router'
// import { StatusBar } from 'expo-status-bar'
// import { supabase } from '../src/supabase/client'
// import { useAuthStore } from '../src/stores/authStore'
// import { useTheme } from '../src/theme/useTheme'

// export default function RootLayout() {
//   const { usuario, conductor, cargarPerfil } = useAuthStore()
//   const { isDark } = useTheme()
//   const router = useRouter()
//   const segments = useSegments()
//   const [listo, setListo] = useState(false)

//   useEffect(() => {
//     let mounted = true

//     const init = async () => {
//       try {
//         const { data: { session } } = await supabase.auth.getSession()
//         if (session?.user) {
//           await (supabase as any).rpc('ensure_usuario_profile')
//           await cargarPerfil()
//         }
//       } catch (e) {
//         console.warn('Error en init:', e)
//       } finally {
//         if (mounted) setListo(true)
//       }
//     }

//     init()

//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (_event, session) => {
//         if (_event === 'INITIAL_SESSION') return

//         if (_event === 'SIGNED_OUT') {
//           useAuthStore.setState({ usuario: null, conductor: null })
//           router.replace('/(auth)/splash')
//           return
//         }

//         if (session?.user) {
//           await (supabase as any).rpc('ensure_usuario_profile')
//           await cargarPerfil()
//         }

//         if (mounted) setListo(true)
//       }
//     )

//     return () => {
//       mounted = false
//       subscription.unsubscribe()
//     }
//   }, [])

//   useEffect(() => {
//     if (!listo) return
//     if (segments.length < 1) return

//     const enAuth = segments[0] === '(auth)'

//     if (!usuario && !enAuth) {
//       router.replace('/(auth)/splash')
//     } else if (usuario) {
//       if (usuario.rol !== 'conductor') {
//         router.replace('/(auth)/suspendido')
//       } else if (conductor?.estado_suscripcion === 'suspendido') {
//         router.replace('/(auth)/suspendido')
//       } else if (enAuth) {
//         router.replace('/(tabs)')
//       }
//     }
//   }, [usuario, conductor, segments, listo])

//   return (
//     <>
//       <StatusBar style={isDark ? 'light' : 'dark'} />
//       <Slot />
//     </>
//   )
// }


import { useEffect, useRef, useState } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { supabase } from '../src/supabase/client'
import { useAuthStore } from '../src/stores/authStore'
import { useTheme } from '../src/theme/useTheme'

export default function RootLayout() {
  const { usuario, conductor, cargarPerfil, listo } = useAuthStore()
  const { isDark } = useTheme()
  const router = useRouter()
  const segments = useSegments()
  

  // FIX 1: semáforo para bloquear el listener mientras init() corre
  const inicializando = useRef(false)

  useEffect(() => {
    let mounted = true

    const init = async () => {
      inicializando.current = true
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          await (supabase as any).rpc('ensure_usuario_profile')
          await cargarPerfil()
        }
      } catch (e) {
        console.warn('Error en init:', e)
      } finally {
        inicializando.current = false
        if (mounted) useAuthStore.setState({ listo: true })
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // ignorar el evento inicial siempre
        if (_event === 'INITIAL_SESSION') return

        // FIX 1: si init() todavía está corriendo, no hacer nada
        // init() ya va a llamar cargarPerfil() y setListo(true) por su cuenta
        if (inicializando.current) return

        if (_event === 'SIGNED_OUT') {
          useAuthStore.setState({ usuario: null, conductor: null })
          if (mounted) useAuthStore.setState({ listo: true })
          return
        }

        if (session?.user) {
          try {
            await (supabase as any).rpc('ensure_usuario_profile')
            await cargarPerfil()
          } catch (e) {
            console.warn('Error en authStateChange:', e)
          }
        }

        if (mounted) useAuthStore.setState({ listo: true })
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!listo) return
    if (segments.length < 1) return

    // FIX 2: si el usuario es conductor, esperar a que conductor esté cargado
    // conductor === undefined significa "todavía no llegó del store"
    // conductor === null significa "no existe en DB" (estado válido para evaluar)
    if (usuario?.rol === 'conductor' && conductor === undefined) return

    const enAuth = segments[0] === '(auth)'

    if (!usuario) {
      if (!enAuth) router.replace('/(auth)/splash')
      return
    }

    // FIX 3: mensaje diferenciado para no-conductores
    if (usuario.rol !== 'conductor') {
      router.replace('/(auth)/suspendido')
      return
    }

    if (conductor?.estado_suscripcion === 'suspendido') {
      router.replace('/(auth)/suspendido')
      return
    }

    if (enAuth) {
      router.replace('/(tabs)')
    }
  }, [usuario, conductor, segments, listo])

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Slot />
    </>
  )
}