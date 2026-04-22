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
      <div className="help-search">
        <input
          placeholder="Search for answers…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search help"
        />
      </div>

      <div className="help-layout">
        <aside>
          <nav aria-label="Help categories">
            {FAQ.map(c => (
              <button
                key={c.id}
                type="button"
                className={`help-category ${categoryId === c.id && !query ? 'is-active' : ''}`}
                onClick={() => {
                  setCategoryId(c.id)
                  setQuery('')
                }}
              >
                <strong>{c.title}</strong>
                <span>{c.summary}</span>
              </button>
            ))}
          </nav>
        </aside>
        <section>
          {query ? (
            filtered.length === 0 ? (
              <div className="empty-state"><p>No articles match "{query}".</p></div>
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
          <div className="detail-card help-contact">
            <h2>Still need help?</h2>
            <p>Our team is available 24/7.</p>
            <div className="help-contact__actions">
              <a className="btn btn--primary" href="mailto:support@tripma.example">Email support</a>
              <a className="btn btn--secondary" href="tel:+441234567890">Call us</a>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
