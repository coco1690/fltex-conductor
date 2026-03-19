// import { useEffect } from 'react'
// import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
// import { useRouter } from 'expo-router'

// export default function Splash() {
//   const router = useRouter()

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       router.replace('/(auth)/login')
//     }, 2000)
//     return () => clearTimeout(timer)
//   }, [])

//   return (
//     <View style={styles.container}>
//       <Text style={styles.logo}>Fletex</Text>
//       <Text style={styles.slogan}>Tu transporte, organizado</Text>
//       <ActivityIndicator
//         color="#BFDBFE"
//         size="small"
//         style={{ marginTop: 40 }}
//       />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#2563EB',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   logo: {
//     fontSize: 48,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     letterSpacing: 2
//   },
//   slogan: {
//     fontSize: 16,
//     color: '#BFDBFE',
//     marginTop: 8
//   }
// })


// import { useEffect } from 'react'
// import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
// import { useRouter } from 'expo-router'
// import { useAuthStore } from '../../src/stores/authStore'

// export default function Splash() {
//   const router = useRouter()
//   const listo = useAuthStore((s) => s.listo)

//   useEffect(() => {
//     // cuando RootLayout termina de resolver la sesión,
//     // él mismo va a redirigir. El splash no toma decisiones.
//     // Este timeout es solo un safety net por si algo falla en el layout.
//     const timer = setTimeout(() => {
//       if (!listo) {
//         // solo llegamos aquí si después de 5s el layout no resolvió
//         console.warn('Splash timeout — forzando login')
//         router.replace('/(auth)/login')
//       }
//     }, 5000)

//     return () => clearTimeout(timer)
//   }, [])

//   useEffect(() => {
//     // RootLayout ya resolvió — si seguimos en splash con listo=true,
//     // significa que no hay sesión activa (RootLayout nos hubiera movido
//     // a /(tabs) si hubiera usuario). Navegar a login.
//     if (listo) {
//       router.replace('/(auth)/login')
//     }
//   }, [listo])

//   return (
//     <View style={styles.container}>
//       <Text style={styles.logo}>Fletex</Text>
//       <Text style={styles.slogan}>Tu transporte, organizado</Text>
//       <ActivityIndicator
//         color="#BFDBFE"
//         size="small"
//         style={{ marginTop: 40 }}
//       />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#2563EB',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   logo: {
//     fontSize: 48,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     letterSpacing: 2
//   },
//   slogan: {
//     fontSize: 16,
//     color: '#BFDBFE',
//     marginTop: 8
//   }
// })

import { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../src/stores/authStore'

const SPLASH_MINIMO = 4500
const SPLASH_TIMEOUT = 6000

const BRAND = {
  bgMid:       '#0A0F1E',
  white:       '#FFFFFF',
  whiteMid:    'rgba(255,255,255,0.6)',
  whiteLow:    'rgba(255,255,255,0.4)',
  whiteDim:    'rgba(255,255,255,0.15)',
  whiteBorder: 'rgba(255,255,255,0.25)',
}

const GRID_DOTS = Array.from({ length: 12 })

function DotsLoader() {
  const anims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current

  useEffect(() => {
    const pulsar = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.delay(400),
        ])
      ).start()

    pulsar(anims[0], 0)
    pulsar(anims[1], 200)
    pulsar(anims[2], 400)
  }, [])

  return (
    <View style={styles.dotsLoader}>
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.loaderDot,
            {
              opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
              transform: [{
                scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }),
              }],
            }
          ]}
        />
      ))}
    </View>
  )
}

