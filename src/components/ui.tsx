import { useState } from 'react'
import { ArrowUpRight, Check, Copy, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { Project } from '../data/types'
import { profile } from '../data/profile'
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="eyebrow">
      <span className="tiny-line" />
      {children}
    </div>
  )
}
export function PageHeading({
  label,
  title,
  children,
}: {
  label: string
  title: string
  children: ReactNode
}) {
  return (
    <header className="page-heading">
      <Eyebrow>{label}</Eyebrow>
      <h1 tabIndex={-1}>{title}</h1>
      <p>{children}</p>
    </header>
  )
}
export function ExternalLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ArrowUpRight size={15} aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
export function ResumeLink({ className = 'button secondary' }: { className?: string }) {
  return (
    <a className={className} href={`${import.meta.env.BASE_URL}${profile.resume}`} download>
      <Download size={16} aria-hidden="true" /> Download resume
    </a>
  )
}
export function Tags({ items }: { items: string[] }) {
  return (
    <div className="tags">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  )
}
export function CopyButton({ value, label = 'Copy link' }: { value: string; label?: string }) {
  const [status, setStatus] = useState('')
  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setStatus('Copied')
    } catch {
      setStatus('Copy unavailable')
    }
  }
  return (
    <button type="button" className="copy-button" onClick={copy}>
      {status === 'Copied' ? <Check size={15} /> : <Copy size={15} />}
      <span aria-live="polite">{status || label}</span>
    </button>
  )
}
export function ProjectVisual({ project }: { project: Project }) {
  if (project.id === 'evalforge')
    return (
      <div className="project-visual visual-eval">
        <div className="visual-caption">MODEL EVALUATION / REGRESSION TESTING</div>
        <img
          src={`${import.meta.env.BASE_URL}images/evalforge.webp`}
          alt="EvalForge results interface comparing model evaluation scores"
          loading="lazy"
          width="800"
          height="470"
        />
      </div>
    )
  const type = project.category
  return (
    <div className={`project-visual visual-${project.id}`} aria-hidden="true">
      <span className="visual-caption">
        {project.id === 'iowa-ai-gateway'
          ? 'ONE WORKSPACE. MULTIPLE MODELS.'
          : project.id === 'titronics-cloud'
            ? 'CONNECTED HEALTHCARE'
            : project.id === 'vr-classroom'
              ? 'HUMAN × MACHINE'
              : project.id === 'simplex-operations'
                ? 'OPERATIONS, AUTOMATED.'
                : 'ARCHITECTURE IN PRACTICE'}
      </span>
      {type === 'AI & LLM Systems' ? (
        <div className="model-map">
          <span>OpenAI</span>
          <span>Anthropic</span>
          <span>Bedrock</span>
          <div className="model-hub">
            Iowa AI Gateway <small>HawkID SSO</small>
          </div>
        </div>
      ) : type === 'Healthcare Software' ? (
        <div className="health-visual">
          <svg viewBox="0 0 300 80">
            <path d="M0 43H60L73 30 87 57 107 10 127 70 143 35 160 43H300" />
          </svg>
          <div>
            <span>SCAN ACCESS</span>
            <span>PROVIDERS</span>
            <span>PATIENTS</span>
          </div>
        </div>
      ) : type === 'XR & Generative Media' ? (
        <div className="vr-visual">
          <div className="vr-ring" />
          <div className="vr-ring second" />
          <span>VR</span>
          <small>Unity · AI · Real-time HRV</small>
        </div>
      ) : type === 'Automation & Data' ? (
        <div className="pipeline-visual">
          <span>
            01<small>Capture</small>
          </span>
          <i>→</i>
          <span>
            02<small>Process</small>
          </span>
          <i>→</i>
          <span>
            03<small>Deliver</small>
          </span>
        </div>
      ) : (
        <div className="layers-visual">
          <span>React interface</span>
          <span>
            Express API <i>REST</i>
          </span>
          <span>
            MySQL <i>DATA</i>
          </span>
        </div>
      )}
    </div>
  )
}
export function ProjectCard({
  project,
  visual = false,
  index,
}: {
  project: Project
  visual?: boolean
  index?: number
}) {
  return (
    <article className={`project-card ${visual ? 'with-visual' : ''}`}>
      {visual && <ProjectVisual project={project} />}
      <div className="project-card-body">
        <div className="card-meta">
          <span>
            {project.context} /{' '}
            {project.category.replace(' Applications', '').replace(' Software', '')}
          </span>
          {index !== undefined && <span>{String(index + 1).padStart(2, '0')}</span>}
        </div>
        <h3>
          <Link to={`/work/${project.id}`} className="card-link">
            {project.title}
            <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </h3>
        <p>{project.summary}</p>
        <Tags items={project.tech.slice(0, 4)} />
        <div className="card-footer">
          <span>{project.organization}</span>
          <span>
            {project.study ? 'Case study' : 'Project overview'} <span aria-hidden="true">↗</span>
          </span>
        </div>
      </div>
    </article>
  )
}
