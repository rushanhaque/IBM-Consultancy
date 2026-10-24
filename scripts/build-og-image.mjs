// Builds public/og-image.jpg (1200x630), the picture shown when a page is shared on
// WhatsApp, Facebook, LinkedIn or X. Run: npm run build:og
import sharp from 'sharp'

const W = 1200
const H = 630

const logo = await sharp('assets-src/logo.png').resize({ height: 330, fit: 'inside' }).png().toBuffer()
const { width: lw, height: lh } = await sharp(logo).metadata()

const text = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#fafaf9"/>
  <rect x="0" y="${H - 10}" width="${W}" height="10" fill="#2350d6"/>
  <text x="560" y="250" font-family="Georgia, 'Times New Roman', serif" font-size="64" fill="#0a0a0c">Visa &amp; Passport</text>
  <text x="560" y="322" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-style="italic" fill="#55555d">consultants in Delhi</text>
  <text x="562" y="392" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#2c2c31">Study abroad · MBBS abroad · Work placement</text>
  <text x="562" y="470" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#0a0a0c">+91 93112 24584</text>
  <text x="562" y="510" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#6a6a72">@ibm.consultancy · Yamuna Vihar &amp; Chanakyapuri</text>
</svg>`

const info = await sharp(Buffer.from(text))
  .composite([{ input: logo, left: Math.round(70 + (420 - lw) / 2), top: Math.round((H - lh) / 2 - 10) }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile('public/og-image.jpg')
console.log(`public/og-image.jpg ${info.width}x${info.height} ${(info.size / 1024).toFixed(1)} KB`)
