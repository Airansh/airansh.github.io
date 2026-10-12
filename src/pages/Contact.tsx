import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'
import { profile } from '../data/profile'
import { CopyButton, ExternalLink, PageHeading, ResumeLink } from '../components/ui'
export default function Contact() {
  return (
    <div className="container page contact-page">
      <PageHeading label="CONTACT" title="Let’s start a conversation.">
        Have an engineering opportunity, an interesting problem, or a research idea? I’d be glad to
        hear about it.
      </PageHeading>
      <div className="contact-email">
        <span className="role-label">THE BEST WAY TO REACH ME</span>
        <a href={`mailto:${profile.email}`}>
          {profile.email}
          <ArrowUpRight />
        </a>
        <CopyButton value={profile.email} label="Copy email address" />
      </div>
      <div className="contact-options">
        <ExternalLink className="contact-option" href={profile.github}>
          <Github size={24} />
          <span>
            <strong>GitHub</strong>
            <small>Explore source code & projects</small>
          </span>
        </ExternalLink>
        <ExternalLink className="contact-option" href={profile.linkedin}>
          <Linkedin size={24} />
          <span>
            <strong>LinkedIn</strong>
            <small>Connect & follow my work</small>
          </span>
        </ExternalLink>
        <a className="contact-option" href={`mailto:${profile.email}`}>
          <Mail size={24} />
          <span>
            <strong>Email</strong>
            <small>Opportunities & collaborations</small>
          </span>
          <ArrowUpRight size={15} />
        </a>
      </div>
      <div className="contact-resume">
        <p>A snapshot of my experience, projects, and technical background.</p>
        <ResumeLink />
      </div>
    </div>
  )
}
