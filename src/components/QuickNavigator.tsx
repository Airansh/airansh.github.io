import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { projects } from '../data/projects'

const pages = ['Home', 'Work', 'Experience', 'Architecture', 'Research', 'About', 'Contact']
const entries = [
  ...pages.map((label) => ({
    id: `page-${label}`,
    label,
    detail: 'Page',
    to: label === 'Home' ? '/' : `/${label.toLowerCase()}`,
  })),
  ...projects.map((project) => ({
    id: project.id,
    label: project.title,
    detail: project.category,
    to: `/work/${project.id}`,
  })),
]

function Navigator({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  const results = entries
    .filter((entry) =>
      words.every((word) => `${entry.label} ${entry.detail}`.toLowerCase().includes(word)),
    )
    .slice(0, 12)
  useEffect(() => {
    const modal = dialog.current
    const previous = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    modal?.showModal()
    input.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      modal?.close()
      document.body.style.overflow = previousOverflow
      previous?.focus()
    }
  }, [])
  useEffect(() => {
    dialog.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active, query])
  const choose = (to: string) => {
    onClose()
    navigate(to)
  }
  return (
    <dialog
      ref={dialog}
      className="navigator-dialog"
      aria-labelledby="navigator-title"
      onClose={() => {
        if (!dialog.current?.open) onClose()
      }}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const rect = event.currentTarget.getBoundingClientRect()
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose()
      }}
    >
      <div className="navigator-heading">
        <h2 id="navigator-title">Quick navigation</h2>
        <button
          type="button"
          className="icon-button"
          aria-label="Close quick navigation"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <div className="navigator-search">
        <Search size={20} aria-hidden="true" />
        <label className="sr-only" htmlFor="navigator-query">
          Search pages and projects
        </label>
        <input
          ref={input}
          id="navigator-query"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="true"
          aria-controls="navigator-results"
          aria-activedescendant={results[active] ? `result-${results[active].id}` : undefined}
          placeholder="Search pages and projects…"
          maxLength={150}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setActive(Math.min(active + 1, results.length - 1))
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault()
              setActive(Math.max(0, active - 1))
            }
            if (event.key === 'Enter' && results[active]) {
              event.preventDefault()
              choose(results[active].to)
            }
          }}
        />
      </div>
      <div
        id="navigator-results"
        className="navigator-results"
        role="listbox"
        aria-label="Pages and projects"
      >
        {results.map((entry, index) => (
          <button
            key={entry.id}
            id={`result-${entry.id}`}
            type="button"
            role="option"
            aria-selected={active === index}
            tabIndex={-1}
            onClick={() => choose(entry.to)}
          >
            <span>
              <strong>{entry.label}</strong>
              <small>{entry.detail}</small>
            </span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </button>
        ))}
      </div>
      {!results.length && (
        <p className="navigator-empty" role="status">
          No matching pages or projects.
        </p>
      )}
      <p className="navigator-help">↑ ↓ to explore · Enter to open · Esc to close</p>
    </dialog>
  )
}
export function NavigatorLauncher() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        !event.altKey &&
        !event.shiftKey &&
        event.key.toLowerCase() === 'k' &&
        !document.querySelector('dialog[open]')
      ) {
        event.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [])
  return (
    <>
      <button
        type="button"
        className="icon-button navigator-launcher"
        aria-label="Open quick navigation"
        aria-haspopup="dialog"
        aria-keyshortcuts="Control+k Meta+k"
        title="Search pages and projects (Ctrl/⌘ K)"
        onClick={() => setOpen(true)}
      >
        <Search size={18} aria-hidden="true" />
      </button>
      {open && <Navigator onClose={() => setOpen(false)} />}
    </>
  )
}
