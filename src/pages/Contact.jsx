import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useReveal from '../hooks/useReveal'
import { FORMSPREE, company, countries, hours, services, waLink } from '../data/site'
import Icon from '../components/Icon'
import Button from '../components/Button'
import { Eyebrow, PageHero, Spotlight } from '../components/Sections'

function useOpenStatus() {
  return useMemo(() => {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
    const idx = (now.getDay() + 6) % 7 // Monday = 0
    const today = hours[idx]
    const mins = now.getHours() * 60 + now.getMinutes()
    const toMin = (t) => (t ? parseInt(t.slice(0, 2)) * 60 + parseInt(t.slice(3)) : 0)
    const open = today.open && mins >= toMin(today.open) && mins < toMin(today.close)
    return { idx, open }
  }, [])
}

const fmt = (t) => {
  const [h, m] = t.split(':').map(Number)
  return `${String(((h + 11) % 12) + 1).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`
}

export default function Contact() {
  const ref = useRef(null)
  useReveal(ref)
  const [params] = useSearchParams()
  const { idx, open } = useOpenStatus()

  const options = [
    ...services.map((s) => ({ value: s.id, label: s.title })),
    { value: 'other', label: 'Something else' },
  ]
  const initial = params.get('service') || params.get('topic') || ''

  const [form, setForm] = useState({
    name: '',
    phone: '',
    service: options.some((o) => o.value === initial) ? initial : '',
    destination: '',
    date: '',
    message: '',
  })
  const [errors, setErrors] = useState({})

  // a new ?service= link while already on this page (same route, no remount) should still preselect
  useEffect(() => {
    if (options.some((o) => o.value === initial)) setForm((f) => ({ ...f, service: initial }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial])

  // arriving from a service card: bring the form into view once the page has settled
  const formRef = useRef(null)
  useEffect(() => {
    if (!initial) return
    // wait out the route transition and, on a fresh visit, the intro screen (which pauses scrolling)
    let tries = 0
    const t = setInterval(() => {
      const el = formRef.current
      const lenis = window.__lenis
      const ready = el && !document.querySelector('.preloader') && !(lenis && lenis.isStopped)
      if (!ready && ++tries < 30) return
      clearInterval(t)
      if (!el) return
      if (lenis) lenis.scrollTo(el, { offset: -110, duration: 1.2 })
      else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
    return () => clearInterval(t)
  }, [initial])

  // today in local time, so the date picker can't offer past days
  const today = useMemo(() => {
    const d = new Date()
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
  }, [])
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)
  // kept for the "also send on WhatsApp" button on the thank-you screen
  const waText = useRef('')

  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (form.name.trim().length < 2) er.name = 'Please enter your name'
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) er.phone = 'Please enter a valid phone number'
    if (!form.service) er.service = 'Please choose a service'
    if (form.date && form.date < today) er.date = 'Please pick today or a later date'
    setErrors(er)
    if (Object.keys(er).length) return
    const label = options.find((o) => o.value === form.service)?.label
    const lines = [
      'Hello IBM Consultancy, I would like to book a consultation.',
      '',
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Service: ${label}`,
      form.destination ? `Destination: ${form.destination}` : null,
      form.date
        ? `Preferred date: ${new Date(`${form.date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}`
        : null,
      form.message ? `Message: ${form.message}` : null,
    ].filter((l) => l !== null)
    waText.current = lines.join('\n')
    setSending(true)
    setFailed(false)
    try {
      const res = await fetch(FORMSPREE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Consultation request: ${label} (${form.name})`,
          name: form.name,
          phone: form.phone,
          service: label,
          destination: form.destination || '—',
          preferred_date: form.date || '—',
          message: form.message || '—',
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setSent(true)
    } catch {
      setFailed(true)
    } finally {
      setSending(false)
    }
  }

  // Google Maps is ~400KB of third-party code: only load it as the map nears the screen
  const mapRef = useRef(null)
  const [mapOn, setMapOn] = useState(false)
  useEffect(() => {
    const el = mapRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      setMapOn(true)
      io.disconnect()
    }, { rootMargin: '300px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(company.mapQuery)}&z=15&output=embed`

  return (
    <div ref={ref} className="contact-page">
      {/* dimmed, pre-blurred Delhi map behind the page, centred on the office */}
      <div className="contact-bg" aria-hidden="true">
        <img src="/contact-map.webp" alt="" width="1600" height="1000" decoding="async" fetchpriority="low" />
      </div>
      <PageHero
        eyebrow="Contact & booking"
        title="Let’s plan *your next move.*"
        text="We usually reply on WhatsApp within working hours."
      >
        {/* the background map is OpenStreetMap data, which requires this credit */}
        <small className="map-credit">Background map © OpenStreetMap contributors</small>
      </PageHero>

      <section className="section contact">
        <div className="container contact-grid">
          <div className="form-card" data-fade="">
            {sent ? (
              <div className="form-done">
                <span className="done-icon">
                  <Icon name="check" size={30} stroke={2} />
                </span>
                <h3 className="h3">Request received.</h3>
                <p>
                  Thanks, {form.name.split(' ')[0]}. We’ll get back to you shortly to confirm your slot. Need it sooner? Call{' '}
                  <a href={company.phoneHref}>{company.phone}</a> or email <a href={`mailto:${company.email}`}>{company.email}</a>.
                </p>
                <div className="form-done-actions">
                  <Button href={waLink(waText.current)} icon="whatsapp" magnetic={false}>
                    Also send on WhatsApp
                  </Button>
                  <Button variant="ghost" icon="arrowLeft" onClick={() => setSent(false)} magnetic={false}>
                    Back to form
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate ref={formRef}>
                <div className="form-head">
                  <h2 className="h3">Book a consultation</h2>
                  <p>Fill in a few details and we’ll confirm your slot on WhatsApp.</p>
                </div>
                <div className="fields">
                  <Field label="Full name" error={errors.name}>
                    <input value={form.name} onChange={set('name')} placeholder=" " autoComplete="name" />
                  </Field>
                  <Field label="Phone / WhatsApp" error={errors.phone}>
                    <input value={form.phone} onChange={set('phone')} placeholder=" " inputMode="tel" autoComplete="tel" />
                  </Field>
                  <Field label="Service" error={errors.service} wide select filled={!!form.service}>
                    <select value={form.service} onChange={set('service')}>
                      <option value="" disabled hidden />
                      {options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <CountryField value={form.destination} onChange={(v) => setForm((f) => ({ ...f, destination: v }))} />
                  <Field label="Preferred date" filled error={errors.date}>
                    <input type="date" min={today} value={form.date} onChange={set('date')} />
                  </Field>
                  <Field label="Tell us about your travel plans (optional)" wide>
                    <textarea rows={4} value={form.message} onChange={set('message')} placeholder=" " />
                  </Field>
                </div>
                <div className="form-foot">
                  <Button type="submit" magnetic={false} disabled={sending}>
                    {sending ? 'Sending…' : 'Send request'}
                  </Button>
                  <span className="form-note">
                    <Icon name="shield" size={15} /> Your details are only used to arrange your consultation.
                  </span>
                  {failed && (
                    <p className="form-fail" role="alert">
                      Couldn’t send just now. Please try again, or reach us on{' '}
                      <a href={waLink()} target="_blank" rel="noreferrer">
                        WhatsApp
                      </a>{' '}
                      or <a href={`mailto:${company.email}`}>{company.email}</a>.
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>

          <aside className="contact-side">
            <div className="contact-cards" data-stagger="">
              <Spotlight as="a" href={company.phoneHref} className="c-card" data-draw="">
                <span className="c-icon">
                  <Icon name="phone" size={20} />
                </span>
                <span>
                  <small>Call us</small>
                  <strong>{company.phone}</strong>
                </span>
                <Icon name="arrowUpRight" size={18} className="c-go" />
              </Spotlight>
              <Spotlight as="a" href={waLink()} target="_blank" rel="noreferrer" className="c-card" data-draw="">
                <span className="c-icon wa">
                  <Icon name="whatsapp" size={20} />
                </span>
                <span>
                  <small>Message us</small>
                  <strong>WhatsApp chat</strong>
                </span>
                <Icon name="arrowUpRight" size={18} className="c-go" />
              </Spotlight>
              <Spotlight as="a" href={`mailto:${company.email}`} className="c-card" data-draw="">
                <span className="c-icon">
                  <Icon name="mail" size={20} />
                </span>
                <span>
                  <small>Email us</small>
                  <strong>{company.email}</strong>
                </span>
                <Icon name="arrowUpRight" size={18} className="c-go" />
              </Spotlight>
              <Spotlight
                as="a"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.mapQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="c-card"
                data-draw=""
              >
                <span className="c-icon">
                  <Icon name="pin" size={20} />
                </span>
                <span>
                  <small>Visit us</small>
                  <strong>{company.address[0]}</strong>
                  <em>{company.address[1]}</em>
                </span>
                <Icon name="arrowUpRight" size={18} className="c-go" />
              </Spotlight>
            </div>

            <div className="hours beam" data-fade="">
              <div className="hours-head">
                <h3>Hours</h3>
                <span className={`status ${open ? 'is-open' : ''}`}>
                  <i /> {open ? 'Open now' : 'Closed now'}
                </span>
              </div>
              <ul>
                {hours.map((h, i) => (
                  <li key={h.day} className={i === idx ? 'is-today' : ''}>
                    <span>{h.day}</span>
                    <span>{h.open ? `${fmt(h.open)} – ${fmt(h.close)}` : h.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <div className="container">
          <div className="map" data-clip="" ref={mapRef}>
            <iframe title="IBM Consultancy location map" src={mapOn ? mapSrc : undefined} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <div className="map-pin-card">
              <Eyebrow>IBM Consultancy</Eyebrow>
              <p>
                {company.address[0]}, {company.address[1]}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Destination: a dropdown of the countries we serve that also accepts any typed country.
function CountryField({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [hi, setHi] = useState(-1)
  const q = value.trim().toLowerCase()
  const exact = countries.some((c) => c.toLowerCase() === q)
  const list = q && !exact ? countries.filter((c) => c.toLowerCase().includes(q)) : countries
  const pick = (c) => {
    onChange(c)
    setOpen(false)
    setHi(-1)
  }
  const onKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setHi((h) => Math.min(h + 1, list.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHi((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' && open && hi >= 0) {
      e.preventDefault()
      pick(list[hi])
    } else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div className={`field is-select country-field ${open ? 'is-open' : ''}`}>
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
          setHi(-1)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKey}
        placeholder=" "
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls="country-list"
        aria-label="Destination country"
      />
      <span className="field-label">Destination country (optional)</span>
      <button
        type="button"
        className="country-toggle"
        tabIndex={-1}
        aria-label="Show countries"
        onMouseDown={(e) => {
          e.preventDefault()
          const input = e.currentTarget.parentElement.querySelector('input')
          if (open) setOpen(false)
          else input.focus()
        }}
      >
        <Icon name="arrow" size={16} className="field-caret" />
      </button>
      {open && list.length > 0 && (
        <ul className="country-list" id="country-list" role="listbox" data-lenis-prevent="">
          {list.map((c, i) => (
            <li
              key={c}
              role="option"
              aria-selected={c === value}
              className={`${i === hi ? 'is-hi' : ''} ${c === value ? 'is-picked' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault()
                pick(c)
              }}
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Field({ label, error, wide, select, filled, children }) {
  return (
    <label className={`field ${wide ? 'wide' : ''} ${select ? 'is-select' : ''} ${filled ? 'is-filled' : ''} ${error ? 'has-error' : ''}`}>
      {children}
      <span className="field-label">{label}</span>
      {select && <Icon name="arrow" size={16} className="field-caret" />}
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}
