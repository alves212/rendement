import gsap from 'gsap'
import { RefObject, useEffect } from 'react'

export function useGsapProgress(
  ref: RefObject<HTMLElement | null>,
  value: number,
  disabled: boolean,
) {
  useEffect(() => {
    if (!ref.current) return

    const width = `${Math.max(0, Math.min(value, 100))}%`
    if (disabled) {
      ref.current.style.width = width
      return
    }

    const tween = gsap.to(ref.current, {
      width,
      duration: 0.85,
      ease: 'expo.out',
    })

    return () => {
      tween.kill()
    }
  }, [disabled, ref, value])
}
