export const limits = {
  daily: 200,
  networkDaily: 40,
  networkMinute: 6,
  concurrent: 2,
  leaseMs: 30000,
}

export function reserve(state, network, now) {
  const day = new Date(now).toISOString().slice(0, 10)
  const next =
    state?.day === day
      ? structuredClone(state)
      : { day, count: 0, networks: {}, leases: structuredClone(state?.leases || {}) }
  for (const [lease, entry] of Object.entries(next.leases))
    if (entry.expires <= now) delete next.leases[lease]
  const untilTomorrow = Math.max(
    1,
    Math.ceil((Date.parse(day + 'T00:00:00Z') + 86400000 - now) / 1000),
  )
  const visitor = next.networks[network] || { count: 0, recent: [] }
  visitor.recent = visitor.recent.filter((time) => now - time < 60000)
  if (next.count >= limits.daily)
    return { state: next, status: 429, retryAfter: untilTomorrow, code: 'daily_limit' }
  if (visitor.count >= limits.networkDaily)
    return { state: next, status: 429, retryAfter: untilTomorrow, code: 'network_limit' }
  if (visitor.recent.length >= limits.networkMinute)
    return {
      state: next,
      status: 429,
      retryAfter: Math.max(1, Math.ceil((visitor.recent[0] + 60000 - now) / 1000)),
      code: 'rate_limit',
    }
  if (
    Object.keys(next.leases).length >= limits.concurrent ||
    Object.values(next.leases).some((entry) => entry.network === network)
  )
    return { state: next, status: 429, retryAfter: 10, code: 'busy' }
  const lease = crypto.randomUUID()
  next.count++
  visitor.count++
  visitor.recent.push(now)
  next.networks[network] = visitor
  next.leases[lease] = { network, expires: now + limits.leaseMs }
  return { state: next, status: 200, lease }
}

export class ChatQuota {
  constructor(state) {
    this.storage = state.storage
  }
  async fetch(request) {
    const input = await request.json()
    const path = new URL(request.url).pathname
    const response = await this.storage.transaction(async (transaction) => {
      const state = await transaction.get('quota')
      if (path === '/release') {
        if (state?.leases?.[input.lease]) {
          delete state.leases[input.lease]
          await transaction.put('quota', state)
        }
        return Response.json({ released: true })
      }
      if (
        path !== '/acquire' ||
        typeof input.network !== 'string' ||
        !/^[a-f0-9]{64}$/.test(input.network)
      )
        return Response.json({ error: 'Invalid request.' }, { status: 400 })
      const result = reserve(state, input.network, Date.now())
      await transaction.put('quota', result.state)
      const { status, lease, retryAfter, code } = result
      return Response.json({ lease, retryAfter, code }, { status })
    })
    if (path === '/acquire') {
      const day = new Date().toISOString().slice(0, 10)
      await this.storage.setAlarm(Date.parse(day + 'T00:00:00Z') + 86401000)
    }
    return response
  }
  async alarm() {
    const now = Date.now()
    const day = new Date(now).toISOString().slice(0, 10)
    let nextAlarm
    await this.storage.transaction(async (transaction) => {
      const state = await transaction.get('quota')
      if (!state) return
      const active = Object.values(state.leases).filter((lease) => lease.expires > now)
      if (state.day !== day && !active.length) await transaction.delete('quota')
      else
        nextAlarm =
          state.day === day
            ? Date.parse(day + 'T00:00:00Z') + 86401000
            : Math.max(...active.map((lease) => lease.expires)) + 1
    })
    if (nextAlarm) await this.storage.setAlarm(nextAlarm)
  }
}
