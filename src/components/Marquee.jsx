import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

// Infinite marquee that accelerates with scroll velocity, then eases back.
export default function Marquee({ items, reverse = false, className = '' }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const track = ref.current.querySelector('.marquee-track')
      const loop = gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration: 42, ease: 'none', repeat: -1 }
      )
      // one reusable speed tween (no new timelines per scroll event)
      const speed = { v: 1 }
      const toSpeed = gsap.quickTo(speed, 'v', { duration: 0.6, ease: 'power2.out', onUpdate: () => loop.timeScale(speed.v) })
      let settle = null
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        // only animate while visible
        onToggle: (self) => (self.isActive ? loop.resume() : loop.pause()),
        onUpdate: (self) => {
          toSpeed(1 + Math.min(Math.abs(self.getVelocity()) / 250, 6))
          settle?.kill()
          settle = gsap.delayedCall(0.15, () => toSpeed(1))
        },
      })
    },
    { scope: ref }
  )

  const row = items.flatMap((t, i) => [
    <span className="marquee-item" key={`t${i}`}>
      {t}
    </span>,
    <span className="marquee-star" key={`s${i}`} aria-hidden="true">
      ✦
    </span>,
  ])

  return (
    <div className={`marquee ${className}`} ref={ref} aria-hidden="true">
      <div className="marquee-track" aria-hidden="true">
        <div className="marquee-row">{row}</div>
        <div className="marquee-row">{row}</div>
      </div>
    </div>
  )
}
