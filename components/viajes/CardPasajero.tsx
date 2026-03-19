// import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native'
// import { Ionicons } from '@expo/vector-icons'
// import { useTheme } from '../../src/theme/useTheme'

// interface Pasajero {
//     id: string
//     nombres: string
//     telefono?: string | null
//     orden: number
//     estado?: string
// }

// interface Reserva {
//     id: string
//     estado: string
//     cupos_solicitados: number
//     precio_pasaje: number
//     reserva_pasajeros: Pasajero[]
//     puntos_abordaje?: { nombre: string } | null
// }

// interface Props {
//     reserva: Reserva
//     viajeEstado: string
//     onAbordar: (reservaId: string) => void
//     onNoShowPasajero: (reservaPasajeroId: string, nombre: string) => void
// }

// export function CardPasajero({ reserva, viajeEstado, onAbordar, onNoShowPasajero }: Props) {
//     const { theme } = useTheme()

//     const titular = reserva.reserva_pasajeros?.[0]
//     const todosPasajeros = reserva.reserva_pasajeros ?? []
//     const enAbordaje = viajeEstado === 'abordando'

//     const formatTelefono = (tel?: string | null) => {
//         if (!tel) return null
//         return tel.startsWith('57') ? tel.slice(2) : tel
//     }

//     const handleLlamar = () => {
//         const numero = formatTelefono(titular?.telefono)
//         if (!numero) return
//         Linking.openURL(`tel:${numero}`)
//     }

//     const getEstadoConfig = () => {
//         switch (reserva.estado) {
//             case 'abordada': return { color: theme.success, bg: theme.successLight, label: 'Abordó', icon: 'checkmark-circle' }
//             case 'no_show': return { color: theme.error, bg: theme.errorLight, label: 'No show', icon: 'close-circle' }
//             default: return { color: theme.warning, bg: theme.warningLight, label: 'Pendiente', icon: 'time' }
//         }
//     }

//     const getPasajeroConfig = (pasajeroEstado?: string) => {
//         if (pasajeroEstado === 'no_show') {
//             return { color: theme.error, icon: 'close-circle', tachado: true }
//         }
//         if (reserva.estado === 'abordada') {
//             return { color: theme.success, icon: 'checkmark-circle', tachado: false }
//         }
//         return { color: theme.textMuted, icon: 'ellipse-outline', tachado: false }
//     }

//     const estadoConfig = getEstadoConfig()
//     const totalActivos = todosPasajeros.filter(p => p.estado !== 'no_show').length

//     return (
//         <View style={[styles.card, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>

//             {/* Header: estado + precio + llamar */}
//             <View style={styles.headerRow}>
//                 <View style={styles.headerLeft}>
//                     <View style={[styles.estadoBadge, { backgroundColor: estadoConfig.bg }]}>
//                         <Ionicons name={estadoConfig.icon as any} size={12} color={estadoConfig.color} />
//                         <Text style={[styles.estadoTexto, { color: estadoConfig.color }]}>
//                             {estadoConfig.label}
//                         </Text>
//                     </View>
//                     <Text style={[styles.cuposTexto, { color: theme.textSecondary }]}>
//                         {totalActivos} cupo{totalActivos !== 1 ? 's' : ''}
//                         {'  ·  '}
//                         <Text style={[styles.precioTexto, { color: theme.textPrimary }]}>
//                             ${(reserva.precio_pasaje * totalActivos).toLocaleString('es-CO')}
//                         </Text>
//                     </Text>
//                 </View>

//                 {titular?.telefono && (
//                     <TouchableOpacity
//                         style={[styles.botonLlamar, { backgroundColor: theme.primaryLight }]}
//                         onPress={handleLlamar}
//                     >
//                         <Ionicons name="call-outline" size={14} color={theme.primary} />
//                         <Text style={[styles.telefonoTexto, { color: theme.primary }]}>
//                             {formatTelefono(titular.telefono)}
//                         </Text>
//                     </TouchableOpacity>
//                 )}
//             </View>

