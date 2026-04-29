'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TERRITOIRES } from '@/types/database'
import type { Territoire } from '@/types/database'
import toast from 'react-hot-toast'

function AdhererForm() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '',
    date_naissance: '', adresse: '', ville: '',
    territoire: '' as Territoire | '',
    cgu: false, majeur: false,
  })

  const supabase = createClient()

  function set(k: string, v: string | boolean) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (step < 3) { setStep(s => s + 1); return }
    setLoading(true)
    try {
      // Créer le compte auth (magic link)
      const { error: authErr } = await supabase.auth.signInWithOtp({
        email: form.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/auth/en-attente`,
          data: {
            prenom: form.prenom,
            nom: form.nom,
            telephone: form.telephone,
            adresse: form.adresse,
            ville: form.ville,
            territoire: form.territoire,
            date_naissance: form.date_naissance,
            parrain_ref: ref,
          }
        }
      })
      if (authErr) throw authErr
      setDone(true)
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'inscription.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'var(--noir-doux)',
    border: '1px solid rgba(201,169,97,0.25)',
    color: 'var(--creme)',
    outline: 'none',
    padding: '1rem 1.2rem',
    fontSize: '0.95rem',
    width: '100%',
  }

  if (done) {
    return (
      <div className="text-center py-16">
        <p className="text-xs tracking-[8px] uppercase mb-6" style={{ color: 'var(--or)' }}>✓ Dossier envoyé</p>
        <h2 className="serif text-3xl font-normal mb-4">Vérifiez votre email</h2>
        <p style={{ color: 'var(--nacre)' }}>
          Un lien de validation vous a été envoyé à <strong>{form.email}</strong>.<br />
          Une fois cliqué, votre dossier sera soumis à validation (48h).
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      {/* Progression */}
      <div className="flex gap-0 mb-12">
        {[1, 2, 3].map(n => (
          <div key={n} className="flex-1 text-center">
            <div className="w-10 h-10 rounded-full border flex items-center justify-center mx-auto mb-2 serif text-lg"
              style={{
                borderColor: step >= n ? 'var(--or)' : 'rgba(201,169,97,0.2)',
                color: step >= n ? 'var(--or)' : 'var(--gris)',
                background: step >= n ? 'rgba(201,169,97,0.1)' : 'transparent',
              }}>
              {n}
            </div>
            <p className="text-xs tracking-[2px] uppercase" style={{ color: step >= n ? 'var(--or)' : 'var(--gris)' }}>
              {n === 1 ? 'Identité' : n === 2 ? 'Coordonnées' : 'Confirmation'}
            </p>
          </div>
        ))}
      </div>

      {/* Étape 1: Identité */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-[3px] uppercase mb-3" style={{ color: 'var(--or)' }}>Prénom *</label>
              <input style={inputStyle} value={form.prenom} onChange={e => set('prenom', e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs tracking-[3px] uppercase mb-3" style={{ color: 'var(--or)' }}>Nom *</label>
              <input style={inputStyle} value={form.nom} onChange={e => set('nom', e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="block text-xs tracking-[3px] uppercase mb-3" style={{ color: 'var(--or)' }}>Date de naissance *</label>
            <input type="date" style={inputStyle} value={form.date_naissance} onChange={e => set('date_naissance', e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs tracking-[3px] uppercase mb-3" style={{ color: 'var(--or)' }}>Email *</label>
            <input type="email" style={inputStyle} value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs tracking-[3px] uppercase mb-3" style={{ color: 'var(--or)' }}>Téléphone</label>
            <input type="tel" style={inputStyle} value={form.telephone} onChange={e => set('telephone', e.target.value)} />
          </div>
        </div>
      )}

      {/* Étape 2: Coordonnées */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs tracking-[3px] uppercase mb-3" style={{ color: 'var(--or)' }}>Adresse *</label>
            <input style={inputStyle} value={form.adresse} onChange={e => set('adresse', e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-[3px] uppercase mb-3" style={{ color: 'var(--or)' }}>Ville *</label>
              <input style={inputStyle} value={form.ville} onChange={e => set('ville', e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs tracking-[3px] uppercase mb-3" style={{ color: 'var(--or)' }}>Territoire *</label>
              <select style={{ ...inputStyle, appearance: 'none' as const }}
                value={form.territoire} onChange={e => set('territoire', e.target.value)} required>
                <option value="">Sélectionner</option>
                {(Object.entries(TERRITOIRES) as [Territoire, string][]).map(([code, nom]) => (
                  <option key={code} value={code}>{nom} ({code})</option>
                ))}
              </select>
            </div>
          </div>
          {ref && (
            <div className="p-4" style={{ background: 'rgba(201,169,97,0.08)', border: '1px solid rgba(201,169,97,0.2)' }}>
              <p className="text-xs tracking-[3px] uppercase mb-1" style={{ color: 'var(--or)' }}>Cooptation</p>
              <p className="text-sm" style={{ color: 'var(--nacre)' }}>Vous avez été coopté par le membre {ref}</p>
            </div>
          )}
        </div>
      )}

      {/* Étape 3: Confirmation */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="p-6 border" style={{ background: 'var(--noir-doux)', borderColor: 'rgba(201,169,97,0.2)' }}>
            <h3 className="text-xs tracking-[4px] uppercase mb-4" style={{ color: 'var(--or)' }}>Récapitulatif</h3>
            <dl className="space-y-3">
              {[
                ['Nom', `${form.prenom} ${form.nom}`],
                ['Email', form.email],
                ['Territoire', form.territoire ? TERRITOIRES[form.territoire] : '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="text-xs tracking-[2px] uppercase" style={{ color: 'var(--gris)' }}>{k}</dt>
                  <dd className="text-sm" style={{ color: 'var(--creme)' }}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="space-y-4">
            <label className="flex gap-3 items-start text-sm cursor-pointer" style={{ color: 'var(--nacre)' }}>
              <input type="checkbox" checked={form.majeur} onChange={e => set('majeur', e.target.checked)} required className="mt-1" />
              Je certifie avoir 18 ans ou plus et être résident d&apos;un territoire antillais.
            </label>
            <label className="flex gap-3 items-start text-sm cursor-pointer" style={{ color: 'var(--nacre)' }}>
              <input type="checkbox" checked={form.cgu} onChange={e => set('cgu', e.target.checked)} required className="mt-1" />
              J&apos;accepte les{' '}
              <a href="/cgv" target="_blank" style={{ color: 'var(--or)' }}>Conditions Générales de Vente</a>
              {' '}et la{' '}
              <a href="/confidentialite" target="_blank" style={{ color: 'var(--or)' }}>Politique de confidentialité</a>.
            </label>
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-10">
        {step > 1 && (
          <button type="button" onClick={() => setStep(s => s - 1)}
            className="px-8 py-4 text-xs tracking-[4px] uppercase border transition-colors"
            style={{ borderColor: 'var(--or)', color: 'var(--or)', background: 'none', cursor: 'pointer' }}>
            Retour
          </button>
        )}
        <button type="submit" disabled={loading}
          className="flex-1 py-4 text-xs tracking-[4px] uppercase transition-all duration-300 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #C9A961, #9C7B3E)', color: 'var(--noir)', border: 'none', cursor: 'pointer' }}>
          {loading ? 'Envoi...' : step < 3 ? 'Continuer →' : 'Soumettre ma demande'}
        </button>
      </div>
    </form>
  )
}

export default function AdhererPage() {
  return (
    <div className="min-h-screen px-8 py-32" style={{ background: 'var(--noir)' }}>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[8px] uppercase mb-4" style={{ color: 'var(--or)' }}>
            Adhésion · La Réserve des Initiés
          </p>
          <h1 className="serif text-5xl font-normal mb-4">Rejoindre<br /><em className="italic" style={{ color: 'var(--or-clair)' }}>le Cercle</em></h1>
          <p style={{ color: 'var(--nacre)' }}>
            L&apos;adhésion est gratuite et réservée aux personnes cooptées par un membre actif.
          </p>
        </div>
        <Suspense>
          <AdhererForm />
        </Suspense>
      </div>
    </div>
  )
}
