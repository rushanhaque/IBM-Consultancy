import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { gsap, useGSAP } from '../lib/gsap'
import { nav, company, offices, waLink } from '../data/site'
import Button from './Button'

export function Brand({ light = false }) {
  return (
    <Link to="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label={`${company.name} — home`}>
      <img src="/emblem.webp" alt="" className="brand-mark" width="82" height="40" />
      <span className="brand-text">
        <strong>IBM</strong>
        <small>Consultancy</small>
      </span>
    </Link>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef(null)
  const tl = useRef(null)
  const linksRef = useRef(null)
  const pillRef = useRef(null)
  const { pathname } = useLocation()

  // Sliding pill: follows the hovered link, settles back on the active page.
  const movePill = (el) => {
    if (!pillRef.current) return
    if (!el) return gsap.to(pillRef.current, { opacity: 0, scale: 0.9, duration: 0.4 })
    gsap.to(pillRef.current, { x: el.offsetLeft, width: el.offsetWidth, opacity: 1, scale: 1, duration: 0.7, ease: 'expo.out' })
  }
  const toActive = () => movePill(linksRef.current?.querySelector('.nav-link.active'))
  useEffect(() => {
    const t = setTimeout(toActive, 60)
    // fonts change link widths, so re-measure once they are in
    document.fonts?.ready.then(toActive)
    window.addEventListener('resize', toActive)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', toActive)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    // the header stays put; scrolling only toggles its compact background
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(menuRef.current, { visibility: 'visible' })
        .fromTo('.menu-bg', { clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)', duration: 1, ease: 'expo.inOut' })
        .from('.menu-link span', { yPercent: 110, duration: 1, stagger: 0.06 }, '-=0.45')
        .from('.menu-foot > *', { opacity: 0, y: 20, duration: 0.8, stagger: 0.06 }, '-=0.8')
    },
    { scope: menuRef }
  )

  useEffect(() => {
    if (!tl.current) return
    if (open) {
      window.__lenis?.stop()
      tl.current.timeScale(1).play()
    } else {
      window.__lenis?.start()
      tl.current.timeScale(1.6).reverse()
    }
  }, [open])

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
        <div className="nav-inner">
          <Brand />
          <nav className="nav-links" aria-label="Primary" ref={linksRef} onMouseLeave={toActive}>
            <span className="nav-pill" ref={pillRef} aria-hidden="true" />
            {/* Contact lives in the Connect button on desktop */}
            {nav.filter((n) => n.to !== '/contact').map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className="nav-link" onMouseEnter={(e) => movePill(e.currentTarget)}>
                <span className="roll">
                  <span data-text={n.label}>{n.label}</span>
                </span>
              </NavLink>
            ))}
          </nav>
          <div className="nav-actions">
            <Button to="/contact" variant="primary" className="btn-sm nav-cta" wrapClassName="nav-cta-wrap">
              Connect
            </Button>
            <button className={`burger ${open ? 'is-active' : ''}`} onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className="menu" ref={menuRef} aria-hidden={!open}>
        <div className="menu-bg" />
        <div className="menu-inner">
          <nav className="menu-links">
            {nav.map((n, i) => (
              <Link key={n.to} to={n.to} className="menu-link" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
                <span>
                  <em>0{i + 1}</em>
                  {n.label}
                </span>
              </Link>
            ))}
          </nav>
          <div className="menu-foot">
            <a href={company.phoneHref}>{company.phone}</a>
            <a href={waLink()} target="_blank" rel="noreferrer">
              WhatsApp us
            </a>
            <a href={company.instagram} target="_blank" rel="noreferrer">
              Instagram {company.instagramHandle}
            </a>
            {offices.map((o) => (
              <p key={o.label}>{o.lines.join(', ')}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
