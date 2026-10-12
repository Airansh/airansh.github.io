# Maintaining the portfolio

## Add a project

1. Add a `Project` to `src/data/projects.ts`. Use a unique lowercase hyphenated `id`.
2. Set the category and context from `src/data/types.ts`. Describe your actual contribution and identify the employer or team.
3. Include at least one `sources` entry. State what the available evidence supports; do not invent scale, architecture, metrics, or test results.
4. Include `github` only for an appropriate public repository, and `featured: true` only for homepage selections. Keep six featured records for the present grid.
5. If associated with a role, add its ID to that experience's `projects` array in `src/data/profile.ts`.
6. Add `study` when there is enough evidence for the detailed sections. Optional fields should be omitted instead of filled with fabricated detail.
7. Run the checks in the README. If the inventory size changes, update the gallery-count browser assertions; the homepage count updates automatically.

```ts
const project: Project = {
  id: 'example-project',
  title: 'Project name',
  subtitle: 'A short, specific explanation.',
  summary: 'What it does and who it serves.',
  category: 'Full-Stack Applications',
  context: 'Independent',
  organization: 'Independent project',
  period: '2026',
  tech: ['React', 'TypeScript'],
  contributions: ['Describe a contribution that you can substantiate.'],
  outcomes: ['Describe an observed outcome, with context.'],
  sources: [{ label: 'Public documentation', url: 'https://example.com' }],
}
```

This is an authoring example, not a completed project. Delete example links before publishing real content.

## Extend a case study

The `Study` type contains problem, role, requirements, implementation, validation, tradeoffs, outcome, and optional further-documentation fields. Use `requirements` for supported functional requirements and constraints. Explain the available performance, security, reliability, deployment, and testing evidence within the relevant sections. Do not equate frontend role routing with backend authorization, or a manifest with a verified cluster deployment.

For future detailed designs, use [the full case-study outline](case-study-template.md). Keep unknown material in authoring notes until supported. The UI can display a concise documentation note when the absence is useful context.

## Diagrams and code

Add a `DiagramDefinition` in `src/data/diagrams.ts` with a unique ID, a linked project ID, source description, Mermaid code, and an accessible description. Set the project's `diagram` to this ID. The renderer uses Mermaid's strict security mode and supports expanded viewing, zoom, Escape dismissal, source display, and copying.

The architecture page includes templates for high-level, sequence, ER, data-flow, deployment, and component diagrams. Validate new diagrams in a browser; syntax errors retain a source fallback but must be fixed before publication.

`CodeBlock` supports syntax-highlighted TypeScript with copying. Example:

```tsx
<CodeBlock title="Illustrative typed interface" code={example} language="typescript" />
```

Clearly label illustrative snippets. Attribute excerpts from public repositories; never include secrets or internal code.

## Writing and publications

Add records to `publications` in `src/data/profile.ts`. Use `Publication`, `Manuscript`, `Article`, or `Talk` to control the section. A submitted manuscript must retain its status until publication is established. Include full authors and citation details where available. Links open separately with an accessible new-tab notice.

Articles currently link to externally published ITS writing. No unpublished article bodies are invented. Future local articles can be added as typed content and a new hash route without requiring a backend; add Markdown tooling only when there is actual content to maintain.

## Resume, contact, and media

Replace the general resume at the existing public path to keep download links stable. Use one current general resume rather than an application-specific version. Update contact information in `profile`; never place credentials in content files.

Use approved screenshots. Store optimized images in `public/images`, include useful alt text and dimensions, and credit the source. Do not publish patient data, internal interfaces, or confidential designs.
