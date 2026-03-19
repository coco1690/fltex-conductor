import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { useTheme } from '../../src/theme/useTheme'
import { useAuthStore } from '../../src/stores/authStore'
import { Ionicons } from '@expo/vector-icons'

export default function Suspendido() {
  const { theme } = useTheme()
  const { conductor, cerrarSesion } = useAuthStore()

  const getMensaje = () => {
    if (conductor?.estado_suscripcion === 'suspendido') {
      return {
        icono: 'ban-outline' as const,
        titulo: 'Suscripción suspendida',
        mensaje: 'Tu suscripción ha vencido. Contacta a tu agencia para renovarla y volver a operar.',
      }
    }
    return {
      icono: 'lock-closed-outline' as const,
      titulo: 'Acceso restringido',
      mensaje: 'Tu cuenta no tiene permisos para acceder a esta aplicación. Contacta a tu agencia.',
    }
  }

  const { icono, titulo, mensaje } = getMensaje()

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
        <View style={[styles.iconoContainer, { backgroundColor: theme.errorLight }]}>
          <Ionicons name={icono} size={48} color={theme.error} />
        </View>

        <Text style={[styles.titulo, { color: theme.textPrimary }]}>
          {titulo}
        </Text>
        <Text style={[styles.mensaje, { color: theme.textSecondary }]}>
          {mensaje}
        </Text>

        {conductor?.fecha_corte && (
          <View style={[styles.fechaBox, { backgroundColor: theme.errorLight }]}>
            <Text style={[styles.fechaTexto, { color: theme.error }]}>
              Venció el {new Date(conductor.fecha_corte).toLocaleDateString('es-CO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.boton, { borderColor: theme.error }]}
          onPress={cerrarSesion}
        >
          <Ionicons name="log-out-outline" size={18} color={theme.error} />
          <Text style={[styles.botonTexto, { color: theme.error }]}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { borderRadius: 16, borderWidth: 1, padding: 24, alignItems: 'center', gap: 16, width: '100%' },
  iconoContainer: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  mensaje: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  fechaBox: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  fechaTexto: { fontSize: 13, fontWeight: '600' },
  boton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, borderWidth: 1, marginTop: 8 },
  botonTexto: { fontSize: 15, fontWeight: '600' },
})