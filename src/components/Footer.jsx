import { Link } from 'react-router-dom'
import { company, nav, waLink } from '../data/site'
import Icon from './Icon'

// Compact footer: brand, page links, contact, one legal line.
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <Link to="/" className="footer-brand" aria-label={`${company.name} — home`}>
            <img src="/emblem.webp" alt="" width="82" height="40" loading="lazy" decoding="async" />
            <span>
              <strong>IBM</strong> Consultancy
            </span>
          </Link>

          <nav className="footer-links" aria-label="Footer">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} data-scramble-hover="">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="footer-contact">
            <a href={company.phoneHref}>
              <Icon name="phone" size={15} />
              {company.phone}
            </a>
            <a href={waLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="footer-wa">
              <Icon name="whatsapp" size={17} />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {year} {company.name} · CEO: {company.ceo}
          </span>
          <span className="footer-address">{company.address.join(', ')}</span>
          <button className="to-top" onClick={() => window.__lenis?.scrollTo(0, { duration: 1.4 })}>
            Top <Icon name="arrow" size={13} className="rot-up" />
          </button>
        </div>
      </div>
    </footer>
  )
}
