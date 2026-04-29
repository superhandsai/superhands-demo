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
          className="md:hidden fixed right-5 bottom-5 z-[1000] flex items-center gap-2 bg-purple text-white border-0 rounded-full py-3 px-[18px] font-semibold cursor-pointer shadow-[0_12px_30px_rgba(96,93,236,0.4)] font-[inherit] hover:brightness-105"
          aria-label="Open support chat"
          onClick={openChat}
        >
          <ChatIcon />
          <span>Help</span>
        </button>
      ) : null}
      <div
        className={`md:hidden fixed right-5 bottom-5 w-[min(380px,calc(100vw-40px))] h-[min(560px,calc(100vh-40px))] bg-white border border-grey-200 rounded-[20px] shadow-drawer flex flex-col transition-[opacity,transform] duration-150 z-[1100] ${open ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-5 opacity-0 pointer-events-none'}`}
        aria-hidden={!open}
      >
        <header className="py-4 px-5 border-b border-grey-200 flex justify-between items-start gap-4">
          <div>
            <strong className="block text-grey-900">Tripma support</strong>
            <span className="text-xs text-grey-600">Typically replies in under a minute</span>
          </div>
          <button
            type="button"
            className="bg-transparent border-0 text-xl cursor-pointer text-grey-600"
            aria-label="Close chat"
            onClick={toggleChat}
          >
            ×
          </button>
        </header>
        <div
          className="flex-1 overflow-y-auto py-4 px-5 flex flex-col gap-2 bg-grey-100"
          ref={listRef}
        >
          {messages.map(m => (
            <div
              key={m.id}
              className={`max-w-[85%] rounded-[14px] py-[10px] px-3 text-sm leading-[1.4] ${m.from === 'user' ? 'self-end bg-purple text-white rounded-br-[4px]' : 'self-start bg-white text-grey-900 border border-grey-200 rounded-bl-[4px]'}`}
            >
              <p className="m-0">{m.text}</p>
            </div>
          ))}
          {typing ? (
            <div
              className="max-w-[85%] rounded-[14px] text-sm leading-[1.4] self-start bg-white text-grey-900 border border-grey-200 rounded-bl-[4px] inline-flex gap-1 py-3 px-[14px]"
              aria-live="polite"
            >
              <span className="w-[6px] h-[6px] rounded-full bg-grey-400 animate-chat-typing" />
              <span className="w-[6px] h-[6px] rounded-full bg-grey-400 animate-chat-typing [animation-delay:0.15s]" />
              <span className="w-[6px] h-[6px] rounded-full bg-grey-400 animate-chat-typing [animation-delay:0.3s]" />
            </div>
          ) : null}
        </div>
        <div className="flex gap-1.5 py-[10px] px-5 overflow-x-auto border-t border-grey-200 whitespace-nowrap">
          {QUICK_REPLIES.map(q => (
            <button
              key={q}
              type="button"
              className="bg-grey-100 border border-grey-200 rounded-full py-1.5 px-3 text-xs cursor-pointer font-[inherit] text-grey-900 whitespace-nowrap hover:bg-white hover:border-purple hover:text-purple"
              onClick={() => sendMessage(q)}
            >
              {q}
            </button>
          ))}
        </div>
        <form className="flex gap-2 py-3 px-4 border-t border-grey-200" onSubmit={onSubmit}>
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Type your message…"
            aria-label="Message"
            className="flex-1 border border-grey-200 rounded-[10px] py-[10px] px-3 font-[inherit] text-sm focus:outline-none focus:border-purple"
          />
          <button
            type="submit"
            className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] inline-flex items-center justify-center gap-2 transition-colors bg-purple text-white hover:bg-purple-hover disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!draft.trim()}
          >
            Send
          </button>
        </form>
        <button
          type="button"
          className="hidden fixed inset-0 bg-transparent border-0 -z-[1]"
          aria-hidden
          onClick={closeChat}
        />
      </div>
    </>
  )
}
