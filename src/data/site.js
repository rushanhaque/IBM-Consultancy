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
  tagline: 'Immigration & Visa Services',
  phone: '+91 93112 76037',
  phoneHref: 'tel:+919311276037',
  whatsapp: '919311276037',
  address: ['C-11/197 G/F, C-Block Yamuna Vihar', 'Shahdara, Delhi 110053'],
  mapQuery: 'C-11/197 C-Block Yamuna Vihar Shahdara Delhi 110053',
}

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
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export const services = [
  {
    id: 'visa',
    icon: 'visa',
    title: 'Visa Assistance',
    short: 'Tourist, business, visit and transit visas — files built to each embassy’s standard.',
    long: 'Schengen, UK, USA, Canada, Australia, UAE and beyond. We prepare complete, consistent visa files — checklists, cover letters, itineraries and financial documentation — and book your VFS or BLS appointment.',
    tags: ['Tourist', 'Business', 'Schengen', 'USA B1/B2', 'Canada'],
    includes: [
      'Country-specific document checklist',
      'Cover letter & itinerary drafting',
      'VFS / BLS appointment scheduling',
      'Interview preparation (where required)',
    ],
    ideal: 'Holidaymakers, business travellers, family visits',
  },
  {
    id: 'passport',
    icon: 'passport',
    title: 'Passport Assistance',
    short: 'Fresh applications, renewals, re-issue and Tatkaal — filed right the first time.',
    long: 'From a first passport for your newborn to an urgent Tatkaal renewal before a business trip, we prepare, verify and file every form so your appointment at the Passport Seva Kendra goes smoothly.',
    tags: ['Fresh & renewal', 'Tatkaal', 'Minor passports', 'Corrections'],
    includes: [
      'Online application & appointment booking',
      'Document checklist and verification',
      'Name, address & ECR/ECNR updates',
      'Police verification guidance',
    ],
    ideal: 'First-time applicants, urgent travellers, families',
  },
  {
    id: 'flights',
    icon: 'plane',
    title: 'Flight Ticket Booking',
    short: 'Domestic and international fares, group bookings and visa-ready flight itineraries.',
    long: 'We compare fares across airlines to find the right balance of price, timing and flexibility — and provide flight reservations formatted for your visa application when you need them.',
    tags: ['International', 'Domestic', 'Group fares', 'Multi-city'],
    includes: [
      'Fare comparison across airlines',
      'Round-trip, multi-city & group bookings',
      'Flight reservations for visa files',
      'Date change & cancellation support',
    ],
    ideal: 'Students, families, corporate travellers',
  },
  {
    id: 'hotels',
    icon: 'hotel',
    title: 'Hotel Booking',
    short: 'Stays from smart budget to five-star — plus confirmed bookings for your visa file.',
    long: 'Hotels, serviced apartments and resorts chosen around your plans and budget, with confirmed bookings that satisfy embassy accommodation requirements.',
    tags: ['Hotels', 'Apartments', 'Resorts', 'Long stays'],
    includes: [
      'Hotels, serviced apartments & resorts',
      'Confirmed bookings for visa applications',
      'Student & long-stay accommodation',
      'Flexible & refundable options',
    ],
    ideal: 'Tourists, business trips, students arriving abroad',
  },
  {
    id: 'packages',
    icon: 'suitcase',
    title: 'Travel Packages',
    short: 'Curated holidays and honeymoons — flights, stays, transfers and sightseeing in one plan.',
    long: 'Tell us how you like to travel and we’ll design the trip: flights, hotels, transfers and experiences bundled into one seamless package — with the visa handled too.',
    tags: ['Holidays', 'Honeymoons', 'Family trips', 'Custom'],
    includes: [
      'Custom day-by-day itineraries',
      'Flights, hotels & transfers bundled',
      'Honeymoon & family packages',
      'Visa + package combinations',
    ],
    ideal: 'Couples, families, groups',
  },
  {
    id: 'insurance',
    icon: 'shield',
    title: 'Travel Insurance',
    short: 'Schengen-compliant and worldwide cover for medical emergencies, trips and baggage.',
    long: 'Travel with peace of mind. We help you choose the right policy — including cover that meets Schengen visa requirements — for single trips, multi-trip travel or study abroad.',
    tags: ['Schengen-compliant', 'Medical', 'Student', 'Multi-trip'],
    includes: [
      'Schengen-compliant policies',
      'Medical & emergency cover',
      'Trip cancellation & baggage cover',
      'Student & multi-trip plans',
    ],
    ideal: 'Every international traveller',
  },
  {
    id: 'student',
    icon: 'graduation',
    title: 'Study Abroad',
    short: 'University shortlisting to visa stamping — a clear path for students and parents.',
    long: 'We guide students through admissions paperwork, financial documentation and the student visa itself for the UK, USA, Canada, Australia and Europe, keeping parents informed at every step.',
    tags: ['UK Student', 'US F-1', 'Canada Study Permit', 'Australia 500'],
    includes: [
      'Course & university shortlisting',
      'SOP and financial document review',
      'Visa application & biometrics',
      'Mock visa interviews',
    ],
    ideal: 'Undergraduate & postgraduate applicants',
  },
  {
    id: 'immigration',
    icon: 'globe',
    title: 'Immigration Support',
    short: 'Work permits, dependant visas and permanent residency pathways, mapped honestly.',
    long: 'Planning a longer move? We assess your eligibility and map the right pathway — work permits, dependant and family visas, or permanent residency programmes — with realistic timelines.',
    tags: ['Work permits', 'Dependant visas', 'PR pathways'],
    includes: [
      'Eligibility assessment',
      'Points & profile evaluation',
      'Employer & dependant documentation',
      'End-to-end application filing',
    ],
    ideal: 'Skilled professionals and their families',
  },
]

