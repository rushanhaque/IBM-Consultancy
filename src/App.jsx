import { Component, lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { gsap, intro, ScrollTrigger, useGSAP } from './lib/gsap'
import { AppContext } from './lib/appContext'
import useLenis from './hooks/useLenis'
import useMicro from './hooks/useMicro'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Preloader from './components/Preloader'
import MobileDock from './components/MobileDock'
import Icon from './components/Icon'
import { waLink } from './data/site'
import { fontsReady } from './lib/fonts'

// Each page is its own chunk: the first visit downloads only what it shows,
// the rest is prefetched in idle time and awaited behind the route curtain.
const loaders = {
  '/': () => import('./pages/Home'),
  '/services': () => import('./pages/Services'),
  '/about': () => import('./pages/About'),
  '/contact': () => import('./pages/Contact'),
  '*': () => import('./pages/NotFound'),
}
// After a new deploy, an already-open tab may ask for old chunk filenames. On navigation,
// reload once to pick up the new build instead of showing an error.
const fresh = (load) => () =>
  load().catch((err) => {
    try {
      if (!sessionStorage.getItem('ibm-chunk-reload')) {
        sessionStorage.setItem('ibm-chunk-reload', '1')
        window.location.reload()
        return new Promise(() => {})
      }
    } catch {
      /* storage unavailable: fall through to the error screen */
    }
    throw err
  })
const Home = lazy(fresh(loaders['/']))
const Services = lazy(fresh(loaders['/services']))
const About = lazy(fresh(loaders['/about']))
const Contact = lazy(fresh(loaders['/contact']))
const NotFound = lazy(fresh(loaders['*']))
const loaderFor = (path) => loaders[path] || loaders['*']

// Removes the static boot screen once real page content has rendered
// (only still present when the intro is skipped on repeat visits).
function BootDone() {
  useEffect(() => {
    document.getElementById('boot')?.remove()
  }, [])
  return null
}

// If a page chunk fails to download (flaky mobile data), offer a retry instead of a blank screen.
class RouteBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <section className="notfound">
        <div className="container">
          <h1 className="h2">This page didn’t load.</h1>
          <p className="lead">Your connection may have dropped for a moment.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            <span className="btn-label">Try again</span>
          </button>
        </div>
      </section>
    )
  }
}

const pages = {
  '/': { title: 'IBM Consultancy — Immigration, Passport & Visa Services in Delhi', label: 'Home', code: 'DEL' },
  '/services': { title: 'Services — IBM Consultancy', label: 'Services', code: 'SRV' },
  '/about': { title: 'About — IBM Consultancy', label: 'About', code: 'ABT' },
  '/contact': { title: 'Contact & Book — IBM Consultancy', label: 'Contact', code: 'CNT' },
}
const pageOf = (p) => pages[p] || { title: 'IBM Consultancy', label: 'Lost', code: '404' }

// The preloader is a first-impression moment: show it once per browser session.
const seenIntro = (() => {
  try {
    return sessionStorage.getItem('ibm-intro') === '1'
  } catch {
    return false
  }
})()

