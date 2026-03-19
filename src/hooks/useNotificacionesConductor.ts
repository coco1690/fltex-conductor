// src/hooks/useNotificacionesConductor.ts
import { useEffect } from 'react'
import { useNotificacionesConductorStore } from '../stores/notificacionesConductorStore'
import { useAuthStore } from '../stores/authStore'

export function useNotificacionesConductor() {
  const { usuario } = useAuthStore()
  const {
    notificaciones,
    noLeidas,
    cargando,
    error,
    cargarNotificaciones,
    marcarLeida,
    marcarTodasLeidas,
    suscribirRealtime,
    desuscribirRealtime,
    limpiarError,
  } = useNotificacionesConductorStore()

  useEffect(() => {
    if (!usuario?.id) return
    cargarNotificaciones(usuario.id)
    suscribirRealtime(usuario.id)
    return () => desuscribirRealtime()
  }, [usuario?.id])

  const handleMarcarLeida = (id: string) => {
    if (!usuario?.id) return
    marcarLeida(id, usuario.id)
  }

  const handleMarcarTodasLeidas = () => {
    if (!usuario?.id) return
    marcarTodasLeidas(usuario.id)
  }

  return {
    notificaciones,
    noLeidas,
    cargando,
    error,
    marcarLeida: handleMarcarLeida,
    marcarTodasLeidas: handleMarcarTodasLeidas,
    limpiarError,
  }
}