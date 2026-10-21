import { useRef } from 'react'
import { gsap, reducedMotion, useGSAP } from '../lib/gsap'
import { photos, photoUrl } from '../data/site'

const FLASH = [photos.bigBen, photos.dubai, photos.paris, photos.sydney, photos.nyc, photos.singapore, photos.wingClouds]
const CODES = ['LHR', 'DXB', 'CDG', 'SYD', 'JFK', 'SIN', 'DEL']

export default function Preloader({ onDone }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      window.__lenis?.stop()
      // take over seamlessly from the static boot screen in index.html (same logo, same spot)
      const boot = document.getElementById('boot')
      boot?.remove()
      let done = false
      let tl = null
      const finish = () => {
        if (done) return
        done = true
        window.__lenis?.start()
        onDone()
      }
      // Failsafe on a plain timer: if animation frames stall (background tab, slow device)
      // the site is still released instead of staying locked behind the loader.
      const failsafe = setTimeout(() => {
        tl?.kill()
        finish()
      }, 6000)
      const cleanup = () => clearTimeout(failsafe)

      if (reducedMotion()) {
        gsap.to(ref.current, { opacity: 0, duration: 0.4, delay: 0.2, onComplete: finish })
        return cleanup
      }

      const count = { v: 0 }
      const num = ref.current.querySelector('.pre-count span')
      const code = ref.current.querySelector('.pre-code')
      const frames = gsap.utils.toArray('.pre-frame')
      const fill = 1.25
      tl = gsap.timeline({ onComplete: finish })

      if (!boot) tl.from('.pre-logo', { opacity: 0, y: 16, duration: 0.6 })
      tl.to(count, {
          v: 100,
          duration: fill,
          ease: 'power2.inOut',
          onUpdate: () => (num.textContent = String(Math.round(count.v)).padStart(3, '0')),
        }, 0.1)
        .to('.pre-bar i', { scaleX: 1, duration: fill, ease: 'power2.inOut' }, 0.1)

      // Photos stack in like flipping through a passport of stamps.
      frames.forEach((f, i) => {
        const at = 0.15 + i * 0.14
        tl.fromTo(
          f,
          { clipPath: 'inset(100% 0% 0% 0%)', rotate: gsap.utils.random(-6, 6) },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.4, ease: 'silk' },
          at
        )
          .from(f.querySelector('img'), { scale: 1.4, duration: 0.55, ease: 'expo.out' }, at)
          .to(code, { duration: 0.2, scrambleText: { text: CODES[i], chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' }, ease: 'none' }, at)
      })

      // Final frame grows to cover the screen (GPU scale, no layout), then the curtain lifts.
      const last = frames[frames.length - 1]
      const cover = () => Math.max(window.innerWidth / last.offsetWidth, window.innerHeight / last.offsetHeight) * 1.04
      tl.to('.pre-meta, .pre-logo', { opacity: 0, duration: 0.25 }, '+=0.02')
        .to(frames.slice(0, -1), { opacity: 0, duration: 0.25 }, '<')
        .to(last, { scale: cover, rotate: 0, duration: 0.6, ease: 'silk' }, '<')
        .to(ref.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.6, ease: 'silk' }, '-=0.1')
      return cleanup
    },
    { scope: ref }
  )

  return (
    <div className="preloader" ref={ref}>
      <img src="/logo-320.webp" alt="" className="pre-logo" width="120" height="107" fetchpriority="high" />
      <div className="pre-stack">
          {FLASH.map((id, i) => (
            <div className="pre-frame" key={id} style={{ zIndex: i }}>
              <img src={photoUrl(id, 480, 60)} alt="" decoding="async" />
            </div>
          ))}
      </div>
      <div className="pre-meta">
        <div className="pre-left">
          <small>Now boarding</small>
          <span className="pre-code">DEL</span>
        </div>
        <div className="pre-bar">
          <i />
        </div>
        <div className="pre-count">
          <span>000</span>
          <small>%</small>
        </div>
      </div>
    </div>
  )
}
