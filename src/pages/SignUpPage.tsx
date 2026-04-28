import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageShell } from './PageShell'
import { signUp } from '../lib/sessionStore'

const fieldLabelCls = 'flex flex-col gap-1.5 text-sm text-grey-900'
const fieldInputCls =
  'font-sans text-[15px] px-3 py-2.5 border border-grey-200 rounded-sm bg-white text-grey-900 focus:outline focus:outline-2 focus:outline-purple focus:outline-offset-1'

export function SignUpPage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const result = signUp({ email, password, firstName, lastName })
    if (result.ok) {
      navigate('/account', { replace: true })
    } else {
      setError(result.error)
    }
  }

  return (
    <PageShell
      title="Create your account"
      subtitle="Start earning Tripma points on every booking."
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Sign up' }]}
    >
      <form
        className="max-w-[420px] bg-white p-6 rounded-card shadow-card flex flex-col gap-4"
        onSubmit={onSubmit}
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          <label className={fieldLabelCls}>
            <span className="text-grey-600 font-semibold">First name</span>
            <input
              className={fieldInputCls}
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              autoComplete="given-name"
              required
            />
          </label>
          <label className={fieldLabelCls}>
            <span className="text-grey-600 font-semibold">Last name</span>
            <input
              className={fieldInputCls}
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              autoComplete="family-name"
              required
            />
          </label>
        </div>
        <label className={fieldLabelCls}>
          <span className="text-grey-600 font-semibold">Email</span>
          <input
            className={fieldInputCls}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className={fieldLabelCls}>
          <span className="text-grey-600 font-semibold">Password (6+ characters)</span>
          <input
            className={fieldInputCls}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={6}
          />
        </label>
        {error ? <p className="text-[#b91c1c] text-sm my-2">{error}</p> : null}
        <button
          type="submit"
          className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover"
        >
          Create account
        </button>
        <p className="text-center text-grey-600 text-sm">
          Already have an account? <Link className="text-purple" to="/signin">Sign in</Link>
        </p>
      </form>
    </PageShell>
  )
}