//             <View style={[styles.separador, { backgroundColor: theme.border }]} />

//             {/* Punto de abordaje */}
//             {reserva.puntos_abordaje && (
//                 <View style={styles.puntoFila}>
//                     <View style={[styles.puntoIcono, { backgroundColor: theme.primaryLight }]}>
//                         <Ionicons name="location-outline" size={13} color={theme.primary} />
//                     </View>
//                     <Text style={[styles.puntoLabel, { color: theme.textMuted }]}>
//                         Recoger en{' '}
//                         <Text style={[styles.puntoNombre, { color: theme.textPrimary }]}>
//                             {reserva.puntos_abordaje.nombre}
//                         </Text>
//                     </Text>
//                 </View>
//             )}

//             {reserva.puntos_abordaje && (
//                 <View style={[styles.separador, { backgroundColor: theme.border }]} />
//             )}

//             {/* Lista de pasajeros */}
//             <View style={styles.listaPasajeros}>
//                 {todosPasajeros.map((pasajero, index) => {
//                     const pConfig = getPasajeroConfig(pasajero.estado)
//                     const esTitular = index === 0
//                     return (
//                         <View key={pasajero.id} style={styles.filaPasajero}>
//                             <Ionicons
//                                 name={pConfig.icon as any}
//                                 size={16}
//                                 color={pConfig.color}
//                             />
//                             <View style={styles.pasajeroInfo}>
//                                 <Text style={[
//                                     styles.pasajeroNombre,
//                                     {
//                                         color: pConfig.tachado ? theme.textMuted : theme.textPrimary,
//                                         textDecorationLine: pConfig.tachado ? 'line-through' : 'none',
//                                     }
//                                 ]}>
//                                     {pasajero.nombres}
//                                 </Text>
//                                 {esTitular && (
//                                     <View style={[styles.titularBadge, { backgroundColor: theme.border }]}>
//                                         <Text style={[styles.titularLabel, { color: theme.textMuted }]}>
//                                             Titular
//                                         </Text>
//                                     </View>
//                                 )}
//                             </View>

//                             {enAbordaje && reserva.estado === 'reservada' && pasajero.estado !== 'no_show' && (
//                                 <TouchableOpacity
//                                     style={[styles.botonNoShow, { borderColor: theme.errorLight, backgroundColor: theme.errorLight }]}
//                                     onPress={() => onNoShowPasajero(pasajero.id, pasajero.nombres)}
//                                     hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//                                 >
//                                     <Ionicons name="close" size={13} color={theme.error} />
//                                 </TouchableOpacity>
//                             )}
//                         </View>
//                     )
//                 })}
//             </View>

