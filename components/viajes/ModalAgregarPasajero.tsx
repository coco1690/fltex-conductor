import { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/theme/useTheme'

interface Props {
  visible: boolean
  cargando: boolean
  onAgregar: (nombre: string, telefono?: string) => void
  onCerrar: () => void
}

export function ModalAgregarPasajero({ visible, cargando, onAgregar, onCerrar }: Props) {
  const { theme } = useTheme()
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const telefonoRef = useRef<TextInput>(null)

  const handleAgregar = () => {
    if (!nombre.trim()) return
    onAgregar(nombre.trim(), telefono.trim() || undefined)
    setNombre('')
    setTelefono('')
  }

  const handleCerrar = () => {
    Keyboard.dismiss()
    setNombre('')
    setTelefono('')
    onCerrar()
  }

  const valido = nombre.trim().length >= 2

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCerrar}
    >
      <TouchableWithoutFeedback onPress={handleCerrar}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={[styles.container, { backgroundColor: theme.backgroundCard }]}>

          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: theme.border }]} />

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.titulo, { color: theme.textPrimary }]}>
                Agregar pasajero
              </Text>
              <Text style={[styles.subtitulo, { color: theme.textSecondary }]}>
                Pasajero sin reserva previa
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.botonCerrar, { backgroundColor: theme.background }]}
              onPress={handleCerrar}
            >
              <Ionicons name="close" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Campo nombre */}
            <View style={styles.campo}>
              <Text style={[styles.campoLabel, { color: theme.textSecondary }]}>
                Nombre completo <Text style={{ color: theme.error }}>*</Text>
              </Text>
              <View style={[
                styles.inputContainer,
                {
                  backgroundColor: theme.background,
                  borderColor: nombre.trim().length > 0 ? theme.primary : theme.border,
                }
              ]}>
                <Ionicons name="person-outline" size={18} color={theme.textMuted} />
                <TextInput
                  style={[styles.input, { color: theme.textPrimary }]}
                  placeholder="Ej: Juan Pérez"
                  placeholderTextColor={theme.textMuted}
                  value={nombre}
                  onChangeText={setNombre}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => telefonoRef.current?.focus()}
                  autoFocus
                />
                {nombre.trim().length > 0 && (
                  <TouchableOpacity onPress={() => setNombre('')}>
                    <Ionicons name="close-circle" size={18} color={theme.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Campo teléfono */}
            <View style={styles.campo}>
              <Text style={[styles.campoLabel, { color: theme.textSecondary }]}>
                Teléfono <Text style={[styles.opcional, { color: theme.textMuted }]}>(opcional)</Text>
              </Text>
              <View style={[
                styles.inputContainer,
                {
                  backgroundColor: theme.background,
                  borderColor: telefono.trim().length > 0 ? theme.primary : theme.border,
                }
              ]}>
                <Ionicons name="call-outline" size={18} color={theme.textMuted} />
                <TextInput
                  ref={telefonoRef}
                  style={[styles.input, { color: theme.textPrimary }]}
                  placeholder="Ej: 3001234567"
                  placeholderTextColor={theme.textMuted}
                  value={telefono}
                  onChangeText={setTelefono}
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  onSubmitEditing={valido ? handleAgregar : undefined}
                />
                {telefono.trim().length > 0 && (
                  <TouchableOpacity onPress={() => setTelefono('')}>
                    <Ionicons name="close-circle" size={18} color={theme.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Botones */}
          <View style={styles.botones}>
            <TouchableOpacity
              style={[styles.botonVolver, { borderColor: theme.border }]}
              onPress={handleCerrar}
            >
              <Text style={[styles.botonVolverTexto, { color: theme.textSecondary }]}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.botonAgregar,
                { backgroundColor: valido ? theme.success : theme.border }
              ]}
              onPress={handleAgregar}
              disabled={!valido || cargando}
            >
              {cargando ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="person-add-outline" size={18} color={valido ? '#FFFFFF' : theme.textMuted} />
                  <Text style={[
                    styles.botonAgregarTexto,
                    { color: valido ? '#FFFFFF' : theme.textMuted }
                  ]}>
                    Agregar
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  keyboardView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 12,
    gap: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitulo: {
    fontSize: 13,
    marginTop: 2,
  },
  botonCerrar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    gap: 16,
  },
  campo: {
    gap: 8,
  },
  campoLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  opcional: {
    fontSize: 12,
    fontWeight: '400',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  botones: {
    flexDirection: 'row',
    gap: 12,
  },
  botonVolver: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonVolverTexto: {
    fontSize: 15,
    fontWeight: '600',
  },
  botonAgregar: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  botonAgregarTexto: {
    fontSize: 15,
    fontWeight: '700',
  },
})