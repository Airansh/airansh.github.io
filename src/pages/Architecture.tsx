import { lazy, Suspense } from 'react'
import { ArrowUpRight, FileCode2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { diagrams, diagramTemplates, plannedDesigns } from '../data/diagrams'
import { PageHeading } from '../components/ui'
import { CodeBlock } from '../components/CodeBlock'
const Diagram = lazy(() => import('../components/Diagram'))
export default function Architecture() {
  return (
    <div className="container page">
      <PageHeading label="ARCHITECTURE & SYSTEM DESIGN" title="Make the system understandable.">
        Interfaces, boundaries, data flow, and the decisions between them. These views draw from
        documented projects and make their scope explicit.
      </PageHeading>
      <div className="architecture-list">
        {diagrams.map((d, i) => (
          <article key={d.id}>
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
      <section className="planned-section">
        <div className="section-heading">
          <div>
            <span className="role-label">PLANNED DESIGN EXERCISES</span>
            <h2>Room to explore.</h2>
          </div>
        </div>
        <p>
          Future exercises for working through requirements, scale, failure modes, and tradeoffs.
          These are planned studies, not completed professional systems.
        </p>
        <div className="planned-grid">
          {plannedDesigns.map((title) => (
            <div key={title}>
              <FileCode2 size={19} />
              <span>{title}</span>
              <small>Planned</small>
            </div>
          ))}
        </div>
      </section>
      <section className="templates-section">
        <span className="role-label">REUSABLE STARTING POINTS</span>
        <h2>Diagram templates</h2>
        <p>
          Small, illustrative Mermaid templates for future case studies. These examples do not
          describe a completed project.
        </p>
        <div className="templates-grid">
          {diagramTemplates.map((t) => (
            <details key={t.title}>
              <summary>{t.title}</summary>
              <CodeBlock title="Mermaid template" code={t.code} language="plain" />
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
