import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const api = 'https://vedansh-portfolio-chat.suas104.workers.dev/chat'
const answer =
  'I contributed full-stack healthcare features at FarrPro, including Titronics Cloud and MyCare.'
const response = () =>
  [
    `event: delta\ndata: ${JSON.stringify({ text: answer.slice(0, 35) })}\n\n`,
    `event: delta\ndata: ${JSON.stringify({ text: answer.slice(35) })}\n\n`,
    `event: done\ndata: ${JSON.stringify({ answer, sources: [{ title: 'Titronics Cloud', url: 'https://airansh.github.io/#/work/titronics-cloud' }] })}\n\n`,
  ].join('')

test('chat loads on demand, streams a sourced reply, sends bounded history, clears and restores focus', async ({
  page,
}) => {
  const requests: { message: string; history: { role: string; text: string }[] }[] = []
  await page.route(api, async (route) => {
    requests.push(route.request().postDataJSON())
    await route.fulfill({ status: 200, contentType: 'text/event-stream', body: response() })
  })
  await page.goto('/')
  expect(requests).toHaveLength(0)
  const launcher = page.getByRole('button', { name: 'Talk to my Airen Bot', exact: true })
  await launcher.click()
  const dialog = page.getByRole('dialog', { name: 'Airen Bot' })
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('#chat-disclaimer')).toContainText('AI version of me, Vedansh Airen')
  await expect(dialog.locator('#chat-disclaimer')).toContainText('can get details wrong')
  const field = dialog.getByRole('textbox', { name: 'Your question' })
  await expect(field).toBeFocused()
  await field.fill('What healthcare experience do you have?')
  await field.press('Enter')
  await expect(dialog.getByRole('log')).toContainText(answer)
  await expect(dialog.getByRole('link', { name: 'Titronics Cloud' })).toHaveAttribute(
    'href',
    'https://airansh.github.io/#/work/titronics-cloud',
  )
  await field.fill('Tell me more about that project.')
  await dialog.getByRole('button', { name: 'Send question' }).click()
  await expect.poll(() => requests.length).toBe(2)
  expect(requests[1].history.map((turn) => turn.role)).toEqual(['user', 'assistant'])
  await expect(dialog.getByRole('button', { name: 'Send question' })).toBeVisible()
  await dialog.getByRole('button', { name: 'Clear conversation' }).click()
  await expect(dialog.getByRole('log')).toBeEmpty()
  await expect(field).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(launcher).toBeFocused()
})

test('chat errors remain actionable and generated markup and unsafe sources are not executed', async ({
  page,
}) => {
  let attempt = 0
  await page.route(api, async (route) => {
    if (attempt++ === 0)
      return route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ code: 'daily_limit' }),
      })
    return route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      body:
        'event: done\ndata: ' +
        JSON.stringify({
          answer: '<img src=x onerror=alert(1)> is plain text.',
          sources: [
            { title: 'Bad', url: 'javascript:alert(1)' },
            { title: 'Spoof', url: 'https://airansh.github.io.attacker.example' },
          ],
        }) +
        '\n\n',
    })
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Talk to my Airen Bot', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Show me an AI project.' }).click()
  await expect(dialog.getByRole('alert')).toContainText('daily limit')
  await dialog.getByRole('button', { name: 'Try again' }).click()
  await expect(dialog.getByRole('log')).toContainText('<img src=x onerror=alert(1)>')
  await expect(dialog.locator('img')).toHaveCount(0)
  await expect(dialog.locator('.chat-sources a')).toHaveCount(0)
})

for (const theme of ['dark', 'light']) {
  test(`chat is keyboard accessible and readable at enlarged text in ${theme} mode`, async ({
    page,
  }) => {
    await page.addInitScript((value) => localStorage.setItem('va-theme', value), theme)
    await page.setViewportSize({ width: 320, height: 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    await page.getByRole('button', { name: 'Talk to my Airen Bot', exact: true }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('textbox')).toBeFocused()
    expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(await dialog.locator('.chat-history').evaluate((el) => el.clientHeight)).toBeGreaterThan(
      60,
    )
    await expect(dialog.getByRole('button', { name: 'Close Airen Bot' })).toBeInViewport()
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true)
    const scan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    expect(
      scan.violations,
      JSON.stringify(
        scan.violations.map((item) => ({
          id: item.id,
          targets: item.nodes.map((node) => node.target),
        })),
      ),
    ).toEqual([])
  })
}

test('a visitor can stop a pending reply and keep the panel usable', async ({ page }) => {
  let release!: () => void
  const pending = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route(api, async (route) => {
    // Keep the reply pending until Stop is clicked, independent of renderer speed.
    await pending
    await route
      .fulfill({ status: 200, contentType: 'text/event-stream', body: response() })
      .catch(() => {})
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Talk to my Airen Bot', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('textbox').fill('Tell me about the AI Gateway.')
  await dialog.getByRole('button', { name: 'Send question' }).click()
  try {
    await dialog.getByRole('button', { name: 'Stop reply' }).click()
  } finally {
    release()
  }
  await expect(dialog.getByRole('alert')).toContainText('Reply stopped')
  await dialog.getByRole('button', { name: 'Clear conversation' }).click()
  await expect(dialog.getByRole('textbox')).toBeFocused()
  await expect(dialog.getByRole('log')).toBeEmpty()
})
