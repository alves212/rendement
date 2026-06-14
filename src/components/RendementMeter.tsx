import { motion, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { useGsapProgress } from '../hooks/useGsapProgress'
import { getRendementBand } from '../utils/production'
import { AnimatedNumber } from './AnimatedNumber'

type RendementMeterProps = {
  rendement: number
}

export function RendementMeter({ rendement }: RendementMeterProps) {
  const reducedMotion = useReducedMotion()
  const barRef = useRef<HTMLDivElement>(null)
  const band = getRendementBand(rendement)
  const capped = Math.max(0, Math.min(rendement, 100))
  useGsapProgress(barRef, capped, Boolean(reducedMotion))

  return (
    <motion.section
      layout
      className="overflow-hidden rounded-3xl border border-white/10 bg-panel/80 p-5 shadow-glow backdrop-blur-xl"
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
            Rendement mensuel
          </p>
          <h2 className="mt-1 text-4xl font-black text-white">
            <AnimatedNumber value={rendement} suffix="%" decimals={1} />
          </h2>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg"
          style={{ backgroundColor: band.color }}
        >
          {band.label}
        </span>
      </div>

      <div className="h-4 overflow-hidden rounded-full bg-white/10">
        <div
          ref={barRef}
          className={`h-full rounded-full bg-gradient-to-r ${band.accent}`}
          style={{ width: `${capped}%` }}
        />
      </div>
      <div className="mt-3 flex justify-between text-xs text-muted">
        <span>0%</span>
        <span>Objectif 96.5%</span>
        <span>100%</span>
      </div>
    </motion.section>
  )
}
