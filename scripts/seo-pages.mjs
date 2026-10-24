// Runs after `vite build`. For every page in src/data/seo.js it writes a copy of
// dist/index.html with that page's title, description, canonical URL, social tags and
// JSON-LD structured data, plus a plain-HTML summary inside #root that React replaces on
// load. Vercel serves dist/services.html at /services (cleanUrls), so crawlers and link
// previews get the right page without running JavaScript. Also writes sitemap.xml and robots.txt.
import { readFileSync, writeFileSync } from 'node:fs'
import { OG_IMAGE, SITE_URL, seoPages } from '../src/data/seo.js'
import { company, faqs, hours, nav, offices, services } from '../src/data/site.js'
import { universities } from '../src/data/universities.js'
import { mbbs } from '../src/data/mbbs.js'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const urlOf = (path) => SITE_URL + (path === '/' ? '/' : path)
const ORG = `${SITE_URL}/#organization`

const postal = (lines, postalCode, locality) => ({
  '@type': 'PostalAddress',
  streetAddress: lines[0],
  addressLocality: locality,
  addressRegion: 'Delhi',
  postalCode,
  addressCountry: 'IN',
})

const openDays = hours.filter((h) => h.open)
const openingHours = {
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: openDays.map((h) => h.day),
  opens: openDays[0].open,
  closes: openDays[0].close,
}

const organization = {
  '@type': ['TravelAgency', 'ProfessionalService'],
  '@id': ORG,
  name: company.name,
  alternateName: 'IBM Consultancy Immigration & Visa Services',
  description: seoPages['/'].description,
  url: urlOf('/'),
  logo: `${SITE_URL}/logo-640.webp`,
  image: OG_IMAGE,
  telephone: '+91-93112-24584',
  email: company.email,
  sameAs: [company.instagram],
  address: postal(offices[0].lines, '110053', 'Shahdara, Delhi'),
  geo: { '@type': 'GeoCoordinates', latitude: 28.6966, longitude: 77.278 },
  hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(offices[0].mapQuery)}`,
  openingHoursSpecification: [openingHours],
  areaServed: [
    { '@type': 'City', name: 'Delhi' },
    { '@type': 'AdministrativeArea', name: 'Delhi NCR' },
    { '@type': 'Country', name: 'India' },
  ],
  employee: { '@type': 'Person', name: company.ceo, jobTitle: 'CEO' },
  department: [
    {
      '@type': 'TravelAgency',
      name: `${company.name}, ${offices[1].label}`,
      telephone: '+91-93112-24584',
      email: company.email,
      address: postal(offices[1].lines, '110021', 'Chanakyapuri, New Delhi'),
      hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(offices[1].mapQuery)}`,
      openingHoursSpecification: [openingHours],
    },
  ],
  knowsAbout: ['Visa assistance', 'Passport services', 'Study abroad', 'MBBS abroad', 'Work placement abroad', 'Immigration'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Immigration, visa and travel services',
    itemListElement: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, description: s.long, url: `${urlOf('/services')}#${s.id}` },
    })),
  },
}

const website = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: urlOf('/'),
  name: company.name,
  inLanguage: 'en-IN',
  publisher: { '@id': ORG },
}

const crumbs = (path) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: urlOf('/') },
    { '@type': 'ListItem', position: 2, name: seoPages[path].crumb, item: urlOf(path) },
  ],
})

const webPage = (path) => ({
  '@type': path === '/about' ? 'AboutPage' : path === '/contact' ? 'ContactPage' : 'WebPage',
  '@id': `${urlOf(path)}#webpage`,
  url: urlOf(path),
  name: seoPages[path].title,
  description: seoPages[path].description,
  isPartOf: { '@id': `${SITE_URL}/#website` },
  about: { '@id': ORG },
  inLanguage: 'en-IN',
})

// one service entry per offering, each linked to the organisation
const serviceNodes = services.map((s) => ({
  '@type': 'Service',
  '@id': `${urlOf('/services')}#${s.id}`,
  name: s.title,
  serviceType: s.title,
  description: s.long,
  provider: { '@id': ORG },
  areaServed: { '@type': 'Country', name: 'India' },
}))

