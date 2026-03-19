import { useCallback, useState } from 'react'
import { useFocusEffect, router } from 'expo-router'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native'
import { useTheme } from '../../src/theme/useTheme'
import { useAuthStore } from '../../src/stores/authStore'
import { useViajesStore } from '../../src/stores/viajesStore'
import { Ionicons } from '@expo/vector-icons'
import { BannerViajeActivo } from '../../components/viajes/BannerViajeActivo'
import { CardViajeConductor } from '../../components/viajes/CardViajeConductor'

export default function Inicio() {
  const { theme } = useTheme()
  const { usuario, conductor } = useAuthStore()
  const {
    viajes, viajesManana, cargando, viajeEnCurso,
    cargarViajesDelDia, cargarViajesManana, cargarViajeEnCurso,
  } = useViajesStore()

  const [refreshing, setRefreshing] = useState(false)

  const cargarTodo = useCallback(async () => {
    if (!conductor) return
    await Promise.all([
      cargarViajesDelDia(conductor.id),
      cargarViajesManana(conductor.id),
      cargarViajeEnCurso(conductor.id),
    ])
  }, [conductor])

  useFocusEffect(
    useCallback(() => { cargarTodo() }, [cargarTodo])
  )

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await cargarTodo()
    setRefreshing(false)
  }, [cargarTodo])

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* Header fijo */}
      <View style={[styles.headerFijo, { backgroundColor: theme.background }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.saludo, { color: theme.textSecondary }]}>Bienvenido,</Text>
            <Text style={[styles.nombre, { color: theme.textPrimary }]}>{usuario?.nombre}</Text>
          </View>
          {conductor && (
            <View style={[
              styles.suscripcionBadge,
              { backgroundColor: conductor.estado_suscripcion === 'activo' ? theme.successLight : theme.warningLight },
            ]}>
              <Text style={[
                styles.suscripcionTexto,
                { color: conductor.estado_suscripcion === 'activo' ? theme.success : theme.warning },
              ]}>
                {conductor.estado_suscripcion === 'activo' ? '✓ Activo' : '⚠ Por vencer'}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.botonCrear, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/crear-viaje')}
        >
          <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.botonCrearTexto}>Crear nuevo viaje</Text>
        </TouchableOpacity>

        <Text style={[styles.seccionTitulo, { color: theme.textPrimary }]}>Viajes de hoy</Text>
      </View>

      {/* ScrollView */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        {cargando && !refreshing ? (
          <ActivityIndicator color={theme.primary} style={{ marginTop: 24 }} />
        ) : viajes.length === 0 ? (
          <View style={[styles.sinViajes, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
            <Ionicons name="car-outline" size={40} color={theme.textMuted} />
            <Text style={[styles.sinViajesTexto, { color: theme.textMuted }]}>
              No tienes viajes programados para hoy
            </Text>
          </View>
        ) : (
          viajes.map(v => <CardViajeConductor key={v.id} viaje={v} />)
        )}

        {viajesManana.length > 0 && (
          <>
            <Text style={[styles.seccionTitulo, { color: theme.textPrimary }]}>
              {`Viajes de mañana · ${new Date(Date.now() + 86400000).toLocaleDateString('es-CO', {
                weekday: 'long', day: 'numeric', month: 'long',
              })}`}
            </Text>
            {viajesManana.map(v => <CardViajeConductor key={v.id} viaje={v} />)}
          </>
        )}

        {/* Banner solo cuando hay viaje en_curso */}
        {viajeEnCurso?.estado === 'en_curso' && (
          <BannerViajeActivo titulo="Viaje en curso" />
        )}

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerFijo: { paddingHorizontal: 20, paddingTop: 110, paddingBottom: 12, gap: 12 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  content: { padding: 20, paddingTop: 12, gap: 12, flexGrow: 1 },
  saludo: { fontSize: 14 },
  nombre: { fontSize: 22, fontWeight: 'bold' },
  suscripcionBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  suscripcionTexto: { fontSize: 12, fontWeight: '600' },
  botonCrear: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12 },
  botonCrearTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  seccionTitulo: { fontSize: 18, fontWeight: '600' },
  sinViajes: { alignItems: 'center', padding: 40, borderRadius: 12, borderWidth: 1, gap: 12 },
  sinViajesTexto: { fontSize: 14, textAlign: 'center' },
})