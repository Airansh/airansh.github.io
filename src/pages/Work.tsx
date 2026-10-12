import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { categories } from '../data/types'
import { filterProjects, projects } from '../data/projects'
import { PageHeading, ProjectCard } from '../components/ui'
export default function Work() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''
  const category = categories.find((c) => c === params.get('category')) || 'All work'
  const context =
    ['Professional', 'Research', 'Academic', 'Independent'].find(
      (c) => c === params.get('context'),
    ) || 'All contexts'
  const results = filterProjects(query, category, context)
  function update(name: string, value: string) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (!value || value.startsWith('All ')) next.delete(name)
        else next.set(name, value)
        return next
      },
      { replace: true },
    )
  }
  return (
    <div className="container page">
      <PageHeading label="THE WORK LIBRARY" title="A connected body of work.">
        Professional systems, independent builds, and research experiments. Explore the problems,
        the implementation, and the work behind each one.
      </PageHeading>
      <div className="work-controls">
        <label className="search-field">
          <Search size={19} />
          <span className="sr-only">Search projects</span>
          <input
            type="search"
            value={query}
            onChange={(e) => update('q', e.target.value)}
            placeholder="Search projects, technologies, or organizations…"
          />
        </label>
        <label className="context-select">
          <SlidersHorizontal size={16} />
          <span className="sr-only">Filter by work context</span>
          <select value={context} onChange={(e) => update('context', e.target.value)}>
            {['All contexts', 'Professional', 'Research', 'Academic', 'Independent'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="filter-chips" aria-label="Project categories">
        {categories.map((c) => (
          <button key={c} aria-pressed={category === c} onClick={() => update('category', c)}>
            {c}
            {c === 'All work' && <span>{projects.length}</span>}
          </button>
        ))}
      </div>
      <div className="results-label" role="status">
        Showing {results.length} of {projects.length} projects
        {(query || category !== 'All work' || context !== 'All contexts') && (
          <button onClick={() => setParams({})}>
            Clear filters <X size={14} />
          </button>
        )}
      </div>
      {results.length ? (
        <div className="work-grid">
          {results.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={30} />
          <h2>No projects match those filters.</h2>
          <p>Try a different technology or clear your filters to explore all the work.</p>
          <button className="button secondary" onClick={() => setParams({})}>
            Reset filters
          </button>
        </div>
      )}
    </div>
  )
}