const faqPage = {
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
}

const graphFor = (path) => {
  const g = [organization, website, webPage(path)]
  if (path !== '/') g.push(crumbs(path))
  if (path === '/services') g.push(...serviceNodes, faqPage)
  return { '@context': 'https://schema.org', '@graph': g }
}

// Plain-HTML version of each page's key content, for crawlers that don't run JavaScript.
// It sits under the boot screen and React replaces it as soon as the app mounts.
const links = `<nav>${nav.map((n) => `<a href="${n.to}">${esc(n.label)}</a>`).join(' ')}</nav>`
const contactLine = `<p>Call or WhatsApp <a href="${company.phoneHref}">${esc(company.phone)}</a> · <a href="mailto:${company.email}">${esc(company.email)}</a> · <a href="${company.instagram}">Instagram ${esc(company.instagramHandle)}</a></p><address>${offices.map((o) => esc(`${o.label}: ${o.lines.join(', ')}`)).join('<br>')}</address>`
const list = (items) => `<ul>${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`
const bodies = {
  '/': `<h1>Visa &amp; passport consultant in Delhi</h1><p>${esc(seoPages['/'].description)}</p><h2>Our services</h2>${list(services.map((s) => `${s.title}: ${s.short}`))}`,
  '/services': `<h1>Visa, passport, study and work abroad services</h1>${services
    .map((s) => `<h2>${esc(s.title)}</h2><p>${esc(s.long)}</p>${list(s.includes)}${s.roles ? `<h3>Opportunities</h3>${list(s.roles)}` : ''}`)
    .join('')}<h2>Frequently asked questions</h2>${faqs.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}`,
  '/study-abroad': `<h1>Study abroad and MBBS abroad</h1><p>${esc(seoPages['/study-abroad'].description)}</p><h2>Partner universities</h2>${universities
    .map((u) => `<h3>${esc(u.country)}</h3>${list(u.unis)}`)
    .join('')}<h2>MBBS abroad</h2>${list(mbbs.map((m) => `MBBS in ${m.country}${m.rows ? `: ${m.rows.length} universities` : ''}`))}`,
  '/about': `<h1>About IBM Consultancy</h1><p>${esc(seoPages['/about'].description)}</p>`,
  '/contact': `<h1>Contact IBM Consultancy</h1><p>${esc(seoPages['/contact'].description)}</p>`,
}

const template = readFileSync('dist/index.html', 'utf8')
const setMeta = (html, attr, key, value) =>
  html.replace(new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`), `$1${esc(value)}$2`)

for (const [path, page] of Object.entries(seoPages)) {
  let html = template
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`)
  html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${esc(page.description)}$2`)
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${urlOf(path)}$2`)
  html = setMeta(html, 'property', 'og:title', page.title)
  html = setMeta(html, 'property', 'og:description', page.description)
  html = setMeta(html, 'property', 'og:url', urlOf(path))
  html = setMeta(html, 'name', 'twitter:title', page.title)
  html = setMeta(html, 'name', 'twitter:description', page.description)
  html = html.replace(
    '</head>',
    `  <script type="application/ld+json">${JSON.stringify(graphFor(path)).replace(/</g, '\\u003c')}</script>\n  </head>`
  )
  html = html.replace('<div id="root"></div>', `<div id="root"><main class="seo-fallback">${links}${bodies[path]}${contactLine}</main></div>`)
  writeFileSync(path === '/' ? 'dist/index.html' : `dist${path}.html`, html)
}

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(seoPages)
  .map((p) => `  <url><loc>${urlOf(p)}</loc><lastmod>${today}</lastmod><changefreq>${p === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${p === '/' ? '1.0' : '0.8'}</priority></url>`)
  .join('\n')}
</urlset>
`
writeFileSync('dist/sitemap.xml', sitemap)
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
console.log(`seo: wrote ${Object.keys(seoPages).length} pages, sitemap.xml and robots.txt`)
