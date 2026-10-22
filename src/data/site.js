// Central content for the site. Items marked "PLACEHOLDER" should be confirmed or
// replaced with real business data before going live.

// Photography: Unsplash (free licence), served from the Unsplash image CDN.
// q=70 with auto=format (AVIF/WebP) is visually lossless at these sizes and noticeably lighter
export const photoUrl = (id, w = 1600, q = 70) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`

export const photos = {
  wingClouds: '1436491865332-7a61a109cc05',
  windowSunset: '1488085061387-422e29b40080',
  lounge: '1530521954074-e64f6810b32d',
  runwaySunset: '1542296332-2e4473faf563',
  tarmac: '1464037866556-6812c9d1c72e',
  cloudsWarm: '1500835556837-99ac94a94552',
  landing: '1520437358207-323b43b50729',
  departures: '1517400508447-f8dd518b86db',
  handoff: '1544027993-37dbfe43562a',
  passportFlatlay: '1578894381163-e72c17f2d45f',
  maldives: '1590523277543-a94d2e4eb00b',
  londonAerial: '1513635269975-59663e0ac1ad',
  bigBen: '1505761671935-60b3a7427bad',
  toronto: '1517090504586-fde19ea6066f',
  nyc: '1485871981521-5b1fd3805eee',
  sydney: '1506973035872-a4ec16b8e8d9',
  dubai: '1512453979798-5ea266f8880c',
  burjAlArab: '1518684079-3c830dcef090',
  paris: '1502602898657-3e91760cbb34',
  parisBridge: '1499856871958-5b9627545d1a',
  singapore: '1525625293386-3f8f99389edd',
  berlin: '1560969184-10fe8719e047',
  graduation: '1541339907198-e08756dedf3f',
  consultation: '1600880292203-757bb62b4baf',
  signing: '1450101499163-c8848c66ca85',
  checklist: '1586281380349-632531db7ed4',
  indiaGate: '1587474260584-136574528ed5',
  tajMahal: '1524492412937-b28074a5d7da',
  mapPassport: '1488646953014-85cb44e25828',
  team: '1521737604893-d14cc237f11d',
  hotel: '1551882547-ff40c63fe5fa',
}

export const company = {
  name: 'IBM Consultancy',
  ceo: 'Abdul Rehman',
  tagline: 'Immigration & Visa Services',
  phone: '+91 93112 24584',
  email: 'info@ibmconsultancy.com',
  phoneHref: 'tel:+919311224584',
  whatsapp: '919311224584',
  address: ['C-11/197 G/F, C-Block Yamuna Vihar', 'Shahdara, Delhi 110053'],
  mapQuery: 'C-11/197 C-Block Yamuna Vihar Shahdara Delhi 110053',
}

// opens the visitor's mail app with a ready-written enquiry
export const mailLink = (subject, body) =>
  `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

// every form on the site posts here
export const FORMSPREE = 'https://formspree.io/f/xdeenyry'

export const waLink = (text = 'Hello IBM Consultancy, I would like to book a consultation.') =>
  `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`

