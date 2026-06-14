import { rendementBands } from '../constants/rendement'
import type { DayInput, MonthlyTotals, ProductionDay } from '../types/production'

export function createDay(input: DayInput): ProductionDay {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    date: input.date,
    production: input.production,
    rebus: input.rebus,
    createdAt: now,
    updatedAt: now,
  }
}

export function validateDay(input: DayInput) {
  if (!input.date) return 'Choisissez une date.'
  if (!Number.isFinite(input.production) || input.production <= 0) {
    return 'La production doit être supérieure à zéro.'
  }
  if (!Number.isFinite(input.rebus) || input.rebus < 0) {
    return 'Le rebus ne peut pas être négatif.'
  }
  if (input.rebus > input.production) {
    return 'Le rebus ne peut pas dépasser la production.'
  }
  return null
}

export function getTotals(days: ProductionDay[]): MonthlyTotals {
  const production = days.reduce((sum, day) => sum + day.production, 0)
  const rebus = days.reduce((sum, day) => sum + day.rebus, 0)
  const conformes = production - rebus
  const rendement = production > 0 ? (conformes / production) * 100 : 0

  return { production, rebus, conformes, rendement }
}

export function getRendementBand(rendement: number) {
  return [...rendementBands].reverse().find((band) => rendement >= band.min) ?? rendementBands[0]
}

export function sortDays(days: ProductionDay[]) {
  return [...days].sort((a, b) => b.date.localeCompare(a.date))
}

export function daysForMonth(days: ProductionDay[], month: string) {
  return sortDays(days.filter((day) => day.date.startsWith(month)))
}

export function chartRows(days: ProductionDay[]) {
  return [...days]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((day) => {
      const conformes = day.production - day.rebus
      const rendement = day.production > 0 ? Number(((conformes / day.production) * 100).toFixed(1)) : 0
      return {
        date: day.date.slice(5),
        production: day.production,
        rebus: day.rebus,
        rendement,
      }
    })
}
