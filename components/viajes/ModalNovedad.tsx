import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/theme/useTheme'

interface Props {
  visible: boolean
  onConfirmar: (novedad?: string) => void
  onCerrar: () => void
}

export function ModalNovedad({ visible, onConfirmar, onCerrar }: Props) {
  const { theme } = useTheme()
  const [novedad, setNovedad] = useState('')
  const [conNovedad, setConNovedad] = useState(false)

  const handleConfirmar = () => {
    onConfirmar(conNovedad && novedad.trim() ? novedad.trim() : undefined)
    setNovedad('')
    setConNovedad(false)
  }

  const handleCerrar = () => {
    setNovedad('')
    setConNovedad(false)
    onCerrar()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCerrar}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.backgroundCard }]}>

          <View style={styles.header}>
            <Text style={[styles.titulo, { color: theme.textPrimary }]}>
              Finalizar viaje
            </Text>
            <TouchableOpacity onPress={handleCerrar}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitulo, { color: theme.textSecondary }]}>
            ¿El viaje llegó sin novedades?
          </Text>

          {/* Opciones */}
          <View style={styles.opciones}>
            <TouchableOpacity
              style={[
                styles.opcion,
                {
                  backgroundColor: !conNovedad ? theme.primary : theme.backgroundCard,
                  borderColor: !conNovedad ? theme.primary : theme.border,
                }
              ]}
              onPress={() => setConNovedad(false)}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={!conNovedad ? '#FFFFFF' : theme.textSecondary}
              />
              <Text style={[styles.opcionTexto, { color: !conNovedad ? '#FFFFFF' : theme.textPrimary }]}>
                Sin novedad
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.opcion,
                {
                  backgroundColor: conNovedad ? theme.warning : theme.backgroundCard,
                  borderColor: conNovedad ? theme.warning : theme.border,
                }
              ]}
              onPress={() => setConNovedad(true)}
            >
              <Ionicons
                name="warning-outline"
                size={20}
                color={conNovedad ? '#FFFFFF' : theme.textSecondary}
              />
              <Text style={[styles.opcionTexto, { color: conNovedad ? '#FFFFFF' : theme.textPrimary }]}>
                Con novedad
              </Text>
            </TouchableOpacity>
          </View>

          {/* Campo de novedad */}
          {conNovedad && (
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                }
              ]}
              placeholder="Describe la novedad ocurrida..."
              placeholderTextColor={theme.textMuted}
              value={novedad}
              onChangeText={setNovedad}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          )}

          {/* Botones */}
          <View style={styles.botones}>
            <TouchableOpacity
              style={[styles.botonCancelar, { borderColor: theme.border }]}
              onPress={handleCerrar}
            >
              <Text style={[styles.botonCancelarTexto, { color: theme.textSecondary }]}>
                Volver
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.botonConfirmar,
                { backgroundColor: conNovedad ? theme.warning : theme.primary }
              ]}
              onPress={handleConfirmar}
              disabled={conNovedad && !novedad.trim()}
            >
              <Ionicons name="flag-outline" size={18} color="#FFFFFF" />
              <Text style={styles.botonConfirmarTexto}>Finalizar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { fontSize: 20, fontWeight: 'bold' },
  subtitulo: { fontSize: 14 },
  opciones: { flexDirection: 'row', gap: 10 },
  opcion: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  opcionTexto: { fontSize: 14, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14, minHeight: 80 },
  botones: { flexDirection: 'row', gap: 12 },
  botonCancelar: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  botonCancelarTexto: { fontSize: 15, fontWeight: '600' },
  botonConfirmar: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12 },
  botonConfirmarTexto: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
})