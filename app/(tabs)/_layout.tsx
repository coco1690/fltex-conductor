// import { Tabs } from 'expo-router'
// import { Ionicons } from '@expo/vector-icons'
// import { useTheme } from '../../src'
// import { Pressable, View } from 'react-native'
// import { useThemeStore } from '../../src/stores/themeStore'

// export default function TabsLayout() {
//   const toggleTheme = useThemeStore(s => s.toggle)
//   const { theme, isDark } = useTheme()

//   return (

//     <View style={{ flex: 1 }}>
//         {/* 🌙 TOGGLE DARK/LIGHT */}
//        <View
//         style={{
//           position: 'absolute',
//           top: 60,
//           right: 20,
//           zIndex: 999,
//           backgroundColor: theme.tabBackground,
//           padding: 8,
//           borderRadius: 20,
//           elevation: 5
//         }}
//       >
//         <Pressable onPress={toggleTheme}>
//           <Ionicons
//             name={isDark ? 'sunny-outline' : 'moon-outline'}
//             size={24}
//             color={theme.primary}
//           />
//         </Pressable>
//       </View> 
//       <Tabs
//         screenOptions={{
//           headerShown: false,

//           tabBarActiveTintColor: theme.tabActive,
//           tabBarInactiveTintColor: theme.tabInactive,

//           tabBarStyle: {
//             backgroundColor: theme.tabBackground,
//             borderTopWidth: 0,
//             height: 86,
//             paddingTop: 10,
//             paddingBottom: 18,
//             paddingHorizontal: 14,

//             // look "app comercial"
//             borderTopLeftRadius: 50,
//             borderTopRightRadius: 50,
//             position: 'absolute',
//             left: 10,
//             right: 10,
//             bottom: 1,
//             elevation: 10
//           },

//           tabBarLabelStyle: {
//             fontSize: 11,
//             fontWeight: '600',
//             marginTop: 5
//           }
//         }}
//       >
//         <Tabs.Screen
//           name="index"
//           options={{
//             title: 'Inicio',
//             tabBarIcon: ({ color, size, focused }) => (
//               <View
//                 style={{
//                   width: 44,
//                   height: 36,
//                   borderRadius: 14,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   backgroundColor: focused ? theme.primaryLight : 'transparent'
//                 }}
//               >
//                 <Ionicons name="home-outline" size={size} color={color} />
//               </View>
//             )
//           }}
//         />

//         <Tabs.Screen
//           name="historial"
//           options={{
//             title: 'Historial',
//             tabBarIcon: ({ color, size, focused }) => (
//               <View
//                 style={{
//                   width: 44,
//                   height: 36,
//                   borderRadius: 14,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   backgroundColor: focused ? theme.primaryLight : 'transparent'
//                 }}
//               >
//                 <Ionicons name="car-outline" size={size} color={color} />
//               </View>
//             )
//           }}
//         />

//         <Tabs.Screen
//           name="encomiendas"
//           options={{
//             title: 'Encomiendas',
//             tabBarIcon: ({ color, size, focused }) => (
//               <View
//                 style={{
//                   width: 44,
//                   height: 36,
//                   borderRadius: 14,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   backgroundColor: focused ? theme.primaryLight : 'transparent'
//                 }}
//               >
//                 <Ionicons name="cube-outline" size={size} color={color} />
//               </View>
//             )
//           }}
//         />

//         <Tabs.Screen
//           name="perfil"
//           options={{
//             title: 'Perfil',
//             tabBarIcon: ({ color, size, focused }) => (
//               <View
//                 style={{
//                   width: 44,
//                   height: 36,
//                   borderRadius: 14,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   backgroundColor: focused ? theme.primaryLight : 'transparent'
//                 }}
//               >
//                 <Ionicons name="person-outline" size={size} color={color} />
//               </View>
//             )
//           }}
//         />
//       </Tabs>
//     </View>
//   )
// }

import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, useViajesStore } from '../../src'
import {
  Pressable, View, Text,
  StyleSheet, AppState, type AppStateStatus,
} from 'react-native'
import { useThemeStore } from '../../src/stores/themeStore'
import { useNotificacionesConductorStore } from '../../src/stores/notificacionesConductorStore'
import { useAuthStore } from '../../src/stores/authStore'
import { useEffect } from 'react'
import { router } from 'expo-router'

function BadgeNotificaciones({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  )
}

