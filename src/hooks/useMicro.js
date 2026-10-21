import { useEffect } from 'react'
import { gsap, finePointer } from '../lib/gsap'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// Site-wide hover micro-interactions, wired once through event delegation:
//   [data-draw]            stroked icons inside redraw themselves line by line
//   [data-scramble-hover]  text flickers through letters like a departure board
export default function useMicro() {
  useEffect(() => {
    if (!finePointer()) return

    const entered = (e, sel) => {
      const el = e.target.closest(sel)
      if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return null
      return el
    }

    const over = (e) => {
      const drawHost = entered(e, '[data-draw]')
      if (drawHost) {
        const shapes = drawHost.querySelectorAll('svg.ic path, svg.ic rect, svg.ic circle')
        gsap.fromTo(shapes, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, stagger: 0.06, ease: 'power2.inOut', overwrite: true })
      }

      const scr = entered(e, '[data-scramble-hover]')
      if (scr && !scr.__scrambling) {
        const target = scr.querySelector('[data-scramble-text]') || scr
        const text = target.dataset.original || (target.dataset.original = target.textContent)
        scr.__scrambling = true
        gsap.to(target, {
          duration: 0.6,
          scrambleText: { text, chars: CHARS, speed: 0.9 },
          ease: 'none',
          onComplete: () => (scr.__scrambling = false),
        })
      }
    }

    document.addEventListener('mouseover', over)
    return () => document.removeEventListener('mouseover', over)
  }, [])
}
