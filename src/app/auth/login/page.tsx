'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/espace-membre'
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}` }
    })
    setSent(true)
    setLoading(false)
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
        <h1 className="serif text-4xl font-normal mb-4">Connexion</h1>
        <p className="mb-12" style={{ color: 'var(--nacre)' }}>
          Saisissez votre email pour recevoir votre lien de connexion magique.
        </p>

        {sent ? (
          <div className="p-8 border" style={{ borderColor: 'rgba(201,169,97,0.3)', background: 'var(--noir-doux)' }}>
            <p className="text-xs tracking-[4px] uppercase mb-4" style={{ color: 'var(--or)' }}>✓ Lien envoyé</p>
            <p style={{ color: 'var(--nacre)' }}>
              Vérifiez votre boîte email {email} et cliquez sur le lien pour vous connecter.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs tracking-[3px] uppercase mb-3 text-left" style={{ color: 'var(--or)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 text-sm"
                style={{ background: 'var(--noir-doux)', border: '1px solid rgba(201,169,97,0.25)', color: 'var(--creme)', outline: 'none' }}
                placeholder="votre@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-xs tracking-[4px] uppercase transition-all duration-300 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #C9A961, #9C7B3E)', color: 'var(--noir)' }}>
              {loading ? 'Envoi...' : 'Recevoir mon lien'}
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
