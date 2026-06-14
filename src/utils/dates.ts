import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export function monthKey(date: Date) {
  return format(date, 'yyyy-MM')
}

export function todayISO() {
  return format(new Date(), 'yyyy-MM-dd')
}

export function formatMonth(key: string) {
  return format(parseISO(`${key}-01`), 'MMMM yyyy', { locale: fr })
}

export function formatDay(date: string) {
  return format(parseISO(date), 'dd MMM yyyy', { locale: fr })
}

export function shiftMonth(key: string, offset: number) {
  const [year, month] = key.split('-').map(Number)
  return monthKey(new Date(year, month - 1 + offset, 1))
}
