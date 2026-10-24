import { OG_IMAGE, SITE_URL, seoPages } from '../data/seo'

const tag = (sel, make) => {
  let el = document.head.querySelector(sel)
  if (!el) {
    el = make()
    document.head.appendChild(el)
  }
  return el
}
const meta = (attr, key, value) => {
  const el = tag(`meta[${attr}="${key}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute(attr, key)
    return m
  })
  el.setAttribute('content', value)
}

// Keeps title, description, canonical and social tags in step with in-app navigation.
// Unknown paths (the 404 page) are kept out of search results.
export function applyMeta(path) {
  const page = seoPages[path]
  const url = SITE_URL + (path === '/' ? '/' : path)
  document.title = page ? page.title : 'Page not found | IBM Consultancy'
  meta('name', 'robots', page ? 'index, follow, max-image-preview:large' : 'noindex, follow')
  if (!page) return
  meta('name', 'description', page.description)
  meta('property', 'og:title', page.title)
  meta('property', 'og:description', page.description)
  meta('property', 'og:url', url)
  meta('property', 'og:image', OG_IMAGE)
  meta('name', 'twitter:title', page.title)
  meta('name', 'twitter:description', page.description)
  tag('link[rel="canonical"]', () => {
    const l = document.createElement('link')
    l.rel = 'canonical'
    return l
  }).href = url
}
