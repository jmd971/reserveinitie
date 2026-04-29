'use client'
import { useState } from 'react'
import type { Profile, Commande, PointsTransaction, Invitation } from '@/types/database'
import { NIVEAUX_CONFIG, TERRITOIRES } from '@/types/database'
import toast from 'react-hot-toast'

interface Props {
  profile: Profile | null
  commandes: Commande[]
  pointsHistory: PointsTransaction[]
  invitations: Invitation[]
}

export default function EspaceMembreClient({ profile, commandes, pointsHistory, invitations }: Props) {
  const [emailInvit, setEmailInvit] = useState('')
  const [invitLoading, setInvitLoading] = useState(false)
  const [tab, setTab] = useState<'dashboard' | 'commandes' | 'points' | 'invitations'>('dashboard')

  if (!profile) return null

  const niveau = NIVEAUX_CONFIG[profile.niveau]
  const nextNiveau = profile.niveau === 'standard' ? NIVEAUX_CONFIG.gold : profile.niveau === 'gold' ? NIVEAUX_CONFIG.vip : null
  const progressPct = nextNiveau
    ? Math.min(100, Math.round(((profile.points - niveau.min) / ((nextNiveau.min) - niveau.min)) * 100))
    : 100

  async function envoyerInvitation(e: React.FormEvent) {
    e.preventDefault()
    setInvitLoading(true)
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_filleul: emailInvit }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Invitation envoyée !')
      setEmailInvit('')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setInvitLoading(false)
    }
  }

  function formatDate(s: string) {
    return new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
  }
  function formatPrix(n: number) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(n)
  }

  const lienCooptation = `${typeof window !== 'undefined' ? window.location.origin : ''}/adherer?ref=${profile.numero_membre}`

  return (
    <div className="min-h-screen px-8 py-12" style={{ background: 'var(--noir)' }}>
      <div className="max-w-5xl mx-auto">

        {/* Carte membre */}
        <div className="mb-12 p-10 relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #1a1400, #0a0a0a)',
          border: '1px solid rgba(201,169,97,0.5)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,169,97,0.2)'
        }}>
          {/* Déco */}
          <div className="absolute inset-4 pointer-events-none" style={{ border: '1px solid rgba(201,169,97,0.15)' }} />
          <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none" style={{
            background: 'radial-gradient(circle, rgba(201,169,97,0.05) 0%, transparent 70%)'
          }} />

          <div className="grid grid-cols-2 gap-8 relative z-10">
            <div>
              <p className="text-xs tracking-[8px] uppercase mb-6" style={{ color: 'var(--or)' }}>
                La Réserve des Initiés
              </p>
              <div className="serif text-5xl font-normal mb-2" style={{ color: 'var(--creme)' }}>
                {profile.prenom} <span style={{ color: 'var(--or)' }}>{profile.nom.toUpperCase()}</span>
              </div>
              <p className="text-xs tracking-[3px] uppercase mt-4 mb-8" style={{ color: 'var(--gris)' }}>
                N° {profile.numero_membre} · Adhésion {formatDate(profile.created_at)}
              </p>
              <div className="inline-block px-6 py-2 text-sm tracking-[4px] uppercase"
                style={{ background: 'linear-gradient(135deg, #C9A961, #9C7B3E)', color: 'var(--noir)' }}>
                {profile.niveau.toUpperCase()} · {niveau.remise > 0 ? `−${niveau.remise}%` : 'Standard'}
              </div>
            </div>
            <div className="flex flex-col items-end justify-between">
              {/* QR Code simulé */}
              <div className="w-24 h-24 flex items-center justify-center"
                style={{ background: 'rgba(201,169,97,0.1)', border: '1px solid rgba(201,169,97,0.3)' }}>
                <span className="text-xs text-center tracking-[2px] uppercase" style={{ color: 'var(--or)' }}>QR Code</span>
              </div>
              <div className="text-right">
                <div className="serif text-4xl" style={{ color: 'var(--or)' }}>{profile.points.toLocaleString('fr-FR')}</div>
                <p className="text-xs tracking-[3px] uppercase" style={{ color: 'var(--gris)' }}>Points fidélité</p>
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          {nextNiveau && (
            <div className="mt-8 relative z-10">
              <div className="flex justify-between mb-2 text-xs" style={{ color: 'var(--gris)' }}>
                <span>{niveau.label} ({niveau.min} pts)</span>
                <span>{nextNiveau.label} ({nextNiveau.min} pts)</span>
              </div>
              <div className="h-1" style={{ background: 'rgba(201,169,97,0.15)', borderRadius: '2px' }}>
                <div className="h-1" style={{
                  width: `${progressPct}%`,
                  background: 'linear-gradient(90deg, #9C7B3E, #E8C77E)',
                  borderRadius: '2px',
                  transition: 'width 1s ease',
                }} />
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--or)' }}>
                {nextNiveau.min - profile.points} points pour atteindre {nextNiveau.label}
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {[
            { val: profile.points.toLocaleString('fr-FR'), label: 'Points', unit: 'pts' },
            { val: commandes.filter(c => c.statut === 'payee' || c.statut === 'livree').length, label: 'Commandes', unit: '' },
            { val: invitations.filter(i => i.statut === 'acceptee').length, label: 'Filleuls', unit: '' },
            { val: niveau.remise > 0 ? `−${niveau.remise}%` : '0%', label: 'Avantage', unit: '' },
          ].map(({ val, label, unit }) => (
            <div key={label} className="p-8 text-center border" style={{ background: 'var(--noir-doux)', borderColor: 'rgba(201,169,97,0.15)' }}>
              <div className="serif text-3xl mb-2" style={{ color: 'var(--or)' }}>{val}<span className="text-lg">{unit}</span></div>
              <p className="text-xs tracking-[3px] uppercase" style={{ color: 'var(--gris)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-8 border-b" style={{ borderColor: 'rgba(201,169,97,0.15)' }}>
          {(['dashboard', 'commandes', 'points', 'invitations'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-8 py-4 text-xs tracking-[3px] uppercase transition-colors"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: tab === t ? 'var(--or)' : 'var(--gris)',
                borderBottom: tab === t ? '2px solid var(--or)' : '2px solid transparent',
                marginBottom: '-1px'
              }}>
              {t === 'dashboard' ? 'Mon Compte' : t === 'commandes' ? 'Commandes' : t === 'points' ? 'Points' : 'Invitations'}
            </button>
          ))}
        </div>

        {/* Tab: Dashboard */}
        {tab === 'dashboard' && (
          <div className="grid grid-cols-2 gap-8">
            <div className="p-8 border" style={{ background: 'var(--noir-doux)', borderColor: 'rgba(201,169,97,0.15)' }}>
              <h3 className="text-xs tracking-[4px] uppercase mb-6" style={{ color: 'var(--or)' }}>Informations</h3>
              <dl className="space-y-4">
                {[
                  ['Nom', `${profile.prenom} ${profile.nom}`],
                  ['Email', profile.email],
                  ['Téléphone', profile.telephone || '—'],
                  ['Territoire', profile.territoire ? TERRITOIRES[profile.territoire] : '—'],
                  ['Membre depuis', formatDate(profile.created_at)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <dt className="text-xs tracking-[2px] uppercase" style={{ color: 'var(--gris)' }}>{k}</dt>
                    <dd className="text-sm" style={{ color: 'var(--creme)' }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="p-8 border" style={{ background: 'var(--noir-doux)', borderColor: 'rgba(201,169,97,0.15)' }}>
              <h3 className="text-xs tracking-[4px] uppercase mb-6" style={{ color: 'var(--or)' }}>Cooptation</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--nacre)' }}>
                Partagez votre lien de cooptation. Vous gagnez 20 points au premier achat de chaque filleul.
              </p>
              <div className="p-4 mb-4 text-xs" style={{ background: 'var(--noir)', border: '1px solid rgba(201,169,97,0.2)', color: 'var(--or)', wordBreak: 'break-all' }}>
                {lienCooptation}
              </div>
              <button onClick={() => { navigator.clipboard.writeText(lienCooptation); toast.success('Lien copié !') }}
                className="w-full py-3 text-xs tracking-[3px] uppercase border transition-colors hover:bg-[var(--or)] hover:text-[var(--noir)]"
                style={{ borderColor: 'var(--or)', color: 'var(--or)', background: 'none', cursor: 'pointer' }}>
                Copier le lien
              </button>
            </div>
          </div>
        )}

        {/* Tab: Commandes */}
        {tab === 'commandes' && (
          <div className="space-y-4">
            {commandes.length === 0 ? (
              <p style={{ color: 'var(--nacre)' }}>Aucune commande pour l&apos;instant.</p>
            ) : commandes.map(c => (
              <div key={c.id} className="p-6 border flex items-center justify-between"
                style={{ background: 'var(--noir-doux)', borderColor: 'rgba(201,169,97,0.15)' }}>
                <div>
                  <p className="serif text-lg mb-1" style={{ color: 'var(--creme)' }}>
                    {(c as any).produit?.nom || c.produit_id}
                  </p>
                  <p className="text-xs tracking-[2px]" style={{ color: 'var(--gris)' }}>{formatDate(c.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="serif text-xl mb-1" style={{ color: 'var(--or)' }}>{formatPrix(c.prix_total)}</p>
                  <span className="text-xs tracking-[2px] uppercase px-3 py-1" style={{
                    background: c.statut === 'livree' ? 'rgba(201,169,97,0.15)' : 'rgba(50,50,50,0.5)',
                    color: 'var(--or)'
                  }}>
                    {c.statut}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Points */}
        {tab === 'points' && (
          <div>
            <div className="p-8 border mb-8" style={{ background: 'var(--noir-doux)', borderColor: 'rgba(201,169,97,0.15)' }}>
              <h3 className="text-xs tracking-[4px] uppercase mb-4" style={{ color: 'var(--or)' }}>Programme Fidélité</h3>
              <div className="grid grid-cols-3 gap-6">
                {Object.entries(NIVEAUX_CONFIG).map(([key, n]) => (
                  <div key={key} className={`p-6 border text-center ${profile.niveau === key ? 'border-[var(--or)]' : ''}`}
                    style={{ borderColor: profile.niveau === key ? 'var(--or)' : 'rgba(201,169,97,0.15)' }}>
                    <p className="text-xs tracking-[4px] uppercase mb-2" style={{ color: n.couleur }}>{n.label}</p>
                    <p className="serif text-2xl mb-2" style={{ color: 'var(--creme)' }}>
                      {n.remise > 0 ? `−${n.remise}%` : 'Standard'}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--gris)' }}>
                      {n.min.toLocaleString('fr-FR')} pts{n.max ? ` — ${n.max.toLocaleString('fr-FR')} pts` : '+'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {pointsHistory.map(t => (
                <div key={t.id} className="flex items-center justify-between p-4 border"
                  style={{ background: 'var(--noir-doux)', borderColor: 'rgba(201,169,97,0.1)' }}>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--creme)' }}>{t.description}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--gris)' }}>{formatDate(t.created_at)}</p>
                  </div>
                  <span className="serif text-xl" style={{ color: t.points > 0 ? 'var(--or)' : '#e05252' }}>
                    {t.points > 0 ? '+' : ''}{t.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Invitations */}
        {tab === 'invitations' && (
          <div>
            <form onSubmit={envoyerInvitation} className="flex gap-4 mb-12">
              <input type="email" value={emailInvit} onChange={e => setEmailInvit(e.target.value)} required
                placeholder="email@destinataire.com"
                className="flex-1 px-5 py-4 text-sm"
                style={{ background: 'var(--noir-doux)', border: '1px solid rgba(201,169,97,0.25)', color: 'var(--creme)', outline: 'none' }} />
              <button type="submit" disabled={invitLoading}
                className="px-8 py-4 text-xs tracking-[3px] uppercase disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #C9A961, #9C7B3E)', color: 'var(--noir)', border: 'none', cursor: 'pointer' }}>
                {invitLoading ? '...' : 'Inviter'}
              </button>
            </form>
            <div className="space-y-3">
              {invitations.map(i => (
                <div key={i.id} className="flex items-center justify-between p-5 border"
                  style={{ background: 'var(--noir-doux)', borderColor: 'rgba(201,169,97,0.1)' }}>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--creme)' }}>{i.email_filleul}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--gris)' }}>Envoyée le {formatDate(i.created_at)}</p>
                  </div>
                  <span className="text-xs tracking-[2px] uppercase px-3 py-1"
                    style={{
                      color: i.statut === 'acceptee' ? 'var(--or)' : 'var(--gris)',
                      border: '1px solid',
                      borderColor: i.statut === 'acceptee' ? 'rgba(201,169,97,0.4)' : 'rgba(107,107,107,0.3)'
                    }}>
                    {i.statut === 'acceptee' ? 'Acceptée' : i.statut === 'expiree' ? 'Expirée' : 'En attente'}
                    {i.points_attribues && ' · +20 pts'}
                  </span>
                </div>
              ))}
              {invitations.length === 0 && (
                <p style={{ color: 'var(--nacre)' }}>Aucune invitation envoyée.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
