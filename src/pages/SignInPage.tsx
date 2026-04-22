import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PageShell } from './PageShell'
import { signIn } from '../lib/sessionStore'

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
      <form className="auth-form" onSubmit={onSubmit}>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit" className="btn btn--primary">Sign in</button>
        <p className="auth-form__alt">
          New to Tripma? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </PageShell>
  )
}
