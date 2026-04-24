import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PageShell } from './PageShell'
import { signIn } from '../lib/sessionStore'

const fieldLabelCls = 'flex flex-col gap-1.5 text-sm text-grey-900'
const fieldInputCls =
  'font-sans text-[15px] px-3 py-2.5 border border-grey-200 rounded-sm bg-white text-grey-900 focus:outline focus:outline-2 focus:outline-purple focus:outline-offset-1'

export function SignInPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function redirectAfter(): string {
    const state = location.state as { from?: string } | null
    return state?.from || '/account'
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const result = signIn(email, password)
    if (result.ok) {
      navigate(redirectAfter(), { replace: true })
    } else {
      setError(result.error)
    }
  }

  return (
    <PageShell
      title="Welcome back"
      subtitle="Sign in to manage trips, save travellers, and earn points on every booking."
      breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Sign in' }]}
    >
      <form
        className="max-w-[420px] bg-white p-6 rounded-card shadow-card flex flex-col gap-4"
        onSubmit={onSubmit}
      >
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
          <span className="text-grey-600 font-semibold">Password</span>
          <input
            className={fieldInputCls}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error ? <p className="text-[#b91c1c] text-sm my-2">{error}</p> : null}
        <button
          type="submit"
          className="font-sans font-bold border-0 cursor-pointer rounded-card px-5 py-3 text-[15px] leading-[1.2] text-center transition-colors inline-flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple-hover"
        >
          Sign in
        </button>
        <p className="text-center text-grey-600 text-sm">
          New to Tripma? <Link className="text-purple" to="/signup">Create an account</Link>
        </p>
      </form>
    </PageShell>
  )
}
