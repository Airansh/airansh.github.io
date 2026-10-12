import { ArrowUpRight, GraduationCap, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { skills } from '../data/profile'
import { Eyebrow, PageHeading, ResumeLink, Tags } from '../components/ui'
export default function About() {
  return (
    <div className="container page">
      <PageHeading label="ABOUT VEDANSH" title="Curious about the whole system.">
        Software engineering, for me, means understanding how the pieces fit—and how the people
        using them actually work.
      </PageHeading>
      <div className="about-grid">
        <div className="about-text">
          <p>
            I’m a software engineer based in Iowa City, with an M.S. in Computer Science from the
            University of Iowa and more than five years of software engineering experience.
          </p>
          <p>
            I’ve built across the full application stack: database schemas and migrations, REST
            APIs, frontend interfaces, AI integrations, and workflow automation. My work has taken
            me through manufacturing operations, healthcare products, university IT, and immersive
            research.
          </p>
          <p>
            At Iowa ITS, I work with staff to understand their workflows, then help turn those needs
            into AI agents, platform configurations, and tested automation. That work also includes
            service ownership, vendor coordination, training, and technical guidance.
          </p>
          <p>
            My research background adds another perspective: connecting Unity applications with AI
            and physiological sensors, analyzing study data, and documenting methods so others can
            understand the work.
          </p>
          <ResumeLink />
        </div>
        <aside className="about-card">
          <div className="about-monogram">
            va<span>.</span>
          </div>
          <h2>Vedansh Airen</h2>
          <p>
            Software engineer.
            <br />
            Builder across domains.
          </p>
          <span>
            <MapPin size={16} /> Iowa City, Iowa
          </span>
          <Link className="text-link" to="/experience">
            Explore my experience <ArrowUpRight size={16} />
          </Link>
        </aside>
      </div>
      <section className="education-section">
        <Eyebrow>EDUCATION</Eyebrow>
        <div className="education-grid">
          <article>
            <GraduationCap size={26} />
            <span className="role-label">MAY 2024</span>
            <h2>M.S. Computer Science</h2>
            <h3>University of Iowa</h3>
            <p>GPA 3.84 / 4.0</p>
            <p>
              Software engineering and architecture, database systems, cloud computing, generative
              AI, healthcare information systems, and research ethics.
            </p>
          </article>
          <article>
            <GraduationCap size={26} />
            <span className="role-label">MAY 2021</span>
            <h2>
              B.Tech Computer Science
              <br />& Information Technology
            </h2>
            <h3>Symbiosis University of Applied Sciences</h3>
            <p>India</p>
            <p>
              A foundation in programming, web development, databases, and the software development
              lifecycle.
            </p>
          </article>
        </div>
      </section>
      <section className="skills-section">
        <Eyebrow>ENGINEERING TOOLKIT</Eyebrow>
        <h2>Tools in service of the problem.</h2>
        <p>Technologies used across professional, research, and independent work.</p>
        <div className="skills-grid">
          {Object.entries(skills).map(([title, items]) => (
            <article key={title}>
              <h3>{title}</h3>
              <Tags items={items} />
            </article>
          ))}
        </div>
      </section>
      <section className="leadership-section">
        <Eyebrow>BEYOND THE CODE</Eyebrow>
        <h2>Teaching, leadership & research practice.</h2>
        <div className="leadership-grid">
          <article>
            <h3>Community leadership</h3>
            <p>
              President of the Computer Science Graduate Student Association, University of Iowa,
              2023–24, serving a community of 50+ members.
            </p>
          </article>
          <article>
            <h3>Ideas & communication</h3>
            <p>
              IdeaStorm recognition in 2023 for “Career Insights Using VR for Neurodiverse.”
              University workshops, technical articles, and classroom teaching.
            </p>
          </article>
          <article>
            <h3>Continued learning</h3>
            <p>
              CITI training in responsible research, social and behavioral research, and export
              controls. LinkedIn Learning coursework in Azure and Power BI.
            </p>
          </article>
        </div>
      </section>
    </div>
  )
}
