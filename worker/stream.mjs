export async function* readEvents(body) {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let bytes = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.length
      if (bytes > 256000) throw new Error('Response too large.')
      buffer += decoder.decode(value, { stream: true })
      let match
      while ((match = /\r?\n\r?\n/.exec(buffer))) {
        const frame = buffer.slice(0, match.index)
        buffer = buffer.slice(match.index + match[0].length)
        const data = frame
          .split(/\r?\n/)
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.slice(5).trimStart())
          .join('\n')
        if (data && data !== '[DONE]') yield JSON.parse(data)
      }
    }
    if (buffer.trim()) {
      const data = buffer
        .split(/\r?\n/)
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trimStart())
        .join('\n')
      if (data && data !== '[DONE]') yield JSON.parse(data)
    }
  } finally {
    await reader.cancel().catch(() => {})
    reader.releaseLock()
  }
}

// Read only the JSON answer string; incomplete escapes wait for the next provider chunk.
export function partialAnswer(raw) {
  const match = /"answer"\s*:\s*"/.exec(raw)
  if (!match) return ''
  let output = ''
  const escaped = { '"': '"', '\\': '\\', '/': '/', b: '\b', f: '\f', n: '\n', r: '\r', t: '\t' }
  for (let i = match.index + match[0].length; i < raw.length; i++) {
    const char = raw[i]
    if (char === '"') break
    if (char !== '\\') {
      output += char
      continue
    }
    const code = raw[++i]
    if (!code) break
    if (code === 'u') {
      const hex = raw.slice(i + 1, i + 5)
      if (hex.length < 4) break
      if (!/^[a-f0-9]{4}$/i.test(hex)) throw new Error('Invalid response.')
      output += String.fromCharCode(parseInt(hex, 16))
      i += 4
    } else {
      if (!(code in escaped)) throw new Error('Invalid response.')
      output += escaped[code]
    }
  }
  return output
}
