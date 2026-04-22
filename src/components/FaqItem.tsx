import { useState } from 'react'

export interface FaqItemProps {
  question: string
  answer: string
  meta?: string
}

export function FaqItem({ question, answer, meta }: FaqItemProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="faq-item__trigger"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        <span>
          {meta ? <span className="faq-item__meta">{meta}</span> : null}
          <strong>{question}</strong>
        </span>
        <span className="faq-item__chev" aria-hidden>{open ? '−' : '+'}</span>
      </button>
      {open ? <div className="faq-item__body"><p>{answer}</p></div> : null}
    </div>
  )
}
