import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'

// Declarative scroll animations driven by data attributes inside `scope`:
//   data-split        masked word-by-word heading reveal (see <Split/>)
//   data-fade         fade + rise   (data-delay="0.2" optional)
//   data-stagger      children fade + rise in sequence
//   data-clip         clip-path wipe from bottom
//   data-img-reveal   photo frame wipes open while the photo settles from a zoom
//   data-parallax-img photo drifts inside its frame
//   data-line         horizontal rule draws in
//   data-speed        parallax (e.g. data-speed="-12" = yPercent over the viewport)
//   data-counter      counts up to data-counter value
//   data-scrub-words  words brighten as the paragraph scrolls through
//   data-colorize     photos bloom into colour while centred
//   data-skew         skews with scroll velocity
//   .eyebrow-text     scrambles in like a departure board
//
// Performance: everything runs in two phases. Phase 1 only WRITES (starting styles,
// paused tweens). Phase 2 only READS (ScrollTriggers with callbacks, no attached
// animation). Mixing the two per element forced a synchronous layout for every one
// of ~100+ elements on load; now layout is computed once and reused.
export default function useReveal(scope, deps = []) {
  useGSAP(
    () => {
      const q = gsap.utils.selector(scope)
      const triggers = [] // phase-2 trigger configs, created after all writes
      // plays once, whether the element is reached scrolling down or (after a deep link) scrolling up
      const onEnter = (trigger, start, play) => {
        let ran = false
        const run = () => !ran && ((ran = true), play())
        triggers.push({ trigger, start, once: true, onEnter: run, onEnterBack: run })
      }
      const scrubbed = (trigger, start, end, tween, smooth = 0) => {
        if (!smooth) {
          triggers.push({ trigger, start, end, onUpdate: (self) => tween.progress(self.progress) })
          return
        }
        const p = { v: 0 }
        const to = gsap.quickTo(p, 'v', { duration: smooth, ease: 'power2.out', onUpdate: () => tween.progress(p.v) })
        triggers.push({ trigger, start, end, onUpdate: (self) => to(self.progress) })
      }

      // ---------- phase 1: writes only ----------
      // Starting states are written as plain inline styles. (gsap.set() would first read
      // each element's computed style, turning this loop into read/write thrash.) GSAP
      // parses these values later, when each animation actually plays.
      const style = (els, css) => {
        for (const el of els) Object.assign(el.style, css)
      }
      const hiddenUp = (y) => ({ transform: 'translate(0px, ' + y + 'px)', opacity: '0' })

      // Reveals run as CSS transitions: the browser animates transform/opacity itself,
      // so nothing parses styles in JavaScript while you scroll. Curves match the old GSAP eases.
      const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)'
      const SILK = 'cubic-bezier(0.7, 0, 0.15, 1)'
      // two frames on, the starting state has certainly been rendered, so the transition runs
      const afterPaint = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn))
      const transitionTo = (el, css, { props, duration, delay = 0, ease = EXPO, clear = [] }) => {
        el.style.transition = props.map((p) => p + ' ' + duration + 's ' + ease + ' ' + delay + 's').join(', ')
        Object.assign(el.style, css)
        // afterwards hand the element back to its stylesheet (hover effects etc.)
        setTimeout(() => {
          el.style.transition = ''
          clear.forEach((p) => (el.style[p] = ''))
        }, (duration + delay) * 1000 + 80)
      }

      q('[data-split]').forEach((el) => {
        const words = [...el.querySelectorAll('.w > span')]
        style(words, { transform: 'translate(0px, 115%) rotate(3deg)' })
        onEnter(el, 'top 88%', () =>
          afterPaint(() =>
            words.forEach((w, i) =>
              transitionTo(w, { transform: 'translate(0px, 0%) rotate(0deg)' }, { props: ['transform'], duration: 1.3, delay: i * 0.045, clear: ['transform'] })
            )
          )
        )
      })

      q('.eyebrow-text:not([data-noscramble])').forEach((el) => {
        const text = el.textContent
        onEnter(el, 'top 92%', () =>
          gsap.to(el, { duration: 1.2, scrambleText: { text, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', speed: 0.6, revealDelay: 0.2 }, ease: 'none' })
        )
      })

      const shown = { transform: 'translate(0px, 0px)', opacity: '1' }
      q('[data-fade]').forEach((el) => {
        style([el], hiddenUp(48))
        const delay = parseFloat(el.dataset.delay || 0)
        onEnter(el, 'top 86%', () =>
          afterPaint(() => transitionTo(el, shown, { props: ['transform', 'opacity'], duration: 1.3, delay, clear: ['transform', 'opacity'] }))
        )
      })

      q('[data-stagger]').forEach((el) => {
        const kids = [...el.children]
        style(kids, hiddenUp(56))
        onEnter(el, 'top 84%', () =>
          afterPaint(() =>
            kids.forEach((k, i) =>
              transitionTo(k, shown, { props: ['transform', 'opacity'], duration: 1.3, delay: i * 0.09, clear: ['transform', 'opacity'] })
            )
          )
        )
      })

      q('[data-clip]').forEach((el) => {
        style([el], { clipPath: 'inset(100% 0% 0% 0% round 28px)' })
        onEnter(el, 'top 88%', () =>
          afterPaint(() => transitionTo(el, { clipPath: 'inset(0% 0% 0% 0% round 28px)' }, { props: ['clip-path'], duration: 1.6, ease: SILK, clear: ['clipPath'] }))
        )
      })

      // the photo's zoom uses the separate 'scale' property so it never collides with
      // the parallax drift, which GSAP drives through 'transform'
      q('[data-img-reveal]').forEach((el) => {
        const img = el.querySelector('img')
        style([el], { clipPath: 'inset(18% 12% 18% 12%)' })
        style([img], { scale: '1.35' })
        onEnter(el, 'top 90%', () =>
          afterPaint(() => {
            transitionTo(el, { clipPath: 'inset(0% 0% 0% 0%)' }, { props: ['clip-path'], duration: 1.7, ease: SILK, clear: ['clipPath'] })
            transitionTo(img, { scale: '1' }, { props: ['scale'], duration: 2, clear: ['scale'] })
          })
        )
      })

      // scrubbed tweens are built lazily (immediateRender off) so nothing is read here
      q('[data-parallax-img]').forEach((img) => {
        const tw = gsap.fromTo(img, { yPercent: -9 }, { yPercent: 9, ease: 'none', paused: true, immediateRender: false })
        scrubbed(img.parentElement, 'top bottom', 'bottom top', tw)
      })

      q('[data-line]').forEach((el) => {
        style([el], { transform: 'scaleX(0)', transformOrigin: 'left center' })
        onEnter(el, 'top 92%', () =>
          afterPaint(() => transitionTo(el, { transform: 'scaleX(1)' }, { props: ['transform'], duration: 1.6, ease: SILK, clear: ['transform'] }))
        )
      })

      q('[data-speed]').forEach((el) => {
        const tw = gsap.fromTo(el, { yPercent: 0 }, { yPercent: parseFloat(el.dataset.speed), ease: 'none', paused: true, immediateRender: false })
        scrubbed(el, 'top bottom', 'bottom top', tw)
      })

      q('[data-counter]').forEach((el) => {
        const target = parseFloat(el.dataset.counter)
        onEnter(el, 'top 90%', () => {
          const obj = { v: 0 }
          gsap.to(obj, { v: target, duration: 2.2, ease: 'power3.out', onUpdate: () => (el.textContent = Math.round(obj.v)) })
        })
      })

      q('[data-scrub-words]').forEach((el) => {
        const words = el.querySelectorAll('.sw')
        style(words, { opacity: '0.14' })
        const tw = gsap.fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: 'none', paused: true, immediateRender: false })
        scrubbed(el, 'top 78%', 'bottom 50%', tw, 0.6)
      })

      // ---------- phase 2: reads only (trigger measurement) ----------
      triggers.forEach((cfg) => ScrollTrigger.create(cfg))

      // rotating card beams animate only while on screen
      q('.beam').forEach((el) => {
        ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', toggleClass: { targets: el, className: 'is-live' } })
      })

      q('[data-colorize]').forEach((el) => {
        ScrollTrigger.create({ trigger: el, start: 'top 62%', end: 'bottom 38%', toggleClass: { targets: el, className: 'is-color' } })
      })

      const skewEls = q('[data-skew]')
      if (skewEls.length) {
        const proxy = { skew: 0 }
        const set = gsap.quickSetter(skewEls, 'skewY', 'deg')
        const clamp = gsap.utils.clamp(-7, 7)
        ScrollTrigger.create({
          trigger: scope.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const skew = clamp(self.getVelocity() / -350)
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew
              gsap.to(proxy, { skew: 0, duration: 0.9, ease: 'power3', overwrite: true, onUpdate: () => set(proxy.skew) })
            }
          },
        })
      }
      // Pinned sections queue their own full refresh; no extra forced refresh here.
    },
    { scope, dependencies: deps }
  )
}
