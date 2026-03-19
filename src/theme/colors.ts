// export const colors = {
//   light: {
//     // Primarios
//     primary: '#2563EB',
//     primaryLight: '#BFDBFE',
//     primaryDark: '#1D4ED8',

//     // Fondos
//     background: '#F5F5F5',
//     backgroundSecondary: '#EBEBEB',
//     backgroundCard: '#FFFFFF',
//     backgroundCardButton: '#1A1A1A',

//     // background: '#FFFFFF',
//     // backgroundSecondary: '#F9FAFB',
//     // backgroundCard: '#F3F4F6',
//     // backgroundCardButton: '#F3F4F6',

//     // Textos
//     textPrimary: '#111827',
//     textSecondary: '#6B7280',
//     textMuted: '#9CA3AF',
//     textInverse: '#FFFFFF',

//     // Bordes
//     border: '#E5E7EB',
//     borderFocus: '#2563EB',

//     // Estados
//     success: '#16A34A',
//     successLight: '#DCFCE7',
//     warning: '#D97706',
//     warningLight: '#FEF3C7',
//     error: '#DC2626',
//     errorLight: '#FEE2E2',
//     info: '#0284C7',
//     infoLight: '#E0F2FE',

//     // Tab bar
//     tabActive: '#2563EB',
//     tabInactive: '#9CA3AF',
//     tabBackground: '#FFFFFF',

//     // Específicos app
//     reservaActiva: '#2563EB',
//     conductorDisponible: '#16A34A',
//     suscripcionVigente: '#16A34A',
//     suscripcionPorVencer: '#D97706',
//     suscripcionSuspendida: '#DC2626',
//   },
//   dark: {
//     // Primarios
//     primary: '#3B82F6',
//     primaryLight: '#1E3A5F',
//     primaryDark: '#60A5FA',

//     // Fondos
//     background: '#111827',
//     backgroundSecondary: '#1F2937',
//     backgroundCard: '#374151',
//     backgroundCardButton: '#3B82F6',
//     // Textos
//     textPrimary: '#F9FAFB',
//     textSecondary: '#D1D5DB',
//     textMuted: '#6B7280',
//     textInverse: '#111827',

//     // Bordes
//     border: '#374151',
//     borderFocus: '#3B82F6',

//     // Estados
//     success: '#22C55E',
//     successLight: '#14532D',
//     warning: '#F59E0B',
//     warningLight: '#78350F',
//     error: '#EF4444',
//     errorLight: '#7F1D1D',
//     info: '#38BDF8',
//     infoLight: '#0C4A6E',

//     // Tab bar
//     tabActive: '#3B82F6',
//     tabInactive: '#6B7280',
//     tabBackground: '#1F2937',

//     // Específicos app
//     reservaActiva: '#3B82F6',
//     conductorDisponible: '#22C55E',
//     suscripcionVigente: '#22C55E',
//     suscripcionPorVencer: '#F59E0B',
//     suscripcionSuspendida: '#EF4444',
//   }
// }

// export type ColorScheme = typeof colors.light

// GAMA DE COLORES NUEVO 

