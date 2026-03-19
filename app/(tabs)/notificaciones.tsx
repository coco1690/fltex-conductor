// app/(tabs)/notificaciones.tsx
import { useCallback } from 'react'
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/theme/useTheme'
import { useNotificacionesConductor } from '../../src/hooks/useNotificacionesConductor'
import { getIconoConductor, getTiempoRelativo } from '../../src/utils/notificacionesConductor'
import type { Notificacion } from '../../src/stores/notificacionesConductorStore'

export default function PantallaNotificaciones() {
  const { theme } = useTheme()
  const {
    notificaciones,
    noLeidas,
    cargando,
    marcarLeida,
    marcarTodasLeidas,
  } = useNotificacionesConductor()

  const renderItem = useCallback(({ item }: { item: Notificacion }) => {
    const { nombre, color, bgColor } = getIconoConductor(item.tipo)

    return (
      <TouchableOpacity
        style={[
          styles.item,
          {
            backgroundColor: item.leida
              ? theme.backgroundCard
              : theme.backgroundSecondary,
          }
        ]}
        onPress={() => { if (!item.leida) marcarLeida(item.id) }}
        activeOpacity={0.7}
      >
        {!item.leida && (
          <View style={[styles.puntoBadge, { backgroundColor: theme.primary }]} />
        )}

        <View style={[styles.iconoBox, { backgroundColor: bgColor }]}>
          <Ionicons name={nombre as any} size={20} color={color} />
        </View>

        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text
              style={[
                styles.itemTitulo,
                {
                  color: theme.textPrimary,
                  fontWeight: item.leida ? '400' : '600',
                }
              ]}
              numberOfLines={1}
            >
              {item.titulo}
            </Text>
            <Text style={[styles.itemTiempo, { color: theme.textMuted }]}>
              {getTiempoRelativo(item.fecha_envio)}
            </Text>
          </View>
          <Text
            style={[styles.itemMensaje, { color: theme.textSecondary }]}
            numberOfLines={2}
          >
            {item.mensaje}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }, [notificaciones, theme])

  const ListaVacia = () => (
    <View style={styles.vacio}>
      <View style={[styles.vacioIconoBox, { backgroundColor: theme.backgroundCard }]}>
        <Ionicons name="notifications-off-outline" size={40} color={theme.textMuted} />
      </View>
      <Text style={[styles.vacioTitulo, { color: theme.textPrimary }]}>
        Sin notificaciones
      </Text>
      <Text style={[styles.vacioSub, { color: theme.textSecondary }]}>
        Aquí aparecerán alertas de suscripción, viajes y liquidaciones
      </Text>
    </View>
  )

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.titulo, { color: theme.textPrimary }]}>
          Notificaciones
        </Text>
        {noLeidas > 0 && (
          <TouchableOpacity
            style={[styles.marcarBtn, { borderColor: theme.borderFocus }]}
            onPress={marcarTodasLeidas}
          >
            <Ionicons name="checkmark-done" size={14} color={theme.primary} />
            <Text style={[styles.marcarBtnText, { color: theme.primary }]}>
              Marcar todas
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {noLeidas > 0 && (
        <View style={[styles.noLeidasBanner, {
          backgroundColor: theme.primaryLight,
          borderBottomColor: theme.borderFocus,
        }]}>
          <Ionicons name="ellipse" size={8} color={theme.primary} />
          <Text style={[styles.noLeidasText, { color: theme.primary }]}>
            {noLeidas} {noLeidas === 1 ? 'notificación nueva' : 'notificaciones nuevas'}
          </Text>
        </View>
      )}

      <FlatList
        data={notificaciones}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={cargando ? null : <ListaVacia />}
        contentContainerStyle={[
          styles.lista,
          notificaciones.length === 0 && styles.listaVacia,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={cargando}
            tintColor={theme.primary}
            colors={[theme.primary]}
            onRefresh={() => {}}
          />
        }
        ItemSeparatorComponent={() => (
          <View style={[styles.separador, { backgroundColor: theme.border }]} />
        )}
      />

      {cargando && notificaciones.length === 0 && (
        <View style={styles.loader}>
          <ActivityIndicator color={theme.primary} size="large" />
        </View>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 105, paddingBottom: 16,
    // borderBottomWidth: StyleSheet.hairlineWidth,
  },
  titulo: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  marcarBtn: {
    flexDirection: 'row', alignItems: 'center',
    gap: 4, borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  marcarBtnText: { fontSize: 11, fontWeight: '500' },
  noLeidasBanner: {
    flexDirection: 'row', alignItems: 'center',
    gap: 6, paddingHorizontal: 20, paddingVertical: 8,
    borderBottomWidth: 1,
  },
  noLeidasText: { fontSize: 12, fontWeight: '500' },
  lista: { paddingVertical: 8 },
  listaVacia: { flex: 1 },
  item: {
    flexDirection: 'row', alignItems: 'flex-start',
    padding: 16, gap: 12, position: 'relative',
  },
  puntoBadge: {
    position: 'absolute', top: 20, left: 6,
    width: 6, height: 6, borderRadius: 3,
  },
  iconoBox: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  itemContent: { flex: 1, gap: 4 },
  itemHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', gap: 8,
  },
  itemTitulo: { fontSize: 14, flex: 1 },
  itemTiempo: { fontSize: 11, flexShrink: 0 },
  itemMensaje: { fontSize: 13, lineHeight: 18, fontWeight: '300' },
  separador: { height: StyleSheet.hairlineWidth },
  vacio: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: 12, paddingHorizontal: 40, paddingBottom: 100,
  },
  vacioIconoBox: {
    width: 72, height: 72, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  vacioTitulo: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  vacioSub: { fontSize: 14, textAlign: 'center', lineHeight: 20, fontWeight: '300' },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center',
  },
})