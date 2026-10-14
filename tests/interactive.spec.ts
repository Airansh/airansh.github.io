import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('the quick navigator searches existing projects, supports keys, and restores focus', async ({
  page,
}) => {
  await page.goto('/')
  const launcher = page.getByRole('button', { name: 'Open quick navigation' })
  await launcher.click()
  const dialog = page.getByRole('dialog', { name: 'Quick navigation' })
  const search = dialog.getByRole('combobox', { name: 'Search pages and projects' })
  await expect(search).toBeFocused()
  await search.fill('gokart')
  await expect(dialog.getByRole('option')).toHaveCount(1)
  await expect(dialog.getByRole('option')).toContainText('GoKart object detection')
  await search.press('Enter')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('GoKart object detection')
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await launcher.click()
  await page.keyboard.press('Escape')
  await expect(launcher).toBeFocused()
  await page.keyboard.press('Control+k')
  await expect(dialog).toBeVisible()
  await search.fill('no-such-project-9382')
  await expect(dialog.getByRole('status')).toContainText('No matching')
  await search.fill('research')
  await search.press('ArrowDown')
  await search.press('ArrowUp')
  await search.press('Enter')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Build. Investigate. Share.')
})

test('3D motion can pause, persist, and rotate manually without running in the background', async ({
  page,
}) => {
  await page.goto('/')
  const canvas = page.locator('.orbital-canvas')
  await expect(canvas).toBeVisible()
  const pixels = () => canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL())
  const original = await pixels()
  await expect.poll(pixels).not.toBe(original)
  await page.getByRole('button', { name: 'Pause visual motion' }).click()
  await expect(page.getByRole('button', { name: 'Enable visual motion' })).toBeVisible()
  const paused = await pixels()
  await page.waitForTimeout(150)
  expect(await pixels()).toBe(paused)
  await page.getByRole('button', { name: 'Rotate visual right' }).click()
  expect(await pixels()).not.toBe(paused)
  await page.getByRole('button', { name: 'Change 3D form, currently Sphere' }).click()
  await expect(canvas).toHaveAttribute('aria-label', 'Interactive 3D torus visual')
  await page.reload()
  await expect(page.getByRole('button', { name: 'Enable visual motion' })).toBeVisible()
  const persisted = await pixels()
  await page.waitForTimeout(150)
  expect(await pixels()).toBe(persisted)
  await canvas.focus()
  await canvas.press('ArrowLeft')
  expect(await pixels()).not.toBe(persisted)
  await page.getByRole('button', { name: 'Enable visual motion' }).click()
  await page.locator('footer').scrollIntoViewIfNeeded()
  await page.waitForTimeout(100)
  const offscreen = await pixels()
  await page.waitForTimeout(150)
  expect(await pixels()).toBe(offscreen)
})

test('the new controls remain readable and accessible at 200% text with reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 320, height: 844 })
  await page.goto('/')
  await expect(
    page.getByRole('button', { name: 'Motion reduced by your system settings' }),
  ).toBeDisabled()
  const canvas = page.locator('.orbital-canvas')
  const pixels = await canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL())
  await page.waitForTimeout(150)
  expect(await canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL())).toBe(pixels)
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%'
  })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.getByRole('button', { name: 'Open quick navigation' }).click()
  const dialog = page.getByRole('dialog', { name: 'Quick navigation' })
  await expect(dialog.getByRole('combobox')).toBeFocused()
  expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(
    scan.violations.map((item) => ({
      id: item.id,
      targets: item.nodes.map((node) => node.target),
    })),
  ).toEqual([])
})
