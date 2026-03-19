import { create } from 'zustand'
import type { Tables } from '../supabase/types'

// Tipos directamente de Supabase
type ReservaPasajero = Tables<'reserva_pasajeros'>

// Solo los campos que necesitamos en el formulario
export interface PasajeroForm {
  orden: number
  nombres: string
  telefono: string
}

const pasajeroVacio = (orden: number, telefono = ''): PasajeroForm => ({
  orden,
  nombres: '',
  telefono,
})

interface ReservaFormState {
  cupos: number
  pasajeros: PasajeroForm[]

  iniciarConTitular: (nombre: string, telefono: string) => void
  setCupos: (n: number) => void
  updatePasajero: (orden: number, data: Partial<PasajeroForm>) => void
  reset: () => void
}

export const useReservaFormStore = create<ReservaFormState>((set, get) => ({
  cupos: 1,
  pasajeros: [pasajeroVacio(1)],

  // Llamas esto cuando el usuario abre el flujo de reserva
  // Se autocompleta con los datos del perfil
  iniciarConTitular: (nombre, telefono) => {
    set({
      cupos: 1,
      pasajeros: [{ orden: 1, nombres: nombre, telefono }],
    })
  },

  // Ajusta el array de pasajeros según los cupos seleccionados
  // Los nuevos acompañantes heredan el teléfono del titular
  setCupos: (n) => {
    const { pasajeros } = get()
    const telefonoTitular = pasajeros[0]?.telefono ?? ''
    let nuevos = [...pasajeros]

    if (n > nuevos.length) {
      for (let i = nuevos.length + 1; i <= n; i++) {
        nuevos.push(pasajeroVacio(i, telefonoTitular))
      }
    } else {
      nuevos = nuevos.slice(0, Math.max(1, n))
    }

    set({ cupos: n, pasajeros: nuevos })
  },

  updatePasajero: (orden, data) =>
    set((s) => ({
      pasajeros: s.pasajeros.map((p) =>
        p.orden === orden ? { ...p, ...data } : p
      ),
    })),

  reset: () => set({ cupos: 1, pasajeros: [pasajeroVacio(1)] }),
}))