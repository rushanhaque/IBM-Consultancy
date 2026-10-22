import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap, intro, ScrollTrigger, SplitText, useGSAP, finePointer } from '../lib/gsap'
import { useApp } from '../lib/appContext'
import useReveal from '../hooks/useReveal'
import { destinations, marquee, photos, photoUrl, process, ribbon, services, stats, testimonials } from '../data/site'
import Globe from '../components/Globe'
import Button from '../components/Button'
import Icon from '../components/Icon'
import Split from '../components/Split'
import Marquee from '../components/Marquee'
import Img from '../components/Img'
import Deferred from '../components/Deferred'
import { CTA, Eyebrow, Spotlight } from '../components/Sections'

const PLANE = 'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z'

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

function Hero() {
  const ref = useRef(null)
  const { ready } = useApp()

  useGSAP(
    () => {
      if (!ready) return
      const split = SplitText.create('.hero-title', { type: 'words,chars', wordsClass: 'hw', charsClass: 'hc' })
      const tl = gsap.timeline({ delay: intro.delay })
      tl.from('.hero-eyebrow', { opacity: 0, y: 20, duration: 1 })
        .to('.hero-eyebrow .eyebrow-text', { duration: 1.4, scrambleText: { text: 'Immigration & Visa Services · New Delhi', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', speed: 0.5 }, ease: 'none' }, '<')
        // split-flap: every letter flips down like an airport departure board
        .from(split.chars, { rotateX: -100, yPercent: 30, opacity: 0, duration: 1.1, stagger: { each: 0.022, from: 'start' }, ease: 'back.out(1.6)' }, '<0.1')
        .from('.hero-sub', { opacity: 0, y: 30, duration: 1.2 }, '-=0.8')
        .from('.hero-actions > *', { opacity: 0, y: 30, duration: 1.2, stagger: 0.08 }, '<0.1')
        .from('.hero-points li', { opacity: 0, x: -16, duration: 1, stagger: 0.07 }, '<0.15')
        .from('.hero-visual .globe', { scale: 0.7, opacity: 0, rotate: -12, duration: 2.2, ease: 'expo.out' }, 0.1)
        .from('.float-card', { opacity: 0, y: 50, scale: 0.92, duration: 1.4, stagger: 0.12 }, 0.8)
        .from('.hero-foot > *', { opacity: 0, y: 16, duration: 1, stagger: 0.08 }, 1)
        .from('.flight-path', { drawSVG: '0%', duration: 2.6, ease: 'power2.inOut' }, 0.4)

      // a little plane keeps flying the route
      const loops = [
        gsap.to('.flight-plane', {
          motionPath: { path: '.flight-path', align: '.flight-path', alignOrigin: [0.5, 0.5], autoRotate: true },
          duration: 9,
          ease: 'none',
          repeat: -1,
          delay: intro.delay + 1.2,
        }),
      ]
      gsap.from('.flight-plane', { opacity: 0, duration: 0.6, delay: intro.delay + 1.2 })

      // gentle bob on yPercent so it never fights the mouse parallax (which owns x/y)
      gsap.utils.toArray('.float-card').forEach((c, i) => {
        loops.push(gsap.to(c, { yPercent: i % 2 ? 8 : -8, duration: 3 + i * 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 + i * 0.3 }))
      })

      // endless loops only run while the hero is on screen
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => loops.forEach((t) => (self.isActive ? t.resume() : t.pause())),
      })

      gsap.to('.hero-copy', {
        yPercent: -12,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-visual', {
        yPercent: 10,
        scale: 0.94,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      })

      if (finePointer()) {
        // one reusable tween per layer instead of new tweens on every mouse move
        const layers = gsap.utils.toArray('[data-depth]').map((l) => ({
          d: parseFloat(l.dataset.depth),
          x: gsap.quickTo(l, 'x', { duration: 1.4, ease: 'power3.out' }),
          y: gsap.quickTo(l, 'y', { duration: 1.4, ease: 'power3.out' }),
        }))
        const move = (e) => {
          const x = e.clientX / window.innerWidth - 0.5
          const y = e.clientY / window.innerHeight - 0.5
          for (const l of layers) {
            l.x(x * l.d)
            l.y(y * l.d)
          }
        }
        window.addEventListener('mousemove', move)
        return () => window.removeEventListener('mousemove', move)
      }
    },
    { scope: ref, dependencies: [ready] }
  )

  return (
    <section className={`hero ${ready ? '' : 'is-waiting'}`} ref={ref}>
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-glow g1" />
        <div className="hero-glow g2" />
        <svg className="flight" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <path className="flight-path" d="M-60 820 C 260 860 420 560 700 600 S 1100 380 1180 250 S 1380 60 1520 40" />
          <g className="flight-plane">
            <path d={PLANE} transform="translate(-14 -14) scale(1.15) rotate(90 12 12)" />
          </g>
        </svg>
      </div>

      <div className="container hero-inner">
        <div className="hero-copy">
          <Eyebrow className="hero-eyebrow" noscramble>
            Immigration &amp; Visa Services · New Delhi
          </Eyebrow>
          <h1 className="hero-title display">
            Passports &amp; visas, <em>handled with precision.</em>
          </h1>
          <p className="hero-sub lead">
            For students, families and business travellers.
          </p>
          <div className="hero-actions">
            <Button to="/contact">Book a consultation</Button>
            <Button to="/services" variant="ghost">
              Explore services
            </Button>
          </div>
          <ul className="hero-points">
            {['Tatkaal passports', 'Visa file review', 'Study abroad'].map((p) => (
              <li key={p}>
                <Icon name="check" size={14} stroke={2.2} />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-visual">
          <div data-depth="-14" className="globe-layer">
            <Globe />
          </div>

          <div className="float-card fc-visa" data-depth="26">
            <div className="fc-row">
              <span className="fc-icon">
                <Icon name="stamp" size={18} />
              </span>
              <div>
                <small>Schengen · Type C</small>
                <strong>Visa approved</strong>
              </div>
              <span className="fc-chip">
                <Icon name="check" size={12} stroke={2.6} /> Done
              </span>
            </div>
            <div className="fc-progress">
              <i />
            </div>
            <div className="fc-steps">
              <span>Checklist</span>
              <span>Filing</span>
              <span>Biometrics</span>
              <span>Stamped</span>
            </div>
          </div>

          <div className="float-card fc-ticket" data-depth="38">
            <div className="tk-main">
              <div>
                <small>From</small>
                <strong>DEL</strong>
                <span>New Delhi</span>
              </div>
              <div className="tk-plane">
                <i />
                <Icon name="plane" size={16} />
                <i />
              </div>
              <div className="tk-right">
                <small>To</small>
                <strong>YYZ</strong>
                <span>Toronto</span>
              </div>
            </div>
            <div className="tk-foot">
              <span>Study Permit</span>
              <span>Gate · Ready</span>
            </div>
          </div>

          <div className="float-card fc-pass" data-depth="18">
            <span className="fc-icon dark">
              <Icon name="passport" size={18} />
            </span>
            <div>
              <small>Express renewal</small>
              <strong>Filed in one visit</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="container hero-foot">
        <div className="scroll-hint">
          <span className="scroll-line" />
          Scroll to explore
        </div>
        <span className="hero-foot-meta">Yamuna Vihar, Delhi · Mon – Fri, 09:00 – 17:00</span>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Airplane-window reveal                                                     */
/* -------------------------------------------------------------------------- */

function WindowReveal() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const stage = ref.current
      const mask = stage.querySelector('.wr-mask')
      const size = () => {
        const w = window.innerWidth < 768 ? 150 : window.innerWidth < 1280 ? 210 : 240
        return { w, h: w * 1.42 }
      }
      const startClip = () => {
        const { w, h } = size()
        const x = (stage.clientWidth - w) / 2
        const y = (stage.clientHeight - h) / 2
        return `inset(${y}px ${x}px ${y}px ${x}px round ${w / 2}px)`
      }
      // rebuilt per breakpoint: the flanking words fly sideways on desktop, vertically on mobile
      const mm = gsap.matchMedia()
      mm.add({ desktop: '(min-width: 1024px)', mobile: '(max-width: 1023px)' }, (ctx) => {
      const { desktop } = ctx.conditions
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: stage, start: 'top top', end: '+=170%', pin: true, scrub: 0.8, invalidateOnRefresh: true },
      })
      tl.fromTo(mask, { clipPath: startClip }, { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 1, ease: 'power2.inOut' })
        .fromTo('.wr-mask img', { scale: 1.6 }, { scale: 1, duration: 1.1, ease: 'power2.inOut' }, 0)
        .fromTo('.wr-frame', { scale: 1, opacity: 1 }, { scale: 4, opacity: 0, duration: 0.6, ease: 'power2.in' }, 0)
        .to('.wr-word.l', desktop ? { xPercent: -140, opacity: 0, duration: 0.7 } : { yPercent: -160, opacity: 0, duration: 0.7 }, 0)
        .to('.wr-word.r', desktop ? { xPercent: 140, opacity: 0, duration: 0.7 } : { yPercent: 160, opacity: 0, duration: 0.7 }, 0)
        .to('.wr-hint', { opacity: 0, duration: 0.2 }, 0)
        .fromTo('.wr-shade', { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.75)
        .fromTo('.wr-copy .eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 0.8)
        .fromTo('.wr-copy .wr-l > span', { yPercent: 110 }, { yPercent: 0, stagger: 0.07, duration: 0.45, ease: 'power3.out' }, 0.85)
        .fromTo('.wr-chips > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.3 }, 1.1)
        .to({}, { duration: 0.35 })
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <section className="wr" ref={ref}>
      <div className="wr-words" aria-hidden="true">
        <span className="wr-word l">Window</span>
        <span className="wr-gap" />
        <span className="wr-word r">
          <em>seat.</em>
        </span>
      </div>
      <div className="wr-mask">
        <img
          src={photoUrl(photos.wingClouds, 1400)}
          srcSet={[700, 1100, 1400, 2000].map((w) => `${photoUrl(photos.wingClouds, w)} ${w}w`).join(', ')}
          sizes="100vw"
          alt="View of an aircraft wing above the clouds"
          loading="lazy"
          decoding="async"
        />
        <div className="wr-shade" />
        <div className="container wr-copy">
          <Eyebrow light noscramble>
            Above the clouds
          </Eyebrow>
          <p className="wr-title">
            <span className="wr-l">
              <span>From a window seat</span>
            </span>
            <span className="wr-l">
              <span>to a new life abroad —</span>
            </span>
            <span className="wr-l">
              <span>
                <em>we handle everything in between.</em>
              </span>
            </span>
          </p>
          <div className="wr-chips">
            <span>Visas</span>
            <span>Passports</span>
            <span>Flights &amp; hotels</span>
            <span>Travel insurance</span>
            <span>Study abroad</span>
            <span>Immigration</span>
            <span>Work placement</span>
          </div>
        </div>
      </div>
      <div className="wr-frame" aria-hidden="true" />
      <div className="wr-hint" aria-hidden="true">
        Keep scrolling
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Intro statement with inline photos                                         */
/* -------------------------------------------------------------------------- */

const STATEMENT = [
  'A Delhi team', { img: photos.indiaGate, alt: 'India Gate, New Delhi' },
  'helping students', { img: photos.graduation, alt: 'Graduates' },
  'and travellers', { img: photos.lounge, alt: 'Business traveller' },
  'cross borders, without the stress.',
]

function Intro() {
  return (
    <section className="section intro">
      <div className="container">
        <div className="intro-grid">
          <Eyebrow data-fade="">About us</Eyebrow>
          <p className="intro-text" data-scrub-words="">
            {STATEMENT.flatMap((part, i) =>
              typeof part === 'string' ? (
                part.split(' ').map((w, k) => (
                  <span className="sw" key={`${i}-${k}`}>
                    {w}{' '}
                  </span>
                ))
              ) : (
                <span className="sw sw-img" key={i}>
                  <img src={photoUrl(part.img, 300, 70)} alt={part.alt} loading="lazy" />
                </span>
              )
            )}
          </p>
        </div>
        <div className="stats" data-stagger="">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-num">
                <span data-counter={s.value}>0</span>
                <em>{s.suffix}</em>
              </div>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
        <div className="intro-link" data-fade="">
          <Link to="/about" className="link-arrow" data-scramble-hover="">
            <span data-scramble-text="">Our story</span> <Icon name="arrow" size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Services rail                                                              */
/* -------------------------------------------------------------------------- */

function ServicesRail() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px)', () => {
        const track = ref.current.querySelector('.rail-track')
        const distance = () => track.scrollWidth - window.innerWidth + parseFloat(getComputedStyle(track).paddingLeft)
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set('.rail-progress i', { scaleX: self.progress }),
          },
        })
        gsap.utils.toArray('.rail-card .rail-photo img').forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: 'none',
              scrollTrigger: { trigger: img.closest('.rail-card'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
            }
          )
        })
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <section className="rail" ref={ref}>
      <div className="container rail-head">
        <div>
          <Eyebrow data-fade="">What we do</Eyebrow>
          <Split as="h2" className="h2" text="Every document, *every destination.*" />
        </div>
        <div className="rail-meta" data-fade="" data-delay="0.15">
          <div className="rail-progress">
            <i />
          </div>
          <span className="swipe-hint">
            Swipe <Icon name="arrow" size={14} />
          </span>
        </div>
      </div>
      <div className="rail-track">
        {services.map((s, i) => (
          <Spotlight as={Link} to={`/contact?topic=${s.id}`} className="rail-card" key={s.id} data-draw="">
            <div className="rail-photo">
              <Img id={s.image} alt={s.title} reveal={false} sizes="(min-width: 1024px) 420px, 82vw" />
              <span className="rail-num">0{i + 1}</span>
              <span className="rail-icon">
                <Icon name={s.icon} size={22} stroke={1.5} />
              </span>
            </div>
            <div className="rail-body">
              <h3>
                <span>{s.title}</span>
              </h3>
              <p>{s.short}</p>
            </div>
            <div className="rail-foot">
              <div className="tags">
                {/* three tags keep every card's photo the same height; the rest collapse into +N */}
                {s.tags.slice(0, 3).map((t) => (
                  <span key={t}>{t}</span>
                ))}
                {s.tags.length > 3 && <span>+{s.tags.length - 3}</span>}
              </div>
              <span className="rail-go" aria-hidden="true">
                <Icon name="arrowUpRight" size={18} />
              </span>
            </div>
          </Spotlight>
        ))}
        <div className="rail-card rail-card-cta beam">
          <Icon name="sparkle" size={30} stroke={1.3} />
          <h3>
            Not sure <em>where to start?</em>
          </h3>
          <p>Tell us your plans. We’ll map the right route.</p>
          <Button to="/contact" variant="light" magnetic={false}>
            Talk to us
          </Button>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Process with sticky imagery                                                */
/* -------------------------------------------------------------------------- */

function Process() {
  const ref = useRef(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      gsap.fromTo(
        '.proc-line i',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.proc-list', start: 'top 60%', end: 'bottom 60%', scrub: true } }
      )
      const steps = gsap.utils.toArray('.proc-step')
      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 62%',
          end: i === steps.length - 1 ? 'bottom top' : 'bottom 62%',
          toggleClass: { targets: step, className: 'is-active' },
          onToggle: (self) => self.isActive && setActive(i),
        })
      })
    },
    { scope: ref }
  )

  return (
    <section className="section process" ref={ref}>
      <div className="container proc-grid">
        <div className="proc-side">
          <div className="proc-sticky">
            <Eyebrow data-fade="">How it works</Eyebrow>
            <Split as="h2" className="h2" text="From first call *to boarding gate.*" />
            <div className="proc-media" aria-hidden="true">
              {process.map((p, i) => (
                <div key={p.title} className={`proc-shot ${i === active ? 'is-on' : ''} ${i < active ? 'is-past' : ''}`}>
                  <img src={photoUrl(p.image, 900)} alt="" loading="lazy" />
                </div>
              ))}
              <span className="proc-media-tag">
                Step 0{active + 1} · {process[active].title}
              </span>
            </div>
            <div data-fade="" data-delay="0.2" className="proc-cta">
              <Button to="/contact">Start step one</Button>
            </div>
          </div>
        </div>
        <div className="proc-list">
          <div className="proc-line">
            <i />
          </div>
          {process.map((p, i) => (
            <div className="proc-step" key={p.title}>
              <span className="proc-dot" />
              <span className="proc-idx">Step 0{i + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <Img id={p.image} alt="" className="proc-thumb" sizes="90vw" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Destinations                                                               */
/* -------------------------------------------------------------------------- */

function Destinations() {
  const ref = useRef(null)
  const [active, setActive] = useState(0)
  const [show, setShow] = useState(false)
  // hover-only preview photos are fetched on desktop after the first hover, never on phones
  const [armed, setArmed] = useState(false)

  useGSAP(
    () => {
      if (!finePointer()) return
      // start fetching the preview photos shortly before the list scrolls into view
      ScrollTrigger.create({ trigger: ref.current, start: 'top 160%', once: true, onEnter: () => setArmed(true) })
      const card = ref.current.querySelector('.dest-preview')
      const list = ref.current.querySelector('.dest-list')
      const xTo = gsap.quickTo(card, 'x', { duration: 0.7, ease: 'power3' })
      const yTo = gsap.quickTo(card, 'y', { duration: 0.7, ease: 'power3' })
      const rTo = gsap.quickTo(card, 'rotate', { duration: 0.9, ease: 'power3' })
      let lastX = 0
      const move = (e) => {
        const r = list.getBoundingClientRect()
        xTo(e.clientX - r.left)
        yTo(e.clientY - r.top)
        rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6))
        lastX = e.clientX
      }
      list.addEventListener('mousemove', move)
      return () => list.removeEventListener('mousemove', move)
    },
    { scope: ref }
  )

  const enter = (i, e) => {
    setActive(i)
    setShow(true)
    const code = e.currentTarget.querySelector('.dest-code')
    gsap.to(code, { duration: 0.6, scrambleText: { text: destinations[i].code, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' }, ease: 'none' })
  }

  return (
    <section className="section dest" ref={ref}>
      <div className="container">
        <div className="section-head split-head">
          <div>
            <Eyebrow data-fade="">Destinations</Eyebrow>
            <Split as="h2" className="h2" text="Where we *take you.*" />
          </div>
        </div>

        <div className="dest-board-head" aria-hidden="true">
          <span>Code</span>
          <span>Destination</span>
          <span>Popular routes</span>
          <span>Status</span>
        </div>

        <div className="dest-list" onMouseLeave={() => setShow(false)} onMouseEnter={() => !armed && finePointer() && setArmed(true)}>
          <div className={`dest-preview ${show ? 'is-visible' : ''}`} aria-hidden="true">
            <div className="dp-inner">
              {armed &&
                destinations.map((d, i) => (
                <img key={d.code} src={photoUrl(d.image, 600)} alt="" decoding="async" className={i === active ? 'is-on' : ''} />
              ))}
              <div className="dp-stamp">
                <span>Visa</span>
                <strong>{destinations[active].code}</strong>
                <span>Approved</span>
              </div>
              <div className="dp-foot">
                <small>{destinations[active].city}</small>
                <p>{destinations[active].name}</p>
              </div>
            </div>
          </div>

          {destinations.map((x, i) => (
            <Link to="/contact" className="dest-row" key={x.code} onMouseEnter={(e) => enter(i, e)} data-fade="">
              <span className="dest-code">{x.code}</span>
              <span className="dest-thumb">
                <img src={photoUrl(x.image, 200, 70)} alt="" loading="lazy" />
              </span>
              <span className="dest-name">{x.name}</span>
              <span className="dest-types">{x.types}</span>
              <span className="dest-status">
                <i /> Open
              </span>
              <span className="dest-arrow">
                <Icon name="arrowUpRight" size={20} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Photo ribbon                                                               */
/* -------------------------------------------------------------------------- */

function Ribbon() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const rows = gsap.utils.toArray('.ribbon-row')
      rows.forEach((row, i) => {
        gsap.fromTo(
          row,
          { xPercent: i % 2 ? -22 : 0 },
          {
            xPercent: i % 2 ? 0 : -22,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          }
        )
      })
    },
    { scope: ref }
  )

  return (
    <section className="section ribbon" ref={ref}>
      <div className="container section-head center">
        <Eyebrow data-fade="">The world awaits</Eyebrow>
        <Split as="h2" className="h2" text="The world, *one visa away.*" />
      </div>
      <div className="ribbon-rows">
        {ribbon.map((row, ri) => (
          <div className="ribbon-row" key={ri}>
            {[...row, ...row].map((p, i) => (
              <figure className="rb-card" key={`${p.code}${i}`}>
                <Img id={p.id} alt={p.label} reveal={false} sizes="(min-width: 1024px) 360px, 60vw" />
                <figcaption>
                  <span className="rb-code">{p.code}</span>
                  <span>{p.label}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Testimonials                                                               */
/* -------------------------------------------------------------------------- */

function Testimonials() {
  const [i, setI] = useState(0)
  const ref = useRef(null)
  const n = testimonials.length

  useEffect(() => {
    const t = setTimeout(() => setI((v) => (v + 1) % n), 7000)
    return () => clearTimeout(t)
  }, [i, n])

  useGSAP(
    () => {
      gsap.fromTo('.tq-quote .w > span', { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.012, ease: 'expo.out' })
      gsap.fromTo('.tq-meta', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.3 })
    },
    { scope: ref, dependencies: [i] }
  )

  const t = testimonials[i]

  return (
    <section className="section testi" ref={ref}>
      <div className="container testi-grid">
        <div className="testi-side">
          <Eyebrow data-fade="">Client stories</Eyebrow>
          <Split as="h2" className="h2" text="Trusted on *every journey.*" />
          <div className="testi-nav" data-fade="" data-delay="0.15">
            <button onClick={() => setI((i - 1 + n) % n)} aria-label="Previous testimonial">
              <Icon name="arrowLeft" size={18} />
            </button>
            <button onClick={() => setI((i + 1) % n)} aria-label="Next testimonial">
              <Icon name="arrow" size={18} />
            </button>
            <span className="testi-count">
              0{i + 1} <i /> 0{n}
            </span>
          </div>
        </div>
        <figure className="testi-card" data-fade="">
          <span className="testi-mark" aria-hidden="true">
            “
          </span>
          <blockquote className="tq-quote" key={i}>
            {t.quote.split(' ').map((w, k) => (
              <span key={k}>
                <span className="w">
                  <span>{w}</span>
                </span>{' '}
              </span>
            ))}
          </blockquote>
          <figcaption className="tq-meta">
            <span className="tq-avatar">{t.name.charAt(0)}</span>
            <span>
              <strong>{t.name}</strong>
              <small>{t.role}</small>
            </span>
          </figcaption>
          <div className="testi-bar" key={`b${i}`}>
            <i />
          </div>
        </figure>
      </div>
    </section>
  )
}

export default function Home() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <div ref={ref}>
      <Hero />
      <Marquee items={marquee} className="hero-marquee" />
      <WindowReveal />
      {/* below the first screen: mounted progressively in idle time (see Deferred) */}
      <Deferred>
        <Intro />
      </Deferred>
      <Deferred>
        <ServicesRail />
      </Deferred>
      <Deferred minHeight="200vh">
        <Process />
      </Deferred>
      <Deferred minHeight="120vh">
        <Destinations />
      </Deferred>
      <Deferred>
        <Ribbon />
      </Deferred>
      <Deferred minHeight="80vh">
        <Testimonials />
      </Deferred>
      <Deferred minHeight="80vh">
        <CTA />
      </Deferred>
    </div>
  )
}
