import { lazy, Suspense, useEffect } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Github, Layers3 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { projects } from '../data/projects'
import { diagrams } from '../data/diagrams'
import { CopyButton, ExternalLink, Eyebrow, ProjectCard, Tags } from '../components/ui'
import NotFound from './NotFound'
const Diagram = lazy(() => import('../components/Diagram'))
export default function ProjectDetail() {
  const { id } = useParams()
  const project = projects.find((p) => p.id === id)
  useEffect(() => {
    if (project) {
      document.title = `${project.title} — Vedansh Airen`
      document.querySelector('meta[name="description"]')?.setAttribute('content', project.summary)
    }
  }, [project])
  if (!project) return <NotFound />
  const study = project.study
  const diagram = diagrams.find((d) => d.id === project.diagram)
  const related = projects
    .filter(
      (p) =>
        p.id !== project.id &&
        (p.organization === project.organization || p.category === project.category),
    )
    .slice(0, 3)
  const sections = [
    'Overview',
    'Contributions',
    ...(study ? ['Requirements', 'Implementation', 'Testing & validation', 'Tradeoffs'] : []),
    ...(diagram ? ['Architecture'] : []),
    'Results',
    'Sources',
  ]
  return (
    <div className="container page detail-page">
      <Link className="back-link" to="/work">
        <ArrowLeft size={16} /> All work
      </Link>
      <header className="detail-heading">
        <Eyebrow>
          {project.context} / {project.category}
        </Eyebrow>
        <h1 tabIndex={-1}>{project.title}</h1>
        <p className="detail-subtitle">{project.subtitle}</p>
        <p>{project.summary}</p>
        <div className="detail-actions">
          {project.github && (
            <ExternalLink className="button primary" href={project.github}>
              <Github size={17} /> View repository
            </ExternalLink>
          )}
          <CopyButton value={window.location.href} />
        </div>
      </header>
      <dl className="project-facts">
        <div>
          <dt>Context</dt>
          <dd>{project.organization}</dd>
        </div>
        <div>
          <dt>Period</dt>
          <dd>{project.period}</dd>
        </div>
        <div>
          <dt>Work type</dt>
          <dd>
            {project.context}
            {study ? ' · Case study' : ' · Project overview'}
          </dd>
        </div>
      </dl>
      <div className="detail-layout">
        <aside className="case-sidebar">
          <p>IN THIS PROJECT</p>
          <nav aria-label="Case study sections">
            {sections.map((s) => (
              <a
                key={s}
                href={`#${s}`}
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById(s)
                  el?.scrollIntoView({ behavior: 'instant', block: 'start' })
                  el?.focus({ preventScroll: true })
                }}
              >
                {s}
              </a>
            ))}
          </nav>
          <div className="sidebar-tech">
            <p>TECHNOLOGY</p>
            <Tags items={project.tech} />
          </div>
        </aside>
        <div className="case-content">
          <section id="Overview" tabIndex={-1}>
            <h2>{study ? 'The problem' : 'Overview'}</h2>
            <p>{study?.problem || project.summary}</p>
            {study && (
              <>
                <h3>My role</h3>
                <p>{study.role}</p>
              </>
            )}
          </section>
          <section id="Contributions" tabIndex={-1}>
            <h2>What I contributed</h2>
            <ul className="contribution-list">
              {project.contributions.map((c) => (
                <li key={c}>
                  <ArrowUpRight size={16} />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>
          {project.id === 'evalforge' && (
            <figure className="case-screenshot">
              <img
                src={`${import.meta.env.BASE_URL}images/evalforge.webp`}
                alt="EvalForge results showing correctness, groundedness, required-fact coverage, and latency across evaluated models"
                width="800"
                height="470"
              />
              <figcaption>
                Actual interface from the public EvalForge repository’s documented live runs.
              </figcaption>
            </figure>
          )}
          {study && (
            <>
              <section id="Requirements" tabIndex={-1}>
                <h2>Requirements & constraints</h2>
                <ul>
                  {study.requirements.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </section>
              <section id="Implementation" tabIndex={-1}>
                <h2>Implementation highlights</h2>
                <ol className="implementation-list">
                  {study.implementation.map((item, i) => (
                    <li key={item}>
                      <span>{String(i + 1).padStart(2, '0')}</span>
                      <p>{item}</p>
                    </li>
                  ))}
                </ol>
              </section>
              <section id="Testing & validation" tabIndex={-1}>
                <h2>Testing & validation</h2>
                <p>{study.validation}</p>
              </section>
              <section id="Tradeoffs" tabIndex={-1}>
                <h2>Tradeoffs & limitations</h2>
                <p>{study.tradeoffs}</p>
              </section>
            </>
          )}
          {diagram && (
            <section id="Architecture" tabIndex={-1}>
              <h2>System view</h2>
              <Suspense fallback={<p>Loading architecture…</p>}>
                <Diagram diagram={diagram} />
              </Suspense>
            </section>
          )}
          <section id="Results" tabIndex={-1}>
            <h2>Results & impact</h2>
            {study && <p>{study.outcome}</p>}
            <div className="result-cards">
              {project.outcomes.map((o) => (
                <div key={o}>
                  <Check size={18} />
                  <span>{o}</span>
                </div>
              ))}
            </div>
          </section>
          {study?.further && (
            <section className="documentation-note">
              <Layers3 size={22} />
              <div>
                <h3>Further documentation</h3>
                {study.further.map((f) => (
                  <p key={f}>{f}</p>
                ))}
              </div>
            </section>
          )}
          {!study && (
            <div className="documentation-note">
              <Layers3 size={22} />
              <div>
                <h3>A focused project overview</h3>
                <p>
                  This entry covers the contributions supported by the available materials. Detailed
                  architecture, implementation decisions, and test reports can be added as
                  supporting documentation becomes available.
                </p>
              </div>
            </div>
          )}
          <section id="Sources" tabIndex={-1}>
            <h2>Sources & supporting material</h2>
            <ul className="source-list">
              {project.sources.map((s) => (
                <li key={s.label}>
                  {s.url ? (
                    <ExternalLink className="text-link" href={s.url}>
                      {s.label}
                    </ExternalLink>
                  ) : (
                    <span>
                      {s.label} <small>Supplied by Vedansh</small>
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {project.context === 'Professional' && (
              <p className="small-note">
                Professional work is described at the scope supported by the supplied resume.
                Internal code and confidential implementation details are not included.
              </p>
            )}
          </section>
        </div>
      </div>
      {related.length > 0 && (
        <section className="related-work">
          <div className="section-heading">
            <h2>Keep exploring.</h2>
            <Link className="text-link" to="/work">
              All projects <ArrowRight size={16} />
            </Link>
          </div>
          <div className="work-grid">
            {related.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