// PLACEHOLDER: Monday–Thursday confirmed from the old site; confirm Friday–Sunday.
export const hours = [
  { day: 'Monday', short: 'Mon', open: '09:00', close: '17:00' },
  { day: 'Tuesday', short: 'Tue', open: '09:00', close: '17:00' },
  { day: 'Wednesday', short: 'Wed', open: '09:00', close: '17:00' },
  { day: 'Thursday', short: 'Thu', open: '09:00', close: '17:00' },
  { day: 'Friday', short: 'Fri', open: '09:00', close: '17:00' },
  { day: 'Saturday', short: 'Sat', open: null, close: null, note: 'By appointment' },
  { day: 'Sunday', short: 'Sun', open: null, close: null, note: 'Closed' },
]

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/study-abroad', label: 'Study Abroad' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export const services = [
  {
    id: 'visa',
    icon: 'visa',
    title: 'Visa Assistance',
    short: 'Tourist, business and visit visas, filed right.',
    long: 'Complete visa files for Schengen, UK, USA, Canada, Australia, UAE and more.',
    tags: ['Tourist', 'Business', 'Study'],
    includes: ['Document checklist', 'Cover letter & itinerary', 'VFS / BLS appointments'],
  },
  {
    id: 'passport',
    icon: 'passport',
    title: 'Passport Assistance',
    short: 'New, renewal and Tatkaal passports.',
    long: 'Forms, documents and appointments handled for a smooth Passport Seva visit.',
    tags: ['Renewal', 'Tatkaal', 'Minors'],
    includes: ['Application & booking', 'Document verification', 'Name & address updates'],
  },
  {
    id: 'flights',
    icon: 'plane',
    title: 'Flight Ticket Booking',
    short: 'Best fares, flexible tickets, visa itineraries.',
    long: 'Domestic and international fares compared across airlines.',
    tags: ['International', 'Domestic', 'Group'],
    includes: ['Fare comparison', 'Multi-city & group bookings', 'Flight reservations for visas'],
  },
  {
    id: 'hotels',
    icon: 'hotel',
    title: 'Hotel Booking',
    short: 'Stays for every budget, visa-ready.',
    long: 'Hotels, apartments and resorts, with confirmed bookings for your visa file.',
    tags: ['Hotels', 'Apartments', 'Resorts'],
    includes: ['Handpicked stays', 'Confirmed visa bookings', 'Flexible options'],
  },
  {
    id: 'packages',
    icon: 'suitcase',
    title: 'Travel Packages',
    short: 'Holidays and honeymoons, planned end to end.',
    long: 'Flights, stays, transfers and sightseeing in one seamless plan.',
    tags: ['Holidays', 'Honeymoons', 'Family'],
    includes: ['Custom itineraries', 'Flights & hotels bundled', 'Visa included'],
  },
  {
    id: 'insurance',
    icon: 'shield',
    title: 'Travel Insurance',
    short: 'Schengen-compliant and worldwide cover.',
    long: 'The right policy for medical emergencies, trips and baggage.',
    tags: ['Schengen', 'Medical', 'Student'],
    includes: ['Schengen-compliant plans', 'Medical & trip cover', 'Student & multi-trip'],
  },
  {
    id: 'student',
    icon: 'graduation',
    title: 'Study Abroad',
    short: 'From university shortlist to student visa.',
    long: 'Admissions paperwork and student visas for Russia, Georgia, Kazakhstan, Kyrgyzstan, Belarus, Egypt, Malaysia, Belgium, Nepal, Poland and Germany.',
    tags: ['Russia', 'Georgia', 'Kazakhstan', 'Kyrgyzstan', 'Belarus', 'Egypt', 'Malaysia', 'Belgium', 'Nepal', 'Poland', 'Germany'],
    includes: ['University shortlisting', 'SOP & financials review', 'Mock visa interviews'],
  },
  {
    id: 'immigration',
    icon: 'globe',
    title: 'Immigration Support',
    short: 'Work permits, family visas and PR.',
    long: 'Honest eligibility checks and the right pathway for a longer move.',
    tags: ['Work permits', 'Family', 'PR'],
    includes: ['Eligibility assessment', 'Profile evaluation', 'End-to-end filing'],
  },
  {
    id: 'work',
    icon: 'briefcase',
    title: 'Work Placement',
    short: 'Hotel and kitchen jobs in Europe, the Gulf and Asia.',
    long: 'Work placements and work visas across 34 countries in Europe, the Gulf and Asia, from job offer to departure.',
    tags: [
      'Albania', 'Belarus', 'Belgium', 'Croatia', 'Czech Republic', 'Georgia', 'Germany', 'Italy', 'Latvia', 'Lithuania',
      'Malta', 'Luxembourg', 'Poland', 'Russia', 'Slovakia', 'Ukraine', 'Spain', 'Sweden', 'Netherlands',
      'Bahrain', 'Kuwait', 'Oman', 'Qatar', 'Saudi Arabia', 'UAE', 'Iraq', 'Jordan',
      'Malaysia', 'Indonesia', 'Philippines', 'Thailand', 'Singapore', 'Japan', 'Azerbaijan',
    ],
    includes: ['Job matching & employer offer', 'Work permit & visa filing', 'Pre-departure support'],
    // openings we currently place candidates in
    roles: [
      'Pastry assistant / baker',
      'Line cook / commis chef',
      'Kitchen steward / dishwasher',
      'Bartender',
      'Barback',
      'Waiter',
      'Hotel management',
    ],
  },
]

export const process = [
  { title: 'Discovery call', text: 'Tell us your plans. We find the right route.' },
  { title: 'Tailored checklist', text: 'Every document checked, gaps flagged early.' },
  { title: 'Application & filing', text: 'Forms, fees and appointments, done properly.' },
  { title: 'Track & collect', text: 'Updates until your passport is back with you.' },
]

export const destinations = [
  { code: 'CA', name: 'Canada', city: 'Toronto', types: 'Visitor · Study Permit · Work · PR', image: photos.toronto },
  { code: 'UK', name: 'United Kingdom', city: 'London', types: 'Standard Visitor · Student · Skilled Worker', image: photos.bigBen },
  { code: 'US', name: 'United States', city: 'New York', types: 'B1/B2 · F-1 Student · Business', image: photos.nyc },
  { code: 'EU', name: 'Schengen Area', city: 'Paris', types: 'Type C Tourist · Business · Family Visit', image: photos.paris },
  { code: 'AU', name: 'Australia', city: 'Sydney', types: 'Visitor · Student 500 · Skilled Migration', image: photos.sydney },
  { code: 'AE', name: 'United Arab Emirates', city: 'Dubai', types: 'Tourist · Employment · Family', image: photos.dubai },
  { code: 'SG', name: 'Singapore & Asia', city: 'Singapore', types: 'Tourist · Business · Transit', image: photos.singapore },
]

