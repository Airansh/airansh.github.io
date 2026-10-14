export const chatEndpoint = 'https://vedansh-portfolio-chat.suas104.workers.dev/chat'
export interface ChatSource {
  title: string
  url: string
}
export interface ChatTurn {
  question: string
  answer: string
  sources: ChatSource[]
}
export class ChatFailure extends Error {
  constructor(public code: string) {
    super(code)
  }
}
const allowedHosts = new Set([
  'airansh.github.io',
  'its.uiowa.edu',
  'drive.google.com',
  'github.com',
  'www.imaging.org',
  'www.linkedin.com',
])
function safeSource(value: unknown): value is ChatSource {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<ChatSource>
  if (
    typeof item.title !== 'string' ||
    !item.title.trim() ||
    item.title.length > 240 ||
    typeof item.url !== 'string'
  )
    return false
  try {
    const url = new URL(item.url)
    return (
      url.protocol === 'https:' && !url.username && !url.password && allowedHosts.has(url.hostname)
    )
  } catch {
    return false
  }
}
export async function askPortfolio(
  question: string,
  turns: ChatTurn[],
  signal: AbortSignal,
  onText: (text: string) => void,
): Promise<ChatTurn> {
  const history = turns.slice(-3).flatMap((turn) => [
    { role: 'user', text: turn.question.slice(0, 1200) },
    { role: 'assistant', text: turn.answer.slice(0, 1200) },
  ])
  while (
    history.length &&
    new TextEncoder().encode(JSON.stringify({ message: question, history })).length > 15000
  )
    history.splice(0, 2)
  const response = await fetch(chatEndpoint, {
    method: 'POST',
    credentials: 'omit',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: question, history }),
    signal,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new ChatFailure(typeof error.code === 'string' ? error.code : 'unavailable')
  }
  if (!response.body || !response.headers.get('content-type')?.includes('text/event-stream'))
    throw new ChatFailure('unavailable')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = '',
    answer = '',
    bytes = 0
  let result: ChatTurn | undefined
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      bytes += value.length
      if (bytes > 128000) throw new ChatFailure('unavailable')
      buffer += decoder.decode(value, { stream: true })
      let separator
      while ((separator = /\r?\n\r?\n/.exec(buffer))) {
        const frame = buffer.slice(0, separator.index)
        buffer = buffer.slice(separator.index + separator[0].length)
        const event = frame.match(/^event: (.+)$/m)?.[1]?.trim()
        const text = frame
          .split(/\r?\n/)
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.slice(5).trimStart())
          .join('\n')
        if (!text) continue
        const data = JSON.parse(text)
        if (event === 'error') throw new ChatFailure(data.code || 'unavailable')
        if (event === 'delta' && typeof data.text === 'string') {
          answer += data.text
          if (answer.length > 4000) throw new ChatFailure('unavailable')
          onText(answer)
        }
        if (event === 'done') {
          if (
            typeof data.answer !== 'string' ||
            !data.answer.trim() ||
            data.answer.length > 4000 ||
            !Array.isArray(data.sources)
          )
            throw new ChatFailure('unavailable')
          result = {
            question,
            answer: data.answer,
            sources: data.sources
              .filter(safeSource)
              .filter(
                (source: ChatSource, index: number, all: ChatSource[]) =>
                  all.findIndex((other) => other.url === source.url) === index,
              )
              .slice(0, 3),
          }
        }
      }
    }
    if (!result) throw new ChatFailure('unavailable')
    return result
  } finally {
    await reader.cancel().catch(() => {})
    reader.releaseLock()
  }
}
export function failureMessage(code: string) {
  if (code === 'daily_limit')
    return 'The guide has reached its daily limit. You can still explore the projects or get in touch directly.'
  if (code === 'network_limit')
    return 'This network has reached its daily chat limit. You can still browse the portfolio or contact Vedansh.'
  if (code === 'rate_limit' || code === 'busy')
    return 'Please give the guide a moment, then try again.'
  if (code === 'provider_limit')
    return 'The AI service is at capacity right now. Please try again later, or explore the linked project pages.'
  if (code === 'timeout') return 'That reply took too long. Please try a shorter question.'
  return 'The guide couldn’t finish that reply. Please try again, or contact Vedansh directly.'
}
