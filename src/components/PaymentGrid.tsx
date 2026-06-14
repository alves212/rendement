import { motion, useReducedMotion } from 'framer-motion'
import { paymentColors, paymentTable } from '../constants/payment'

export function PaymentGrid() {
  const reducedMotion = useReducedMotion()

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
      <div className="mb-4">
        <h2 className="text-lg font-black text-white">Faixas de paiement</h2>
        <p className="text-sm text-muted">Repères visuels de rendement et primes.</p>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {paymentTable.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => {
            const background =
              rowIndex === 0
                ? paymentColors[colIndex]
                : `linear-gradient(135deg, ${paymentColors[rowIndex - 1]} 0 50%, ${paymentColors[colIndex]} 50% 100%)`

            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: reducedMotion ? 0 : (rowIndex * 5 + colIndex) * 0.012 }}
                whileTap={{ scale: 0.96 }}
                className="grid aspect-[1.18] place-items-center rounded-2xl border border-white/15 text-sm font-black text-white shadow-lg"
                style={{
                  background,
                  textShadow: '0 1px 8px rgba(0,0,0,0.85)',
                }}
              >
                {value}
                {rowIndex === 0 ? '%' : '€'}
              </motion.div>
            )
          }),
        )}
      </div>
    </section>
  )
}