export const colors = {
  light: {
    // Primarios — sin cambio, brand color fijo
    primary: '#2563EB',
    primaryLight: '#BFDBFE',
    primaryDark: '#1D4ED8',

    // Fondos — más cálidos/neutros para contrastar con el dark
    background: '#F1F5F9',         // slate-100, menos frío que #F5F5F5
    backgroundSecondary: '#E2E8F0', // slate-200
    backgroundCard: '#FFFFFF',
    backgroundCardButton: '#1E293B',

    // Textos
    textPrimary: '#0F172A',        // slate-900, más profundo
    textSecondary: '#475569',      // slate-600, del diseño oscuro
    textMuted: '#94A3B8',          // slate-400, del diseño oscuro
    textInverse: '#FFFFFF',

    // Bordes
    border: '#E2E8F0',             // slate-200
    borderFocus: '#2563EB',

    // Estados
    success: '#16A34A',
    successLight: '#DCFCE7',
    warning: '#D97706',
    warningLight: '#FEF3C7',
    error: '#DC2626',
    errorLight: '#FEE2E2',
    info: '#0284C7',
    infoLight: '#E0F2FE',

    // Tab bar
    tabActive: '#2563EB',
    tabInactive: '#94A3B8',        // slate-400
    tabBackground: '#FFFFFF',

    // Específicos app
    reservaActiva: '#2563EB',
    conductorDisponible: '#16A34A',
    suscripcionVigente: '#16A34A',
    suscripcionPorVencer: '#D97706',
    suscripcionSuspendida: '#DC2626',
  },
  dark: {
    // Primarios
    primary: '#3B82F6',
    primaryLight: '#1E3A5F',       // el azul oscuro del infoIcon del diseño
    primaryDark: '#60A5FA',

    // Fondos — extraídos exactamente del diseño que te gustó
    background: '#0A0F1E',         // el fondo más oscuro del diseño
    backgroundSecondary: '#111827', // slate-900, para cards secundarias
    backgroundCard: '#111827',     // el fondo de los inputs y cards
    backgroundCardButton: '#3B82F6',

    // Textos — la jerarquía azul-grisácea del diseño
    textPrimary: '#F8FAFC',        // slate-50, casi blanco puro
    textSecondary: '#94A3B8',      // slate-400, los subtítulos del diseño
    textMuted: '#475569',          // slate-600, hints y placeholders
    textInverse: '#0A0F1E',

    // Bordes
    border: '#1E293B',             // slate-800, el borde sutil del diseño
    borderFocus: '#3B82F6',

    // Estados — mantenemos los mismos, funcionan bien en dark
    success: '#22C55E',
    successLight: '#14532D',
    warning: '#F59E0B',
    warningLight: '#78350F',
    error: '#EF4444',
    errorLight: '#7F1D1D',
    info: '#38BDF8',
    infoLight: '#0C4A6E',

    // Tab bar
    tabActive: '#3B82F6',
    tabInactive: '#475569',        // slate-600
    tabBackground: '#0A0F1E',

    // Específicos app
    reservaActiva: '#3B82F6',
    conductorDisponible: '#22C55E',
    suscripcionVigente: '#22C55E',
    suscripcionPorVencer: '#F59E0B',
    suscripcionSuspendida: '#EF4444',
  }
}

export type ColorScheme = typeof colors.light


// GAMA DE COLORES INDRIVE - Basada en Tailwind CSS pero adaptada a la identidad de marca de InDrive,
// con un acento verde característico. Incluye colores para estados, textos, fondos y bordes, tanto para modo claro como oscuro.


// export const colors = {
//   light: {
//     // Primarios
//     primary: '#1A1A1A',
//     primaryLight: '#E8FAC8',
//     primaryDark: '#0A0A0A',

//     // Fondos
//     background: '#F5F5F5',
//     backgroundSecondary: '#EBEBEB',
//     backgroundCard: '#FFFFFF',
//     backgroundCardButton: '#1A1A1A',

//     // Textos
//     textPrimary: '#0A0A0A',
//     textSecondary: '#555555',
//     textMuted: '#999999',
//     textInverse: '#FFFFFF',

//     // Bordes
//     border: '#DCDCDC',
//     borderFocus: '#1A1A1A',

//     // Estados
//     success: '#4CAF50',
//     successLight: '#E8F5E9',
//     warning: '#F59E0B',
//     warningLight: '#FFF8E1',
//     error: '#EF4444',
//     errorLight: '#FEECEC',
//     info: '#3B82F6',
//     infoLight: '#EFF6FF',

//     // Tab bar
//     tabActive: '#0A0A0A',
//     tabInactive: '#AAAAAA',
//     tabBackground: '#FFFFFF',

//     // Específicos app
//     reservaActiva: '#1A1A1A',
//     conductorDisponible: '#4CAF50',
//     suscripcionVigente: '#4CAF50',
//     suscripcionPorVencer: '#F59E0B',
//     suscripcionSuspendida: '#EF4444',

