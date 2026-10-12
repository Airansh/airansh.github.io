import { describe, expect, it } from 'vitest'
import { filterProjects, projects } from './projects'
import { experiences } from './profile'
import { diagrams } from './diagrams'

describe('portfolio navigation and discoverability', () => {
  it('keeps projects discoverable by organization, technology and compound query', () => {
    expect(filterProjects('FarrPro', 'All work', 'Professional').map((p) => p.id)).toEqual([
      'titronics-cloud',
      'mycare',
      'titronics',
    ])
    expect(
      filterProjects('react auth0', 'Healthcare Software', 'Professional').map((p) => p.id),
    ).toEqual(['mycare'])
    expect(
      filterProjects('  PYTHON  ', 'All work', 'All contexts').some((p) => p.id === 'evalforge'),
    ).toBe(true)
    expect(filterProjects('not a project', 'All work', 'All contexts')).toEqual([])
  })
  it('keeps experience links and diagram relationships navigable', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const experience of experiences)
      for (const id of experience.projects) expect(ids).toContain(id)
    for (const diagram of diagrams) expect(ids).toContain(diagram.project)
    for (const project of projects)
      if (project.diagram)
        expect(diagrams.some((d) => d.id === project.diagram && d.project === project.id)).toBe(
          true,
        )
  })
  it('requires provenance and prevents placeholder repository links', () => {
    for (const project of projects) {
      expect(project.sources.length).toBeGreaterThan(0)
      if (project.github) expect(new URL(project.github).hostname).toBe('github.com')
      expect(project.id).toMatch(/^[a-z0-9-]+$/)
    }
  })
})