// Photo ribbon on the home page.
export const ribbon = [
  [
    { id: photos.londonAerial, label: 'London', code: 'LHR' },
    { id: photos.maldives, label: 'Malé', code: 'MLE' },
    { id: photos.sydney, label: 'Sydney', code: 'SYD' },
    { id: photos.parisBridge, label: 'Paris', code: 'CDG' },
    { id: photos.burjAlArab, label: 'Dubai', code: 'DXB' },
    { id: photos.toronto, label: 'Toronto', code: 'YYZ' },
  ],
  [
    { id: photos.singapore, label: 'Singapore', code: 'SIN' },
    { id: photos.berlin, label: 'Berlin', code: 'BER' },
    { id: photos.nyc, label: 'New York', code: 'JFK' },
    { id: photos.tajMahal, label: 'Agra', code: 'AGR' },
    { id: photos.paris, label: 'Paris', code: 'ORY' },
    { id: photos.bigBen, label: 'London', code: 'LGW' },
  ],
]

const serviceImages = {
  visa: photos.departures,
  passport: photos.passportFlatlay,
  flights: photos.runwaySunset,
  hotels: photos.hotel,
  packages: photos.maldives,
  insurance: photos.cloudsWarm,
  student: photos.graduation,
  immigration: photos.mapPassport,
  work: photos.team,
}
services.forEach((s) => (s.image = serviceImages[s.id]))

const processImages = [photos.consultation, photos.checklist, photos.signing, photos.landing]
process.forEach((p, i) => (p.image = processImages[i]))

export const marquee = [
  'Canada', 'United Kingdom', 'United States', 'Schengen', 'Australia', 'Dubai',
  'Singapore', 'New Zealand', 'Germany', 'Japan', 'France', 'Ireland',
]

// PLACEHOLDER figures — replace with the firm's real numbers.
export const stats = [
  { value: 40, suffix: '+', label: 'Destinations served' },
  { value: 9, suffix: '', label: 'Travel & visa services' },
  { value: 24, suffix: 'h', label: 'Typical WhatsApp response' },
  { value: 1, suffix: ':1', label: 'Dedicated case manager' },
]

// PLACEHOLDER testimonials — replace with genuine client reviews (e.g. from Google).
export const testimonials = [
  {
    quote:
      'They caught two mistakes in my Schengen file that would have meant a rejection. Visa approved first time, and the whole process felt calm.',
    name: 'Business traveller',
    role: 'Schengen visa',
  },
  {
    quote:
      'My Tatkaal renewal was filed the same day I walked in. Clear checklist, no running around — exactly what I needed before a work trip.',
    name: 'Corporate client',
    role: 'Express passport renewal',
  },
  {
    quote:
      'From SOP review to the mock interview, they treated my daughter’s UK student visa like their own. As parents, we always knew what was next.',
    name: 'Parent of a student',
    role: 'UK student visa',
  },
]

export const faqs = [
  {
    q: 'How long does a visa take?',
    a: 'It depends on the country and season. We give you a realistic timeline when we start.',
  },
  {
    q: 'Can you guarantee approval?',
    a: 'No one honestly can; the embassy decides. We make sure your file is complete and strong.',
  },
  {
    q: 'Do you handle Tatkaal passports?',
    a: 'Yes: document checks, form filing and appointment booking.',
  },
  {
    q: 'Can I consult remotely?',
    a: 'Yes. Visit our Yamuna Vihar office, call, or WhatsApp us.',
  },
  {
    q: 'Can you book flights and hotels too?',
    a: 'Yes, plus travel packages and insurance, including bookings for your visa file.',
  },
]

// Countries offered in the contact form's destination picker (visa, study, MBBS and work destinations).
export const countries = [
  'Albania', 'Australia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Canada', 'Croatia',
  'Czech Republic', 'Dubai / UAE', 'Egypt', 'Finland', 'France', 'Georgia', 'Germany', 'Indonesia', 'Iraq',
  'Ireland', 'Italy', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait', 'Kyrgyzstan', 'Latvia', 'Lithuania', 'Luxembourg',
  'Malaysia', 'Maldives', 'Malta', 'Nepal', 'Netherlands', 'New Zealand', 'Oman', 'Philippines', 'Poland', 'Qatar',
  'Russia', 'Saudi Arabia', 'Schengen (Europe)', 'Singapore', 'Slovakia', 'Spain', 'Sweden', 'Switzerland',
  'Thailand', 'Ukraine', 'United Kingdom', 'United States',
]
