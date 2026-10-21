import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

// Pulls its child towards the cursor on hover (desktop pointers only).
export default function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
      // smooth, damped follow (no elastic overshoot)
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
      const move = (e) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * strength)
        yTo((e.clientY - (r.top + r.height / 2)) * strength)
      }
      const leave = () => {
        xTo(0)
        yTo(0)
      }
      el.addEventListener('mousemove', move)
      el.addEventListener('mouseleave', leave)
      return () => {
        el.removeEventListener('mousemove', move)
        el.removeEventListener('mouseleave', leave)
      }
    },
    { scope: ref }
  )

  return (
    <span ref={ref} className={`magnetic ${className}`}>
      {children}
    </span>
  )
}
