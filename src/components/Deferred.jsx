import { useEffect, useRef, useState } from 'react'
import useReveal from '../hooks/useReveal'
import { ScrollTrigger } from '../lib/gsap'

// Progressive mounting for below-the-fold sections.
// Instead of rendering and wiring every section's animations in one long first
// commit (which freezes low-end phones), sections mount one at a time in idle
// gaps, in page order. Each gets its own scroll-reveal setup. A single
// ScrollTrigger refresh runs once the queue drains so page-length-dependent
// values (progress bar, footer) are measured against the final layout.

const queue = []
let pumping = false
const idle =
  typeof window !== 'undefined' && window.requestIdleCallback
    ? (fn) => window.requestIdleCallback(fn, { timeout: 200 })
    : (fn) => setTimeout(fn, 32)

function pump() {
  if (pumping) return
  pumping = true
  const step = () => {
    const job = queue.shift()
    if (!job) {
      pumping = false
      // let the last section commit and its effects run, then measure once
      requestAnimationFrame(() => ScrollTrigger.refresh())
      return
    }
    job()
    idle(step)
  }
  idle(step)
}

function Revealed({ children }) {
  const ref = useRef(null)
  useReveal(ref)
  return <div ref={ref}>{children}</div>
}

export default function Deferred({ children, minHeight = '100vh' }) {
  const [on, setOn] = useState(false)

  useEffect(() => {
    let alive = true
    queue.push(() => alive && setOn(true))
    pump()
    return () => {
      alive = false
    }
  }, [])

  // placeholder keeps roughly the right page length so nothing jumps
  if (!on) return <div style={{ minHeight }} aria-hidden="true" />
  return <Revealed>{children}</Revealed>
}
