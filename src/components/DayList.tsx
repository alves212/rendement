import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Edit3, Trash2 } from 'lucide-react'
import type { ProductionDay } from '../types/production'
import { formatDay } from '../utils/dates'

type DayListProps = {
  days: ProductionDay[]
  onEdit: (day: ProductionDay) => void
  onDelete: (id: string) => void
}

export function DayList({ days, onEdit, onDelete }: DayListProps) {
  const reducedMotion = useReducedMotion()

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black text-white">Historique</h2>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
          {days.length} journée{days.length > 1 ? 's' : ''}
        </span>
      </div>

      {days.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-sm text-muted">
          Aucune journée pour ce mois.
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {days.map((day) => (
              <motion.article
                layout
                key={day.id}
                initial={reducedMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0, x: -20, scale: 0.96 }}
                className="rounded-2xl border border-white/10 bg-ink/45 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-white">{formatDay(day.date)}</p>
                    <p className="mt-1 text-sm text-muted">
                      {day.production} produits · {day.rebus} rebus ·{' '}
                      {day.production - day.rebus} conformes
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      aria-label="Modifier la journée"
                      className="icon-button"
                      type="button"
                      onClick={() => onEdit(day)}
                    >
                      <Edit3 size={17} />
                    </button>
                    <button
                      aria-label="Supprimer la journée"
                      className="icon-button text-red-200"
                      type="button"
                      onClick={() => onDelete(day.id)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}
