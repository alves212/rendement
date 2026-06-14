import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

type ResetModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ResetModal({ open, onClose, onConfirm }: ResetModalProps) {
  const reducedMotion = useReducedMotion()
  const [confirmation, setConfirmation] = useState('')
  const canReset = confirmation.toUpperCase() === 'RESET'

  function confirm() {
    if (!canReset) return
    onConfirm()
    setConfirmation('')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-md"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={reducedMotion ? undefined : { opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-title"
        >
          <motion.div
            className="w-full max-w-sm rounded-3xl border border-red-300/20 bg-surface p-5 shadow-premium"
            initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: 20, scale: 0.96 }}
          >
            <h2 id="reset-title" className="text-xl font-black text-white">
              Réinitialiser les données
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Cette action supprime toutes les journées enregistrées sur cet appareil.
              Tapez RESET pour confirmer.
            </p>
            <input
              className="field mt-4"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder="RESET"
            />
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button className="rounded-2xl bg-white/10 px-4 py-3 font-bold text-white" type="button" onClick={onClose}>
                Annuler
              </button>
              <button
                className="rounded-2xl bg-red-500 px-4 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
                type="button"
                disabled={!canReset}
                onClick={confirm}
              >
                Supprimer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