// Pricing taken from the existing site.
export const consultations = [
  {
    id: 'travel-document',
    title: 'Travel Document Consultation',
    price: 1500,
    duration: '1 Hour',
    desc: 'A focused session to review your travel plans and the exact documents you need.',
    points: ['Personalised document checklist', 'Visa type recommendation', 'Timeline planning'],
  },
  {
    id: 'visa-review',
    title: 'Visa Application Review Service',
    price: 2500,
    duration: '1 Hour 30 Minutes',
    desc: 'A line-by-line review of your visa file to catch issues before the embassy does.',
    points: ['Full application audit', 'Cover letter & financials review', 'Interview pointers'],
    featured: true,
  },
  {
    id: 'express-passport',
    title: 'Express Passport Renewal Assistance',
    price: 3000,
    duration: '2 Hours',
    desc: 'Hands-on, priority assistance to get your passport renewal filed fast and correctly.',
    points: ['Form filling & submission', 'Appointment booking', 'Tatkaal guidance'],
  },
]

export const process = [
  {
    title: 'Discovery call',
    text: 'Tell us where you’re going and why. We assess your profile, timeline and the right visa or passport route — in plain language.',
  },
  {
    title: 'Tailored checklist',
    text: 'You receive a personalised document checklist. We verify every paper, flag gaps early and draft letters where needed.',
  },
  {
    title: 'Application & filing',
    text: 'Forms completed, fees paid, appointments booked. Your file is assembled to the standard each embassy expects.',
  },
  {
    title: 'Prep, track & collect',
    text: 'Interview preparation, biometrics guidance and real-time updates — until your passport is back in your hands.',
  },
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
  { value: 8, suffix: '', label: 'Travel & visa services' },
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
    q: 'How long does a visa take to process?',
    a: 'Processing time depends on the country, visa type and season. During your consultation we give you an indicative timeline based on current embassy schedules and plan your application around your travel date.',
  },
  {
    q: 'Can you guarantee my visa will be approved?',
    a: 'No honest consultancy can — the final decision always rests with the embassy. What we guarantee is a complete, accurate and well-presented application that gives you the strongest possible chance.',
  },
  {
    q: 'Do you handle urgent (Tatkaal) passport applications?',
    a: 'Yes. Our Express Passport Renewal Assistance covers Tatkaal applications, including document verification, form filing and appointment booking.',
  },
  {
    q: 'Can I consult with you remotely?',
    a: 'Absolutely. Consultations are available in person at our Yamuna Vihar office, over the phone, or on WhatsApp — whichever suits you.',
  },
  {
    q: 'What should I bring to my first consultation?',
    a: 'Your current passport (if any), travel or admission details, and any documents you already have. If you’re unsure, just bring what you have — we’ll tell you exactly what’s missing.',
  },
  {
    q: 'Can you book my flights and hotel too?',
    a: 'Yes. We handle flight tickets, hotel bookings, complete travel packages and travel insurance — including confirmed reservations formatted for your visa application.',
  },
]
