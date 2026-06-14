import { motion, useReducedMotion } from 'framer-motion'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ProductionDay } from '../types/production'
import { chartRows } from '../utils/production'

type ChartsPanelProps = {
  days: ProductionDay[]
}

export function ChartsPanel({ days }: ChartsPanelProps) {
  const reducedMotion = useReducedMotion()
  const data = chartRows(days)

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
      <div className="mb-4">
        <h2 className="text-lg font-black text-white">Graphiques</h2>
        <p className="text-sm text-muted">Production, rebus et rendement du mois.</p>
      </div>

      {data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-sm text-muted">
          Les graphiques apparaîtront après la première journée.
        </div>
      ) : (
        <div className="grid gap-5">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            className="h-56"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.06)' }}
                  contentStyle={{
                    background: '#0d1320',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 16,
                    color: '#fff',
                  }}
                />
                <Bar dataKey="production" fill="#22c55e" radius={[8, 8, 2, 2]} isAnimationActive={!reducedMotion} />
                <Bar dataKey="rebus" fill="#ef4444" radius={[8, 8, 2, 2]} isAnimationActive={!reducedMotion} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            className="h-52"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="rendementGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.75} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0d1320',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 16,
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rendement"
                  stroke="#a78bfa"
                  strokeWidth={3}
                  fill="url(#rendementGradient)"
                  isAnimationActive={!reducedMotion}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}
    </section>
  )
}
