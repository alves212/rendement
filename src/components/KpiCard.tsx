import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { AnimatedNumber } from './AnimatedNumber'

type KpiCardProps = {
  label: string
  value: number
  suffix?: string
  decimals?: number
  icon: ReactNode
  tone?: 'default' | 'success' | 'danger' | 'premium'
}

const toneClass = {
  default: 'from-white/12 to-white/5',
  success: 'from-emerald-400/20 to-emerald-300/5',
  danger: 'from-red-400/20 to-red-300/5',
  premium: 'from-violet-400/25 to-cyan-300/5',
}

export function KpiCard({ label, value, suffix, decimals, icon, tone = 'default' }: KpiCardProps) {
  return (
    <motion.article
      layout
      whileTap={{ scale: 0.985 }}
      className={`rounded-2xl border border-white/10 bg-gradient-to-br ${toneClass[tone]} p-4 shadow-premium backdrop-blur`}
    >
      <div className="mb-3 flex items-center justify-between text-muted">
        <span className="text-xs font-semibold uppercase tracking-[0.2em]">{label}</span>
        <span className="rounded-full bg-white/10 p-2 text-white">{icon}</span>
      </div>
      <div className="text-2xl font-black tracking-tight text-white">
        <AnimatedNumber value={value} suffix={suffix} decimals={decimals} />
      </div>
    </motion.article>
  )
}