export default function Splash() {
  const router = useRouter()
  const listo = useAuthStore((s) => s.listo)
  const [tiempoMinimoCumplido, setTiempoMinimoCumplido] = useState(false)

  const fadeAnim  = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current

  // animación de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // FIX: timer mínimo de branding — el splash se ve siempre al menos 1.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setTiempoMinimoCumplido(true)
    }, SPLASH_MINIMO)
    return () => clearTimeout(timer)
  }, [])

  // FIX: navegar solo cuando AMBOS están listos
  // — listo: RootLayout terminó de resolver la sesión
  // — tiempoMinimoCumplido: el splash ya se mostró el mínimo de branding
  useEffect(() => {
    if (listo && tiempoMinimoCumplido) {
      router.replace('/(auth)/login')
    }
  }, [listo, tiempoMinimoCumplido])

  // safety net — si después de 6s algo falló en el layout
  useEffect(() => {
    const timer = setTimeout(() => {
      console.warn('Splash timeout — forzando login')
      router.replace('/(auth)/login')
    }, SPLASH_TIMEOUT)
    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND.bgMid} />

      {/* grid decorativo top-right */}
      <View style={styles.gridTopRight}>
        {GRID_DOTS.map((_, i) => (
          <View key={i} style={styles.gridDot} />
        ))}
      </View>

      {/* grid decorativo bottom-left */}
      <View style={styles.gridBottomLeft}>
        {GRID_DOTS.map((_, i) => (
          <View key={i} style={[styles.gridDot, { opacity: 0.08 }]} />
        ))}
      </View>

      {/* logo con animación de entrada */}
      <Animated.View
        style={[
          styles.logoArea,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <View style={styles.logoIconBox}>
          <Ionicons name="car-outline" size={36} color={BRAND.white} />
        </View>

        <View style={styles.wordArea}>
          <Text style={styles.logoWord}>Fletex</Text>
          <Text style={styles.tagline}>Tu transporte, organizado</Text>
        </View>

        <View style={styles.divider} />
      </Animated.View>

      {/* loader */}
      <Animated.View style={[styles.loaderArea, { opacity: fadeAnim }]}>
        <DotsLoader />
        <Text style={styles.loaderText}>
          {tiempoMinimoCumplido && !listo
            ? 'Cargando tu perfil...'   // el mínimo pasó pero aún espera a Supabase
            : 'Verificando sesión...'   // estado normal de carga
          }
        </Text>
      </Animated.View>

      <Text style={styles.version}>v1.0</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.bgMid,
    alignItems: 'center',
    justifyContent: 'center',
  },

  gridTopRight: {
    position: 'absolute',
    top: 48, right: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 56, gap: 8,
    opacity: 0.15,
  },
  gridBottomLeft: {
    position: 'absolute',
    bottom: 100, left: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 56, gap: 8,
  },
  gridDot: {
    width: 4, height: 4,
    borderRadius: 2,
    backgroundColor: BRAND.white,
  },

  logoArea: {
    alignItems: 'center',
    gap: 14,
  },
  logoIconBox: {
    width: 72, height: 72,
    borderRadius: 20,
    backgroundColor: BRAND.whiteDim,
    borderWidth: 1.5,
    borderColor: BRAND.whiteBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordArea: {
    alignItems: 'center',
    gap: 4,
  },
  logoWord: {
    fontSize: 44,
    fontWeight: '800',
    color: BRAND.white,
    letterSpacing: 3,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '300',
    color: BRAND.whiteMid,
    letterSpacing: 0.5,
  },
  divider: {
    width: 32, height: 1.5,
    backgroundColor: BRAND.whiteBorder,
    borderRadius: 1,
    marginTop: 6,
  },

  loaderArea: {
    position: 'absolute',
    bottom: 56,
    alignItems: 'center',
    gap: 12,
  },
  dotsLoader: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  loaderDot: {
    width: 6, height: 6,
    borderRadius: 3,
    backgroundColor: BRAND.whiteMid,
  },
  loaderText: {
    fontSize: 11,
    fontWeight: '300',
    color: BRAND.whiteLow,
    letterSpacing: 0.5,
  },

  version: {
    position: 'absolute',
    bottom: 20, right: 24,
    fontSize: 10,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 0.3,
  },
})
