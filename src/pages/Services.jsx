import { useRef } from 'react'
import useReveal from '../hooks/useReveal'
import { Link } from 'react-router-dom'
import { photos, services } from '../data/site'
import { mbbs } from '../data/mbbs'
import Icon from '../components/Icon'
import Button from '../components/Button'
import Img from '../components/Img'
import Deferred from '../components/Deferred'
import { CTA, FAQ, PageHero } from '../components/Sections'

export default function Services() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Our services"
        title="Services built around *your journey.*"
        text="Eight services. One team. Zero paperwork stress."
        image={photos.tarmac}
        imageAlt="Aircraft on an airport apron at dusk"
      >
        <div className="chips">
          {services.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="chip"
              data-draw=""
              onClick={(e) => {
                e.preventDefault()
                window.__lenis?.scrollTo(`#${s.id}`, { offset: -90, duration: 1.4 })
              }}
            >
              <Icon name={s.icon} size={16} />
              {s.title}
            </a>
          ))}
        </div>
      </PageHero>

      <section className="section sv-list">
        <div className="container">
          {services.map((s, i) => (
            <article className={`sv-row ${i % 2 ? 'is-flip' : ''}`} id={s.id} key={s.id}>
              <div className="sv-visual" data-draw="" data-colorize="">
                <Img id={s.image} alt={s.title} parallax sizes="(min-width: 1024px) 45vw, 92vw" className="sv-photo" />
                <span className="sv-big" aria-hidden="true">
                  0{i + 1}
                </span>
                <span className="sv-badge" data-speed="-30">
                  <Icon name={s.icon} size={30} stroke={1.3} />
                </span>
                <div className="sv-tags">
                  {s.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="sv-copy">
                <span className="sv-idx" data-fade="">
                  0{i + 1} / 0{services.length}
                </span>
                <h2 className="h3" data-fade="">
                  {s.title}
                </h2>
                <p className="lead" data-fade="" data-delay="0.05">
                  {s.long}
                </p>
                <ul className="checks" data-stagger="">
                  {s.includes.map((x) => (
                    <li key={x}>
                      <Icon name="check" size={16} stroke={2} />
                      {x}
                    </li>
                  ))}
                </ul>
                {s.id === 'student' && (
                  <p className="sv-mbbs" data-fade="">
                    <strong>MBBS abroad:</strong> {mbbs.map((m) => m.country).join(' · ')}.{' '}
                    <Link to="/mbbs-abroad">See universities &amp; fees</Link>
                  </p>
                )}
                <div data-fade="">
                  <Button to={`/contact?topic=${s.id}`} variant="primary" className="btn-sm">
                    Enquire
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Deferred minHeight="120vh">
        <FAQ />
      </Deferred>
      <Deferred minHeight="80vh">
        <CTA />
      </Deferred>
    </div>
  )
}
