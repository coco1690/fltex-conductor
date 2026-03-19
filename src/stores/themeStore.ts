import { create } from 'zustand'

export type ThemeMode = 'system' | 'light' | 'dark'

type ThemeState = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggle: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'system',
  setMode: (mode) => set({ mode }),
  toggle: () => {
    const { mode } = get()
    if (mode === 'dark') set({ mode: 'light' })
    else set({ mode: 'dark' })
  }
}))