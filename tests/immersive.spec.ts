import { expect, test } from '@playwright/test'

test('the expressive robot pauses, opens chat on click, and preserves the homepage sphere', async ({
  page,
}) => {
  await page.goto('/')
  const robot = page.locator('.robot-companion')
  const sphere = page.locator('.orbital-canvas')
  await expect(robot).toBeVisible()
  await expect(sphere).toBeVisible()
  await expect(page.locator('.immersive-scene, .scene-fallback')).toHaveCount(0)
  await expect(robot).toHaveAttribute('aria-hidden', 'true')
  await expect(robot).toHaveAttribute('data-renderer', 'webgl')
  await page.getByRole('button', { name: 'Pause visual motion' }).click()
  await page.waitForTimeout(100)
  const still = await robot.screenshot()
  await page.waitForTimeout(200)
  expect(await robot.screenshot()).toEqual(still)
  await robot.locator('canvas').click({ position: { x: 105, y: 90 } })
  await expect(page.getByRole('dialog', { name: 'Airen Bot' })).toBeVisible()
  await expect(robot).toHaveCount(0)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Talk to my Airen Bot' })).toBeFocused()
  await expect(robot).toBeVisible()
})

test('navigation transitions resolve lazy pages and retain focus and browser history', async ({
  page,
}) => {
  await page.goto('/')
  await page.evaluate(() => {
    const original = document.startViewTransition.bind(document)
    document.documentElement.dataset.transitions = '0'
    document.startViewTransition = (update) => {
      document.documentElement.dataset.transitions = String(
        Number(document.documentElement.dataset.transitions) + 1,
      )
      return original(update)
    }
  })
  await page.getByRole('link', { name: 'Explore my work' }).click()
  const heading = page.getByRole('heading', { level: 1 })
  await expect(heading).toHaveText('A connected body of work.')
  await expect(heading).toBeFocused()
  await expect(page.locator('html')).toHaveAttribute('data-transitions', '1')
  await page.goBack()
  await expect(heading).toContainText('Vedansh Airen')
  await page.getByRole('button', { name: 'Pause visual motion' }).click()
  await page.getByRole('link', { name: 'Explore my work' }).click()
  await expect(heading).toHaveText('A connected body of work.')
  await expect(page.locator('html')).toHaveAttribute('data-transitions', '1')
})

test('a device without WebGL retains decorative fallbacks, navigation, and downloads', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof original>) {
      if (String(args[0]).startsWith('webgl')) return null
      return original.apply(this, args)
    } as typeof original
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 320, height: 844 })
  await page.goto('/')
  await expect(page.locator('.robot-fallback')).toBeVisible()
  await expect(page.locator('.immersive-scene, .scene-fallback')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Vedansh Airen')
  await expect(
    page.getByRole('button', { name: 'Motion reduced by your system settings' }),
  ).toBeDisabled()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const download = page.getByRole('link', { name: 'Download resume' }).first()
  const response = await page.request.get((await download.getAttribute('href'))!)
  expect(response.ok()).toBe(true)
  expect(response.headers()['content-type']).toContain('application/pdf')
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Contact', exact: true })
    .click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Let’s start a conversation.')
})
