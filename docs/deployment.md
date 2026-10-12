# GitHub Pages deployment

The target is `Airansh/Airansh.github.io` and the public URL is `https://airansh.github.io/`. A GitHub user site requires the repository name to match the account. The existing `Airansh/vedanshairen.github.io` repository can also host a project site under `/vedanshairen.github.io/`.

## Initial publication

1. Ensure the public `Airansh/Airansh.github.io` repository exists. If the GitHub integration cannot create repositories, create it in GitHub with no initial README, license, or .gitignore.
2. Push the reviewed source to its `main` branch, preserving any existing content and history.
3. Open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
4. Open **Actions → Deploy portfolio to GitHub Pages → Run workflow**, selecting `main`.
5. The workflow installs dependencies, checks types/lint/tests, obtains the Pages base path, builds the deployment artifact, runs production browser checks against a separate root-base build, and publishes the preserved artifact.
6. Verify the deployment URL, `#/work`, a refreshed project-detail URL, diagrams, theme toggle, and resume download on desktop and mobile.

CLI equivalents after the repository exists:

```sh
git remote add pages https://github.com/Airansh/Airansh.github.io.git
git push pages HEAD:main
gh api --method POST repos/Airansh/Airansh.github.io/pages -f build_type=workflow
gh workflow run deploy.yml --repo Airansh/Airansh.github.io --ref main
```

Reuse an existing remote if already configured. If Pages is already enabled, inspect its settings before updating them. The GitHub identity must have repository write, workflow, Actions, and Pages administration permissions. Never store credentials in source.

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
