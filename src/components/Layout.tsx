import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Github, Linkedin, Menu, Moon, Sun, X } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { profile } from '../data/profile'
import { ExternalLink } from './ui'
const nav = [
  ['/work', 'Work'],
  ['/experience', 'Experience'],
  ['/architecture', 'Architecture'],
  ['/research', 'Research'],
  ['/about', 'About'],
]
export function Layout() {
  const location = useLocation()
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
  const [menu, setMenu] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const initial = useRef(true)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('va-theme', theme)
    } catch {
      /* Storage may be unavailable in private browsing. */
    }
    window.dispatchEvent(new Event('portfolio-theme'))
  }, [theme])
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (!initial.current)
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true }),
      )
    initial.current = false
  }, [location.pathname])
  useEffect(() => {
    function escape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenu(false)
        menuButton.current?.focus()
      }
    }
    if (menu) window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [menu])
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('main-content')?.focus()
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link
            className="brand"
            to="/"
            onClick={() => setMenu(false)}
            aria-label="Vedansh Airen — home"
          >
            <span className="brand-mark">
              va<span>.</span>
            </span>
            <span className="brand-name">
              Vedansh Airen<span>SOFTWARE ENGINEER</span>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map(([to, title]) => (
              <NavLink key={to} to={to}>
                {title}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button theme-toggle"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link className="contact-nav" to="/contact">
              Let’s talk <ArrowUpRight size={16} />
            </Link>
            <button
              ref={menuButton}
              className="icon-button menu-toggle"
              onClick={() => setMenu(!menu)}
              aria-label={menu ? 'Close navigation' : 'Open navigation'}
              aria-expanded={menu}
              aria-controls="mobile-nav"
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {menu && (
          <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">
            {[...nav, ['/contact', 'Contact']].map(([to, title]) => (
              <NavLink onClick={() => setMenu(false)} key={to} to={to}>
                {title}
                <ArrowUpRight size={16} />
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <div>
            <Link className="footer-name" to="/">
              Vedansh Airen<span>↗</span>
            </Link>
            <p>
              Building useful software.
              <br />
              From the first question to the next release.
            </p>
          </div>
          <div className="footer-links">
            <ExternalLink href={profile.github}>
              <Github size={16} /> GitHub
            </ExternalLink>
            <ExternalLink href={profile.linkedin}>
              <Linkedin size={16} /> LinkedIn
            </ExternalLink>
            <a href={`mailto:${profile.email}`}>
              Email <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Vedansh Airen</span>
          <span>
            Iowa City, IA <span className="footer-dot">·</span> Built with care & TypeScript
          </span>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({
                top: 0,
                behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
                  ? 'instant'
                  : 'smooth',
              })
              document.querySelector<HTMLElement>('.brand')?.focus({ preventScroll: true })
            }}
          >
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  )
}
