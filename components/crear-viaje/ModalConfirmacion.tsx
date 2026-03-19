import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/theme/useTheme'

interface DatosViaje {
  rutaNombre: string
  puntoNombre: string
  fecha: string
  hora: string
  precio: number
  aceptaEncomiendas: boolean
}

interface Props {
  visible: boolean
  datos: DatosViaje
  cargando: boolean
  onConfirmar: () => void
  onCerrar: () => void
}

export function ModalConfirmacion({ visible, datos, cargando, onConfirmar, onCerrar }: Props) {
  const { theme } = useTheme()

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCerrar}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.backgroundCard }]}>

          <View style={styles.header}>
            <Text style={[styles.titulo, { color: theme.textPrimary }]}>
              Confirmar viaje
            </Text>
            <TouchableOpacity onPress={onCerrar}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.separador, { backgroundColor: theme.border }]} />

          <View style={styles.resumen}>
            <FilaResumen icono="navigate-outline" label="Ruta" valor={datos.rutaNombre} />
            <FilaResumen icono="location-outline" label="Punto de abordaje" valor={datos.puntoNombre} />
            <FilaResumen icono="calendar-outline" label="Fecha" valor={datos.fecha} />
            <FilaResumen icono="time-outline" label="Hora de salida" valor={datos.hora} />
            <FilaResumen icono="cash-outline" label="Precio por pasajero" valor={`$${datos.precio.toLocaleString('es-CO')}`} />
            <FilaResumen icono="cube-outline" label="Encomiendas" valor={datos.aceptaEncomiendas ? 'Acepta' : 'No acepta'} />
          </View>

          <View style={[styles.separador, { backgroundColor: theme.border }]} />

          <View style={styles.botones}>
            <TouchableOpacity
              style={[styles.botonVolver, { borderColor: theme.border }]}
              onPress={onCerrar}
            >
              <Text style={[styles.botonVolverTexto, { color: theme.textSecondary }]}>
                Corregir
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botonConfirmar, { backgroundColor: theme.primary }]}
              onPress={onConfirmar}
              disabled={cargando}
            >
              {cargando ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.botonConfirmarTexto}>Confirmar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  )
}

function FilaResumen({ icono, label, valor }: { icono: any, label: string, valor: string }) {
  const { theme } = useTheme()
  return (
    <View style={styles.fila}>
      <Ionicons name={icono} size={16} color={theme.textSecondary} />
      <Text style={[styles.filaLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.filaValor, { color: theme.textPrimary }]}>{valor}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { fontSize: 20, fontWeight: 'bold' },
  separador: { height: 1 },
  resumen: { gap: 14 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  filaLabel: { fontSize: 13, width: 130 },
  filaValor: { fontSize: 14, fontWeight: '600', flex: 1 },
  botones: { flexDirection: 'row', gap: 12, marginTop: 4 },
  botonVolver: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  botonVolverTexto: { fontSize: 15, fontWeight: '600' },
  botonConfirmar: { flex: 2, paddingVertical: 14, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  botonConfirmarTexto: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
})