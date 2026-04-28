import { useState } from 'react'

export interface FaqItemProps {
  question: string
  answer: string
  meta?: string
}

export function FaqItem({ question, answer, meta }: FaqItemProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-card shadow-card mb-2">
      <button
        type="button"
        className="w-full flex justify-between items-center py-4 px-5 bg-transparent border-0 text-left cursor-pointer font-[inherit]"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        <span>
          {meta ? <span className="text-xs text-grey-600 uppercase tracking-[0.06em] block mb-1">{meta}</span> : null}
          <strong className="text-grey-900 block">{question}</strong>
        </span>
        <span className="text-xl text-grey-600" aria-hidden>{open ? '−' : '+'}</span>
      </button>
      {open ? <div className="px-5 pb-4 text-grey-600"><p>{answer}</p></div> : null}
    </div>
  )
}
