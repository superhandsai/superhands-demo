import { useMemo, useState } from 'react'
import { PageShell } from './PageShell'
import { FAQ } from '../data/faq'
import { FaqItem } from '../components/FaqItem'

export function HelpCenterPage() {
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState<string>(FAQ[0].id)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return FAQ.find(c => c.id === categoryId)?.items ?? []
    }
    const matches: Array<{ category: string; question: string; answer: string }> = []
    FAQ.forEach(cat => {
      cat.items.forEach(item => {
        if (item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)) {
          matches.push({ category: cat.title, question: item.question, answer: item.answer })
        }
      })
    })
    return matches
  }, [query, categoryId])

  return (
    <PageShell
      title="How can we help?"
      subtitle="Search our help centre or browse by category."
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Help centre' }]}
    >
      <div className="mb-4">
        <input
          placeholder="Search for answers…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search help"
          className="w-full py-4 px-5 text-base border border-grey-200 rounded-card font-sans shadow-card"
        />
      </div>

      <div className="grid grid-cols-[280px_1fr] gap-6 items-start max-[900px]:grid-cols-1">
        <aside>
          <nav aria-label="Help categories">
            {FAQ.map(c => {
              const active = categoryId === c.id && !query
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`flex flex-col items-start py-3 px-4 border rounded-card text-left mb-2 cursor-pointer font-sans w-full ${
                    active
                      ? 'border-purple bg-purple-on'
                      : 'bg-white border-grey-200'
                  }`}
                  onClick={() => {
                    setCategoryId(c.id)
                    setQuery('')
                  }}
                >
                  <strong className="text-grey-900">{c.title}</strong>
                  <span className="text-grey-600 text-xs">{c.summary}</span>
                </button>
              )
            })}
          </nav>
        </aside>
        <section>
          {query ? (
            filtered.length === 0 ? (
              <div className="bg-white py-12 px-6 text-center rounded-card shadow-card flex flex-col items-center gap-4"><p>No articles match "{query}".</p></div>
            ) : (
              (filtered as Array<{ category: string; question: string; answer: string }>).map((item, i) => (
                <FaqItem key={`${item.question}-${i}`} question={item.question} answer={item.answer} meta={item.category} />
              ))
            )
          ) : (
            (filtered as Array<{ question: string; answer: string }>).map((item, i) => (
              <FaqItem key={`${item.question}-${i}`} question={item.question} answer={item.answer} />
            ))
          )}
          <div className="bg-white rounded-card p-6 shadow-card mb-4 mt-4">
            <h2 className="m-0 mb-2 text-xl text-grey-900">Still need help?</h2>
            <p>Our team is available 24/7.</p>
            <div className="flex gap-3 mt-3 flex-wrap">
              <a
                className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover"
                href="mailto:support@tripma.example"
              >
                Email support
              </a>
              <a
                className="font-sans font-bold cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-white text-purple border border-purple hover:bg-purple-on"
                href="tel:+441234567890"
              >
                Call us
              </a>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