//     // Acento InDrive
//     accent: '#C8FA64',
//     accentDark: '#A8D84A',
//   },

//   dark: {
//     // Primarios
//     primary: '#C8FA64',
//     primaryLight: '#1E2A0F',
//     primaryDark: '#A8D84A',

//     // Fondos
//     background: '#0A0A0A',
//     backgroundSecondary: '#141414',
//     backgroundCard: '#1E1E1E',
//     backgroundCardButton: '#C8FA64',

//     // Textos
//     textPrimary: '#F5F5F5',
//     textSecondary: '#AAAAAA',
//     textMuted: '#666666',
//     textInverse: '#0A0A0A',

//     // Bordes
//     border: '#2A2A2A',
//     borderFocus: '#C8FA64',

//     // Estados
//     success: '#C8FA64',
//     successLight: '#1A2A0A',
//     warning: '#F59E0B',
//     warningLight: '#2A1A00',
//     error: '#EF4444',
//     errorLight: '#2A0A0A',
//     info: '#60A5FA',
//     infoLight: '#0A1A2A',

//     // Tab bar
//     tabActive: '#C8FA64',
//     tabInactive: '#555555',
//     tabBackground: '#0A0A0A',

//     // Específicos app
//     reservaActiva: '#C8FA64',
//     conductorDisponible: '#C8FA64',
//     suscripcionVigente: '#C8FA64',
//     suscripcionPorVencer: '#F59E0B',
//     suscripcionSuspendida: '#EF4444',

//     // Acento InDrive
//     accent: '#C8FA64',
//     accentDark: '#A8D84A',
//   },
// }

// export type ColorScheme = typeof colors.light


// GAMA DE COLORES TIPO UBER - Inspirada en la paleta de colores de Uber,
//  con un enfoque en tonos oscuros y acentos vibrantes para resaltar acciones clave.
// Incluye colores para estados, textos, fondos y bordes, tanto para modo claro como oscuro.

// export const colors = {
//   light: {
//     // Primarios — negro Uber sobre blanco
//     primary: '#000000',
//     primaryLight: '#E5E5E5',
//     primaryDark: '#000000',

//     // Fondos
//     background: '#FFFFFF',
//     backgroundSecondary: '#F6F6F6',
//     backgroundCard: '#EEEEEE',
//     backgroundCardButton: '#000000',

//     // Textos
//     textPrimary: '#000000',
//     textSecondary: '#545454',
//     textMuted: '#8C8C8C',
//     textInverse: '#FFFFFF',

//     // Bordes
//     border: '#E2E2E2',
//     borderFocus: '#000000',

//     // Estados
//     success: '#00A550',
//     successLight: '#E6F7EE',
//     warning: '#FF6B00',
//     warningLight: '#FFF0E6',
//     error: '#E74C3C',
//     errorLight: '#FDEDEC',
//     info: '#276EF1',
//     infoLight: '#EBF2FE',

//     // Tab bar
//     tabActive: '#000000',
//     tabInactive: '#8C8C8C',
//     tabBackground: '#FFFFFF',

//     // Específicos app
//     reservaActiva: '#000000',
//     conductorDisponible: '#00A550',
//     suscripcionVigente: '#00A550',
//     suscripcionPorVencer: '#FF6B00',
//     suscripcionSuspendida: '#E74C3C',
//   },

//   dark: {
//     // Primarios — blanco sobre negro
//     primary: '#FFFFFF',
//     primaryLight: '#1A1A1A',
//     primaryDark: '#F0F0F0',

//     // Fondos
//     background: '#000000',
//     backgroundSecondary: '#111111',
//     backgroundCard: '#1C1C1C',
//     backgroundCardButton: '#FFFFFF',

//     // Textos
//     textPrimary: '#FFFFFF',
//     textSecondary: '#ABABAB',
//     textMuted: '#545454',
//     textInverse: '#000000',

