import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useReveal from '../hooks/useReveal'
import { mbbs } from '../data/mbbs'
import { universities } from '../data/universities'
import { nzColleges } from '../data/nzColleges'
import Icon from '../components/Icon'
import Button from '../components/Button'
import { CTA, PageHero } from '../components/Sections'
import { mailLink, waLink } from '../data/site'

// every country we place students in: partner universities plus MBBS destinations
const allCountries = [...new Set([...universities.map((u) => u.country), ...mbbs.map((m) => m.country)])]
const partnerCount = universities.reduce((n, u) => n + u.unis.length, 0)

const programmes = [
  {
    id: 'bachelor',
    label: "Bachelor's",
    title: "Bachelor's degrees abroad",
    text: 'Undergraduate degrees in engineering, business, IT, design and more, straight after Class 12.',
    points: ['Course & university shortlist', 'Application and offer letter', 'Student visa filing', 'Pre-departure briefing'],
  },
  {
    id: 'master',
    label: "Master's",
    title: "Master's degrees abroad",
    text: 'Postgraduate degrees that build on your bachelor’s, from one to two years.',
    points: ['Profile & university match', 'SOP and LOR review', 'Funds & financials check', 'Student visa filing'],
  },
  {
    id: 'diploma',
    label: 'Diploma',
    title: 'Diplomas abroad',
    text: 'Shorter, career-focused programmes with practical training.',
    points: ['Programme shortlist', 'Admission paperwork', 'Student visa filing', 'Travel & stay bookings'],
  },
  {
    id: 'phd',
    label: 'PhD',
    title: 'PhD abroad',
    text: 'Doctoral research programmes, including funded and scholarship positions.',
    points: ['Research proposal guidance', 'University & supervisor outreach', 'Scholarship paperwork', 'Student visa filing'],
  },
  { id: 'mbbs', label: 'MBBS' },
]

const mbbsCount = mbbs.reduce((n, c) => n + (c.rows?.length || 0), 0)

