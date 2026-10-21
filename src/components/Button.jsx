import { Link } from 'react-router-dom'
import { gsap } from '../lib/gsap'
import Icon from './Icon'
import Magnetic from './Magnetic'

// Ink ripple from the exact press point.
const ripple = (e) => {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const dot = document.createElement('span')
  dot.className = 'btn-ripple'
  const size = Math.max(r.width, r.height) * 2.2
  Object.assign(dot.style, { width: `${size}px`, height: `${size}px`, left: `${e.clientX - r.left - size / 2}px`, top: `${e.clientY - r.top - size / 2}px` })
  el.appendChild(dot)
  gsap.fromTo(dot, { scale: 0, opacity: 0.35 }, { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => dot.remove() })
}

// Pill button: liquid fill sweep, rolling label, sliding arrow, press ripple.
// Renders a router Link, an <a>, or a <button>.
export default function Button({ to, href, children, variant = 'primary', icon = 'arrow', magnetic = true, className = '', wrapClassName = '', onPointerDown, ...rest }) {
  const label =
    typeof children === 'string' ? (
      <span className="btn-label roll">
        <span data-text={children}>{children}</span>
      </span>
    ) : (
      <span className="btn-label">{children}</span>
    )
  const inner = (
    <>
      <span className="btn-fill" />
      {label}
      {icon && (
        <span className="btn-icon">
          <Icon name={icon} size={16} stroke={1.8} />
          <Icon name={icon} size={16} stroke={1.8} />
        </span>
      )}
    </>
  )
  const cls = `btn btn-${variant} ${className}`
  const down = (e) => {
    ripple(e)
    onPointerDown?.(e)
  }
  let el
  if (to) el = <Link to={to} className={cls} onPointerDown={down} {...rest}>{inner}</Link>
  else if (href) el = <a href={href} className={cls} onPointerDown={down} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" {...rest}>{inner}</a>
  else el = <button className={cls} onPointerDown={down} {...rest}>{inner}</button>
  return magnetic ? <Magnetic strength={0.25} className={wrapClassName}>{el}</Magnetic> : el
}
