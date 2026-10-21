import { useRef } from 'react'
import useReveal from '../hooks/useReveal'
import { company, photos, stats } from '../data/site'
import Icon from '../components/Icon'
import Split from '../components/Split'
import Button from '../components/Button'
import Marquee from '../components/Marquee'
import Img from '../components/Img'
import Deferred from '../components/Deferred'
import { CTA, Eyebrow, PageHero, Spotlight } from '../components/Sections'

const values = [
  { icon: 'eye', title: 'Precision', text: 'Every form, date and signature checked twice. Small errors cause big delays — we don’t let them through.' },
  { icon: 'shield', title: 'Transparency', text: 'Fixed consultation fees, honest eligibility advice and no promises we can’t keep.' },
  { icon: 'bolt', title: 'Speed', text: 'Express and Tatkaal workflows built for travellers who can’t afford to wait.' },
  { icon: 'heart', title: 'Care', text: 'One dedicated contact who knows your file — and answers when you call.' },
]

const reasons = [
  ['Embassy-ready files', 'Applications assembled to each embassy’s published requirements and our own review checklist.'],
  ['One point of contact', 'A dedicated case manager from first call to passport collection — no call-centre hand-offs.'],
  ['Clear, fixed fees', 'Know the consultation cost upfront, before any work begins.'],
  ['In person or remote', 'Visit our Yamuna Vihar office or consult over phone and WhatsApp — whichever suits you.'],
]

export default function About() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="About IBM Consultancy"
        title="Clarity at *every border.*"
        text="A Delhi-based immigration and visa consultancy built on a simple belief: travel paperwork should feel effortless, not overwhelming."
        image={photos.indiaGate}
        imageAlt="India Gate, New Delhi, at dusk"
      />

      <section className="section story">
        <div className="container story-grid">
          <div className="story-visual" data-colorize="">
            <Img id={photos.consultation} alt="A consultant meeting a client" parallax className="story-photo" sizes="(min-width: 1024px) 45vw, 92vw" />
            <div className="story-logo" data-speed="-25">
              <img
                src="/logo-320.webp"
                srcSet="/logo-320.webp 320w, /logo-640.webp 640w"
                sizes="(min-width: 1024px) 20vw, 40vw"
                alt="IBM Consultancy — Immigration & Visa Services logo"
                width="640"
                height="570"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="story-tag">
              <Icon name="pin" size={16} /> Yamuna Vihar, Delhi
            </div>
          </div>
          <div className="story-copy">
            <Eyebrow data-fade="">Our story</Eyebrow>
            <Split as="h2" className="h2" text="Streamlined travel *document assistance.*" />
            <p className="lead" data-fade="">
              IBM Consultancy offers comprehensive passport and visa services tailored for expatriates, students and
              business travellers. Our team ensures a hassle-free application process, saving you time and effort.
            </p>
            <p data-fade="" data-delay="0.05">
              We started with a simple observation: most visa delays and rejections come down to avoidable mistakes —
              a missing document, an inconsistent date, a cover letter that doesn’t answer the right question. So we
              built our practice around getting the details right, explaining every step in plain language, and staying
              reachable throughout.
            </p>
            <p data-fade="" data-delay="0.1">
              Today we help travellers with everything from Tatkaal passport renewals to student visas and permanent
              residency pathways — handling your travel documentation with precision and efficiency.
            </p>
          </div>
        </div>
      </section>

      <Deferred minHeight="300vh">
        <Marquee items={['Precision', 'Transparency', 'Speed', 'Care', 'Integrity', 'Clarity']} reverse className="values-marquee" />

        <section className="section values">
          <div className="container">
            <div className="section-head center">
              <Eyebrow data-fade="">Our values</Eyebrow>
              <Split as="h2" className="h2" text="What we *stand for.*" />
            </div>
            <div className="values-grid" data-stagger="">
              {values.map((v, i) => (
                <Spotlight className="value-card" key={v.title} data-draw="">
                  <span className="value-num">0{i + 1}</span>
                  <span className="value-icon">
                    <Icon name={v.icon} size={26} stroke={1.4} />
                  </span>
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </Spotlight>
              ))}
            </div>
          </div>
        </section>

        <section className="section why">
          <div className="container why-grid">
            <div className="why-side">
              <Eyebrow data-fade="">Why choose us</Eyebrow>
              <Split as="h2" className="h2" text="The details are *the difference.*" />
              <Img id={photos.signing} alt="Documents being signed" className="why-photo" data-colorize="" parallax sizes="(min-width: 1024px) 40vw, 92vw" />
              <div className="why-stats" data-stagger="">
                {stats.slice(0, 2).map((s) => (
                  <div key={s.label} className="stat">
                    <div className="stat-num">
                      <span data-counter={s.value}>0</span>
                      <em>{s.suffix}</em>
                    </div>
                    <p>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <ol className="why-list">
              {reasons.map(([t, d], i) => (
                <li key={t} data-fade="" data-delay={i * 0.05}>
                  <span className="why-idx">0{i + 1}</span>
                  <div>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section visit">
          <div className="container">
            <div className="visit-card" data-fade="" data-colorize="">
              <Img id={photos.handoff} alt="A passport being handed over" className="visit-photo" sizes="(min-width: 1024px) 40vw, 92vw" />
              <div className="visit-body">
                <Eyebrow>Visit us</Eyebrow>
                <h3 className="h3">Better yet, see us in person.</h3>
                <p>We love meeting our clients — feel free to visit during normal business hours.</p>
                <div className="visit-info">
                  <p>
                    <Icon name="pin" size={18} />
                    <span>
                      {company.address[0]}
                      <br />
                      {company.address[1]}
                    </span>
                  </p>
                  <p>
                    <Icon name="clock" size={18} />
                    <span>Mon – Fri · 09:00 – 17:00</span>
                  </p>
                </div>
                <Button to="/contact" variant="primary">
                  Get directions
                </Button>
              </div>
            </div>
          </div>
        </section>

      </Deferred>
      <Deferred minHeight="80vh">
        <CTA />
      </Deferred>
    </div>
  )
}
