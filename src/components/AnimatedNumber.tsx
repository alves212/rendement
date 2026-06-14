import { useReducedMotion } from 'framer-motion'
import { useAnimatedNumber } from '../hooks/useAnimatedNumber'

type AnimatedNumberProps = {
  value: number
  suffix?: string
  decimals?: number
}

export function AnimatedNumber({ value, suffix = '', decimals = 0 }: AnimatedNumberProps) {
  const reducedMotion = useReducedMotion()
  const animated = useAnimatedNumber(value, 0.75, Boolean(reducedMotion))

  return (
    <span>
      {animated.toLocaleString('fr-FR', {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}