//     // Bordes
//     border: '#2C2C2C',
//     borderFocus: '#FFFFFF',

//     // Estados
//     success: '#00A550',
//     successLight: '#001A0D',
//     warning: '#FF6B00',
//     warningLight: '#1A0D00',
//     error: '#E74C3C',
//     errorLight: '#1A0000',
//     info: '#276EF1',
//     infoLight: '#00081A',

//     // Tab bar
//     tabActive: '#FFFFFF',
//     tabInactive: '#545454',
//     tabBackground: '#000000',

//     // Específicos app
//     reservaActiva: '#FFFFFF',
//     conductorDisponible: '#00A550',
//     suscripcionVigente: '#00A550',
//     suscripcionPorVencer: '#FF6B00',
//     suscripcionSuspendida: '#E74C3C',
//   },
// }

// export type ColorScheme = typeof colors.light


// GAMA DE COLORES TIPO BOOKING - Inspirada en la paleta de colores de Booking.com,
// con un enfoque en tonos azules y verdes para transmitir confianza y accesibilidad.
// Incluye colores para estados, textos, fondos y bordes, tanto para modo claro como oscuro.

// export const colors = {
//   light: {
//     // Primarios — azul marino Booking
//     primary: '#003580',
//     primaryLight: '#D6E4FF',
//     primaryDark: '#00224F',

//     // Fondos
//     background: '#FFFFFF',
//     backgroundSecondary: '#F2F5F8',
//     backgroundCard: '#FFFFFF',
//     backgroundCardButton: '#003580',

//     // Textos
//     textPrimary: '#1A1A2E',
//     textSecondary: '#595959',
//     textMuted: '#9A9A9A',
//     textInverse: '#FFFFFF',

//     // Bordes
//     border: '#D9E1EC',
//     borderFocus: '#003580',

//     // Estados
//     success: '#008009',
//     successLight: '#E6F4E6',
//     warning: '#E28A00',
//     warningLight: '#FDF5E6',
//     error: '#CC0000',
//     errorLight: '#FAEAEA',
//     info: '#006CE4',
//     infoLight: '#E5F0FF',

//     // Tab bar
//     tabActive: '#003580',
//     tabInactive: '#9A9A9A',
//     tabBackground: '#FFFFFF',

//     // Específicos app
//     reservaActiva: '#003580',
//     conductorDisponible: '#008009',
//     suscripcionVigente: '#008009',
//     suscripcionPorVencer: '#E28A00',
//     suscripcionSuspendida: '#CC0000',
//   },

//   dark: {
//     // Primarios — azul Booking aclarado para dark
//     primary: '#4A90D9',
//     primaryLight: '#0A1A33',
//     primaryDark: '#006CE4',

//     // Fondos
//     background: '#0D1B2A',
//     backgroundSecondary: '#152232',
//     backgroundCard: '#1E2E40',
//     backgroundCardButton: '#4A90D9',

//     // Textos
//     textPrimary: '#F0F4F8',
//     textSecondary: '#A8B8CC',
//     textMuted: '#5A7A99',
//     textInverse: '#0D1B2A',

//     // Bordes
//     border: '#243447',
//     borderFocus: '#4A90D9',

//     // Estados
//     success: '#33B536',
//     successLight: '#071A07',
//     warning: '#F0A500',
//     warningLight: '#1A1200',
//     error: '#F05050',
//     errorLight: '#1A0000',
//     info: '#4A90D9',
//     infoLight: '#071226',

//     // Tab bar
//     tabActive: '#4A90D9',
//     tabInactive: '#5A7A99',
//     tabBackground: '#0D1B2A',

//     // Específicos app
//     reservaActiva: '#4A90D9',
//     conductorDisponible: '#33B536',
//     suscripcionVigente: '#33B536',
//     suscripcionPorVencer: '#F0A500',
//     suscripcionSuspendida: '#F05050',
//   },
// }

// export type ColorScheme = typeof colors.light