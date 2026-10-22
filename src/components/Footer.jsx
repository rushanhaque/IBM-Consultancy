import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { company, nav, services, waLink } from '../data/site'
import Icon from './Icon'

// Footer: brand + CEO, page links, services, contact details, one legal line.
export default function Footer() {
  const year = new Date().getFullYear()
  const [dev, setDev] = useState(false)

  useEffect(() => {
    if (!dev) return
    const onKey = (e) => e.key === 'Escape' && setDev(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dev])

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <Link to="/" className="footer-brand" aria-label={`${company.name} — home`}>
              <img src="/emblem.webp" alt="" width="82" height="40" loading="lazy" decoding="async" />
              <span>
                <strong>IBM</strong> Consultancy
              </span>
            </Link>
            <p>Passports, visas, study abroad and travel, handled from our Delhi office.</p>
            <p className="footer-ceo">CEO: {company.ceo}</p>
          </div>

          <nav className="footer-col" aria-label="Footer">
            <h4>Pages</h4>
            <ul>
              {nav.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} data-scramble-hover="">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              {services.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <Link to={`/services#${s.id}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col footer-contact">
            <h4>Contact</h4>
            <ul>
              <li>
                <Icon name="phone" size={15} />
                <a href={company.phoneHref}>{company.phone}</a>
              </li>
              <li>
                <Icon name="whatsapp" size={15} />
                <a href={waLink()} target="_blank" rel="noreferrer">
                  WhatsApp us
                </a>
              </li>
              <li>
                <Icon name="pin" size={15} />
                <span>
                  {company.address[0]}
                  <br />
                  {company.address[1]}
                </span>
              </li>
              <li>
                <Icon name="clock" size={15} />
                <span>Mon – Fri · 09:00 – 17:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {year} {company.name}. All rights reserved.
          </span>
          <div className="footer-actions">
            <button className="dev-btn" onClick={() => setDev(true)}>
              Contact developer
            </button>
            <button className="to-top" onClick={() => window.__lenis?.scrollTo(0, { duration: 1.4 })}>
              Back to top <Icon name="arrow" size={13} className="rot-up" />
            </button>
          </div>
        </div>
      </div>

      {dev && (
        <div className="dev-modal" role="dialog" aria-modal="true" aria-labelledby="dev-title" onClick={() => setDev(false)} data-lenis-prevent="">
          <div className="dev-card" onClick={(e) => e.stopPropagation()}>
            <button className="dev-close" onClick={() => setDev(false)} aria-label="Close">
              <Icon name="plus" size={18} />
            </button>
            <span className="dev-mark" aria-hidden="true">
              <Icon name="sparkle" size={22} stroke={1.4} />
            </span>
            <p className="dev-eyebrow">Website credits</p>
            <h3 id="dev-title">
              Designed &amp; developed by <em>Rushan Haque</em>
            </h3>
            <p>Want a website like this? Let&rsquo;s connect.</p>
            <a className="dev-link" href="https://rushanhaque.in" target="_blank" rel="noreferrer">
              Visit rushanhaque.in <Icon name="arrow" size={15} />
            </a>
          </div>
        </div>
      )}
    </footer>
  )
}
