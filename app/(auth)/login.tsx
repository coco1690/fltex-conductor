import { useState, useRef } from 'react'
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
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/theme/useTheme'
import { useAuthStore } from '../../src/stores/authStore'

const TELEFONO_VALIDO = /^\d{10}$/

export default function Login() {
  const { theme } = useTheme()
  const { iniciarSesion, cargando, error, limpiarError } = useAuthStore()
  const [telefono, setTelefono] = useState('')
  const [tocado, setTocado] = useState(false)
  const [enfocado, setEnfocado] = useState(false)
  const scaleAnim = useRef(new Animated.Value(1)).current

  const telefonoValido = TELEFONO_VALIDO.test(telefono)
  const mostrarErrorFormato = tocado && telefono.length > 0 && !telefonoValido

  const handleContinuar = async () => {
    if (!telefonoValido) return
    limpiarError()
    const telefonoCompleto = `+57${telefono.trim()}`
    await iniciarSesion(telefonoCompleto)
    if (!useAuthStore.getState().error) {
      router.push({
        pathname: '/(auth)/verificacion',
        params: { telefono: telefonoCompleto },
      })
    }
  }

  const onPressIn = () =>
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
    }).start()

  const onPressOut = () =>
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start()

  const getBorderColor = () => {
    if (error || mostrarErrorFormato) return theme.error
    if (telefonoValido) return theme.success
    if (enfocado) return theme.borderFocus
    return theme.border
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
              {/* único hardcode justificado: brand color fijo que no invierte */}
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

        {/* Step dots */}
        <View style={styles.stepDots}>
          <View style={[styles.dot, styles.dotActive, { backgroundColor: theme.primary }]} />
          <View style={[styles.dot, { backgroundColor: theme.border }]} />
          <View style={[styles.dot, { backgroundColor: theme.border }]} />
        </View>

        {/* Headline */}
        <Text style={[styles.h1, { color: theme.textPrimary }]}>
          Ingresa tu{'\n'}
          <Text style={{ color: theme.primary }}>número</Text>
        </Text>

        <Text style={[styles.sub, { color: theme.textSecondary }]}>
          Verificamos tu identidad con un código SMS.{'\n'}Solo toma 30 segundos.
        </Text>

        {/* Input */}
        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
          Número de celular
        </Text>

        <View style={[
          styles.inputWrap,
          {
            backgroundColor: theme.backgroundCard,
            borderColor: getBorderColor(),
          }
        ]}>
          <View style={styles.prefix}>
            <Text style={styles.flag}>🇨🇴</Text>
            <Text style={[styles.prefixNum, { color: theme.textSecondary }]}>
              +57
            </Text>
          </View>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            value={telefono}
            onChangeText={(v) => {
              setTelefono(v.replace(/\D/g, ''))
              limpiarError()
            }}
            onFocus={() => { setEnfocado(true); limpiarError() }}
            onBlur={() => { setEnfocado(false); setTocado(true) }}
            placeholder="314 123 4567"
            placeholderTextColor={theme.textMuted}
            keyboardType="phone-pad"
            maxLength={10}
            selectionColor={theme.primary}
          />
          {telefonoValido && (
            <View style={styles.inputEndIcon}>
              <Ionicons name="checkmark-circle" size={20} color={theme.success} />
            </View>
          )}
          {mostrarErrorFormato && (
            <View style={styles.inputEndIcon}>
              <Ionicons name="alert-circle" size={20} color={theme.error} />
            </View>
          )}
        </View>

        {/* Hint / errores */}
        {mostrarErrorFormato && !error ? (
          <View style={styles.msgRow}>
            <Ionicons
              name="information-circle-outline"
              size={13}
              color={theme.error}
            />
            <Text style={[styles.msgText, { color: theme.error }]}>
              Ingresa los 10 dígitos de tu número colombiano
            </Text>
          </View>
        ) : error ? (
          <View style={styles.msgRow}>
            <Ionicons
              name="information-circle-outline"
              size={13}
              color={theme.error}
            />
            <Text style={[styles.msgText, { color: theme.error }]}>
              {error}
            </Text>
          </View>
        ) : (
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            10 dígitos sin espacios ni guiones
          </Text>
        )}

        {/* Botón */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[
              styles.btn,
              {
                backgroundColor: telefonoValido ? theme.primary : theme.border,
                // sombra solo cuando está activo
                shadowColor: telefonoValido ? theme.primary : 'transparent',
              }
            ]}
            onPress={handleContinuar}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={cargando || !telefonoValido}
            activeOpacity={1}
          >
            {cargando ? (
              <ActivityIndicator color={theme.textInverse} />
            ) : (
              <>
                <Text style={[styles.btnText, { color: theme.textInverse }]}>
                  Continuar
                </Text>
                {/* <View style={styles.btnArrow}>
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color={theme.textInverse}
                  />
                </View> */}
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Info card */}
        <View style={[
          styles.infoCard,
          {
            backgroundColor: theme.backgroundCard,
            borderColor: theme.border,
          }
        ]}>
          <View style={[styles.infoIconBox, { backgroundColor: theme.primaryLight }]}>
            <Ionicons
              name="shield-checkmark-outline"
              size={15}
              color={theme.primary}
            />
          </View>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            <Text style={{ color: theme.textPrimary, fontWeight: '500' }}>
              ¿Por qué pedimos tu número?{'\n'}
            </Text>
            Enviamos un código de 6 dígitos para confirmar que eres tú.
            Tu número nunca se comparte.
          </Text>
        </View>

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
    marginBottom: 28,
  },
  logoMark: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIcon: {
    width: 30, height: 30,
    backgroundColor: '#2563EB', // brand fijo — no invierte
    borderRadius: 7,
    alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 20, fontWeight: '700', letterSpacing: 0.5 },
  badge: {
    borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  badgeText: { fontSize: 11, fontWeight: '500', letterSpacing: 0.3 },

  stepDots: { flexDirection: 'row', gap: 5, marginBottom: 24 },
  dot: { width: 5, height: 5, borderRadius: 3 },
  dotActive: { width: 18 },

  h1: {
    fontSize: 32, fontWeight: '800',
    lineHeight: 38, letterSpacing: -0.5,
    marginBottom: 10,
  },
  sub: {
    fontSize: 14, lineHeight: 22,
    fontWeight: '300', marginBottom: 28,
  },

  fieldLabel: {
    fontSize: 11, fontWeight: '500',
    letterSpacing: 1, textTransform: 'uppercase',
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderRadius: 13,
    marginBottom: 8, height: 52, overflow: 'hidden',
  },
  prefix: {
    flexDirection: 'row', alignItems: 'center',
    gap: 6, paddingHorizontal: 13, height: '100%',
  },
  flag: { fontSize: 17 },
  prefixNum: { fontSize: 14, fontWeight: '500' },
  dividerLine: { width: 1, height: 26 },
  input: {
    flex: 1, paddingHorizontal: 13,
    fontSize: 16, height: '100%',
  },
  inputEndIcon: { paddingRight: 13 },

  msgRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 5, marginBottom: 20,
  },
  msgText: { fontSize: 12, flex: 1 },
  hint: { fontSize: 12, marginBottom: 20, paddingLeft: 2 },

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

  infoCard: {
    borderWidth: 1, borderRadius: 12,
    padding: 14,
    flexDirection: 'row', alignItems: 'flex-start',
    gap: 11, marginTop: 'auto',
  },
  infoIconBox: {
    width: 30, height: 30, minWidth: 30,
    borderRadius: 7,
    alignItems: 'center', justifyContent: 'center',
  },
  infoText: { flex: 1, fontSize: 12, lineHeight: 19, fontWeight: '300' },
})