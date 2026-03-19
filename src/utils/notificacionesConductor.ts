// src/utils/notificacionesConductor.ts
import type { TipoNotificacion } from '../stores/notificacionesConductorStore'

export function getIconoConductor(tipo: TipoNotificacion): {
  nombre: string
  color: string
  bgColor: string
} {
  switch (tipo) {
    case 'vencimiento_suscripcion':
      return { nombre: 'warning', color: '#F59E0B', bgColor: 'rgba(245,158,11,0.12)' }
    case 'suscripcion_suspendida':
      return { nombre: 'ban', color: '#EF4444', bgColor: 'rgba(239,68,68,0.12)' }
    case 'suscripcion_renovada':
      return { nombre: 'checkmark-circle', color: '#22C55E', bgColor: 'rgba(34,197,94,0.12)' }
    case 'viaje_nuevo':
      return { nombre: 'add-circle', color: '#3B82F6', bgColor: 'rgba(59,130,246,0.12)' }
    case 'viaje_cancelado':
      return { nombre: 'close-circle', color: '#EF4444', bgColor: 'rgba(239,68,68,0.12)' }
    case 'viaje_iniciado':
      return { nombre: 'navigate', color: '#3B82F6', bgColor: 'rgba(59,130,246,0.12)' }
    case 'liquidacion_pendiente':
      return { nombre: 'time', color: '#F59E0B', bgColor: 'rgba(245,158,11,0.12)' }
    case 'liquidacion_pagada':
      return { nombre: 'cash', color: '#22C55E', bgColor: 'rgba(34,197,94,0.12)' }
    default:
      return { nombre: 'notifications', color: '#3B82F6', bgColor: 'rgba(59,130,246,0.12)' }
  }
}

export function getTiempoRelativo(fecha: string): string {
  const diff = Date.now() - new Date(fecha).getTime()
  const minutos = Math.floor(diff / 60000)
  const horas = Math.floor(diff / 3600000)
  const dias = Math.floor(diff / 86400000)

  if (minutos < 1) return 'Ahora'
  if (minutos < 60) return `Hace ${minutos}m`
  if (horas < 24) return `Hace ${horas}h`
  if (dias < 7) return `Hace ${dias}d`
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: 'numeric', month: 'short',
  })
}