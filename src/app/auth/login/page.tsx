'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/espace-membre'
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError(`Erreur : ${err.message}`)
    } else {
      router.push(redirect)
      router.refresh()
    }
    setLoading(false)
  }

  const inputStyle = {
    background: 'var(--noir-doux)',
    border: '1px solid rgba(201,169,97,0.25)',
    color: 'var(--creme)',
    outline: 'none',
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-8"
      style={{ background: 'var(--noir)' }}>
      <div className="w-full max-w-md text-center">
        <p className="text-xs tracking-[8px] uppercase mb-4" style={{ color: 'var(--or)' }}>
          Espace Membres · La Réserve
        </p>
        <h1 className="serif text-4xl font-normal mb-8">Connexion</h1>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="block text-xs tracking-[3px] uppercase mb-3" style={{ color: 'var(--or)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-5 py-4 text-sm"
              style={inputStyle}
              placeholder="votre@email.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[3px] uppercase mb-3" style={{ color: 'var(--or)' }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-5 py-4 text-sm"
              style={inputStyle}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-xs py-3 px-4" style={{ color: '#e57373', background: 'rgba(229,115,115,0.08)', border: '1px solid rgba(229,115,115,0.2)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-xs tracking-[4px] uppercase transition-all duration-300 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #C9A961, #9C7B3E)', color: 'var(--noir)', border: 'none', cursor: 'pointer' }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="mt-8 text-xs" style={{ color: 'var(--gris)' }}>
          Pas encore membre ?{' '}
          <a href="/adherer" style={{ color: 'var(--or)' }}>Demander à rejoindre →</a>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}