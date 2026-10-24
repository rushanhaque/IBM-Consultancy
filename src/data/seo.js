// Search metadata for every page. Used in the browser (on each route change) and by
// scripts/seo-pages.mjs, which writes a pre-filled HTML file per page at build time so
// Google and link previews see the right title, description and structured data without JS.

// The live address (the site's own domain). Every canonical URL, the sitemap and share links use it.
export const SITE_URL = 'https://www.ibmconsultancy.com'

export const OG_IMAGE = `${SITE_URL}/og-image.jpg`

export const seoPages = {
  '/': {
    title: 'Visa & Passport Consultant in Delhi | IBM Consultancy',
    description:
      'Visa and passport assistance in Delhi, plus study abroad, MBBS abroad and work placement abroad. Flights, hotels and travel insurance too. Call +91 93112 24584.',
  },
  '/services': {
    title: 'Visa, Passport, Study & Work Abroad Services | IBM Consultancy Delhi',
    description:
      'Tourist, business, study and work visas, fresh and Tatkal passports, flights, hotels, travel insurance, study abroad, immigration and jobs abroad, all from one Delhi team.',
    crumb: 'Services',
  },
  '/study-abroad': {
    title: 'Study Abroad & MBBS Abroad Consultants in Delhi | IBM Consultancy',
    description:
      "Bachelor's, Master's, Diploma, PhD and MBBS abroad. 60+ partner universities in the UK, Canada, New Zealand and Europe, and MBBS in Russia, Georgia, Kazakhstan and more.",
    crumb: 'Study Abroad',
  },
  '/about': {
    title: 'About IBM Consultancy | Immigration & Visa Experts in Delhi',
    description:
      'IBM Consultancy is a Delhi immigration and visa firm led by CEO Abdul Rehman, with offices in Yamuna Vihar and Chanakyapuri. Honest advice, embassy-ready files.',
    crumb: 'About',
  },
  '/contact': {
    title: 'Contact IBM Consultancy | Book a Visa Consultation in Delhi',
    description:
      'Book a consultation at our Yamuna Vihar or Chanakyapuri office in Delhi. Call or WhatsApp +91 93112 24584 or email info@ibmconsultancy.com.',
    crumb: 'Contact',
  },
}
