import { lazy, Suspense } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { diagrams } from '../data/diagrams'
import { PageHeading } from '../components/ui'
const Diagram = lazy(() => import('../components/Diagram'))
export default function Architecture() {
  return (
    <div className="container page">
      <PageHeading label="ARCHITECTURE & SYSTEM DESIGN" title="How the systems fit together.">
        Five views into the applications I’ve worked on—from evaluation pipelines and API boundaries
        to transactional workflows and immersive research.
      </PageHeading>
      <nav className="architecture-index" aria-label="System views">
        {diagrams.map((d, i) => (
          <a
            key={d.id}
            href={`#system-${d.id}`}
            onClick={(e) => {
              e.preventDefault()
              const section = document.getElementById(`system-${d.id}`)
              section?.scrollIntoView({ behavior: 'instant', block: 'start' })
              section?.focus({ preventScroll: true })
            }}
          >
            <span>0{i + 1}</span>
            {d.title}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        ))}
      </nav>
      <div className="architecture-list">
        {diagrams.map((d, i) => (
          <article key={d.id} id={`system-${d.id}`} tabIndex={-1}>
            <div className="architecture-heading">
              <span className="section-number">0{i + 1}</span>
              <div>
                <span className="role-label">{d.kind}</span>
                <h2>{d.title}</h2>
              </div>
              {d.project && (
                <Link className="text-link" to={`/work/${d.project}`}>
                  Project details <ArrowUpRight size={16} />
                </Link>
              )}
            </div>
            <Suspense fallback={<div className="diagram-panel loading">Loading architecture…</div>}>
              <Diagram diagram={d} />
            </Suspense>
          </article>
        ))}
      </div>
    </div>
  )
}
