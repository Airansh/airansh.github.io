import { ArrowUpRight, BookOpen, FileText, Mic } from 'lucide-react'
import { publications } from '../data/profile'
import { ExternalLink, PageHeading } from '../components/ui'
export default function Research() {
  return (
    <div className="container page">
      <PageHeading label="RESEARCH & WRITING" title="Build. Investigate. Share.">
        Research in immersive systems, practical guidance for AI adoption, and the conversations
        that connect engineering with the people it serves.
      </PageHeading>
      <section className="research-section">
        <div className="section-heading">
          <h2>Research & publications</h2>
          <span className="small-note">AI · Virtual reality · IoT</span>
        </div>
        {publications
          .filter((p) => ['Publication', 'Manuscript'].includes(p.type))
          .map((p) => (
            <article className="publication-card" key={p.id}>
              <div className="publication-icon">
                <BookOpen size={22} />
              </div>
              <div>
                <div className="card-meta">
                  <span>{p.type}</span>
                  <span>{p.year}</span>
                </div>
                <h3>{p.title}</h3>
                {p.authors && <p className="authors">{p.authors}</p>}
                <p>{p.description}</p>
                <div className="publication-venue">{p.venue}</div>
                {p.status && <span className="status-badge">{p.status}</span>}
                {p.url && (
                  <ExternalLink className="text-link" href={p.url}>
                    Conference program <ArrowUpRight size={15} />
                  </ExternalLink>
                )}
              </div>
            </article>
          ))}
      </section>
      <section className="research-section">
        <div className="section-heading">
          <h2>Technical writing</h2>
          <span className="small-note">University of Iowa ITS</span>
        </div>
        <div className="writing-grid">
          {publications
            .filter((p) => p.type === 'Article')
            .map((p) => (
              <article className="writing-card" key={p.id}>
                <FileText size={22} />
                <span className="card-meta">AI & INSTITUTIONAL WORK · {p.year}</span>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <ExternalLink className="text-link" href={p.url!}>
                  Read article
                </ExternalLink>
              </article>
            ))}
        </div>
        <p className="small-note source-note">
          Publication details and article URLs come from the supplied resumes. Publisher and ITS
          pages could not be independently accessed during site preparation.
        </p>
      </section>
      <section className="research-section">
        <h2>Talks & presentations</h2>
        {publications
          .filter((p) => p.type === 'Talk')
          .map((p) => (
            <article className="talk-row" key={p.id}>
              <Mic size={22} />
              <div>
                <span className="role-label">
                  {p.venue} · {p.year}
                </span>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>
            </article>
          ))}
      </section>
      <section className="writing-note">
        <span className="role-label">NEXT ON THE WRITING DESK</span>
        <h2>Engineering notes, in the making.</h2>
        <p>
          Space for future articles on software architecture, AI evaluation, delivery practices, and
          lessons from building real systems. New writing will appear here when published.
        </p>
      </section>
    </div>
  )
}
