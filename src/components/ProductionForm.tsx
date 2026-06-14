import { motion, useReducedMotion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { todayISO } from '../utils/dates'
import { validateDay } from '../utils/production'
import type { DayInput } from '../types/production'

type ProductionFormProps = {
  onSubmit: (input: DayInput) => void
}

export function ProductionForm({ onSubmit }: ProductionFormProps) {
  const reducedMotion = useReducedMotion()
  const [date, setDate] = useState(todayISO())
  const [production, setProduction] = useState('')
  const [rebus, setRebus] = useState('0')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const input = {
      date,
      production: Number(production),
      rebus: Number(rebus),
    }
    const validationError = validateDay(input)
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    onSubmit(input)
    setProduction('')
    setRebus('0')
    setDate(todayISO())
  }

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl"
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
    >
      <div className="grid gap-3">
        <label className="grid gap-2 text-sm font-semibold text-white">
          Date
          <input
            className="field"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-2 text-sm font-semibold text-white">
            Production
            <input
              className="field"
              inputMode="numeric"
              min="1"
              type="number"
              value={production}
              onChange={(event) => setProduction(event.target.value)}
              placeholder="0"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-white">
            Rebus
            <input
              className="field"
              inputMode="numeric"
              min="0"
              type="number"
              value={rebus}
              onChange={(event) => setRebus(event.target.value)}
            />
          </label>
        </div>
      </div>

      {error && <p className="mt-3 text-sm font-semibold text-red-300">{error}</p>}

      <motion.button
        whileHover={reducedMotion ? undefined : { y: -1 }}
        whileTap={{ scale: 0.97 }}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-300 px-4 py-3 font-black text-ink shadow-glow"
        type="submit"
      >
        <Plus size={18} />
        Ajouter journée
      </motion.button>
    </motion.form>
  )
}
