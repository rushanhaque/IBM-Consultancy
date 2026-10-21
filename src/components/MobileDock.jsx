import { Link, useLocation } from 'react-router-dom'
import { company, waLink } from '../data/site'
import Icon from './Icon'

// Thumb-reach action bar for phones: call, WhatsApp, book.
export default function MobileDock() {
  const { pathname } = useLocation()
  return (
    <nav className="dock" aria-label="Quick actions">
      <a href={company.phoneHref} className="dock-item">
        <Icon name="phone" size={19} />
        <span>Call</span>
      </a>
      <a href={waLink()} target="_blank" rel="noreferrer" className="dock-item dock-wa">
        <Icon name="whatsapp" size={20} />
        <span>WhatsApp</span>
      </a>
      <Link to="/contact" className={`dock-item dock-book ${pathname === '/contact' ? 'is-here' : ''}`}>
        <Icon name="calendar" size={19} />
        <span>Book now</span>
      </Link>
    </nav>
  )
}
