import { Suspense, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Github, Linkedin, Menu, Moon, Sun, X } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { profile } from '../data/profile'
import { ExternalLink, ResumeLink } from './ui'
import { RouteMotion } from './RouteMotion'
import { ChatWidget } from './ChatWidget'
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
  const header = useRef<HTMLElement>(null)
  const initial = useRef(true)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'light' ? '#f7f8f2' : '#0e1512')
    try {
      localStorage.setItem('va-theme', theme)
    } catch {
      /* Storage may be unavailable in private browsing. */
    }
    window.dispatchEvent(new Event('portfolio-theme'))
  }, [theme])
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    let observer: MutationObserver | undefined
    const frame = requestAnimationFrame(() => {
      if (initial.current) {
        initial.current = false
        return
      }
      function focusHeading() {
        const heading = document.querySelector<HTMLElement>('main h1')
        if (!heading || !heading.getClientRects().length) return false
        heading.focus({ preventScroll: true })
        observer?.disconnect()
        return true
      }
      if (!focusHeading()) {
        observer = new MutationObserver(focusHeading)
        const main = document.getElementById('main-content')
        if (main) observer.observe(main, { childList: true, subtree: true })
      }
    })
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [location.pathname])
  useEffect(() => {
    function escape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenu(false)
        menuButton.current?.focus()
      }
    }
    function outside(e: PointerEvent) {
      if (!header.current?.contains(e.target as Node)) setMenu(false)
    }
    function resize() {
      if (window.innerWidth > 960) {
        if (document.getElementById('mobile-nav')?.contains(document.activeElement))
          document.querySelector<HTMLElement>('.brand')?.focus()
        setMenu(false)
      }
    }
    if (menu) {
      window.addEventListener('keydown', escape)
      window.addEventListener('pointerdown', outside)
      window.addEventListener('resize', resize)
    }
    return () => {
      window.removeEventListener('keydown', escape)
      window.removeEventListener('pointerdown', outside)
      window.removeEventListener('resize', resize)
    }
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
      <header
        ref={header}
        className="site-header"
        onBlurCapture={(e) => {
          if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) setMenu(false)
        }}
      >
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
        <RouteMotion />
        <Suspense
          fallback={
            <div className="page-loading" role="status">
              Loading page…
            </div>
          }
        >
          <Outlet />
        </Suspense>
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
            <ResumeLink className="footer-resume" />
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
            Iowa City, IA <span className="footer-dot">·</span> Full-stack engineering & applied AI
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
      <ChatWidget />
    </>
  )
}
