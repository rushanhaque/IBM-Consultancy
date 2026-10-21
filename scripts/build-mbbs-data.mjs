// Converts the "MBBS Abroad" workbook into src/data/mbbs.js.
// Usage: python exports the sheets to JSON first (see README note in this file), then:
//   node scripts/build-mbbs-data.mjs <path-to-sheets.json>
// The JSON is { sheetName: rows[][] } exactly as read from the workbook.
import { readFileSync, writeFileSync } from 'node:fs'

const src = JSON.parse(readFileSync(process.argv[2], 'utf8'))

const NAMES = { Kazakhistan: 'Kazakhstan', GEORGIA: 'Georgia' }
const ORDER = ['Russia', 'Georgia', 'Kazakhstan', 'Kyrgyzstan', 'Belarus', 'Bangladesh', 'Egypt', 'Poland', 'Germany', 'Belgium', 'Malaysia']

const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

// repairs characters that were lost in the source file (U+FFFD) and tidies whitespace
const clean = (v) => {
  if (v === null || v === undefined) return ''
  let s = String(v)
  s = s
    .replace(/Li�ge/g, 'Liège')
    .replace(/(\d)�(years?)/g, '$1 $2')
    .replace(/�(?=\d)/g, '€')
    .replace(/�/g, ' ')
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
  return s
}

const nonEmpty = (row) => row.filter((c) => clean(c) !== '').length

function convert(name, rows) {
  rows = rows.filter((r) => nonEmpty(r) > 0)
  if (!rows.length) return null

  // Germany: an information sheet, not a table
  if (rows.every((r) => nonEmpty(r) === 1 && clean(r[0]))) {
    const guide = []
    for (const r of rows) {
      const t = clean(r[0]).replace(/\s*\[\d+(,\s*\d+)*\]/g, '') // drop footnote markers like [1, 2]
      const isHeading = t.length < 70 && !t.includes(':') && !/[.]$/.test(t)
      if (isHeading) guide.push({ heading: t, points: [] })
      else if (!guide.length) guide.push({ heading: '', points: [t] })
      else guide[guide.length - 1].points.push(t)
    }
    return { country: name, guide }
  }

  const header = rows[0].map(clean)
  const body = rows.slice(1)
  const tableRows = []
  const notes = []
  for (const r of body) {
    const cells = r.map(clean)
    const filled = cells.filter(Boolean).length
    if (!cells[0]) continue // stray cells with no university name
    // label/value pairs or free text become notes
    const vals = cells.filter(Boolean)
    // a 2-cell row is a note unless its second value is a duration (e.g. Belgium's name-only rows)
    const twoCellNote = filled === 2 && !/^\d+( years?)?$/i.test(vals[1])
    const looksLikeNote = filled === 1 || twoCellNote || /^note[:\s]/i.test(cells[0]) || cells[0].length > 90
    if (looksLikeNote) {
      const label = vals[0].replace(/:$/, '')
      // 'Average tuition fee: Average tuition fee Approx…' -> drop the repeated label
      const value = vals[1]?.startsWith(label) ? vals[1].slice(label.length).trim() : vals[1]
      notes.push(vals.length === 2 ? `${label}: ${value}` : vals.join(' '))
      continue
    }
    if (tableRows.some((t) => t[0] === cells[0])) continue // the sheet repeats some universities
    tableRows.push(cells)
  }

  // INR number columns -> ₹ formatting; bare durations -> "6 years"
  header.forEach((h, ci) => {
    const isInr = /inr|rs\.?\)/i.test(h)
    tableRows.forEach((row, ri) => {
      const raw = body.find((b) => clean(b[0]) === row[0])?.[ci]
      if (isInr && typeof raw === 'number') row[ci] = inr(raw)
      if (/duration/i.test(h) && /^\d+$/.test(row[ci])) row[ci] = `${row[ci]} years`
    })
  })

  // Russia: the last column mixes INR figures with links to another agency's site; drop it
  let cols = header.map((h, i) => i).filter((i) => header[i] || tableRows.some((r) => r[i]))
  if (name === 'Russia') cols = cols.filter((i) => !/total fees include/i.test(header[i]))
  // drop columns that are empty for every row
  cols = cols.filter((i) => tableRows.some((r) => r[i]))

  // serial-number columns add nothing on a website
  cols = cols.filter((i) => !/^s.?s*no.?$/i.test(header[i]))

  return {
    country: name,
    columns: cols.map((i) => header[i] || ''),
    rows: tableRows.map((r) => cols.map((i) => r[i] || '—')),
    notes,
  }
}

const countries = []
for (const [sheet, rows] of Object.entries(src)) {
  const name = NAMES[sheet] || sheet
  const c = convert(name, rows)
  if (c) countries.push(c)
}
// hand fixes for spots where the sheet itself is ambiguous
for (const c of countries) {
  if (c.country === 'Belarus') c.notes = ['Duration: 6 years, including a 1-year internship']
  if (c.country === 'Belgium') {
    c.columns = ['University', 'Duration', 'Tuition / year', 'Tuition / year (INR)']
    c.rows = c.rows.map((r) => [r[0], r[1], r[2].replace(/^1500 to 3600/, '€1,500 to €3,600').replace(/^4000+ Euros/, '€4,000+'), r[3]])
    c.notes = ['Living cost: €1,540 – €2,780 per month', ...c.notes.filter((n) => !/^Eligibility criteria (and admission|to take admission)/.test(n))]
  }
}
countries.sort((a, b) => ORDER.indexOf(a.country) - ORDER.indexOf(b.country))

writeFileSync(
  new URL('../src/data/mbbs.js', import.meta.url),
  `// Generated from "MBBS Abroad.xlsx" by scripts/build-mbbs-data.mjs — edit the sheet, then regenerate.\nexport const mbbs = ${JSON.stringify(countries, null, 2)}\n`
)
console.log(countries.map((c) => `${c.country}: ${c.rows ? c.rows.length + ' rows' : c.guide.length + ' sections'}${c.notes?.length ? `, ${c.notes.length} notes` : ''}`).join('\n'))