export default function Study() {
  const ref = useRef(null)
  useReveal(ref)
  const [params] = useSearchParams()
  const [prog, setProg] = useState(programmes.some((p) => p.id === params.get('p')) ? params.get('p') : 'bachelor')
  const [active, setActive] = useState(mbbs[0].country)
  const [uniCountry, setUniCountry] = useState(universities[0].country)
  const u = universities.find((x) => x.country === uniCountry)
  const [college, setCollege] = useState(nzColleges[0].name)
  const nz = nzColleges.find((x) => x.name === college)
  const p = programmes.find((x) => x.id === prog)
  const c = mbbs.find((x) => x.country === active)

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="Study Abroad"
        title="Study *abroad.*"
        text={`Bachelor's, Master's, Diploma, PhD and MBBS, across ${allCountries.length} countries.`}
      />

      <section className="section mbbs">
        <div className="container">
          <div className="study-progs" role="tablist" aria-label="Programmes">
            {programmes.map((x) => (
              <button key={x.id} role="tab" aria-selected={x.id === prog} className={x.id === prog ? 'is-active' : ''} onClick={() => setProg(x.id)}>
                {x.label}
              </button>
            ))}
          </div>

          {prog !== 'mbbs' ? (
            <div className="mbbs-panel study-panel" key={p.id}>
              <div className="mbbs-head">
                <h2 className="h3">{p.title}</h2>
                <div className="sv-actions">
                  <Button href={waLink(`Hello IBM Consultancy, I'd like details on ${p.label} programmes abroad.`)} icon="whatsapp" className="btn-sm" magnetic={false}>
                    Ask about {p.label}
                  </Button>
                  <Button
                    href={mailLink(`Enquiry: ${p.label} abroad`, `Hello IBM Consultancy,\n\nI'd like details on ${p.label} programmes abroad.\n\nName:\nPhone:\nPreferred country:\n\nThank you.`)}
                    variant="ghost"
                    icon="mail"
                    className="btn-sm"
                    magnetic={false}
                  >
                    Email
                  </Button>
                </div>
              </div>
              <p className="study-text">{p.text}</p>
              <ul className="mbbs-notes">
                {p.points.map((x) => (
                  <li key={x}>
                    <Icon name="check" size={15} stroke={2} />
                    {x}
                  </li>
                ))}
              </ul>
              <h3 className="study-sub">
                Partner universities · {partnerCount}+ across {universities.length} countries
              </h3>
              <div className="mbbs-tabs" role="tablist" aria-label="Partner university countries">
                {universities.map((x) => (
                  <button
                    key={x.country}
                    role="tab"
                    aria-selected={x.country === uniCountry}
                    className={`chip ${x.country === uniCountry ? 'is-active' : ''}`}
                    onClick={() => setUniCountry(x.country)}
                  >
                    {x.country}
                    <span className="mbbs-count">{x.unis.length}</span>
                  </button>
                ))}
              </div>
              <ul className="uni-list" key={u.country}>
                {u.unis.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>

              {uniCountry === 'New Zealand' && (
                <div className="nz-courses">
                  <h3 className="study-sub">Courses at our NZ partner colleges</h3>
                  <div className="mbbs-tabs" role="tablist" aria-label="New Zealand colleges">
                    {nzColleges.map((x) => (
                      <button
                        key={x.name}
                        role="tab"
                        aria-selected={x.name === college}
                        className={`chip ${x.name === college ? 'is-active' : ''}`}
                        onClick={() => setCollege(x.name)}
                      >
                        {x.name}
                      </button>
                    ))}
                  </div>
                  {nz.note && <p className="study-text">{nz.note}</p>}
                  <div className="mbbs-table-wrap" key={nz.name}>
                    <table className="mbbs-table">
                      <thead>
                        <tr>
                          <th scope="col">Course</th>
                          <th scope="col">NZQA level</th>
                          <th scope="col">Duration</th>
                          <th scope="col">Campus</th>
                        </tr>
                      </thead>
                      {nz.groups.map(([group, courses]) => (
                        <tbody key={group}>
                          <tr className="nz-group">
                            <td colSpan={4}>{group}</td>
                          </tr>
                          {courses.map(([title, level, duration, campus]) => (
                            <tr key={title + level}>
                              <th scope="row">{title}</th>
                              <td>{level}</td>
                              <td>{duration}</td>
                              <td>{campus}</td>
                            </tr>
                          ))}
                        </tbody>
                      ))}
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <p className="study-text">
                {mbbsCount}+ medical universities across {mbbs.length} countries, with fees at a glance.
              </p>
              <div className="mbbs-tabs" role="tablist" aria-label="Countries">
                {mbbs.map((x) => (
                  <button
                    key={x.country}
                    role="tab"
                    aria-selected={x.country === active}
                    className={`chip ${x.country === active ? 'is-active' : ''}`}
                    onClick={() => setActive(x.country)}
                  >
                    {x.country}
                    {x.rows && <span className="mbbs-count">{x.rows.length}</span>}
                  </button>
                ))}
              </div>

              <div className="mbbs-panel" key={c.country}>
                <div className="mbbs-head">
                  <h2 className="h3">MBBS in {c.country}</h2>
                  <div className="sv-actions">
                    <Button href={waLink(`Hello IBM Consultancy, I'd like details on MBBS in ${c.country}.`)} icon="whatsapp" className="btn-sm" magnetic={false}>
                      Ask about {c.country}
                    </Button>
                    <Button
                      href={mailLink(`Enquiry: MBBS in ${c.country}`, `Hello IBM Consultancy,\n\nI'd like details on MBBS in ${c.country}: universities, fees and admission.\n\nName:\nPhone:\n\nThank you.`)}
                      variant="ghost"
                      icon="mail"
                      className="btn-sm"
                      magnetic={false}
                    >
                      Email
                    </Button>
                  </div>
                </div>

                {c.notes?.length > 0 && (
                  <ul className="mbbs-notes">
                    {c.notes.map((n) => (
                      <li key={n}>
                        <Icon name="check" size={15} stroke={2} />
                        {n}
                      </li>
                    ))}
                  </ul>
                )}

                {c.rows && (
                  <div className="mbbs-table-wrap">
                    <table className="mbbs-table">
                      <thead>
                        <tr>
                          {c.columns.map((h) => (
                            <th key={h} scope="col">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {c.rows.map((r) => (
                          <tr key={r[0]}>
                            {r.map((v, i) =>
                              i === 0 ? (
                                <th key={i} scope="row">
                                  {v}
                                </th>
                              ) : (
                                <td key={i}>{v}</td>
                              )
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {c.guide && (
                  <div className="mbbs-guide">
                    {c.guide.map((g, i) => (
                      <div key={i} className="mbbs-guide-block">
                        {g.heading && <h3>{g.heading}</h3>}
                        {g.points.map((x) => (
                          <p key={x}>{x}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                <p className="mbbs-disclaimer">Fees are indicative and change each intake. We confirm current figures before you apply.</p>
              </div>
            </>
          )}
        </div>
      </section>

      <CTA />
    </div>
  )
}
