import { Stack } from 'expo-router'
import { useTheme } from '../../src/theme/useTheme'


export default function AuthLayout() {
  const { theme } = useTheme()

  return (
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: theme.background }
    }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="login" />
      <Stack.Screen name="verificacion" />
      <Stack.Screen name="suspendido" />
    </Stack>
  )
}