import { useRef, useState } from 'react'
import useReveal from '../hooks/useReveal'
import { mbbs } from '../data/mbbs'
import Icon from '../components/Icon'
import Button from '../components/Button'
import { CTA, PageHero } from '../components/Sections'
import { waLink } from '../data/site'

const universities = mbbs.reduce((n, c) => n + (c.rows?.length || 0), 0)

export default function Mbbs() {
  const ref = useRef(null)
  useReveal(ref)
  const [active, setActive] = useState(mbbs[0].country)
  const c = mbbs.find((x) => x.country === active)

  return (
    <div ref={ref}>
      <PageHero
        eyebrow="MBBS Abroad"
        title="Study medicine *abroad.*"
        text={`${universities}+ universities across ${mbbs.length} countries, with fees at a glance.`}
      />

      <section className="section mbbs">
        <div className="container">
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
              <Button href={waLink(`Hello IBM Consultancy, I'd like details on MBBS in ${c.country}.`)} icon="whatsapp" className="btn-sm" magnetic={false}>
                Ask about {c.country}
              </Button>
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
                    {g.points.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            <p className="mbbs-disclaimer">Fees are indicative and change each intake. We confirm current figures before you apply.</p>
          </div>
        </div>
      </section>

      <CTA />
    </div>
  )
}
