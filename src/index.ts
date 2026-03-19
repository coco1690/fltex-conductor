export { supabase } from './supabase/client'
export type { Database } from './supabase/types'
export type { Tables, TablesInsert, TablesUpdate, Enums } from './supabase/types'
export { Constants } from './supabase/types'

// Tipos de enums directamente desde Database
export type EstadoGeneral = Database['public']['Enums']['estado_general']
export type RolUsuario = Database['public']['Enums']['rol_usuario']
export type EstadoViaje = Database['public']['Enums']['estado_viaje']
export type EstadoReserva = Database['public']['Enums']['estado_reserva']
export type EstadoEncomienda = Database['public']['Enums']['estado_encomienda']
export type TipoCobroEncomienda = Database['public']['Enums']['tipo_cobro_encomienda']
export type EstadoSuscripcion = Database['public']['Enums']['estado_suscripcion']
export type TipoVehiculo = Database['public']['Enums']['tipo_vehiculo']
export type TipoNotificacion = Database['public']['Enums']['tipo_notificacion']

import type { Database } from './supabase/types'

export { useAuthStore } from './stores/authStore'
export { useViajesStore } from './stores/viajesStore'
export { useReservasStore } from './stores/reservasStore'
export { useEncomiendasStore } from './stores/encomiendasStore'

export { useTheme } from './theme'