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

test('all project routes load with source material and correct titles', async ({ page }) => {
  for (const project of projects) {
    await page.goto(`/#/work/${project.id}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.title)
    await expect(page.locator('#Sources')).toBeVisible()
    await expect(page).toHaveTitle(`${project.title} — Vedansh Airen`)
  }
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pocket Desk')
})

test('diagrams render, expand, zoom, close and rerender with the theme', async ({ page }) => {
  await page.goto('/#/architecture')
  await expect(page.locator('.diagram-render svg')).toHaveCount(5)
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
