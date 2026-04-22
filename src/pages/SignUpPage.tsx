import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageShell } from './PageShell'
import { signUp } from '../lib/sessionStore'

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
      <form className="auth-form" onSubmit={onSubmit}>
        <div className="field-grid">
          <label className="field">
            <span>First name</span>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} autoComplete="given-name" required />
          </label>
          <label className="field">
            <span>Last name</span>
            <input value={lastName} onChange={e => setLastName(e.target.value)} autoComplete="family-name" required />
          </label>
        </div>
        <label className="field">
          <span>Email</span>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        <label className="field">
          <span>Password (6+ characters)</span>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" required minLength={6} />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit" className="btn btn--primary">Create account</button>
        <p className="auth-form__alt">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </form>
    </PageShell>
  )
}
