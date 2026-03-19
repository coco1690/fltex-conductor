// import { useState, useRef, useEffect } from 'react'
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native'
// import { router, useLocalSearchParams } from 'expo-router'
// import { useTheme } from '../../src/theme/useTheme'
// import { useAuthStore } from '../../src/stores/authStore'

// const OTP_TIMEOUT = 60 // segundos — ajusta según config de Supabase

// export default function Verificacion() {
//   const { theme } = useTheme()
//   const { telefono } = useLocalSearchParams<{ telefono: string }>()
//   const { verificarCodigo, iniciarSesion, cargando, error, limpiarError } = useAuthStore()

//   const [codigo, setCodigo] = useState(['', '', '', '', '', ''])
//   const inputs = useRef<TextInput[]>([])

//   // FIX 1: countdown del OTP
//   const [segundos, setSegundos] = useState(OTP_TIMEOUT)
//   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

//   const iniciarTimer = () => {
//     // limpiar timer anterior si existe
//     if (timerRef.current) clearInterval(timerRef.current)
//     setSegundos(OTP_TIMEOUT)
//     timerRef.current = setInterval(() => {
//       setSegundos((s) => {
//         if (s <= 1) {
//           clearInterval(timerRef.current!)
//           return 0
//         }
//         return s - 1
//       })
//     }, 1000)
//   }

//   useEffect(() => {
//     // arrancar el timer cuando monta la pantalla
//     iniciarTimer()
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current)
//     }
//   }, [])

//   // FIX 2: limpiar inputs cuando llega un error
//   useEffect(() => {
//     if (error) {
//       setCodigo(['', '', '', '', '', ''])
//       // enfocar el primer input para que el usuario pueda reintentar
//       setTimeout(() => inputs.current[0]?.focus(), 100)
//     }
//   }, [error])

//   // FIX 3: auto-submit — función separada para poder llamarla desde handleChange
//   const handleVerificar = async (codigoOverride?: string) => {
//     const codigoCompleto = codigoOverride ?? codigo.join('')
//     if (codigoCompleto.length < 6) return
//     limpiarError()
//     await verificarCodigo(telefono, codigoCompleto)
//   }

//   const handleChange = (texto: string, index: number) => {
//     const nuevo = [...codigo]
//     nuevo[index] = texto
//     setCodigo(nuevo)

//     if (texto && index < 5) {
//       inputs.current[index + 1]?.focus()
//     }

//     // FIX 3: auto-submit cuando se llena el último dígito
//     if (texto && index === 5) {
//       const codigoCompleto = nuevo.join('')
//       if (codigoCompleto.length === 6) {
//         handleVerificar(codigoCompleto)
//       }
//     }
//   }

//   const handleKeyPress = (e: any, index: number) => {
//     if (e.nativeEvent.key === 'Backspace' && !codigo[index] && index > 0) {
//       inputs.current[index - 1]?.focus()
//     }
//   }

//   const handleReenviar = async () => {
//     limpiarError()
//     setCodigo(['', '', '', '', '', ''])
//     await iniciarSesion(telefono)
//     iniciarTimer()
//     setTimeout(() => inputs.current[0]?.focus(), 100)
//   }

//   const otpExpirado = segundos === 0

//   const formatearTiempo = (s: number) => {
//     const m = Math.floor(s / 60)
//     const seg = s % 60
//     return `${m}:${seg.toString().padStart(2, '0')}`
//   }

//   return (
//     <KeyboardAvoidingView
//       style={[styles.container, { backgroundColor: theme.background }]}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <View style={styles.content}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.volver}>
//           <Text style={[styles.volverTexto, { color: theme.primary }]}>← Volver</Text>
//         </TouchableOpacity>

//         <Text style={[styles.titulo, { color: theme.textPrimary }]}>
//           Verifica tu número
//         </Text>
//         <Text style={[styles.subtitulo, { color: theme.textSecondary }]}>
//           Ingresa el código de 6 dígitos enviado a {telefono}
//         </Text>

//         <View style={styles.codigosContainer}>
//           {codigo.map((digito, index) => (
//             <TextInput
//               key={index}
//               ref={(ref) => { if (ref) inputs.current[index] = ref }}
//               style={[
//                 styles.casillaInput,
//                 {
//                   borderColor: otpExpirado
//                     ? theme.error          // rojo si expiró
//                     : digito
//                       ? theme.primary      // azul si tiene valor
//                       : theme.border,      // gris si vacío
//                   backgroundColor: theme.backgroundCard,
//                   color: theme.textPrimary,
//                   opacity: otpExpirado ? 0.5 : 1,
//                 }
//               ]}
//               value={digito}
//               onChangeText={(v) => handleChange(v.slice(-1), index)}
//               onKeyPress={(e) => handleKeyPress(e, index)}
//               keyboardType="number-pad"
//               maxLength={1}
//               textAlign="center"
//               editable={!otpExpirado && !cargando}
//             />
//           ))}
//         </View>

