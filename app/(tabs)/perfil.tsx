import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native'
import { useTheme } from '../../src/theme/useTheme'
import { useAuthStore } from '../../src/stores/authStore'
import { Ionicons } from '@expo/vector-icons'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function Perfil() {
  const { theme } = useTheme()
  const { usuario, conductor, perfil, cerrarSesion } = useAuthStore()

  const [openSections, setOpenSections] = useState({
    licencia: true,
    vehiculo: false,
    agencia: false,
  })

  const toggleSection = (section: 'licencia' | 'vehiculo' | 'agencia') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const getSuscripcionConfig = () => {
    switch (conductor?.estado_suscripcion) {
      case 'activo':
        return { label: 'ACTIVA', color: theme.success }
      case 'por_vencer':
        return { label: 'POR VENCER', color: theme.warning }
      case 'suspendido':
        return { label: 'SUSPENDIDA', color: theme.error }
      case 'pendiente_activacion':
        return { label: 'PENDIENTE', color: theme.info }
      default:
        return { label: 'DESCONOCIDO', color: theme.textMuted }
    }
  }

  const getVehiculoEstadoConfig = () => {
    switch (perfil?.vehiculo_estado) {
      case 'activo':
        return { label: 'ACTIVO', color: theme.success, bg: theme.successLight }
      case 'mantenimiento':
        return { label: 'MANTENIMIENTO', color: theme.warning, bg: theme.warningLight }
      case 'inactivo':
        return { label: 'INACTIVO', color: theme.error, bg: theme.errorLight }
      default:
        return { label: 'DESCONOCIDO', color: theme.textMuted, bg: theme.backgroundCard }
    }
  }

  const confirmarCierreSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: cerrarSesion },
      ]
    )
  }

  const suscripcionConfig = getSuscripcionConfig()
  const vehiculoConfig = getVehiculoEstadoConfig()

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.titulo, { color: theme.textPrimary }]}>Perfil</Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.backgroundSecondary,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.statusDot, { backgroundColor: suscripcionConfig.color }]} />
            <Text style={[styles.statusLabel, { color: suscripcionConfig.color }]}>
              {suscripcionConfig.label}
            </Text>
          </View>

          {perfil?.agencia_nombre && (
            <Text style={[styles.agenciaNombre, { color: theme.textMuted }]}>
              {perfil.agencia_nombre}
            </Text>
          )}
        </View>

        <View style={styles.avatarRow}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarTexto}>
              {usuario?.nombre?.charAt(0).toUpperCase() ?? 'C'}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.nombre, { color: theme.textPrimary }]}>
              {usuario?.nombre}
            </Text>
            <Text style={[styles.telefono, { color: theme.textSecondary }]}>
              {usuario?.telefono}
            </Text>
            {perfil?.region_nombre && (
              <Text style={[styles.region, { color: theme.textMuted }]}>
                {perfil.region_nombre}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.infoRow}>
          {conductor?.fecha_corte && (
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={13} color={theme.textMuted} />
              <Text style={[styles.infoTexto, { color: theme.textSecondary }]}>
                Vence{' '}
                {new Date(conductor.fecha_corte).toLocaleDateString('es-CO', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
            </View>
          )}

          {conductor?.categoria_licencia && (
            <View style={styles.infoItem}>
              <Ionicons name="card-outline" size={13} color={theme.textMuted} />
              <Text style={[styles.infoTexto, { color: theme.textSecondary }]}>
                Licencia {conductor.categoria_licencia}
              </Text>
            </View>
          )}
        </View>

        {conductor?.estado_suscripcion === 'por_vencer' && (
          <>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={[styles.alerta, { backgroundColor: theme.warningLight }]}>
              <Ionicons name="warning-outline" size={15} color={theme.warning} />
              <Text style={[styles.alertaTexto, { color: theme.warning }]}>
                Tu suscripción vence pronto. Contacta a tu agencia para renovarla.
              </Text>
            </View>
          </>
        )}
      </View>

      {perfil?.conductor_id && (
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.accordionHeader}
            activeOpacity={0.8}
            onPress={() => toggleSection('licencia')}
          >
            <View style={styles.headerLeft}>
              <View style={[styles.statusDot, { backgroundColor: theme.primary }]} />
              <Text style={[styles.statusLabel, { color: theme.primary }]}>LICENCIA</Text>
            </View>

            <Ionicons
              name={openSections.licencia ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={18}
              color={theme.textMuted}
            />
          </TouchableOpacity>

          {openSections.licencia && (
            <>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <View style={styles.infoFilaDetalle}>
                <Ionicons name="card-outline" size={15} color={theme.textMuted} />
                <Text style={[styles.infoLabelDetalle, { color: theme.textSecondary }]}>
                  Número
                </Text>
                <Text style={[styles.infoValor, { color: theme.textPrimary }]}>
                  {perfil.numero_licencia}
                </Text>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <View style={styles.infoFilaDetalle}>
                <Ionicons name="ribbon-outline" size={15} color={theme.textMuted} />
                <Text style={[styles.infoLabelDetalle, { color: theme.textSecondary }]}>
                  Categoría
                </Text>
                <Text style={[styles.infoValor, { color: theme.textPrimary }]}>
                  {perfil.categoria_licencia}
                </Text>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <View style={styles.infoFilaDetalle}>
                <Ionicons name="calendar-outline" size={15} color={theme.textMuted} />
                <Text style={[styles.infoLabelDetalle, { color: theme.textSecondary }]}>
                  Vencimiento
                </Text>
                <Text style={[styles.infoValor, { color: theme.textPrimary }]}>
                  {perfil.fecha_vencimiento_licencia
                    ? new Date(perfil.fecha_vencimiento_licencia).toLocaleDateString('es-CO')
                    : '—'}
                </Text>
              </View>

              {perfil.numero_nequi && (
                <>
                  <View style={[styles.divider, { backgroundColor: theme.border }]} />
                  <View style={styles.infoFilaDetalle}>
                    <Ionicons
                      name="phone-portrait-outline"
                      size={15}
                      color={theme.textMuted}
                    />
                    <Text style={[styles.infoLabelDetalle, { color: theme.textSecondary }]}>
                      Nequi
                    </Text>
                    <Text style={[styles.infoValor, { color: theme.textPrimary }]}>
                      {perfil.numero_nequi}
                    </Text>
                  </View>
                </>
              )}
            </>
          )}
        </View>
      )}

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.backgroundSecondary,
            borderColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.accordionHeader}
          activeOpacity={0.8}
          onPress={() => toggleSection('vehiculo')}
        >
          <View style={styles.headerLeft}>
            <View style={[styles.statusDot, { backgroundColor: theme.primary }]} />
            <Text style={[styles.statusLabel, { color: theme.primary }]}>VEHÍCULO</Text>
          </View>

          <View style={styles.accordionRight}>
            {perfil?.vehiculo_id && (
              <View style={[styles.estadoBadge, { backgroundColor: vehiculoConfig.bg }]}>
                <Text style={[styles.estadoBadgeTexto, { color: vehiculoConfig.color }]}>
                  {vehiculoConfig.label}
                </Text>
              </View>
            )}

            <Ionicons
              name={openSections.vehiculo ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={18}
              color={theme.textMuted}
            />
          </View>
        </TouchableOpacity>

        {openSections.vehiculo && (
          <>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {perfil?.vehiculo_id ? (
              <>
                <View style={styles.infoFilaDetalle}>
                  <Ionicons name="car-outline" size={15} color={theme.textMuted} />
                  <Text style={[styles.infoLabelDetalle, { color: theme.textSecondary }]}>
                    Placa
                  </Text>
                  <Text style={[styles.infoValor, { color: theme.textPrimary }]}>
                    {perfil.placa}
                  </Text>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.border }]} />

                <View style={styles.infoFilaDetalle}>
                  <Ionicons name="construct-outline" size={15} color={theme.textMuted} />
                  <Text style={[styles.infoLabelDetalle, { color: theme.textSecondary }]}>
                    Marca / Modelo
                  </Text>
                  <Text style={[styles.infoValor, { color: theme.textPrimary }]}>
                    {[perfil.marca, perfil.modelo, perfil.anio].filter(Boolean).join(' · ')}
                  </Text>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.border }]} />

                <View style={styles.infoFilaDetalle}>
                  <Ionicons name="bus-outline" size={15} color={theme.textMuted} />
                  <Text style={[styles.infoLabelDetalle, { color: theme.textSecondary }]}>
                    Tipo
                  </Text>
                  <Text style={[styles.infoValor, { color: theme.textPrimary }]}>
                    {perfil.vehiculo_tipo?.replace('_', ' ')}
                  </Text>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.border }]} />

                <View style={styles.infoFilaDetalle}>
                  <Ionicons name="people-outline" size={15} color={theme.textMuted} />
                  <Text style={[styles.infoLabelDetalle, { color: theme.textSecondary }]}>
                    Capacidad
                  </Text>
                  <Text style={[styles.infoValor, { color: theme.textPrimary }]}>
                    {perfil.capacidad_pasajeros} pasajeros
                    {perfil.capacidad_carga_kg
                      ? ` · ${perfil.capacidad_carga_kg} kg carga`
                      : ''}
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.sinDatos}>
                <Ionicons name="car-outline" size={32} color={theme.textMuted} />
                <Text style={[styles.sinDatosTexto, { color: theme.textMuted }]}>
                  Sin vehículo asignado
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      {perfil?.agencia_nombre && (
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.accordionHeader}
            activeOpacity={0.8}
            onPress={() => toggleSection('agencia')}
          >
            <View style={styles.headerLeft}>
              <View style={[styles.statusDot, { backgroundColor: theme.primary }]} />
              <Text style={[styles.statusLabel, { color: theme.primary }]}>AGENCIA</Text>
            </View>

            <Ionicons
              name={openSections.agencia ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={18}
              color={theme.textMuted}
            />
          </TouchableOpacity>

          {openSections.agencia && (
            <>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <View style={styles.infoFilaDetalle}>
                <Ionicons name="business-outline" size={15} color={theme.textMuted} />
                <Text style={[styles.infoLabelDetalle, { color: theme.textSecondary }]}>
                  Nombre
                </Text>
                <Text style={[styles.infoValor, { color: theme.textPrimary }]}>
                  {perfil.agencia_nombre}
                </Text>
              </View>

              {perfil.agencia_codigo && (
                <>
                  <View style={[styles.divider, { backgroundColor: theme.border }]} />
                  <View style={styles.infoFilaDetalle}>
                    <Ionicons name="barcode-outline" size={15} color={theme.textMuted} />
                    <Text style={[styles.infoLabelDetalle, { color: theme.textSecondary }]}>
                      Código
                    </Text>
                    <Text style={[styles.infoValor, { color: theme.textPrimary }]}>
                      {perfil.agencia_codigo}
                    </Text>
                  </View>
                </>
              )}

              {perfil.agencia_telefono && (
                <>
                  <View style={[styles.divider, { backgroundColor: theme.border }]} />
                  <View style={styles.infoFilaDetalle}>
                    <Ionicons name="call-outline" size={15} color={theme.textMuted} />
                    <Text style={[styles.infoLabelDetalle, { color: theme.textSecondary }]}>
                      Teléfono
                    </Text>
                    <Text style={[styles.infoValor, { color: theme.textPrimary }]}>
                      {perfil.agencia_telefono}
                    </Text>
                  </View>
                </>
              )}

              {perfil.agencia_direccion && (
                <>
                  <View style={[styles.divider, { backgroundColor: theme.border }]} />
                  <View style={styles.infoFilaDetalle}>
                    <Ionicons name="location-outline" size={15} color={theme.textMuted} />
                    <Text style={[styles.infoLabelDetalle, { color: theme.textSecondary }]}>
                      Dirección
                    </Text>
                    <Text style={[styles.infoValor, { color: theme.textPrimary }]}>
                      {perfil.agencia_direccion}
                    </Text>
                  </View>
                </>
              )}
            </>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[styles.botonCerrar, { borderColor: theme.error }]}
        onPress={confirmarCierreSesion}
      >
        <Ionicons name="log-out-outline" size={18} color={theme.error} />
        <Text style={[styles.botonCerrarTexto, { color: theme.error }]}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 110, paddingBottom: 28, gap: 12 },

  titulo: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 4,
  },

  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  accordionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  statusLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  agenciaNombre: {
    fontSize: 11,
    fontWeight: '500',
  },

  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarTexto: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  nombre: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },

  telefono: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },

  region: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '400',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  infoTexto: {
    fontSize: 12,
    fontWeight: '500',
  },

  divider: {
    height: 1,
  },

  alerta: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },

  alertaTexto: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },

  infoFilaDetalle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  infoLabelDetalle: {
    fontSize: 13,
    width: 110,
    fontWeight: '500',
  },

  infoValor: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },

  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },

  estadoBadgeTexto: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  sinDatos: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },

  sinDatosTexto: {
    fontSize: 13,
    fontWeight: '500',
  },

  botonCerrar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 4,
  },

  botonCerrarTexto: {
    fontSize: 15,
    fontWeight: '700',
  },
})