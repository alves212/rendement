import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

export function useAnimatedNumber(value: number, duration = 0.7, disabled = false) {
  const ref = useRef({ value })
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (disabled) {
      setDisplayValue(value)
      ref.current.value = value
      return
    }

    const tween = gsap.to(ref.current, {
      value,
      duration,
      ease: 'power3.out',
      onUpdate: () => setDisplayValue(ref.current.value),
    })

    return () => {
      tween.kill()
    }
  }, [disabled, duration, value])

  return displayValue
}