export default function App() {
  const location = useLocation()
  const [introDone, setReady] = useState(seenIntro)
  // page intros wait for the intro AND the display fonts (capped), so text never reflows in view
  const [fontsOk, setFontsOk] = useState(false)
  const ready = introDone && fontsOk
  useEffect(() => {
    fontsReady().then(() => setFontsOk(true))
  }, [])
  const [loaderGone, setLoaderGone] = useState(seenIntro)
  const [shown, setShown] = useState(location)
  const [dest, setDest] = useState(pageOf(location.pathname))
  const overlay = useRef(null)
  const progress = useRef(null)
  const tl = useRef(null)
  const pending = useRef(null)

  useLenis()
  useMicro()

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    document.title = pageOf(location.pathname).title
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Deep links (/services#visa): scroll once the preloader has released scrolling.
  // Then measure real frame pacing, and prefetch the other pages while idle.
  useEffect(() => {
    if (!ready) return
    if (location.hash) scrollToHash(location.hash)
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1200))
    idle(() => Object.values(loaders).forEach((load) => load().catch(() => {})))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  // Reading-progress hairline.
  useGSAP(() => {
    gsap.set(progress.current, { scaleX: 0 })
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => gsap.set(progress.current, { scaleX: self.progress }),
    })
  })

  const scrollToHash = (hash) => {
    if (!hash) return
    setTimeout(() => {
      const el = document.querySelector(hash)
      if (el) window.__lenis?.scrollTo(el, { offset: -90, duration: 1.4 })
    }, 250)
  }

  // Curtain transition between routes: blue then navy panels sweep up,
  // the destination page name flips in like a departure board.
  useEffect(() => {
    if (location.pathname === shown.pathname) {
      if (location.key !== shown.key) {
        setShown(location)
        // same page: follow a #hash, otherwise glide back to the top
        if (location.hash) scrollToHash(location.hash)
        else window.__lenis?.scrollTo(0, { duration: 1.4 })
      }
      return
    }
    pending.current = location
    setDest({ ...pageOf(location.pathname), at: Date.now() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  // Runs after the curtain has re-rendered with the destination's name.
  useLayoutEffect(() => {
    const location = pending.current
    if (!location) return
    pending.current = null
    const next = dest
    const chunk = loaderFor(location.pathname)().catch(() => {}) // start downloading now
    tl.current?.kill()
    intro.delay = 0.4
    tl.current = gsap
      .timeline()
      .set(overlay.current, { autoAlpha: 1 })
      .fromTo('.pt-panel', { y: 0, yPercent: 101 }, { yPercent: 0, duration: 0.75, ease: 'silk', stagger: 0.07 })
      .fromTo('.pt-word .cc', { yPercent: 110, rotateX: -90 }, { yPercent: 0, rotateX: 0, duration: 0.7, stagger: 0.035, ease: 'expo.out' }, '-=0.35')
      .fromTo('.pt-code', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, scrambleText: { text: next.code, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' } }, '<')
      .add(() => {
        // hold the curtain closed until the page's code has arrived
        const t = tl.current
        t.pause()
        chunk.then(() => {
          if (tl.current !== t) return // a newer navigation took over
          window.__lenis?.scrollTo(0, { immediate: true, force: true })
          window.scrollTo(0, 0)
          setShown(location)
          document.title = next.title
          t.resume()
        })
      })
      .to('.pt-word .cc', { yPercent: -110, duration: 0.45, stagger: 0.02, ease: 'power3.in' }, '+=0.2')
      .to('.pt-code', { autoAlpha: 0, duration: 0.3 }, '<')
      .to('.pt-panel', { yPercent: -101, duration: 0.85, ease: 'silk', stagger: -0.07 }, '-=0.2')
      .set(overlay.current, { autoAlpha: 0 })
      .add(() => {
        ScrollTrigger.refresh()
        scrollToHash(location.hash)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dest])

  return (
    <AppContext.Provider value={{ ready }}>
      {!loaderGone && (
        <Preloader
          onDone={() => {
            try {
              sessionStorage.setItem('ibm-intro', '1')
            } catch {
              /* private mode: just show it again next time */
            }
            setReady(true)
            setLoaderGone(true)
          }}
        />
      )}

      <div className="pt" ref={overlay} aria-hidden="true">
        <div className="pt-panel pt-1" />
        <div className="pt-panel pt-2">
          <div className="pt-inner">
            <span className="pt-code">{dest.code}</span>
            <span className="pt-word">
              {[...dest.label].map((c, i) => (
                <span className="cc" key={`${dest.label}${i}`}>
                  {c}
                </span>
              ))}
            </span>
            <span className="pt-sub">IBM Consultancy · Now boarding</span>
          </div>
        </div>
      </div>

      <div className="progress" ref={progress} aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <Navbar />
      <div className="page-shell">
        <main>
          <RouteBoundary key={shown.pathname}>
          <Suspense fallback={<div className="route-fallback" />}>
          <Routes location={shown}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BootDone />
          </Suspense>
          </RouteBoundary>
        </main>
      </div>
      <Footer />

      <a className="wa-float" href={waLink()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <Icon name="whatsapp" size={26} />
        <span className="wa-tip">Chat with us</span>
      </a>
      <MobileDock />
    </AppContext.Provider>
  )
}
