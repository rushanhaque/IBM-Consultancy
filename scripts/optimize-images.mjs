// Resizes the brand images to the sizes they are actually displayed at (2x for retina)
// and encodes them as WebP. Run: node scripts/optimize-images.mjs
import sharp from 'sharp'

const jobs = [
  // navbar / curtain emblem: shown 40px tall
  { src: 'assets-src/emblem.png', out: 'public/emblem.webp', height: 96 },
  // preloader (≤120px), footer (150px), About card (≈300px)
  { src: 'assets-src/logo.png', out: 'public/logo-320.webp', width: 320 },
  { src: 'assets-src/logo.png', out: 'public/logo-640.webp', width: 640 },
  // favicon + touch icon
  { src: 'assets-src/favicon.png', out: 'public/favicon-64.png', width: 64, png: true },
  { src: 'assets-src/favicon.png', out: 'public/apple-touch-icon.png', width: 180, png: true, flatten: true },
]

for (const j of jobs) {
  let img = sharp(j.src).resize({ width: j.width, height: j.height, fit: 'inside' })
  if (j.flatten) img = img.flatten({ background: '#ffffff' })
  img = j.png ? img.png({ compressionLevel: 9, palette: true }) : img.webp({ quality: 82, alphaQuality: 90, effort: 6 })
  const info = await img.toFile(j.out)
  console.log(`${j.out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`)
}
