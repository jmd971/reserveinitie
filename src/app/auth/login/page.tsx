'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sent, setSent] = useState(false)
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

    if (mode === 'password') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) {
        setError('Email ou mot de passe incorrect.')
      } else {
        router.push(redirect)
      }
    } else {
      await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}` }
      })
      setSent(true)
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
        {/* Logo */}
        <div className="w-20 h-20 mx-auto mb-10">
          <img src="/logo-premium.png" alt="La Réserve des Initiés"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <p className="text-xs tracking-[8px] uppercase mb-4" style={{ color: 'var(--or)' }}>
          Espace Membres · La Réserve
        </p>
        <h1 className="serif text-4xl font-normal mb-8">Connexion</h1>

        {/* Mode toggle */}
        <div className="flex mb-10 border" style={{ borderColor: 'rgba(201,169,97,0.2)' }}>
          {(['password', 'magic'] as const).map(m => (
            <button key={m} type="button" onClick={() => { setMode(m); setError(''); setSent(false) }}
              className="flex-1 py-3 text-xs tracking-[3px] uppercase transition-all duration-200"
              style={{
                background: mode === m ? 'rgba(201,169,97,0.12)' : 'transparent',
                color: mode === m ? 'var(--or)' : 'var(--gris)',
                borderBottom: mode === m ? '1px solid var(--or)' : '1px solid transparent',
                cursor: 'pointer',
              }}>
              {m === 'password' ? 'Mot de passe' : 'Lien magique'}
            </button>
          ))}
        </div>

        {sent ? (
          <div className="p-8 border" style={{ borderColor: 'rgba(201,169,97,0.3)', background: 'var(--noir-doux)' }}>
            <p className="text-xs tracking-[4px] uppercase mb-4" style={{ color: 'var(--or)' }}>✓ Lien envoyé</p>
            <p style={{ color: 'var(--nacre)' }}>
              Vérifiez votre boîte email <strong>{email}</strong> et cliquez sur le lien pour vous connecter.
            </p>
          </div>
        ) : (
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
              />
            </div>

            {mode === 'password' && (
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
                />
              </div>
            )}

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
              {loading ? 'Connexion...' : mode === 'password' ? 'Se connecter' : 'Recevoir mon lien'}
            </button>
          </form>
        )}

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
