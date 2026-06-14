import type { RendementBand } from '../types/production'

export const rendementBands: RendementBand[] = [
  { label: 'Critique', min: 0, color: '#64748b', accent: 'from-slate-500 to-slate-300' },
  { label: 'Rouge', min: 85, color: '#ef4444', accent: 'from-red-500 to-rose-300' },
  { label: 'Jaune', min: 89, color: '#f59e0b', accent: 'from-amber-400 to-yellow-200' },
  { label: 'Vert', min: 91, color: '#22c55e', accent: 'from-emerald-500 to-lime-300' },
  { label: 'Gris', min: 94, color: '#94a3b8', accent: 'from-slate-300 to-zinc-100' },
  { label: 'Bleu', min: 96.5, color: '#3b82f6', accent: 'from-blue-500 to-cyan-300' },
  { label: 'Premium', min: 100, color: '#a855f7', accent: 'from-violet-500 to-fuchsia-300' },
]