//             {/* Botón abordar */}
//             {/* {enAbordaje && reserva.estado === 'reservada' && totalActivos > 0 && (
//                 <>
//                     <View style={[styles.separador, { backgroundColor: theme.border }]} />
//                     <TouchableOpacity
//                         style={[styles.botonAbordar, { backgroundColor: theme.success }]}
//                         onPress={() => onAbordar(reserva.id)}
//                     >
//                         <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
//                         <Text style={styles.botonAbordarTexto}>
//                             {totalActivos === 1 ? 'Abordó' : `Todos abordaron · ${totalActivos}`}
//                         </Text>
//                     </TouchableOpacity>
//                 </>
//             )} */}
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     card: {
//         borderRadius: 16,
//         borderWidth: 1,
//         padding: 16,
//         gap: 12,
//     },
//     headerRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     headerLeft: {
//         gap: 6,
//     },
//     estadoBadge: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 4,
//         paddingHorizontal: 8,
//         paddingVertical: 3,
//         borderRadius: 20,
//         alignSelf: 'flex-start',
//     },
//     estadoTexto: {
//         fontSize: 11,
//         fontWeight: '700',
//         textTransform: 'uppercase',
//         letterSpacing: 0.5,
//     },
//     cuposTexto: {
//         fontSize: 13,
//     },
//     precioTexto: {
//         fontWeight: '700',
//     },
//     botonLlamar: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 5,
//         paddingHorizontal: 10,
//         paddingVertical: 7,
//         borderRadius: 20,
//     },
//     telefonoTexto: {
//         fontSize: 12,
//         fontWeight: '600',
//     },
//     separador: {
//         height: 1,
//     },
//     puntoFila: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 8,
//     },
//     puntoIcono: {
//         width: 24,
//         height: 24,
//         borderRadius: 12,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     puntoLabel: {
//         fontSize: 13,
//         flex: 1,
//     },
//     puntoNombre: {
//         fontSize: 13,
//         fontWeight: '600',
//     },
//     listaPasajeros: {
//         gap: 10,
//     },
//     filaPasajero: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//     },
//     pasajeroInfo: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 8,
//     },
//     pasajeroNombre: {
//         fontSize: 14,
//         fontWeight: '500',
//     },
//     titularBadge: {
//         paddingHorizontal: 6,
//         paddingVertical: 2,
//         borderRadius: 6,
//     },
//     titularLabel: {
//         fontSize: 10,
//         fontWeight: '600',
//         textTransform: 'uppercase',
//         letterSpacing: 0.3,
//     },
//     botonNoShow: {
//         width: 26,
//         height: 26,
//         borderRadius: 13,
//         borderWidth: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     botonAbordar: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: 8,
//         paddingVertical: 13,
//         borderRadius: 12,
//     },
//     botonAbordarTexto: {
//         color: '#FFFFFF',
//         fontSize: 15,
//         fontWeight: '700',
//     },
// })


import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/theme/useTheme'

interface Pasajero {
    id: string
    nombres: string
    telefono?: string | null
    orden: number
    estado?: string
}

interface Reserva {
    id: string
    estado: string
    cupos_solicitados: number
    precio_pasaje: number
    reserva_pasajeros: Pasajero[]
    puntos_abordaje?: { nombre: string } | null
}

interface Props {
    reserva: Reserva
    viajeEstado: string
    onAbordar: (reservaId: string) => void
    onNoShowPasajero: (reservaPasajeroId: string, nombre: string) => void
}

export function CardPasajero({ reserva, viajeEstado, onAbordar, onNoShowPasajero }: Props) {
    const { theme } = useTheme()

    const titular = reserva.reserva_pasajeros?.[0]
    const todosPasajeros = reserva.reserva_pasajeros ?? []
    const enAbordaje = viajeEstado === 'abordando'

    const formatTelefono = (tel?: string | null) => {
        if (!tel) return null
        return tel.startsWith('57') ? tel.slice(2) : tel
    }

    const handleLlamar = () => {
        const numero = formatTelefono(titular?.telefono)
        if (!numero) return
        Linking.openURL(`tel:${numero}`)
    }

    const getEstadoConfig = () => {
        switch (reserva.estado) {
            case 'abordada':  return { color: theme.success, bg: theme.successLight, label: 'ABORDÓ',   icon: 'checkmark-circle' }
            case 'no_show':   return { color: theme.error,   bg: theme.errorLight,   label: 'NO SHOW',  icon: 'close-circle' }
            default:          return { color: theme.warning, bg: theme.warningLight, label: 'PENDIENTE', icon: 'time' }
        }
    }

    const getPasajeroConfig = (pasajeroEstado?: string) => {
        if (pasajeroEstado === 'no_show') return { color: theme.error,   icon: 'close-circle',    tachado: true }
        if (reserva.estado === 'abordada') return { color: theme.success, icon: 'checkmark-circle', tachado: false }
        return                                    { color: theme.textMuted, icon: 'ellipse-outline', tachado: false }
    }

    const estadoConfig = getEstadoConfig()
    const totalActivos = todosPasajeros.filter(p => p.estado !== 'no_show').length
    const totalPrecio = (reserva.precio_pasaje * totalActivos).toLocaleString('es-CO')

    return (
        <View style={[styles.card, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>

            {/* Header: estado dot + label · botón llamar */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={[styles.statusDot, { backgroundColor: estadoConfig.color }]} />
                    <Text style={[styles.statusLabel, { color: estadoConfig.color }]}>
                        {estadoConfig.label}
                    </Text>
                </View>

                {titular?.telefono && (
                    <TouchableOpacity
                        style={[styles.botonLlamar, { backgroundColor: theme.primaryLight }]}
                        onPress={handleLlamar}
                    >
                        <Ionicons name="call-outline" size={13} color={theme.primary} />
                        <Text style={[styles.botonLlamarTexto, { color: theme.primary }]}>
                            {formatTelefono(titular.telefono)}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Info row: cupos · precio · punto abordaje */}
            <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                    <Ionicons name="people-outline" size={13} color={theme.textMuted} />
                    <Text style={[styles.infoTexto, { color: theme.textSecondary }]}>
                        {totalActivos} cupo{totalActivos !== 1 ? 's' : ''}
                    </Text>
                </View>

                <View style={[styles.infoDivider, { backgroundColor: theme.border }]} />

                <View style={styles.infoItem}>
                    <Ionicons name="cash-outline" size={13} color={theme.textMuted} />
                    <Text style={[styles.infoTexto, { color: theme.textSecondary }]}>
                        ${totalPrecio}
                    </Text>
                </View>

                {reserva.puntos_abordaje && (
                    <>
                        <View style={[styles.infoDivider, { backgroundColor: theme.border }]} />
                        <View style={styles.infoItem}>
                            <Ionicons name="location-outline" size={13} color={theme.textMuted} />
                            <Text style={[styles.infoTexto, { color: theme.textSecondary }]} numberOfLines={1}>
                                {reserva.puntos_abordaje.nombre}
                            </Text>
                        </View>
                    </>
                )}
            </View>

            {/* Separador */}
            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Lista de pasajeros */}
            <View style={styles.listaPasajeros}>
                {todosPasajeros.map((pasajero, index) => {
                    const pConfig = getPasajeroConfig(pasajero.estado)
                    const esTitular = index === 0
                    return (
                        <View key={pasajero.id} style={styles.filaPasajero}>
                            <Ionicons name={pConfig.icon as any} size={16} color={pConfig.color} />
                            <View style={styles.pasajeroInfo}>
                                <Text style={[
                                    styles.pasajeroNombre,
                                    {
                                        color: pConfig.tachado ? theme.textMuted : theme.textPrimary,
                                        textDecorationLine: pConfig.tachado ? 'line-through' : 'none',
                                    }
                                ]}>
                                    {pasajero.nombres}
                                </Text>
                                {esTitular && (
                                    <View style={[styles.titularBadge, { backgroundColor: theme.border }]}>
                                        <Text style={[styles.titularLabel, { color: theme.textMuted }]}>
                                            Titular
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {enAbordaje && reserva.estado === 'reservada' && pasajero.estado !== 'no_show' && (
                                <TouchableOpacity
                                    style={[styles.botonNoShow, { backgroundColor: theme.errorLight }]}
                                    onPress={() => onNoShowPasajero(pasajero.id, pasajero.nombres)}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <Ionicons name="close" size={13} color={theme.error} />
                                </TouchableOpacity>
                            )}
                        </View>
                    )
                })}
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        borderWidth: 1,
        padding: 18,
        gap: 14,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
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
    botonLlamar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    botonLlamarTexto: {
        fontSize: 12,
        fontWeight: '600',
    },

    // Info row
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
    infoDivider: {
        width: 1,
        height: 12,
    },

    // Divider
    divider: {
        height: 1,
    },

    // Pasajeros
    listaPasajeros: {
        gap: 10,
    },
    filaPasajero: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    pasajeroInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    pasajeroNombre: {
        fontSize: 14,
        fontWeight: '500',
    },
    titularBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    titularLabel: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    botonNoShow: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
})