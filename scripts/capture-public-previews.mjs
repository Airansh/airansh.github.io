import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
const targets = [
  { projectId: 'titronics', url: 'https://www.titronics.com/' },
  { projectId: 'simplex-website', url: 'https://simplexmetalprocessors.com/' },
  { projectId: 'simplex-operations', url: 'https://simplexsoftware.co.in/' },
  { projectId: 'chenoa-healthcare', url: 'https://www.cranialtech.com/' },
  { projectId: 'mycare', url: 'https://www.mycare.life/' },
  {
    projectId: 'iowa-ai-gateway',
    url: 'https://its.uiowa.edu/news/2026/01/ai-gateway-pilot-what-it-who-its-and-how-join',
  },
]
await mkdir('public/images/work', { recursive: true })
const browser = await chromium.launch()
const results = []
const ids = (process.env.PROJECT_PREVIEW_IDS || '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean)
const queue = targets.filter((target) => !ids.length || ids.includes(target.projectId))
async function worker() {
  while (queue.length) {
    const target = queue.shift()
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()
    try {
      const response = await page.goto(target.url, {
        waitUntil: 'domcontentloaded',
        timeout: 45000,
      })
      if (!response?.ok()) throw new Error(`HTTP ${response?.status()}`)
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {})
      await page.evaluate(() => document.fonts.ready)
      const title = await page.title()
      const text = await page.locator('body').innerText()
      if (/just a moment|access denied|attention required/i.test(title))
        throw new Error('Site returned an access challenge or incomplete page')
      const src = `images/work/${target.projectId}.jpg`
      await page.screenshot({
        path: `public/${src}`,
        type: 'jpeg',
        quality: 86,
        animations: 'disabled',
      })
      results.push({
        ...target,
        src,
        title,
        bodyTextLength: text.trim().length,
        finalUrl: page.url(),
        width: 1440,
        height: 1000,
        capturedAt: new Date().toISOString(),
        status: 'captured',
      })
      console.log(`Captured ${target.projectId}: ${title}`)
    } catch (error) {
      results.push({ ...target, status: 'unavailable', error: String(error) })
      console.log(`Unavailable ${target.projectId}: ${String(error)}`)
    } finally {
      await context.close()
    }
  }
}
try {
  await Promise.all([worker(), worker(), worker()])
} finally {
  await browser.close()
}
await writeFile('docs/work-preview-captures.json', JSON.stringify(results, null, 2) + '\n')
if (!results.some((r) => r.status === 'captured')) process.exitCode = 1