//         {/* FIX 1: indicador de tiempo */}
//         <View style={styles.timerContainer}>
//           {otpExpirado ? (
//             <Text style={[styles.timerTexto, { color: theme.error }]}>
//               Código expirado
//             </Text>
//           ) : (
//             <Text style={[
//               styles.timerTexto,
//               { color: segundos <= 15 ? theme.error : theme.textSecondary }
//             ]}>
//               Expira en {formatearTiempo(segundos)}
//             </Text>
//           )}
//         </View>

//         {error && (
//           <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
//         )}

//         <TouchableOpacity
//           style={[
//             styles.boton,
//             {
//               backgroundColor: otpExpirado
//                 ? theme.border              // gris si expirado
//                 : theme.primary,
//             }
//           ]}
//           onPress={() => handleVerificar()}
//           disabled={cargando || codigo.join('').length < 6 || otpExpirado}
//         >
//           {cargando ? (
//             <ActivityIndicator color="#FFFFFF" />
//           ) : (
//             <Text style={styles.botonTexto}>Verificar</Text>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={handleReenviar}
//           disabled={cargando}
//           style={styles.reenviarContainer}
//         >
//           <Text style={[
//             styles.reenviar,
//             {
//               color: cargando ? theme.textMuted : theme.primary,
//               // resaltar reenviar cuando el código expiró
//               fontWeight: otpExpirado ? '700' : '400',
//             }
//           ]}>
//             {otpExpirado
//               ? 'Solicitar nuevo código'
//               : '¿No recibiste el código? Reenviar'
//             }
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   )
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   content: { flex: 1, padding: 24, paddingTop: 60 },
//   volver: { marginBottom: 32 },
//   volverTexto: { fontSize: 16 },
//   titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
//   subtitulo: { fontSize: 15, marginBottom: 32, lineHeight: 22 },
//   codigosContainer: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginBottom: 12 },
//   casillaInput: { width: 48, height: 56, borderWidth: 2, borderRadius: 12, fontSize: 24, fontWeight: 'bold' },
//   timerContainer: { alignItems: 'center', marginBottom: 16 },
//   timerTexto: { fontSize: 13 },
//   error: { fontSize: 13, marginBottom: 12, textAlign: 'center' },
//   boton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
//   botonTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
//   reenviarContainer: { alignItems: 'center' },
//   reenviar: { textAlign: 'center', fontSize: 14, textDecorationLine: 'underline' },
// })


import { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/theme/useTheme'
import { useAuthStore } from '../../src/stores/authStore'

const OTP_TIMEOUT = 60

export default function Verificacion() {
  const { theme } = useTheme()
  const { telefono } = useLocalSearchParams<{ telefono: string }>()
  const { verificarCodigo, iniciarSesion, cargando, error, limpiarError } = useAuthStore()

  const [codigo, setCodigo] = useState(['', '', '', '', '', ''])
  const inputs = useRef<TextInput[]>([])
  const [segundos, setSegundos] = useState(OTP_TIMEOUT)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const scaleAnim = useRef(new Animated.Value(1)).current

  // barra de progreso animada
  const barraAnim = useRef(new Animated.Value(1)).current

  const iniciarTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setSegundos(OTP_TIMEOUT)

    // animar la barra de 100% → 0% en OTP_TIMEOUT segundos
    barraAnim.setValue(1)
    Animated.timing(barraAnim, {
      toValue: 0,
      duration: OTP_TIMEOUT * 1000,
      useNativeDriver: false,
    }).start()

    timerRef.current = setInterval(() => {
      setSegundos((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return s - 1
      })
    }, 1000)
  }

  useEffect(() => {
    iniciarTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (error) {
      setCodigo(['', '', '', '', '', ''])
      setTimeout(() => inputs.current[0]?.focus(), 100)
    }
  }, [error])

  const handleVerificar = async (codigoOverride?: string) => {
    const codigoCompleto = codigoOverride ?? codigo.join('')
    if (codigoCompleto.length < 6) return
    limpiarError()
    await verificarCodigo(telefono, codigoCompleto)
  }

  const handleChange = (texto: string, index: number) => {
    const nuevo = [...codigo]
    nuevo[index] = texto
    setCodigo(nuevo)
    if (texto && index < 5) inputs.current[index + 1]?.focus()
    if (texto && index === 5) {
      const completo = nuevo.join('')
      if (completo.length === 6) handleVerificar(completo)
    }
  }

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !codigo[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handleReenviar = async () => {
    limpiarError()
    setCodigo(['', '', '', '', '', ''])
    await iniciarSesion(telefono)
    iniciarTimer()
    setTimeout(() => inputs.current[0]?.focus(), 100)
  }

  const onPressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start()

  const onPressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20 }).start()

  const otpExpirado = segundos === 0
  const codigoCompleto = codigo.join('').length === 6

  const formatearTiempo = (s: number) => {
    const m = Math.floor(s / 60)
    const seg = s % 60
    return `${m}:${seg.toString().padStart(2, '0')}`
  }

  // color de la barra según tiempo restante
  const getTimerColor = () => {
    if (otpExpirado) return theme.error
    if (segundos <= 15) return theme.warning
    return theme.primary
  }

  // color del borde de cada casilla
  const getCasillaColor = (digito: string, index: number) => {
    if (otpExpirado) return theme.error
    if (error) return theme.error
    if (digito) return theme.primary
    return theme.border
  }

  // formatear teléfono para el chip: +57 3XX XXX XXXX
  const formatearTelefono = (tel: string) => {
    const num = tel.replace('+57', '').trim()
    if (num.length === 10) {
      return `+57 ${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6)}`
    }
    return tel
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.screen}>

        {/* Header */}
        <View style={styles.topBar}>
          <View style={styles.logoMark}>
            <View style={styles.logoIcon}>
              <Ionicons name="car-outline" size={15} color="#FFFFFF" />
            </View>
            <Text style={[styles.logoText, { color: theme.textPrimary }]}>
              Fletex
            </Text>
          </View>
          <View style={[styles.badge, {
            borderColor: theme.border,
            backgroundColor: theme.backgroundCard,
          }]}>
            <Text style={[styles.badgeText, { color: theme.textMuted }]}>
              Conductores
            </Text>
          </View>
        </View>

        {/* Botón volver */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <View style={[styles.backIcon, {
            backgroundColor: theme.backgroundCard,
            borderColor: theme.border,
          }]}>
            <Ionicons name="chevron-back" size={14} color={theme.primary} />
          </View>
          <Text style={[styles.backText, { color: theme.primary }]}>Volver</Text>
        </TouchableOpacity>

        {/* Step dots — paso 2 activo, paso 1 completado */}
        <View style={styles.stepDots}>
          <View style={[styles.dot, { backgroundColor: theme.success }]} />
          <View style={[styles.dot, styles.dotActive, { backgroundColor: theme.primary }]} />
          <View style={[styles.dot, { backgroundColor: theme.border }]} />
        </View>

        {/* Headline */}
        <Text style={[styles.h1, { color: theme.textPrimary }]}>
          Código de{'\n'}
          <Text style={{ color: theme.primary }}>verificación</Text>
        </Text>

        <Text style={[styles.sub, { color: theme.textSecondary }]}>
          Ingresa los 6 dígitos que enviamos por SMS
        </Text>

        {/* Chip con el número */}
        <View style={[styles.phoneChip, {
          backgroundColor: theme.backgroundCard,
          borderColor: theme.border,
        }]}>
          <Ionicons name="phone-portrait-outline" size={12} color={theme.textSecondary} />
          <Text style={[styles.phoneChipText, { color: theme.textSecondary }]}>
            {formatearTelefono(telefono)}
          </Text>
        </View>

        {/* Casillas OTP */}
        <View style={styles.otpRow}>
          {codigo.map((digito, index) => (
            <TextInput
              key={index}
              ref={(ref) => { if (ref) inputs.current[index] = ref }}
              style={[
                styles.otpBox,
                {
                  backgroundColor: theme.backgroundCard,
                  borderColor: getCasillaColor(digito, index),
                  color: theme.textPrimary,
                  opacity: otpExpirado ? 0.45 : 1,
                }
              ]}
              value={digito}
              onChangeText={(v) => handleChange(v.slice(-1), index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              editable={!otpExpirado && !cargando}
              selectionColor={theme.primary}
            />
          ))}
        </View>

        {/* Timer */}
        <View style={styles.timerRow}>
          <Ionicons
            name="time-outline"
            size={14}
            color={otpExpirado ? theme.error : segundos <= 15 ? theme.warning : theme.textMuted}
          />
          {otpExpirado ? (
            <Text style={[styles.timerText, { color: theme.error }]}>
              Código expirado
            </Text>
          ) : (
            <Text style={[
              styles.timerText,
              { color: segundos <= 15 ? theme.warning : theme.textSecondary }
            ]}>
              Expira en {formatearTiempo(segundos)}
            </Text>
          )}
        </View>

        {/* Barra de progreso animada */}
        <View style={[styles.timerBarBg, { backgroundColor: theme.border }]}>
          <Animated.View
            style={[
              styles.timerBarFill,
              {
                backgroundColor: getTimerColor(),
                width: barraAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              }
            ]}
          />
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle-outline" size={13} color={theme.error} />
            <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
          </View>
        )}

        {/* Botón verificar */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[
              styles.btn,
              {
                backgroundColor: (codigoCompleto && !otpExpirado)
                  ? theme.primary
                  : theme.border,
                shadowColor: (codigoCompleto && !otpExpirado)
                  ? theme.primary
                  : 'transparent',
              }
            ]}
            onPress={() => handleVerificar()}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={cargando || !codigoCompleto || otpExpirado}
            activeOpacity={1}
          >
            {cargando ? (
              <ActivityIndicator color={theme.textInverse} />
            ) : (
              <>
                <Text style={[styles.btnText, { color: theme.textInverse }]}>
                  Verificar
                </Text>
                {/* <View style={styles.btnArrow}>
                  <Ionicons name="arrow-forward" size={14} color={theme.textInverse} />
                </View> */}
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Reenviar */}
        <TouchableOpacity
          style={styles.reenviarRow}
          onPress={handleReenviar}
          disabled={cargando}
          activeOpacity={0.7}
        >
          <Text style={[styles.reenviarTexto, { color: theme.textMuted }]}>
            {otpExpirado ? 'El código expiró —' : '¿No recibiste el código?'}
          </Text>
          <Text style={[
            styles.reenviarLink,
            {
              color: cargando ? theme.textMuted : theme.primary,
              fontWeight: otpExpirado ? '700' : '500',
            }
          ]}>
            {otpExpirado ? 'Solicitar nuevo' : 'Reenviar'}
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 32,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logoMark: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIcon: {
    width: 30, height: 30,
    backgroundColor: '#2563EB', // brand fijo
    borderRadius: 7,
    alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 20, fontWeight: '700', letterSpacing: 0.5 },
  badge: {
    borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  badgeText: { fontSize: 11, fontWeight: '500', letterSpacing: 0.3 },

  backBtn: {
    flexDirection: 'row', alignItems: 'center',
    gap: 6, marginBottom: 20, alignSelf: 'flex-start',
  },
  backIcon: {
    width: 24, height: 24, borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  backText: { fontSize: 13, fontWeight: '500' },

  stepDots: { flexDirection: 'row', gap: 5, marginBottom: 22 },
  dot: { width: 5, height: 5, borderRadius: 3 },
  dotActive: { width: 18 },

  h1: {
    fontSize: 28, fontWeight: '800',
    lineHeight: 34, letterSpacing: -0.5,
    marginBottom: 8,
  },
  sub: {
    fontSize: 13, lineHeight: 20,
    fontWeight: '300', marginBottom: 16,
  },

  phoneChip: {
    flexDirection: 'row', alignItems: 'center',
    gap: 6, alignSelf: 'flex-start',
    borderWidth: 1, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5,
    marginBottom: 24,
  },
  phoneChipText: { fontSize: 12, fontWeight: '500' },

  otpRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 16,
  },
  otpBox: {
    width: 46, height: 54,
    borderWidth: 1.5, borderRadius: 12,
    fontSize: 22, fontWeight: '800',
  },

  timerRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 5,
    marginBottom: 10,
  },
  timerText: { fontSize: 12 },

  timerBarBg: {
    height: 2, borderRadius: 1,
    marginBottom: 20, overflow: 'hidden',
  },
  timerBarFill: { height: '100%', borderRadius: 1 },

  errorRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 5, marginBottom: 12,
    justifyContent: 'center',
  },
  errorText: { fontSize: 12 },

  btn: {
    height: 52, borderRadius: 13,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  btnText: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  btnArrow: {
    width: 22, height: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 5,
    alignItems: 'center', justifyContent: 'center',
  },

  reenviarRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 4,
  },
  reenviarTexto: { fontSize: 12 },
  reenviarLink: { fontSize: 12, textDecorationLine: 'underline' },
})