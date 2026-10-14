# Airen Bot backend

The website calls `https://vedansh-portfolio-chat.suas104.workers.dev/chat`. Cloudflare stores the Gemini key as an encrypted `GEMINI_API_KEY` secret. Neither the frontend build nor model context receives that key. The destination-scoped `CLOUDFLARE_API_TOKEN` in the Codex environment is used only to manage Cloudflare through `api.cloudflare.com`; it is not uploaded to the Worker or used by GitHub Pages.

## Context and deployment

```sh
npm run chat:context
npm run test:worker
python scripts/deploy-chat-worker.py
```

Context is generated from published projects, experience, skills, research, system diagrams, and the rendered About page. Internal provenance, private uploads, and authoring notes are excluded. The downloadable resume is linked; its PDF body is not separately parsed. The Worker selects up to six relevant source records alongside a compact catalog of all projects. Deploy regenerated context with the Worker before publishing related content changes. CI checks that the generated context matches the portfolio.

The deployment script preserves encrypted secrets, creates an independent random `RATE_LIMIT_SALT` if needed, and provisions one SQLite-backed Durable Object for shared usage limits. Re-running deployment preserves the object and its counters. Extra preview URLs and invocation observability are disabled. No paid Cloudflare plan is enabled by the deployment script.

To pause chat, set the Worker's plain-text `CHAT_ENABLED` binding to `false` in Cloudflare. The website then shows a service-unavailable message with a contact link. The deployment script sets this binding to `true` after local validation; use the pause switch immediately if an issue appears.

Airen Bot speaks in first person about Vedansh's documented work, while identifying itself as an AI version of him. Its visible disclaimer explains that answers can be wrong and links to direct contact. It does not claim to be the human Vedansh or make commitments on his behalf.

The service discovers a supported lightweight Gemini model on first use, preferring `gemini-3.1-flash-lite`, then `gemini-2.5-flash-lite`, then `gemini-2.5-flash`. The final SSE event includes the selected model's public identifier for verification. A supported `GEMINI_MODEL` binding can pin a model, but the deployment script owns plain-text bindings; update its metadata when pinning one. Review model availability and pricing before changing these choices. There are no automatic generation retries.

## Limits and privacy

- 200 admitted attempts per UTC day across the service, 40 per network per UTC day, and six per rolling minute per network. Failed and canceled attempts consume this budget too.
- At most two concurrent generations globally and one per network. Expiring leases recover from disconnects or failed requests.
- 1,000-character questions, six bounded history messages, 16 KB request bodies, 24-second server deadlines, and 768 output tokens per generation.
- Limits are checked atomically in the Durable Object. Storage failure closes chat rather than bypassing the budget. CORS accepts only `https://airansh.github.io`, but CORS is not treated as authentication or as the spending limit.
- The backend stores only daily salted network hashes, counters, timestamps, and short concurrency leases. IPv6 addresses share a /64 budget. An alarm deletes daily quota state; no raw IP addresses or conversation transcripts are stored by application code.
- Conversation history stays in tab memory, clears on refresh, and can be cleared explicitly. Gemini receives the question, recent conversation and selected public context; Google's API terms and retention policies apply separately.
- Responses stream as JSON-encoded SSE events. Only the model's answer field is displayed; reasoning fields are ignored. Source IDs are resolved through a server-side allowlist. The UI renders plain text and validates link hosts, so generated HTML and arbitrary URLs do not become executable content.

The daily cap bounds generation attempts, not an exact dollar amount. Google quotas, pricing, and billing alerts remain separate. Public endpoints can still receive nuisance traffic or have their quota exhausted; add a production Turnstile challenge if that becomes a problem. Grounding and citations reduce unsupported answers but are not a guarantee that every model answer is correct.

## Validation

Worker tests cover atomic quotas, limits, daily reset, concurrency, input bounds, privacy of network identifiers, source filtering, streamed parsing, fail-closed behavior and secret redaction. Browser tests use mocked responses, never live Gemini calls in CI; live provider validation is a separate bounded check.
