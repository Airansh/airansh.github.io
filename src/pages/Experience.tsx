import { ArrowUpRight, MapPin, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { experiences } from '../data/profile'
import { projects } from '../data/projects'
import { PageHeading, ResumeLink } from '../components/ui'
export default function Experience() {
  return (
    <div className="container page">
      <PageHeading label="EXPERIENCE" title="The work behind the work.">
        From manufacturing software to enterprise AI. A career built around learning the domain,
        working with people, and delivering useful systems.
      </PageHeading>
      <div className="experience-intro">
        <span>
          <MapPin size={16} /> Iowa City, IA · Previously India
        </span>
        <ResumeLink />
      </div>
      <div className="timeline">
        {experiences.map((e, i) => (
          <article className="timeline-item" key={e.id}>
            <div className="timeline-date">
              <span>{e.period}</span>
              <small>{e.location}</small>
            </div>
            <div className="timeline-content">
              <div className="timeline-dot" />
              <span className="role-label">{e.role}</span>
              <h2>{e.organization}</h2>
              {e.kind && <div className="role-kind">{e.kind}</div>}
              <p>{e.summary}</p>
              <details open={i < 2}>
                <summary>
                  Contributions & related work <Plus size={16} />
                </summary>
                <ul>
                  {e.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                {e.projects.length > 0 && (
                  <div className="timeline-projects">
                    {e.projects.map((id) => {
                      const p = projects.find((p) => p.id === id)
                      return p ? (
                        <Link key={id} to={`/work/${id}`}>
                          {p.title}
                          <ArrowUpRight size={14} />
                        </Link>
                      ) : null
                    })}
                  </div>
                )}
              </details>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
