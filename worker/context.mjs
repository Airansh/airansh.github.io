import portfolio from './portfolio-context.mjs'

export const references = new Map(
  portfolio.docs.flatMap((doc) => [
    [doc.id, { title: doc.title, url: doc.url }],
    ...doc.references.map((reference) => [
      reference.id,
      { title: reference.title, url: reference.url },
    ]),
  ]),
)
const stop = new Set(
  'what which tell about vedansh airen have does his with from this that your you and the are for can how has work experience'.split(
    ' ',
  ),
)
function terms(text) {
  const normalized = text
    .toLowerCase()
    .replace(/healthcare/g, 'healthcare patient farrpro chenoa')
    .replace(/\bface\b/g, 'face kinect trajectory')
    .replace(/\b(education|degree|studied|graduate)\b/g, 'education university degree')
    .replace(/\b(video|demo)\b/g, 'recording preview')
    .replace(/\bai\b/g, 'ai llm agents')
  return [...new Set(normalized.match(/[a-z0-9+#.]{2,}/g) || [])].filter((term) => !stop.has(term))
}
export function selectContext(message, history = []) {
  const current = terms(message)
  const prior = terms(
    history
      .slice(-4)
      .map((turn) => turn.text)
      .join(' '),
  )
  const ranked = portfolio.docs
    .map((doc, index) => {
      const title = doc.title.toLowerCase()
      const body = doc.text.toLowerCase()
      const score =
        current.reduce(
          (total, term) => total + (title.includes(term) ? 8 : body.includes(term) ? 2 : 0),
          0,
        ) +
        prior.reduce(
          (total, term) => total + (title.includes(term) ? 2 : body.includes(term) ? 0.25 : 0),
          0,
        )
      return { doc, score, index }
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
  const selected = []
  let used = JSON.stringify(portfolio.catalog).length + 1000
  for (const { doc } of ranked) {
    if (selected.length >= 6) break
    if (used + doc.text.length > 24000) continue
    selected.push(doc)
    used += doc.text.length
  }
  const ids = new Set(selected.flatMap((doc) => [doc.id, ...doc.references.map((r) => r.id)]))
  ids.add('contact')
  ids.add('resume')
  return {
    version: portfolio.version,
    ids,
    text: JSON.stringify({
      profile: portfolio.profile,
      projectCatalog: portfolio.catalog,
      sources: selected,
      contact: references.get('contact'),
      resume: references.get('resume'),
    }),
  }
}
export const contextVersion = portfolio.version
