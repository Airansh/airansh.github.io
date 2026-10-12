# GitHub Pages deployment

The portfolio has been prepared locally. No public repository has been created, Pages settings changed, code pushed, or deployment triggered by this task. The owner has approved publishing to `Airansh/Airansh.github.io`, including repository creation if needed. Further confirmation for this publication is unnecessary. The remaining blocker is cloud network access to `api.github.com`; `airansh.github.io` is also required for live verification. Both domains have been saved as additive custom network requirements.

## Choose the target

| Repository                                           | Expected public URL                                 | Vite base                  |
| ---------------------------------------------------- | --------------------------------------------------- | -------------------------- |
| `Airansh/vedanshairen.github.io` (existing checkout) | `https://airansh.github.io/vedanshairen.github.io/` | `/vedanshairen.github.io/` |
| `Airansh/Airansh.github.io` (preferred user site)    | `https://airansh.github.io/`                        | `/`                        |

Creation of the second repository is approved if needed. Inspect whether it already exists and preserve any existing content. The website source is portable between these targets.

## Complete the approved publication

1. Apply the saved network additions in cloud environment settings, then check GitHub API access with `gh api user --jq .login`. The existing `GH_TOKEN` binding is present, but its API usability is untested while the host is blocked. Do not print credential values.
2. Inspect `Airansh/Airansh.github.io` through the API. If absent and creation is permitted, create it as public with `gh repo create Airansh/Airansh.github.io --public --description "Vedansh Airen — software engineering portfolio"`. Preserve any existing repository content. Commit and push the reviewed files to its `main` branch. The existing remote can be reused for the existing target. Creating or changing a remote is unnecessary unless the preferred target is chosen.
3. In that GitHub repository, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
4. Open **Actions → Deploy portfolio to GitHub Pages → Run workflow**, selecting `main`.
5. The workflow installs the lockfile dependencies, checks types/lint/tests, obtains the Pages base path, builds the deployment artifact, runs production browser checks against a separate root-base build, and publishes the preserved artifact.
6. Open the deployment URL reported by GitHub. Verify the homepage, `#/work`, a refreshed project-detail URL, diagrams, theme toggle, and resume download on desktop and mobile.

If GitHub says the workflow lacks permission, confirm repository write/Actions/Pages access using the existing platform authentication. Do not put tokens in source or request secret values in chat.

## Future updates

Edit typed content, run the local checks, commit and push to main, inspect automatic CI, then trigger the manual Pages workflow. Automatic deployment on pushes can be enabled later if the owner requests it; the current workflow intentionally requires an explicit publication action.

## Build for a target locally

```sh
# Existing repository as a GitHub project site
VITE_BASE_PATH=/vedanshairen.github.io/ VITE_SITE_URL=https://airansh.github.io/vedanshairen.github.io/ npm run build

# Preferred GitHub user site
VITE_BASE_PATH=/ VITE_SITE_URL=https://airansh.github.io/ npm run build
```

`VITE_SITE_URL` controls canonical/social metadata. This is a public URL, not a secret. The workflow supplies it from Pages configuration. Never add a private deployment credential to a Vite variable: all Vite frontend values are public.

Hash routes keep browser refreshes compatible with static hosting. For example, the existing target's project URL is `https://airansh.github.io/vedanshairen.github.io/#/work/evalforge`. Unknown app routes show an accessible recovery page; `404.html` covers unknown server paths. Social previews use the homepage's static metadata because fragments are not sent to the server.

No custom domain, paid infrastructure, database, authentication, or API key is required. A future custom domain would need its own configuration and live verification.
