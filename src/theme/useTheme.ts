import { useColorScheme } from 'react-native'
import { colors } from './colors'
import { useThemeStore } from '../stores/themeStore'

export function useTheme() {
  const systemScheme = useColorScheme()
  const mode = useThemeStore(s => s.mode)

  const effectiveScheme =
    mode === 'system' ? systemScheme : mode

  const isDark = effectiveScheme === 'dark'
  const theme = isDark ? colors.dark : colors.light

  return { theme, isDark, mode }
}