export default function TabsLayout() {
  const toggleTheme = useThemeStore(s => s.toggle)
  const { theme, isDark } = useTheme()
  const { usuario, conductor } = useAuthStore()
  const { suscribirCuposRealtime, desuscribirCuposRealtime } = useViajesStore()
  const {
    noLeidas,
    cargarNotificaciones,
    suscribirRealtime,
    desuscribirRealtime,
  } = useNotificacionesConductorStore()

  // useEffect(() => {
  //   if (!usuario?.id) return

  //   cargarNotificaciones(usuario.id)
  //   suscribirRealtime(usuario.id)

  //   const handleAppState = (nextState: AppStateStatus) => {
  //     if (nextState === 'active') {
  //       cargarNotificaciones(usuario.id)
  //     }
  //   }

  //   const suscripcionAppState = AppState.addEventListener('change', handleAppState)

  //   return () => {
  //     desuscribirRealtime()
  //     suscripcionAppState.remove()
  //   }
  // }, [usuario?.id])

  useEffect(() => {
    if (!usuario?.id) return

    cargarNotificaciones(usuario.id)
    suscribirRealtime(usuario.id)

    // suscribir cupos usando conductor.id (no usuario.id)
    if (conductor?.id) {
      suscribirCuposRealtime(conductor.id)
    }

    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        cargarNotificaciones(usuario.id)
      }
    }

    const suscripcionAppState = AppState.addEventListener('change', handleAppState)

    return () => {
      desuscribirRealtime()
      desuscribirCuposRealtime()
      suscripcionAppState.remove()
    }
  }, [usuario?.id, conductor?.id])

  return (
    <View style={{ flex: 1 }}>

      {/* Barra flotante: campana + toggle */}
      <View style={[styles.floatingBar, { backgroundColor: theme.tabBackground }]}>
        <Pressable
          onPress={() => router.push('/(tabs)/notificaciones')}
          style={styles.floatingBtn}
        >
          <Ionicons name="notifications-outline" size={22} color={theme.primary} />
          <BadgeNotificaciones count={noLeidas} />
        </Pressable>

        <View style={[styles.separador, { backgroundColor: theme.border }]} />

        <Pressable onPress={toggleTheme} style={styles.floatingBtn}>
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={22}
            color={theme.primary}
          />
        </Pressable>
      </View>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.tabActive,
          tabBarInactiveTintColor: theme.tabInactive,
          tabBarStyle: {
            backgroundColor: theme.tabBackground,
            borderTopWidth: 0,
            height: 86,
            paddingTop: 10,
            paddingBottom: 18,
            paddingHorizontal: 14,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            position: 'absolute',
            left: 10,
            right: 10,
            bottom: 1,
            elevation: 10
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 5
          }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, size, focused }) => (
              <View style={[
                styles.tabIconBox,
                { backgroundColor: focused ? theme.primaryLight : 'transparent' }
              ]}>
                <Ionicons name="home-outline" size={size} color={color} />
              </View>
            )
          }}
        />

        <Tabs.Screen
          name="historial"
          options={{
            title: 'Historial',
            tabBarIcon: ({ color, size, focused }) => (
              <View style={[
                styles.tabIconBox,
                { backgroundColor: focused ? theme.primaryLight : 'transparent' }
              ]}>
                <Ionicons name="car-outline" size={size} color={color} />
              </View>
            )
          }}
        />

        <Tabs.Screen
          name="encomiendas"
          options={{
            title: 'Encomiendas',
            tabBarIcon: ({ color, size, focused }) => (
              <View style={[
                styles.tabIconBox,
                { backgroundColor: focused ? theme.primaryLight : 'transparent' }
              ]}>
                <Ionicons name="cube-outline" size={size} color={color} />
              </View>
            )
          }}
        />

        <Tabs.Screen
          name="perfil"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size, focused }) => (
              <View style={[
                styles.tabIconBox,
                { backgroundColor: focused ? theme.primaryLight : 'transparent' }
              ]}>
                <Ionicons name="person-outline" size={size} color={color} />
              </View>
            )
          }}
        />

        {/* Pantalla de notificaciones — sin tab visible */}
        <Tabs.Screen
          name="notificaciones"
          options={{ href: null }}
        />
      </Tabs>
    </View>
  )
}

const styles = StyleSheet.create({
  floatingBar: {
    position: 'absolute',
    top: 54, right: 16,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  floatingBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  separador: { width: 1, height: 20, borderRadius: 1 },
  tabIconBox: {
    width: 44, height: 36,
    borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4, right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 16, height: 16,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 16,
  },
})