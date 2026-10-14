import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Compass, RotateCcw, Send, Square, X } from 'lucide-react'
import { askPortfolio, ChatFailure, failureMessage } from '../lib/chat'
import type { ChatTurn } from '../lib/chat'
import { ExternalLink } from './ui'

const suggestions = [
  'What’s your experience?',
  'Show me an AI project.',
  'Which of your projects have video demos?',
]
export default function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const field = useRef<HTMLTextAreaElement>(null)
  const end = useRef<HTMLDivElement>(null)
  const abort = useRef<AbortController | null>(null)
  const requestNumber = useRef(0)
  const [turns, setTurns] = useState<Array<ChatTurn & { id: number }>>([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState('')
  const [streamed, setStreamed] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (!open) {
      dialog.current?.close()
      abort.current?.abort()
      return
    }
    dialog.current?.showModal()
    field.current?.focus()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])
  useEffect(
    () => () => {
      abort.current?.abort()
    },
    [],
  )
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
  }, [turns, streamed, pending, error])

  async function submit(question = input.trim()) {
    if (!question || question.length > 1000 || busy || abort.current) return
    const current = ++requestNumber.current
    const controller = new AbortController()
    abort.current = controller
    setInput('')
    setPending(question)
    setStreamed('')
    setError('')
    setBusy(true)
    setAnnouncement('Airen Bot is answering.')
    const timeout = setTimeout(() => controller.abort(), 35000)
    try {
      const answer = await askPortfolio(question, turns, controller.signal, (text) => {
        if (current === requestNumber.current) setStreamed(text)
      })
      if (current !== requestNumber.current) return
      setTurns((previous) => [...previous.slice(-9), { ...answer, id: current }])
      setPending('')
      setStreamed('')
      setAnnouncement('Reply ready.')
    } catch (failure) {
      if (current !== requestNumber.current) return
      setStreamed('')
      if (controller.signal.aborted) setError('Reply stopped. You can try again when you’re ready.')
      else setError(failureMessage(failure instanceof ChatFailure ? failure.code : 'unavailable'))
      setAnnouncement('The reply could not be completed.')
    } finally {
      clearTimeout(timeout)
      if (current === requestNumber.current) {
        setBusy(false)
        abort.current = null
      }
    }
  }
  function clear() {
    requestNumber.current++
    abort.current?.abort()
    abort.current = null
    setTurns([])
    setInput('')
    setPending('')
    setStreamed('')
    setError('')
    setBusy(false)
    setAnnouncement('Conversation cleared.')
    field.current?.focus()
  }
  return (
    <dialog
      ref={dialog}
      id="portfolio-chat"
      className="chat-panel"
      aria-labelledby="chat-title"
      aria-describedby="chat-disclaimer chat-privacy"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect()
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            event.currentTarget.close()
        }
      }}
    >
      <header className="chat-heading">
        <div>
          <span className="role-label">AI VERSION OF VEDANSH</span>
          <h2 id="chat-title">Airen Bot</h2>
        </div>
        <div className="chat-actions">
          <button
            type="button"
            className="icon-button"
            aria-label="Clear conversation"
            onClick={clear}
            disabled={!turns.length && !pending}
          >
            <RotateCcw size={18} />
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Close Airen Bot"
            onClick={() => dialog.current?.close()}
          >
            <X size={20} />
          </button>
        </div>
      </header>
      <div className="chat-history">
        {!turns.length && !pending && (
          <div className="chat-welcome">
            <div className="chat-emblem" aria-hidden="true">
              <Compass size={28} />
            </div>
            <h3>Hey, I’m Airen Bot.</h3>
            <p>Ask me about my projects, experience, or the ideas I’ve been working on.</p>
            <div className="chat-suggestions">
              {suggestions.map((question) => (
                <button type="button" key={question} onClick={() => void submit(question)}>
                  {question}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        )}
        <div role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions">
          {turns.map((turn) => (
            <div className="chat-turn" key={turn.id}>
              <div className="chat-message user">
                <span className="sr-only">You: </span>
                <p>{turn.question}</p>
              </div>
              <div className="chat-message assistant">
                <span className="chat-sender">Airen Bot</span>
                <p>{turn.answer}</p>
                {!!turn.sources.length && (
                  <ul className="chat-sources" aria-label="Portfolio sources">
                    {turn.sources.map((source) => (
                      <li key={source.url}>
                        <ExternalLink href={source.url}>{source.title}</ExternalLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
        {pending && (
          <div className="chat-turn">
            <div className="chat-message user">
              <span className="sr-only">You: </span>
              <p>{pending}</p>
            </div>
            {(busy || streamed) && (
              <div className="chat-message assistant" aria-live="off">
                <span className="chat-sender">Airen Bot</span>
                <p>{streamed || 'Let me take a look…'}</p>
                {busy && <span className="chat-working" aria-hidden="true" />}
              </div>
            )}
          </div>
        )}
        {error && (
          <div className="chat-error" role="alert">
            <p>{error}</p>
            <div>
              <button className="text-link" type="button" onClick={() => void submit(pending)}>
                Try again
              </button>
              <a className="text-link" href="mailto:vedairen@gmail.com">
                Contact Vedansh <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        )}
        <p id="chat-disclaimer" className="chat-note">
          This is an AI version of me, Vedansh Airen. It can get details wrong. Please{' '}
          <a href="mailto:vedairen@gmail.com">get in touch with me</a> or check the linked pages for
          details.
        </p>
        <div ref={end} />
      </div>
      <form
        className="chat-form"
        onSubmit={(event) => {
          event.preventDefault()
          void submit()
        }}
      >
        <label htmlFor="chat-question">Your question</label>
        <div className="chat-compose">
          <textarea
            ref={field}
            id="chat-question"
            rows={2}
            maxLength={1000}
            value={input}
            placeholder="Projects, experience, skills…"
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault()
                void submit()
              }
            }}
          />
          {busy ? (
            <button
              type="button"
              className="chat-send"
              aria-label="Stop reply"
              onClick={() => abort.current?.abort()}
            >
              <Square size={16} />
            </button>
          ) : (
            <button
              type="submit"
              className="chat-send"
              aria-label="Send question"
              disabled={!input.trim()}
            >
              <Send size={18} />
            </button>
          )}
        </div>
        <p id="chat-privacy">Messages are sent to Gemini.</p>
      </form>
      <span className="sr-only" role="status">
        {announcement}
      </span>
    </dialog>
  )
}
