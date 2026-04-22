import { useEffect, useRef, useState } from 'react'
import {
  QUICK_REPLIES,
  chatStore,
  closeChat,
  openChat,
  sendMessage,
  toggleChat,
} from '../lib/chatStore'
import { useStore } from '../lib/useStore'

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
      <path
        d="M21 12a8 8 0 0 1-11.6 7.1L4 20l.9-4.8A8 8 0 1 1 21 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SupportChat() {
  const { open, messages, typing } = useStore(chatStore)
  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, typing, open])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return
    sendMessage(draft)
    setDraft('')
  }

  return (
    <>
      {!open ? (
        <button
          type="button"
          className="chat-launcher"
          aria-label="Open support chat"
          onClick={openChat}
        >
          <ChatIcon />
          <span>Help</span>
        </button>
      ) : null}
      <div className={`chat-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <header className="chat-drawer__head">
          <div>
            <strong>Tripma support</strong>
            <span>Typically replies in under a minute</span>
          </div>
          <button
            type="button"
            className="chat-drawer__close"
            aria-label="Close chat"
            onClick={toggleChat}
          >
            ×
          </button>
        </header>
        <div className="chat-drawer__messages" ref={listRef}>
          {messages.map(m => (
            <div key={m.id} className={`chat-msg chat-msg--${m.from}`}>
              <p>{m.text}</p>
            </div>
          ))}
          {typing ? (
            <div className="chat-msg chat-msg--agent chat-msg--typing" aria-live="polite">
              <span /><span /><span />
            </div>
          ) : null}
        </div>
        <div className="chat-drawer__quick">
          {QUICK_REPLIES.map(q => (
            <button
              key={q}
              type="button"
              className="chat-quick"
              onClick={() => sendMessage(q)}
            >
              {q}
            </button>
          ))}
        </div>
        <form className="chat-drawer__compose" onSubmit={onSubmit}>
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Type your message…"
            aria-label="Message"
          />
          <button type="submit" className="btn btn--primary" disabled={!draft.trim()}>
            Send
          </button>
        </form>
        <button type="button" className="chat-drawer__backdrop" aria-hidden onClick={closeChat} />
      </div>
    </>
  )
}
