import { useEffect, useId, useRef, useState } from 'react'
import { Expand, Minus, Plus, X } from 'lucide-react'
import type { DiagramDefinition } from '../data/diagrams'
import { CopyButton } from './ui'
export default function Diagram({ diagram }: { diagram: DiagramDefinition }) {
  const id = useId().replaceAll(':', '').replaceAll('«', '').replaceAll('»', '')
  const [svg, setSvg] = useState('')
  const [error, setError] = useState(false)
  const [theme, setTheme] = useState(document.documentElement.dataset.theme)
  const [zoom, setZoom] = useState(1)
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const update = () => setTheme(document.documentElement.dataset.theme)
    window.addEventListener('portfolio-theme', update)
    return () => window.removeEventListener('portfolio-theme', update)
  }, [])
  useEffect(() => {
    let cancelled = false
    async function render() {
      try {
        const { default: mermaid } = await import('mermaid')
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: theme === 'light' ? 'default' : 'dark',
          fontFamily: 'DM Sans, sans-serif',
          themeVariables: {
            primaryColor: theme === 'light' ? '#e0eee7' : '#20352b',
            primaryTextColor: theme === 'light' ? '#172920' : '#e5f0e9',
            primaryBorderColor: '#638c76',
            lineColor: '#83a797',
            fontSize: '14px',
          },
        })
        const rendered = await mermaid.render(`diagram-${id}-${theme}`, diagram.code)
        if (!cancelled) {
          setSvg(rendered.svg)
          setError(false)
        }
      } catch {
        if (!cancelled) setError(true)
      }
    }
    void render()
    return () => {
      cancelled = true
    }
  }, [diagram.code, id, theme])
  return (
    <figure className="diagram-panel">
      <div className="diagram-toolbar">
        <span>{diagram.kind}</span>
        <button
          type="button"
          className="copy-button"
          onClick={() => {
            setZoom(1)
            dialog.current?.showModal()
          }}
        >
          <Expand size={15} /> Expand diagram
        </button>
      </div>
      <div
        className="diagram-render"
        role="img"
        aria-label={`${diagram.title}: ${diagram.description}`}
      >
        {error ? (
          <p>The visual diagram could not be loaded. Its source is available below.</p>
        ) : svg ? (
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        ) : (
          <p className="loading">Rendering diagram…</p>
        )}
      </div>
      <figcaption>
        {diagram.description}
        <small>Source: {diagram.source}</small>
      </figcaption>
      <details className="diagram-source">
        <summary>View Mermaid source</summary>
        <CopyButton value={diagram.code} label="Copy source" />
        <pre>{diagram.code}</pre>
      </details>
      <dialog
        ref={dialog}
        className="diagram-dialog"
        aria-labelledby={`dialog-title-${id}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close()
        }}
      >
        <div className="dialog-head">
          <h2 id={`dialog-title-${id}`}>{diagram.title}</h2>
          <button
            className="icon-button"
            aria-label="Close diagram"
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
        </div>
        <div className="zoom-controls">
          <button
            className="icon-button"
            aria-label="Zoom out"
            disabled={zoom <= 0.5}
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
          >
            <Minus size={18} />
          </button>
          <span aria-live="polite">{Math.round(zoom * 100)}%</span>
          <button
            className="icon-button"
            aria-label="Zoom in"
            disabled={zoom >= 2.5}
            onClick={() => setZoom(Math.min(2.5, zoom + 0.25))}
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="dialog-canvas">
          <div
            style={{ width: `${zoom * 100}%`, minWidth: 360 }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
        <p>{diagram.description}</p>
      </dialog>
    </figure>
  )
}
