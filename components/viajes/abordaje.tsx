import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../src/theme/useTheme'



export default function Abordaje() {
  const { theme } = useTheme()
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.titulo, { color: theme.textPrimary }]}>Abordaje</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold' }
})