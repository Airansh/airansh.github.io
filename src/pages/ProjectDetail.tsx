import { lazy, Suspense, useEffect } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Github, Layers3, Globe } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { projects } from '../data/projects'
import { diagrams } from '../data/diagrams'
import { CopyButton, ExternalLink, Eyebrow, ProjectCard, Tags } from '../components/ui'
import NotFound from './NotFound'
import { ProjectMedia } from '../components/ProjectMedia'
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
  const publicLinks = project.sources.filter(
    (source) => source.url && !project.links?.some((link) => link.url === source.url),
  )
  const sections = [
    'Overview',
    'Contributions',
    ...(project.screenshots?.length ? ['Work previews'] : []),
    ...(study ? ['Requirements', 'Implementation', 'Testing & validation', 'Tradeoffs'] : []),
    ...(diagram ? ['Architecture'] : []),
    'Results',
    ...(publicLinks.length ? ['Project links'] : []),
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
          {project.links?.map((link) => (
            <ExternalLink key={link.url} className="button secondary" href={link.url}>
              <Globe size={17} aria-hidden="true" />
              {link.label}
            </ExternalLink>
          ))}
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
          {project.screenshots?.length ? (
            <ProjectMedia images={project.screenshots} title={project.title} />
          ) : null}
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
          {study?.nextSteps && (
            <section className="documentation-note">
              <Layers3 size={22} />
              <div>
                <h3>Potential improvements</h3>
                {study.nextSteps.map((f) => (
                  <p key={f}>{f}</p>
                ))}
              </div>
            </section>
          )}
          {project.id === 'chenoa-healthcare' && (
            <p className="small-note client-context">
              Cranial Technologies was the client for the healthcare workflow application developed
              at Chenoa. Its public website is provided for client context, rather than as a demo of
              the internal application.
            </p>
          )}
          {publicLinks.length > 0 && (
            <section id="Project links" tabIndex={-1}>
              <h2>Project links</h2>
              <ul className="source-list">
                {publicLinks.map((link) => (
                  <li key={link.url}>
                    <ExternalLink className="text-link" href={link.url!}>
                      {link.label}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </section>
          )}
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
