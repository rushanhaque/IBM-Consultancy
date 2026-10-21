import { useEffect, useRef } from 'react'

const RAD = Math.PI / 180
const TAU = Math.PI * 2
const HOME = { name: 'New Delhi', lat: 28.61, lon: 77.21 }
const ROUTES = [
  { name: 'London', lat: 51.5, lon: -0.12 },
  { name: 'Toronto', lat: 43.65, lon: -79.38 },
  { name: 'New York', lat: 40.71, lon: -74.0 },
  { name: 'Sydney', lat: -33.86, lon: 151.2 },
  { name: 'Dubai', lat: 25.2, lon: 55.27 },
  { name: 'Singapore', lat: 1.35, lon: 103.82 },
  { name: 'Frankfurt', lat: 50.11, lon: 8.68 },
  { name: 'Paris', lat: 48.85, lon: 2.35 },
]
const BLUE = '35,80,214'
const BUCKETS = 6 // land dots are batched into this many opacity levels
const SEG = 6 // comet tail is drawn in this many batched strokes

const toVec = (lat, lon) => {
  const la = lat * RAD
  const lo = lon * RAD
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)]
}

function slerp(a, b, t) {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
  const om = Math.acos(dot)
  if (om < 1e-6) return a
  const s = Math.sin(om)
  const k1 = Math.sin((1 - t) * om) / s
  const k2 = Math.sin(t * om) / s
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2]
}

// Precomputed dots (see scripts/build-land-dots.mjs) -> unit vectors, loaded lazily
// so the hero paints before the dataset arrives.
async function loadDots() {
  const { default: raw } = await import('../data/landDots.js')
  const n = raw.split(',').map(Number)
  const v = new Float32Array((n.length / 2) * 3)
  for (let i = 0, j = 0; i < n.length; i += 2, j += 3) {
    const la = (n[i] / 10) * RAD
    const lo = (n[i + 1] / 10) * RAD
    const cl = Math.cos(la)
    v[j] = cl * Math.sin(lo)
    v[j + 1] = Math.sin(la)
    v[j + 2] = cl * Math.cos(lo)
  }
  return v
}

