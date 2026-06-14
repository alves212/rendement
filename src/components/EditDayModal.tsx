import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FormEvent, useEffect, useState } from 'react'
import type { DayInput, ProductionDay } from '../types/production'
import { validateDay } from '../utils/production'

type EditDayModalProps = {
  day: ProductionDay | null
  onClose: () => void
  onSave: (id: string, input: DayInput) => void
}

export function EditDayModal({ day, onClose, onSave }: EditDayModalProps) {
  const reducedMotion = useReducedMotion()
  const [date, setDate] = useState('')
  const [production, setProduction] = useState('')
  const [rebus, setRebus] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!day) return
    setDate(day.date)
    setProduction(String(day.production))
    setRebus(String(day.rebus))
    setError(null)
  }, [day])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!day) return
    const input = { date, production: Number(production), rebus: Number(rebus) }
    const validationError = validateDay(input)
    if (validationError) {
      setError(validationError)
      return
    }
    onSave(day.id, input)
    onClose()
  }

  return (
    <AnimatePresence>
      {day && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-md"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={reducedMotion ? undefined : { opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-title"
        >
          <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-sm rounded-3xl border border-white/10 bg-surface p-5 shadow-premium"
            initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: 20, scale: 0.96 }}
          >
            <h2 id="edit-title" className="text-xl font-black text-white">
              Modifier journée
            </h2>
            <div className="mt-5 grid gap-3">
              <label className="grid gap-2 text-sm font-semibold text-white">
                Date
                <input className="field" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-white">
                Production
                <input className="field" type="number" value={production} onChange={(e) => setProduction(e.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-white">
                Rebus
                <input className="field" type="number" value={rebus} onChange={(e) => setRebus(e.target.value)} />
              </label>
            </div>
            {error && <p className="mt-3 text-sm font-semibold text-red-300">{error}</p>}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button className="rounded-2xl bg-white/10 px-4 py-3 font-bold text-white" type="button" onClick={onClose}>
                Annuler
              </button>
              <button className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-300 px-4 py-3 font-black text-ink" type="submit">
                Enregistrer
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
