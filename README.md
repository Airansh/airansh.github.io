# Vedansh Airen — Engineering Portfolio

A React/TypeScript portfolio connecting professional experience with 28 projects, eight detailed case studies, five Mermaid system views, research, and technical writing. Dark and light themes, responsive navigation, search and category/context filters, a downloadable resume, and Airen Bot, an AI version of Vedansh, are included.

## Develop

Use Node.js 24 and npm. The lockfile is committed. The static site builds and runs without API keys. The optional chat feature uses a separately deployed Cloudflare Worker; its secrets are never bundled into the website.

```sh
npm ci
npm run dev
```

Vite runs on port 5173. Use the existing checkout in cloud tasks; a separate worktree is unnecessary unless explicitly requested. The local npm cache is configured under `/tmp` for compatibility with restricted cloud environments.

```sh
npm run typecheck
npm run lint
npm test
npm run test:worker
npm run build
npm run test:e2e
```

Browser tests run against the production preview on port 4173. They use `/usr/bin/chromium` if available. Otherwise install Chromium with `npx playwright install --with-deps chromium`. The browser suite tests all project routes, compound filtering, theme persistence, mobile navigation, clipboard behavior, the PDF, unknown routes, local assets, and axe WCAG A/AA checks on the main pages in both themes. Automated accessibility testing does not replace assistive-technology or user testing.

## Content map

| File                                     | Contents                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| `src/data/projects.ts`                   | Project records, contributions, outcomes, case studies, evidence sources |
| `src/data/profile.ts`                    | Contact links, experience, skills, publications, articles, talks         |
| `src/data/diagrams.ts`                   | Mermaid diagrams, reusable templates, planned designs                    |
| `src/data/types.ts`                      | Content types and categories                                             |
| `public/resume/Vedansh_Airen_Resume.pdf` | General resume downloaded by the site                                    |
| `docs/content-sources.md`                | Source inventory, factual boundaries, unresolved discrepancies           |
| `docs/content-guide.md`                  | Adding projects, diagrams, publications, and writing                     |
| `docs/deployment.md`                     | Exact GitHub Pages publication instructions                              |

## Publishing

The publication target is `Airansh/Airansh.github.io`, serving `https://airansh.github.io/`. Source is prepared in the original `Airansh/vedanshairen.github.io` checkout.

The Pages workflow is manual (`workflow_dispatch`). Follow [the deployment guide](docs/deployment.md) to publish reviewed changes. CI runs automatically on main-branch pushes and pull requests.

Vite supports both a root user site and a project subpath through `VITE_BASE_PATH`; the deployment workflow obtains the base path and public URL from `actions/configure-pages`. Navigation uses hash routes so direct links and refreshes do not depend on server rewrites. Social previews use the site's shared metadata rather than unique metadata served for each hash route.

## Design and assets

The design uses locally bundled DM Sans and IBM Plex Mono fonts, Lucide icons, restrained motion, and CSS-rendered technical visuals. Mermaid is loaded only on pages that need it. The EvalForge screenshot is sourced from its public repository and credited in the content provenance document. Chat code loads on demand; questions reach Gemini through the protected Worker only after a visitor sends one. No third-party analytics are included. See [the chat backend guide](worker/README.md) for credentials, context refresh, limits, privacy, and deployment. A dependency override requires KaTeX 0.18.2 or later to address GHSA-238p-pmpm-9mq7 in Mermaid’s transitive dependency; the rendered diagram types are covered by browser tests.

To format changes, run `npx prettier --write src tests docs *.ts *.json *.js .github README.md index.html`.
