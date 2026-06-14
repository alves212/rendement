import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatMonth } from '../utils/dates'

type MonthSwitcherProps = {
  month: string
  onMove: (offset: number) => void
}

export function MonthSwitcher({ month, onMove }: MonthSwitcherProps) {
  const reducedMotion = useReducedMotion()

  return (
    <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.055] p-2 backdrop-blur-xl">
      <button className="icon-button" type="button" onClick={() => onMove(-1)} aria-label="Mois précédent">
        <ChevronLeft size={20} />
      </button>
      <AnimatePresence mode="wait">
        <motion.p
          key={month}
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
          className="text-center text-sm font-black uppercase tracking-[0.22em] text-white"
        >
          {formatMonth(month)}
        </motion.p>
      </AnimatePresence>
      <button className="icon-button" type="button" onClick={() => onMove(1)} aria-label="Mois suivant">
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
