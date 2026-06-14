import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BarChart3, CheckCircle2, RotateCcw, Settings2, ShieldCheck, Trash2 } from 'lucide-react'
import { lazy, Suspense, useMemo, useState } from 'react'
import { DayList } from './components/DayList'
import { EditDayModal } from './components/EditDayModal'
import { KpiCard } from './components/KpiCard'
import { MonthSwitcher } from './components/MonthSwitcher'
import { PaymentGrid } from './components/PaymentGrid'
import { ProductionForm } from './components/ProductionForm'
import { RendementMeter } from './components/RendementMeter'
import { ResetModal } from './components/ResetModal'
import { useProductionStore } from './store/productionStore'
import type { ProductionDay } from './types/production'
import { daysForMonth, getRendementBand, getTotals } from './utils/production'

const ChartsPanel = lazy(() =>
  import('./components/ChartsPanel').then((module) => ({ default: module.ChartsPanel })),
)

export default function App() {
  const reducedMotion = useReducedMotion()
  const [editingDay, setEditingDay] = useState<ProductionDay | null>(null)
  const [resetOpen, setResetOpen] = useState(false)

  const {
    addDay,
    currentMonth,
    days,
    deleteDay,
    historyOpen,
    moveMonth,
    resetAll,
    toggleHistory,
    updateDay,
  } = useProductionStore()

  const monthDays = useMemo(() => daysForMonth(days, currentMonth), [currentMonth, days])
  const visibleDays = historyOpen ? monthDays : monthDays.slice(0, 3)
  const totals = useMemo(() => getTotals(monthDays), [monthDays])
  const band = getRendementBand(totals.rendement)

  return (
    <main className="min-h-screen overflow-x-hidden bg-ink text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-12rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-[-9rem] h-[26rem] w-[26rem] rounded-full bg-violet-500/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
      </div>

      <motion.div
        className="mx-auto flex w-full max-w-xl flex-col gap-5 px-4 pb-10 pt-[max(1rem,env(safe-area-inset-top))]"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={reducedMotion ? undefined : { opacity: 1 }}
      >
        <header className="pt-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 to-cyan-300 text-ink shadow-glow">
                <ShieldCheck size={25} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted">
                  Production
                </p>
                <h1 className="text-3xl font-black tracking-tight">Rendement</h1>
              </div>
            </div>
            <button
              className="icon-button text-red-200"
              type="button"
              aria-label="Réinitialiser les données"
              onClick={() => setResetOpen(true)}
            >
              <RotateCcw size={19} />
            </button>
          </div>

          <MonthSwitcher month={currentMonth} onMove={moveMonth} />
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentMonth}
            className="grid gap-5"
            initial={reducedMotion ? false : { opacity: 0, x: 18 }}
            animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, x: -18 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <RendementMeter rendement={totals.rendement} />

            <section className="grid grid-cols-2 gap-3">
              <KpiCard label="Produit" value={totals.production} icon={<BarChart3 size={18} />} tone="success" />
              <KpiCard label="Rebus" value={totals.rebus} icon={<Trash2 size={18} />} tone="danger" />
              <KpiCard label="Conformes" value={totals.conformes} icon={<CheckCircle2 size={18} />} />
              <KpiCard
                label="Score"
                value={totals.rendement}
                suffix="%"
                decimals={1}
                icon={<Settings2 size={18} />}
                tone="premium"
              />
            </section>

            <ProductionForm onSubmit={addDay} />

            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-muted">
                Couleur active: <span style={{ color: band.color }}>{band.label}</span>
              </p>
              <motion.button
                whileTap={{ scale: 0.96 }}
                className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-white"
                type="button"
                onClick={toggleHistory}
              >
                {historyOpen ? 'Réduire' : 'Tout afficher'}
              </motion.button>
            </div>

            <DayList days={visibleDays} onEdit={setEditingDay} onDelete={deleteDay} />
            <Suspense
              fallback={
                <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-6 text-sm font-semibold text-muted">
                  Chargement des graphiques...
                </div>
              }
            >
              <ChartsPanel days={monthDays} />
            </Suspense>
            <PaymentGrid />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <EditDayModal day={editingDay} onClose={() => setEditingDay(null)} onSave={updateDay} />
      <ResetModal open={resetOpen} onClose={() => setResetOpen(false)} onConfirm={resetAll} />
    </main>
  )
}
