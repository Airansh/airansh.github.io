import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  BriefcaseBusiness,
  Cpu,
  Database,
  Github,
  Layers3,
  ScanLine,
  Workflow,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { featuredProjects, projects } from '../data/projects'
import { profile } from '../data/profile'
import { ExternalLink, Eyebrow, ProjectCard, ResumeLink } from '../components/ui'
export default function Home() {
  return (
    <div className="home">
      <section className="hero container">
        <div className="hero-copy">
          <Eyebrow>FULL-STACK ENGINEERING · APPLIED AI</Eyebrow>
          <h1 tabIndex={-1}>
            Thoughtful systems.
            <br />
            <span>Real-world impact.</span>
          </h1>
          <p className="hero-intro">
            I’m Vedansh. I build software that connects complex systems to the people who use them.
          </p>
          <p className="hero-description">
            From enterprise AI and healthcare applications to manufacturing workflows and immersive
            research—across the full path from schema to screen.
          </p>
          <div className="hero-buttons">
            <Link to="/work" className="button primary">
              Explore my work <ArrowUpRight size={18} />
            </Link>
            <ResumeLink />
          </div>
          <div className="hero-location">
            <span className="status-dot" />
            Iowa City, IA<span className="divider">/</span>M.S. Computer Science, University of Iowa
          </div>
        </div>
        <div
          className="hero-blueprint"
          aria-label="Engineering across applications, intelligence, and data"
        >
          <div className="blueprint-top">
            <span>
              <span className="status-dot" /> ENGINEERING ACROSS THE STACK
            </span>
            <span>01—03</span>
          </div>
          <div className="blueprint-grid">
            <div className="blueprint-node top-node">
              <div className="node-icon">
                <Braces size={25} />
              </div>
              <div>
                <small>01 / THE EXPERIENCE</small>
                <strong>Useful applications</strong>
                <p>Web · Healthcare · Immersive systems</p>
              </div>
              <ArrowUpRight size={16} />
            </div>
            <div className="connector">
              <span />
              Interfaces meet intelligence
              <span />
            </div>
            <div className="blueprint-node middle-node">
              <div className="node-icon">
                <Cpu size={25} />
              </div>
              <div>
                <small>02 / THE INTELLIGENCE</small>
                <strong>AI with a purpose</strong>
                <p>Agents · Evaluation · Automation</p>
              </div>
              <ArrowUpRight size={16} />
            </div>
            <div className="connector">
              <span />
              Built on dependable foundations
              <span />
            </div>
            <div className="blueprint-node bottom-node">
              <div className="node-icon">
                <Database size={25} />
              </div>
              <div>
                <small>03 / THE FOUNDATION</small>
                <strong>Systems that connect</strong>
                <p>APIs · Data · Cloud infrastructure</p>
              </div>
              <ArrowUpRight size={16} />
            </div>
          </div>
          <div className="blueprint-bottom">
            <span>DESIGN → BUILD → TEST → OPERATE</span>
            <span className="blueprint-cross">+</span>
          </div>
        </div>
      </section>
      <div className="impact-strip">
        <div className="container impact-grid">
          <div>
            <strong>
              5<span>+</span>
            </strong>
            <p>
              Years of software
              <br />
              engineering experience
            </p>
          </div>
          <div>
            <strong>
              1,000<span>+</span>
            </strong>
            <p>
              Users supported by
              <br />
              institutional AI agents
            </p>
          </div>
          <div>
            <strong>3</strong>
            <p>
              Healthcare products
              <br />
              developed concurrently
            </p>
          </div>
          <div>
            <strong>7</strong>
            <p>
              Companies using the
              <br />
              Simplex operations app
            </p>
          </div>
        </div>
      </div>
      <section className="section container">
        <div className="section-heading">
          <div>
            <Eyebrow>SELECTED WORK</Eyebrow>
            <h2>
              Different domains.
              <br />
              <span>The same engineering care.</span>
            </h2>
          </div>
          <div className="section-heading-aside">
            <p>
              A selection of professional systems,
              <br />
              independent builds, and research.
            </p>
            <Link className="text-link" to="/work">
              Explore all {projects.length} projects <ArrowRight size={17} />
            </Link>
          </div>
        </div>
        <div className="featured-grid">
          {featuredProjects.map((p, i) => (
            <ProjectCard key={p.id} project={p} visual index={i} />
          ))}
        </div>
      </section>
      <section className="section approach-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>HOW I WORK</Eyebrow>
              <h2>
                From the first question
                <br />
                to the next release.
              </h2>
            </div>
            <Link className="text-link" to="/architecture">
              Explore system designs <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="approach-grid">
            {[
              {
                icon: BriefcaseBusiness,
                n: '01',
                title: 'Understand the work',
                body: 'Start with the people, constraints, and existing process. Define what a useful outcome looks like.',
              },
              {
                icon: Layers3,
                n: '02',
                title: 'Connect the pieces',
                body: 'Design clear boundaries between interfaces, application logic, data, and external services.',
              },
              {
                icon: ScanLine,
                n: '03',
                title: 'Make it testable',
                body: 'Build in validation, traceable results, and meaningful checks. Keep limitations visible.',
              },
              {
                icon: Workflow,
                n: '04',
                title: 'Support the system',
                body: 'Carry the work through release, documentation, user training, and ongoing improvement.',
              },
            ].map((item) => (
              <article key={item.n}>
                <div>
                  <item.icon size={22} />
                  <span>{item.n}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section container career-preview">
        <div>
          <Eyebrow>EXPERIENCE IN CONTEXT</Eyebrow>
          <h2>Software is a team sport.</h2>
          <p>
            My work spans university IT, healthcare product teams, research labs, and manufacturing
            operations. The common thread: learning the domain and building with the people who know
            it best.
          </p>
          <Link className="text-link" to="/experience">
            Follow the full journey <ArrowRight size={17} />
          </Link>
        </div>
        <div className="career-list">
          {[
            ['University of Iowa', 'Enterprise AI & immersive research'],
            ['FarrPro', 'Full-stack healthcare products'],
            ['Chenoa Information Services', 'Healthcare workflows & data'],
            ['Simplex Metal Processors', 'Manufacturing software & automation'],
          ].map(([name, desc], i) => (
            <Link to="/experience" key={name}>
              <span className="career-number">0{i + 1}</span>
              <span>
                <strong>{name}</strong>
                <small>{desc}</small>
              </span>
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </div>
      </section>
      <section className="contact-band container">
        <Eyebrow>LET’S BUILD SOMETHING USEFUL</Eyebrow>
        <div>
          <h2>
            A good conversation
            <br />
            is a good place to start.
          </h2>
          <Link className="button primary" to="/contact">
            Get in touch <ArrowUpRight size={18} />
          </Link>
        </div>
        <ExternalLink className="text-link" href={profile.github}>
          <Github size={17} /> Explore the code on GitHub
        </ExternalLink>
      </section>
    </div>
  )
}
