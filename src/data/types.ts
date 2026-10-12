export const categories = [
  'All work',
  'AI & LLM Systems',
  'Healthcare Software',
  'Full-Stack Applications',
  'Automation & Data',
  'XR & Generative Media',
  'Research & IoT',
  'Web Development',
] as const
export type Category = Exclude<(typeof categories)[number], 'All work'>
export type Context = 'Professional' | 'Research' | 'Academic' | 'Independent'
export interface Source {
  label: string
  url?: string
  note?: string
}
export interface Study {
  problem: string
  role: string
  requirements: string[]
  implementation: string[]
  validation: string
  tradeoffs: string
  outcome: string
  further?: string[]
}
export interface Project {
  id: string
  title: string
  subtitle: string
  summary: string
  category: Category
  context: Context
  organization: string
  period: string
  tech: string[]
  contributions: string[]
  outcomes: string[]
  sources: Source[]
  github?: string
  featured?: boolean
  diagram?: string
  study?: Study
}
export interface Experience {
  id: string
  organization: string
  role: string
  period: string
  location: string
  summary: string
  highlights: string[]
  projects: string[]
  kind?: string
}
export interface Publication {
  id: string
  title: string
  type: 'Publication' | 'Manuscript' | 'Article' | 'Talk'
  year: string
  authors?: string
  venue: string
  description: string
  url?: string
  status?: string
}
