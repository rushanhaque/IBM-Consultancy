import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'

export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    window.__lenis = lenis
    // the preloader mounts first and can't reach Lenis yet, so hold scrolling here
    if (document.querySelector('.preloader')) lenis.stop()
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    // prioritized: scroll first on a clean layout, then GSAP renders. (Running after GSAP
    // wrote styles forced a synchronous re-layout on every frame.)
    gsap.ticker.add(raf, false, true)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])
}
