import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { company, nav, services, waLink } from '../data/site'
import Icon from './Icon'

export default function Footer() {
  const ref = useRef(null)

  useGSAP(
    () => {
      gsap.from('.footer-word span', {
        yPercent: 100,
        duration: 1.6,
        stagger: 0.04,
        // measured from the end of the document so it also works when the footer is pinned beneath the page
        scrollTrigger: { start: () => ScrollTrigger.maxScroll(window) - window.innerHeight * 0.35, once: true },
        clearProps: 'transform', // hand control back to the CSS hover lift
      })
    },
    { scope: ref }
  )

  // Curtain reveal (page lifts off a footer pinned beneath it) only when the
  // whole footer fits on screen; otherwise its top would stay hidden.
  useEffect(() => {
    const el = ref.current
    const check = () => {
      // ignore the 48px of extra top padding the reveal mode itself adds
      const extra = document.documentElement.classList.contains('footer-reveal') ? 48 : 0
      const fits = window.innerWidth >= 1024 && el.offsetHeight - extra + 48 < window.innerHeight
      document.documentElement.classList.toggle('footer-reveal', fits)
    }
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    window.addEventListener('resize', check)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', check)
      document.documentElement.classList.remove('footer-reveal')
    }
  }, [])

  const year = new Date().getFullYear()
  const word = 'IBM Consultancy'

  return (
    <footer className="footer" ref={ref}>
      <div className="container">
        <div className="footer-top">
          <div className="footer-intro">
            <img src="/logo-320.webp" loading="lazy" decoding="async" alt="IBM Consultancy — Immigration & Visa Services" className="footer-logo" width="160" height="143" />
            <p>
              Fast, transparent passport and visa services for business travellers, students and families — from Delhi to
              the world.
            </p>
            <a className="footer-wa" href={waLink()} target="_blank" rel="noreferrer">
              <Icon name="whatsapp" size={18} /> Message us on WhatsApp
            </a>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            {nav.map((n) => (
              <Link key={n.to} to={n.to} data-scramble-hover="">
                {n.label}
              </Link>
            ))}
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            {services.map((s) => (
              <Link key={s.id} to={`/services#${s.id}`} data-scramble-hover="">
                {s.title}
              </Link>
            ))}
          </div>
          <div className="footer-col">
            <h4>Visit</h4>
            <p>
              {company.address[0]}
              <br />
              {company.address[1]}
            </p>
            <a href={company.phoneHref}>{company.phone}</a>
            <p className="muted">Mon – Fri · 09:00 – 17:00</p>
          </div>
        </div>

        <div className="footer-word" aria-hidden="true">
          {word.split('').map((c, i) => (
            <span key={i}>{c === ' ' ? ' ' : c}</span>
          ))}
        </div>

        <div className="footer-bottom">
          <span>© {year} {company.name}. All rights reserved.</span>
          <span>Immigration &amp; Visa Services · New Delhi</span>
          <button className="to-top" data-scramble-hover="" onClick={() => window.__lenis?.scrollTo(0, { duration: 1.8 })}>
            <span data-scramble-text="">Back to top</span> <Icon name="arrow" size={14} className="rot-up" />
          </button>
        </div>
      </div>
    </footer>
  )
}
