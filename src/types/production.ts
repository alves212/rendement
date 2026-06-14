export type ProductionDay = {
  id: string
  date: string
  production: number
  rebus: number
  createdAt: string
  updatedAt: string
}

export type DayInput = {
  date: string
  production: number
  rebus: number
}

export type MonthlyTotals = {
  production: number
  rebus: number
  conformes: number
  rendement: number
}

export type RendementBand = {
  label: string
  min: number
  color: string
  accent: string
}
