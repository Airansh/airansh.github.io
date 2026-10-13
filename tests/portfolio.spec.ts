import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { projects } from '../src/data/projects'

test('search and category/context filters compose and survive refresh', async ({ page }) => {
  await page.goto('/#/work')
  await expect(page.locator('.project-card')).toHaveCount(27)
  await page.getByRole('searchbox', { name: 'Search projects' }).fill('react')
  await page.getByRole('button', { name: 'Healthcare Software', exact: true }).click()
  await page.getByRole('combobox', { name: 'Filter by work context' }).selectOption('Professional')
  await expect(page.locator('.project-card')).toHaveCount(2)
  await expect(page.getByRole('heading', { name: 'MyCare', exact: true })).toBeVisible()
  await page.reload()
  await expect(page.locator('.project-card')).toHaveCount(2)
  await page.getByRole('searchbox').fill('no-such-system')
  await expect(
    page.getByRole('heading', { name: 'No projects match those filters.' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Reset filters' }).click()
  await expect(page.locator('.project-card')).toHaveCount(27)
})

test('all project routes load with direct project copy and correct titles', async ({ page }) => {
  for (const project of projects) {
    await page.goto(`/#/work/${project.id}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.title)
    await expect(page.locator('body')).not.toContainText('Supplied by Vedansh')
    expect(await page.locator('main').innerText()).not.toMatch(
      /resume[- ](?:records|reports|shows|states|lists|listed|supported)|supplied (?:resume|materials)|by this portfolio|during site preparation|supported by the available materials/i,
    )
    await expect(page).toHaveTitle(`${project.title} — Vedansh Airen`)
  }
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pocket Desk')
})

test('diagrams render, expand, zoom, close and rerender with the theme', async ({ page }) => {
  await page.goto('/#/architecture')
  await expect(page.locator('.diagram-render svg')).toHaveCount(5)
  await expect(page.getByText('Room to explore.')).toHaveCount(0)
  await expect(page.getByText('Diagram templates')).toHaveCount(0)
  await page.getByRole('navigation', { name: 'System views' }).getByRole('link').last().click()
  await expect(page.locator('#system-vr')).toBeFocused()
  await page.getByRole('button', { name: 'Expand diagram' }).first().click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Zoom in' }).click()
  await expect(dialog.getByText('125%')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(page.getByRole('button', { name: 'Expand diagram' }).first()).toBeFocused()
  await page.getByRole('button', { name: 'Switch to light theme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(page.locator('.diagram-render svg')).toHaveCount(5)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('mobile navigation, keyboard skip link and narrow layouts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Experience' })
    .click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The work behind the work.')
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).not.toBeVisible()
  for (const route of [
    '/',
    '/#/work',
    '/#/work/evalforge',
    '/#/architecture',
    '/#/research',
    '/#/about',
    '/#/contact',
  ]) {
    await page.goto(route)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('copy email and downloadable PDF work', async ({ page, context, request }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/#/contact')
  await page.getByRole('button', { name: 'Copy email address' }).click()
  await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('vedairen@gmail.com')
  const resume = await request.get('/resume/Vedansh_Airen_Resume.pdf')
  expect(resume.ok()).toBe(true)
  expect(resume.headers()['content-type']).toContain('application/pdf')
  expect((await resume.body()).subarray(0, 4).toString()).toBe('%PDF')
})

test('unknown route has a useful recovery action', async ({ page }) => {
  await page.goto('/#/missing')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A path worth retracing.')
  await page.getByRole('link', { name: 'Explore the work' }).click()
  await expect(page.locator('.project-card')).toHaveCount(27)
})

for (const theme of ['dark', 'light']) {
  for (const route of [
    '/',
    '/#/work',
    '/#/work/evalforge',
    '/#/experience',
    '/#/research',
    '/#/about',
    '/#/contact',
    '/#/architecture',
  ]) {
    test(`accessibility ${route} in ${theme} mode`, async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem('va-theme', value), theme)
      await page.goto(route)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      expect(await page.locator('main').innerText()).not.toMatch(
        /resume[- ](?:records|reports|shows|states|lists|listed|supported)|supplied (?:resume|materials)|by this portfolio|during site preparation|supported by the available materials/i,
      )
      if (route.includes('architecture') || route.includes('evalforge'))
        await expect(page.locator('.diagram-render svg').first()).toBeVisible()
      const scan = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      expect(
        scan.violations,
        JSON.stringify(
          scan.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
        ),
      ).toEqual([])
    })
  }
}

test('no failed local assets or browser exceptions in the main journey', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('response', (r) => {
    if (r.url().startsWith('http://127.0.0.1:4173') && r.status() >= 400)
      errors.push(`${r.status()} ${r.url()}`)
  })
  await page.goto('/')
  await page.getByRole('link', { name: 'Explore my work' }).click()
  await page.getByRole('link', { name: 'EvalForge', exact: true }).click()
  await expect(page.locator('.diagram-render svg')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Results & impact' })).toBeVisible()
  expect(errors).toEqual([])
})

test('public project links and image previews remain separate from case-study navigation', async ({
  page,
}) => {
  for (const project of projects.filter((p) => p.links?.length)) {
    await page.goto(`/#/work/${project.id}`)
    if (project.screenshots?.length) {
      const preview = page.locator('.work-screenshot img').first()
      await preview.scrollIntoViewIfNeeded()
      await expect(preview).toBeVisible()
      await expect
        .poll(() => preview.evaluate((img) => (img as HTMLImageElement).naturalWidth))
        .toBeGreaterThan(0)
    }
    for (const link of project.links!) {
      const action = page.getByRole('link', { name: link.label })
      await expect(action).toHaveAttribute('href', link.url)
      await expect(action).toHaveAttribute('target', '_blank')
    }
  }
  await page.goto('/#/work/chenoa-healthcare')
  await expect(page.locator('.client-context')).toContainText('Cranial Technologies was the client')
  await page.goto('/#/work/evalforge')
  const expand = page.getByRole('button', { name: 'Expand screenshot: EvalForge' })
  await expand.click()
  const dialog = page.getByRole('dialog', { name: 'EvalForge screenshot' })
  await expect(dialog).toBeVisible()
  await expect(
    dialog.getByRole('img', {
      name: 'EvalForge results comparing model correctness, groundedness, fact coverage, and latency',
    }),
  ).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(expand).toBeFocused()
})

test('reading text scales to 200% without horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 })
  for (const route of [
    '/',
    '/#/work',
    '/#/work/chenoa-healthcare',
    '/#/experience',
    '/#/architecture',
    '/#/research',
    '/#/about',
    '/#/contact',
  ]) {
    await page.goto(route)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('recruiter essentials stay visible and unfinished sections are absent', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Vedansh Airen')
  await expect(page.locator('.featured-grid .card-impact')).toHaveCount(6)
  await expect(page.locator('main').getByRole('link', { name: 'Download resume' })).toHaveAttribute(
    'download',
    '',
  )
  await page.goto('/#/experience')
  for (const highlight of await page.locator('.timeline-highlight').all()) {
    await highlight.scrollIntoViewIfNeeded()
    await expect(highlight).toBeVisible()
  }
  await page.goto('/#/research')
  await expect(page.getByText('Engineering notes, in the making.')).toHaveCount(0)
  await expect(page.getByText('Submitted manuscript', { exact: true })).toBeVisible()
})

test('tablet navigation supports keyboard dismissal and route focus', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1000 })
  await page.goto('/')
  const menu = page.getByRole('button', { name: 'Open navigation' })
  await menu.click()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link').first(),
  ).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(menu).toBeFocused()
  await menu.click()
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'About' })
    .click()
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toHaveCount(0)
})

test('reduced motion keeps the entire portfolio readable without animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const route of ['/', '/#/work', '/#/experience', '/#/architecture']) {
    await page.goto(route)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.locator('main').locator('article').last().scrollIntoViewIfNeeded()
    expect(
      await page.evaluate(
        () => document.getAnimations().filter((a) => a.playState === 'running').length,
      ),
    ).toBe(0)
    expect(await page.locator('main').evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
  }
})

test('the initial theme follows the reader’s preference and keeps their selection', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.getByRole('button', { name: 'Switch to dark theme' }).click()
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})