export default function Globe({ className = '' }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    let dots = null
    let cancelled = false
    loadDots().then((d) => !cancelled && (dots = d))

    const home = toVec(HOME.lat, HOME.lon)
    const N = 48
    const arcs = ROUTES.map((r, i) => {
      const end = toVec(r.lat, r.lon)
      const dist = Math.acos(home[0] * end[0] + home[1] * end[1] + home[2] * end[2])
      const pts = new Float32Array((N + 1) * 3)
      for (let k = 0; k <= N; k++) {
        const t = k / N
        const v = slerp(home, end, t)
        const h = 1 + Math.sin(Math.PI * t) * (0.06 + dist * 0.12)
        pts[k * 3] = v[0] * h
        pts[k * 3 + 1] = v[1] * h
        pts[k * 3 + 2] = v[2] * h
      }
      return { end, pts, proj: new Float32Array((N + 1) * 3), offset: i * 0.37, speed: 0.16 + (i % 3) * 0.03 }
    })

    // ---- sizing + static layer (glow, sphere body, highlight) rendered once per resize
    let w = 0
    let h = 0
    let dpr = 1
    let cx = 0
    let cy = 0
    let R = 0
    const under = document.createElement('canvas')
    const over = document.createElement('canvas')
    const paintStatic = () => {
      for (const c of [under, over]) {
        c.width = canvas.width
        c.height = canvas.height
      }
      const u = under.getContext('2d')
      const glow = u.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.28)
      glow.addColorStop(0, 'rgba(10,10,14,0.07)')
      glow.addColorStop(1, 'rgba(10,10,14,0)')
      u.fillStyle = glow
      u.beginPath()
      u.arc(cx, cy, R * 1.28, 0, TAU)
      u.fill()
      const body = u.createRadialGradient(cx - R * 0.38, cy - R * 0.42, R * 0.05, cx, cy, R)
      body.addColorStop(0, '#FFFFFF')
      body.addColorStop(0.55, '#F4F4F3')
      body.addColorStop(1, '#DEDEDB')
      u.fillStyle = body
      u.beginPath()
      u.arc(cx, cy, R, 0, TAU)
      u.fill()
      u.strokeStyle = 'rgba(10,10,14,0.12)'
      u.lineWidth = dpr
      u.stroke()

      const o = over.getContext('2d')
      const spec = o.createRadialGradient(cx - R * 0.45, cy - R * 0.5, 0, cx - R * 0.45, cy - R * 0.5, R * 0.9)
      spec.addColorStop(0, 'rgba(255,255,255,0.35)')
      spec.addColorStop(1, 'rgba(255,255,255,0)')
      o.fillStyle = spec
      o.beginPath()
      o.arc(cx, cy, R, 0, TAU)
      o.fill()
    }
    const resize = () => {
      const r = wrap.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      cx = (w / 2) * dpr
      cy = (h / 2) * dpr
      R = Math.min(w, h) * 0.43 * dpr
      paintStatic()
      labelW = 0
    }
    // 'NEW DELHI · HQ' pill, drawn once into its own small canvas
    let labelW = 0
    const tag = document.createElement('canvas')
    const paintLabel = () => {
      const t = tag.getContext('2d')
      const font = `600 ${11 * dpr}px Manrope, sans-serif`
      t.font = font
      const label = 'NEW DELHI · HQ'
      labelW = t.measureText(label).width
      tag.width = Math.ceil(labelW + 18 * dpr)
      tag.height = Math.ceil(22 * dpr)
      t.font = font // resizing a canvas resets its state
      t.direction = 'ltr'
      t.fillStyle = 'rgba(10,10,12,0.92)'
      t.beginPath()
      if (t.roundRect) t.roundRect(0, 0, tag.width, tag.height, 11 * dpr)
      else t.rect(0, 0, tag.width, tag.height)
      t.fill()
      t.fillStyle = '#FFFFFF'
      t.fillText(label, 9 * dpr, 15 * dpr)
    }
    resize()
    // the label width was measured with a fallback face until Manrope arrives
    document.fonts?.ready.then(() => (labelW = 0))
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let rot = -HOME.lon * RAD - 0.45
    const cosT = Math.cos(0.32)
    const sinT = Math.sin(0.32)
    const auto = reduce ? 0 : 0.0016
    let vel = auto
    let dragging = false
    let lastX = 0

    // bucketed screen positions, reused every frame (no per-frame allocation)
    const bx = Array.from({ length: BUCKETS }, () => new Float32Array(4200))
    const by = Array.from({ length: BUCKETS }, () => new Float32Array(4200))
    const bn = new Int32Array(BUCKETS)

    let raf = 0
    let visible = true
    let last = 0
    const draw = (ts) => {
      raf = requestAnimationFrame(draw)
      if (!visible) return
      const dt = last ? Math.min(3, (ts - last) / 16.67) : 1
      last = ts
      const time = ts / 1000
      if (!dragging) vel += (auto - vel) * 0.02 * dt
      rot += vel * dt

      const cr = Math.cos(rot)
      const sr = Math.sin(rot)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(under, 0, 0)

      // ---- land dots: project once, batch into opacity buckets, one fill per bucket
      if (dots) {
        bn.fill(0)
        for (let i = 0; i < dots.length; i += 3) {
          const x = dots[i]
          const y = dots[i + 1]
          const z = dots[i + 2]
          const x1 = x * cr + z * sr
          const z1 = -x * sr + z * cr
          const z2 = y * sinT + z1 * cosT
          if (z2 < 0.02) continue
          const b = Math.min(BUCKETS - 1, (z2 * BUCKETS) | 0)
          const k = bn[b]++
          bx[b][k] = cx + x1 * R
          by[b][k] = cy - (y * cosT - z1 * sinT) * R
        }
        const s = 1.15 * dpr
        const d = s * 1.77 // side of a square with the same area as the old dot
        const h2 = d / 2
        ctx.fillStyle = '#0B0B0E'
        for (let b = 0; b < BUCKETS; b++) {
          const n = bn[b]
          if (!n) continue
          ctx.globalAlpha = 0.18 + ((b + 0.5) / BUCKETS) * 0.72
          ctx.beginPath()
          const xs = bx[b]
          const ys = by[b]
          // dots are 2–3px: squares of equal area look identical and rasterise far faster than arcs
          for (let k = 0; k < n; k++) ctx.rect(xs[k] - h2, ys[k] - h2, d, d)
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }

      // ---- routes: project, then one stroke for all faint paths
      ctx.lineCap = 'round'
      ctx.beginPath()
      for (const a of arcs) {
        const p = a.pts
        const q = a.proj
        let started = false
        for (let k = 0; k <= N; k++) {
          const x = p[k * 3]
          const y = p[k * 3 + 1]
          const z = p[k * 3 + 2]
          const x1 = x * cr + z * sr
          const z1 = -x * sr + z * cr
          q[k * 3] = cx + x1 * R
          q[k * 3 + 1] = cy - (y * cosT - z1 * sinT) * R
          q[k * 3 + 2] = y * sinT + z1 * cosT
          if (q[k * 3 + 2] < -0.05) {
            started = false
            continue
          }
          started ? ctx.lineTo(q[k * 3], q[k * 3 + 1]) : ctx.moveTo(q[k * 3], q[k * 3 + 1])
          started = true
        }
      }
      ctx.strokeStyle = `rgba(${BLUE},0.22)`
      ctx.lineWidth = dpr
      ctx.stroke()

      // ---- travelling comets: tail in SEG batched strokes across all routes
      for (let sgi = 0; sgi < SEG; sgi++) {
        const t = (sgi + 1) / SEG
        ctx.beginPath()
        let any = false
        for (const a of arcs) {
          const cycle = (time * a.speed + a.offset) % 1.35
          const head = Math.min(1, cycle)
          // after arrival the tail retracts into the destination instead of fading
          const fade = cycle > 1 ? 1 - (cycle - 1) / 0.35 : 1
          const tail = Math.max(0, head - 0.38 * fade)
          const from = Math.floor((tail + (head - tail) * (sgi / SEG)) * N)
          const to = Math.floor((tail + (head - tail) * t) * N)
          const q = a.proj
          let started = false
          for (let k = from; k <= to; k++) {
            if (q[k * 3 + 2] < -0.05) {
              started = false
              continue
            }
            started ? ctx.lineTo(q[k * 3], q[k * 3 + 1]) : ctx.moveTo(q[k * 3], q[k * 3 + 1])
            started = true
            any = true
          }
        }
        if (!any) continue
        ctx.strokeStyle = `rgba(${BLUE},${0.15 + t * 0.85})`
        ctx.lineWidth = (0.8 + t * 1.6) * dpr
        ctx.stroke()
      }

      // ---- comet heads + destination markers
      ctx.fillStyle = `rgb(${BLUE})`
      ctx.beginPath()
      for (const a of arcs) {
        const cycle = (time * a.speed + a.offset) % 1.35
        if (cycle > 1) continue
        const k = Math.floor(cycle * N)
        const q = a.proj
        if (q[k * 3 + 2] < -0.05) continue
        ctx.moveTo(q[k * 3] + 2.4 * dpr, q[k * 3 + 1])
        ctx.arc(q[k * 3], q[k * 3 + 1], 2.4 * dpr, 0, TAU)
      }
      ctx.fill()

      ctx.beginPath()
      for (const a of arcs) {
        const [x, y, z] = a.end
        const x1 = x * cr + z * sr
        const z1 = -x * sr + z * cr
        if (y * sinT + z1 * cosT <= 0) continue
        const px = cx + x1 * R
        const py = cy - (y * cosT - z1 * sinT) * R
        ctx.moveTo(px + 3 * dpr, py)
        ctx.arc(px, py, 3 * dpr, 0, TAU)
      }
      ctx.fillStyle = '#FFFFFF'
      ctx.fill()
      ctx.strokeStyle = `rgb(${BLUE})`
      ctx.lineWidth = 1.4 * dpr
      ctx.stroke()

      // ---- home marker with pulse + label
      const hx1 = home[0] * cr + home[2] * sr
      const hz1 = -home[0] * sr + home[2] * cr
      const mz = home[1] * sinT + hz1 * cosT
      if (mz > 0) {
        const px = cx + hx1 * R
        const py = cy - (home[1] * cosT - hz1 * sinT) * R
        const pulse = (time * 0.8) % 1
        ctx.strokeStyle = `rgba(${BLUE},${0.6 * (1 - pulse)})`
        ctx.lineWidth = 1.5 * dpr
        ctx.beginPath()
        ctx.arc(px, py, (4 + pulse * 18) * dpr, 0, TAU)
        ctx.stroke()
        ctx.fillStyle = `rgb(${BLUE})`
        ctx.beginPath()
        ctx.arc(px, py, 4.5 * dpr, 0, TAU)
        ctx.fill()
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(px, py, 1.8 * dpr, 0, TAU)
        ctx.fill()

        // label is a pre-rendered sprite: no text layout or style resolution per frame
        if (!labelW) paintLabel()
        ctx.globalAlpha = Math.min(1, mz * 2)
        ctx.drawImage(tag, px + 12 * dpr, py - 26 * dpr)
        ctx.globalAlpha = 1
      }

      ctx.drawImage(over, 0, 0)
    }
    raf = requestAnimationFrame(draw)

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      last = 0
    })
    io.observe(wrap)

    const down = (e) => {
      dragging = true
      lastX = e.clientX
      canvas.setPointerCapture(e.pointerId)
    }
    const move = (e) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      lastX = e.clientX
      vel = dx * 0.0009
    }
    const up = () => (dragging = false)
    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('pointercancel', up)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up)
      canvas.removeEventListener('pointercancel', up)
    }
  }, [])

  return (
    <div ref={wrapRef} className={`globe ${className}`}>
      <canvas ref={canvasRef} aria-label="Rotating globe showing routes from New Delhi to destinations worldwide" role="img" />
    </div>
  )
}
