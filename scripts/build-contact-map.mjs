// Builds the Contact page's background map: a static, pre-blurred greyscale image of
// Delhi centred on the office, stitched once from OpenStreetMap tiles.
// Baking the blur/greyscale into the file costs nothing at runtime (no live map,
// no CSS blur over a large area).  Map data © OpenStreetMap contributors (ODbL).
// Run: node scripts/build-contact-map.mjs   → public/contact-map.webp
import sharp from 'sharp'

const OFFICE = { lat: 28.6966, lon: 77.278 } // C-Block Yamuna Vihar, Shahdara
const Z = 13 // ~17 m/px here: wide enough to show most of Delhi
const OUT_W = 1600
const OUT_H = 1000
const COLS = 8
const ROWS = 6

const n = 2 ** Z
const px = ((OFFICE.lon + 180) / 360) * n * 256
const latRad = (OFFICE.lat * Math.PI) / 180
const py = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n * 256

const x0 = Math.floor(px / 256) - COLS / 2
const y0 = Math.floor(py / 256) - ROWS / 2
const headers = { 'User-Agent': 'IBMConsultancy-website-build/1.0 (one-time static background)' }

const tiles = []
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    const url = `https://tile.openstreetmap.org/${Z}/${x0 + x}/${y0 + y}.png`
    const res = await fetch(url, { headers })
    if (!res.ok) throw new Error(`${res.status} for ${url}`)
    tiles.push({ input: Buffer.from(await res.arrayBuffer()), left: x * 256, top: y * 256 })
    await new Promise((r) => setTimeout(r, 120)) // be polite to the tile servers
  }
}

// stitch, then crop so the office sits exactly at the centre
const canvas = await sharp({ create: { width: COLS * 256, height: ROWS * 256, channels: 3, background: '#f2f2f0' } })
  .composite(tiles)
  .png()
  .toBuffer()
const cx = Math.round(px - x0 * 256)
const cy = Math.round(py - y0 * 256)
const info = await sharp(canvas)
  .extract({ left: cx - OUT_W / 2, top: cy - OUT_H / 2, width: OUT_W, height: OUT_H })
  .grayscale()
  .linear(1.15, -20) // crisp greyscale; the page dims it with CSS opacity
  .blur(1.6)
  .webp({ quality: 55, effort: 6 })
  .toFile('public/contact-map.webp')
console.log(`public/contact-map.webp ${info.width}x${info.height} ${(info.size / 1024).toFixed(1)} KB`)
