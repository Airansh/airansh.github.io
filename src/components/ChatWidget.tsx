import { lazy, Suspense, useRef, useState } from 'react'
import { MessageCircle } from 'lucide-react'
const ChatPanel = lazy(() => import('./ChatPanel'))
export function ChatWidget() {
  const [opened, setOpened] = useState(false)
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="chat-launcher"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={opened ? 'portfolio-chat' : undefined}
        onClick={() => {
          setOpened(true)
          setOpen(true)
        }}
      >
        <MessageCircle size={20} aria-hidden="true" />
        <span>Ask about Vedansh</span>
      </button>
      {opened && (
        <Suspense
          fallback={
            <span className="sr-only" role="status">
              Opening portfolio guide…
            </span>
          }
        >
          <ChatPanel
            open={open}
            onClose={() => {
              setOpen(false)
              trigger.current?.focus()
            }}
          />
        </Suspense>
      )}
    </>
  )
}
