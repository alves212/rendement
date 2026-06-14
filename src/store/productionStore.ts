import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { monthKey, shiftMonth } from '../utils/dates'
import { createDay } from '../utils/production'
import type { DayInput, ProductionDay } from '../types/production'

type ProductionStore = {
  days: ProductionDay[]
  currentMonth: string
  historyOpen: boolean
  addDay: (input: DayInput) => void
  updateDay: (id: string, input: DayInput) => void
  deleteDay: (id: string) => void
  resetAll: () => void
  toggleHistory: () => void
  setCurrentMonth: (month: string) => void
  moveMonth: (offset: number) => void
}

export const useProductionStore = create<ProductionStore>()(
  persist(
    (set, get) => ({
      days: [],
      currentMonth: monthKey(new Date()),
      historyOpen: false,
      addDay: (input) => set((state) => ({ days: [createDay(input), ...state.days] })),
      updateDay: (id, input) =>
        set((state) => ({
          days: state.days.map((day) =>
            day.id === id
              ? { ...day, ...input, updatedAt: new Date().toISOString() }
              : day,
          ),
        })),
      deleteDay: (id) => set((state) => ({ days: state.days.filter((day) => day.id !== id) })),
      resetAll: () => set({ days: [], historyOpen: false, currentMonth: monthKey(new Date()) }),
      toggleHistory: () => set((state) => ({ historyOpen: !state.historyOpen })),
      setCurrentMonth: (currentMonth) => set({ currentMonth }),
      moveMonth: (offset) => {
        const nextMonth = shiftMonth(get().currentMonth, offset)
        set({ currentMonth: nextMonth })
      },
    }),
    {
      name: 'rendement-production-v1',
      version: 1,
      partialize: (state) => ({
        days: state.days,
        currentMonth: state.currentMonth,
        historyOpen: state.historyOpen,
      }),
    },
  ),
)
