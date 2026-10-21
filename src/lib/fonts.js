// Resolves when the display fonts are ready, or after `cap` ms, whichever is first.
// The Google Fonts stylesheet loads asynchronously (so it never blocks first paint),
// which means the @font-face rules may not exist yet when this is called: wait for
// the stylesheet, then for the specific faces the headings use.
const FACES = ['400 1em Fraunces', 'italic 300 1em Fraunces', '500 1em Manrope']

export function fontsReady(cap = 1500) {
  return new Promise((resolve) => {
    const done = () => resolve()
    const timer = setTimeout(done, cap)
    if (!document.fonts) return done()

    const loadFaces = (tries = 0) =>
      Promise.all(FACES.map((f) => document.fonts.load(f))).then((sets) => {
        // faces not declared yet (stylesheet still being applied): try again next frame
        if (sets.some((s) => s.length === 0) && tries < 20) return requestAnimationFrame(() => loadFaces(tries + 1))
        clearTimeout(timer)
        done()
      }, done)

    const link = document.querySelector('link[href*="fonts.googleapis.com/css"]')
    if (!link || (link.rel === 'stylesheet' && link.sheet)) loadFaces()
    else link.addEventListener('load', () => loadFaces(), { once: true })
  })
}
