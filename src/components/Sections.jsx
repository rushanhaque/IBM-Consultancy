import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap, intro, useGSAP } from '../lib/gsap'
import { useApp } from '../lib/appContext'
import { faqs, photos, waLink } from '../data/site'
import Button from './Button'
import Icon from './Icon'
import Split from './Split'
import Magnetic from './Magnetic'
import Img from './Img'

export function Eyebrow({ children, light = false, className = '', noscramble = false, ...rest }) {
  return (
    <div className={`eyebrow ${light ? 'eyebrow-light' : ''} ${className}`} {...rest}>
      <span className="eyebrow-dot" />
      <span className="eyebrow-text" data-noscramble={noscramble ? '' : undefined}>
        {children}
      </span>
    </div>
  )
}

// Card with a soft cursor-following glow.
export function Spotlight({ as: Tag = 'div', className = '', children, ...rest }) {
  // one style write per animation frame at most, however fast the mouse moves
  let frame = 0
  const onMove = (e) => {
    const el = e.currentTarget
    const { clientX, clientY } = e
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${clientX - r.left}px`)
      el.style.setProperty('--my', `${clientY - r.top}px`)
    })
  }
  return (
    <Tag className={`spot ${className}`} onMouseMove={onMove} {...rest}>
      {children}
    </Tag>
  )
}

// Hero used on inner pages; an optional photo banner opens wider as you scroll.
export function PageHero({ eyebrow, title, text, image, imageAlt = '', children }) {
  const ref = useRef(null)
  const { ready } = useApp()

  useGSAP(
    () => {
      if (!ready) return
      gsap
        .timeline({ delay: intro.delay })
        .from('.ph-eyebrow', { opacity: 0, y: 20, duration: 1 })
        .to('.ph-eyebrow .eyebrow-text', { duration: 1.2, scrambleText: { text: eyebrow, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', speed: 0.6 }, ease: 'none' }, '<')
        .from('[data-hero-split] .w > span', { yPercent: 115, rotate: 3, duration: 1.4, stagger: 0.05 }, '<0.1')
        .from('.ph-text, .ph-extra', { opacity: 0, y: 30, duration: 1.2, stagger: 0.1 }, '<0.4')
        .from('.ph-orb', { scale: 0.6, opacity: 0, duration: 2, ease: 'expo.out' }, 0)
        .fromTo('.ph-banner', { clipPath: 'inset(30% 8% 0% 8% round 32px)' }, { clipPath: 'inset(0% 4% 0% 4% round 32px)', duration: 1.6, ease: 'silk' }, 0.3)
        .from('.ph-banner img', { scale: 1.4, duration: 2.2, ease: 'expo.out' }, 0.3)

      if (image) {
        gsap.to('.ph-banner', {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          ease: 'none',
          scrollTrigger: { trigger: '.ph-banner', start: 'top 85%', end: 'top 15%', scrub: true },
        })
      }
    },
    { scope: ref, dependencies: [ready] }
  )

  return (
    <section className={`page-hero ${image ? 'has-banner' : ''} ${ready ? '' : 'is-waiting'}`} ref={ref}>
      <div className="ph-bg" aria-hidden="true">
        <div className="hero-grid" />
        <div className="ph-orb" />
      </div>
      <div className="container">
        <Eyebrow className="ph-eyebrow" noscramble>
          {eyebrow}
        </Eyebrow>
        <Split as="h1" hero text={title} className="ph-title display" />
        {text && <p className="ph-text lead">{text}</p>}
        {children && <div className="ph-extra">{children}</div>}
      </div>
      {image && <Img id={image} alt={imageAlt} className="ph-banner" reveal={false} parallax eager fetchPriority="high" sizes="100vw" />}
    </section>
  )
}

export function FAQ() {
  const [openIdx, setOpenIdx] = useState(0)
  return (
    <section className="section faq">
      <div className="container faq-grid">
        <div className="faq-side">
          <Eyebrow data-fade="">FAQ</Eyebrow>
          <Split as="h2" text="Answers, *before you ask.*" className="h2" />
          <div data-fade="" data-delay="0.2">
            <Button href={waLink('Hello IBM Consultancy, I have a question.')} variant="ghost" icon="whatsapp">
              Ask on WhatsApp
            </Button>
          </div>
        </div>
        <div className="faq-list" data-stagger="">
          {faqs.map((f, i) => (
            <div key={f.q} className={`faq-item ${openIdx === i ? 'is-open' : ''}`}>
              <button className="faq-q" data-scramble-hover="" onClick={() => setOpenIdx(openIdx === i ? -1 : i)} aria-expanded={openIdx === i}>
                <span className="faq-n" data-scramble-text="">0{i + 1}</span>
                <span className="faq-t">{f.q}</span>
                <span className="faq-icon">
                  <Icon name="plus" size={18} />
                </span>
              </button>
              <div className="faq-a">
                <div>
                  <p>{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTA() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const split = new SplitTextLite(ref.current.querySelector('.cta-title'))
      gsap.from(split.chars, {
        yPercent: 120,
        rotateX: -80,
        opacity: 0,
        duration: 1.4,
        stagger: 0.025,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
      })
    },
    { scope: ref }
  )

  return (
    <section className="section cta-wrap" ref={ref}>
      <div className="container">
        <div className="cta" data-clip="">
          <Img id={photos.landing} alt="" className="cta-photo" reveal={false} parallax sizes="100vw" />
          <div className="cta-shade" aria-hidden="true" />
          <div className="cta-lines" aria-hidden="true">
            <svg viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
              {[...Array(9)].map((_, i) => (
                <ellipse key={i} cx="400" cy="400" rx={60 + i * 45} ry={360} fill="none" stroke="currentColor" strokeWidth="1" />
              ))}
              {[...Array(7)].map((_, i) => (
                <ellipse key={`h${i}`} cx="400" cy="400" rx="380" ry={40 + i * 50} fill="none" stroke="currentColor" strokeWidth="1" />
              ))}
            </svg>
          </div>
          <div className="cta-content">
            <Eyebrow light>Start today</Eyebrow>
            <h2 className="cta-title">
              <span className="cta-line">Ready when</span>
              <span className="cta-line em">you are.</span>
            </h2>
            <p>Tell us where you’re headed. We’ll handle the rest.</p>
            <div className="cta-actions">
              <Button to="/contact" variant="light">
                Book a consultation
              </Button>
              <Button href={waLink()} variant="ghost-light" icon="whatsapp">
                WhatsApp us
              </Button>
            </div>
          </div>
          <Magnetic strength={0.4} className="cta-orb-wrap">
            <Link to="/contact" className="cta-orb" aria-label="Book now">
              <span className="cta-orb-text">
                <svg viewBox="0 0 200 200">
                  <defs>
                    <path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                  </defs>
                  <text>
                    <textPath href="#circ">BOOK A CONSULTATION · BOOK A CONSULTATION · </textPath>
                  </text>
                </svg>
              </span>
              <Icon name="arrowUpRight" size={34} stroke={1.4} />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}

// Minimal char splitter that keeps words intact (avoids mid-word line breaks).
class SplitTextLite {
  constructor(el) {
    this.chars = []
    el.querySelectorAll('.cta-line').forEach((line) => {
      const words = line.textContent.split(' ')
      line.textContent = ''
      words.forEach((w, wi) => {
        const word = document.createElement('span')
        word.className = 'cw'
        ;[...w].forEach((c) => {
          const ch = document.createElement('span')
          ch.className = 'cc'
          ch.textContent = c
          word.appendChild(ch)
          this.chars.push(ch)
        })
        line.appendChild(word)
        if (wi < words.length - 1) line.appendChild(document.createTextNode(' '))
      })
    })
  }
}
