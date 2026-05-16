'use client'
import { useState } from 'react'
import type { Produit, Profile } from '@/types/database'
import { NIVEAUX_CONFIG } from '@/types/database'
import toast from 'react-hot-toast'

interface Props {
  produits: Produit[]
  profile: Profile | null
}

export default function BoutiqueClient({ produits, profile }: Props) {
  const [selected, setSelected] = useState<Produit | null>(null)
  const [loading, setLoading] = useState(false)

  const niveau = profile?.niveau || 'standard'
  const remise = NIVEAUX_CONFIG[niveau].remise

  const nextNiveauKey = niveau === 'standard' ? 'gold' : niveau === 'gold' ? 'vip' : null
  const nextNiveau = nextNiveauKey ? NIVEAUX_CONFIG[nextNiveauKey] : null
  const pointsManquants = nextNiveau ? nextNiveau.min - (profile?.points || 0) : 0
  const progressPct = nextNiveau
    ? Math.min(100, Math.round((((profile?.points || 0) - NIVEAUX_CONFIG[niveau].min) / (nextNiveau.min - NIVEAUX_CONFIG[niveau].min)) * 100))
    : 100

  function prixFinal(prix: number) {
    return remise > 0 ? prix * (1 - remise / 100) : prix
  }

  function formatPrix(n: number) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(n)
  }

  async function handleCommander(produit: Produit) {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produit_id: produit.id }),
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (err) {
      toast.error('Erreur lors de la création de la commande.')
    } finally {
      setLoading(false)
    }
  }

  const champagnes = produits.filter(p => p.categorie === 'champagne')
  const spiritueux = produits.filter(p => p.categorie !== 'champagne')

  return (
    <div className="min-h-screen px-8 py-16" style={{ background: 'var(--noir)' }}>
      <div className="max-w-6xl mx-auto">

        {/* En-tête */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[8px] uppercase mb-4" style={{ color: 'var(--or)' }}>Boutique Membres</p>
          <h1 className="serif text-5xl font-normal mb-4">
            La <em className="italic" style={{ color: 'var(--or-clair)' }}>Collection</em>
          </h1>
          <p style={{ color: 'var(--nacre)' }}>
            Cinq expressions d&apos;exception enrichies de particules d&apos;or 24 carats. Livraison offerte.
          </p>
          {remise > 0 && (
            <div className="inline-block mt-4 px-6 py-2 text-xs tracking-[3px] uppercase"
              style={{ border: '1px solid rgba(201,169,97,0.4)', color: 'var(--or)' }}>
              Avantage {niveau.toUpperCase()} · −{remise}% sur tous les produits
            </div>
          )}
        </div>

        {/* Champagnes */}
        <p className="text-xs tracking-[6px] uppercase mb-4" style={{ color: 'var(--or)' }}>Champagnes 24K</p>

        {/* Hero card — Emblème de la Maison (Anchoring) */}
        {champagnes.length > 0 && (() => {
          const embleme = champagnes[0]
          return (
            <div className="mb-8 border cursor-pointer relative overflow-hidden transition-all duration-500"
              style={{ borderColor: 'rgba(201,169,97,0.35)', background: 'linear-gradient(135deg, rgba(25,18,5,1), rgba(10,10,10,1))' }}
              onClick={() => setSelected(embleme)}
              onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(201,169,97,0.7)')}
              onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(201,169,97,0.35)')}>
              {/* Corner badge */}
              <div className="absolute top-0 left-0 px-5 py-2 text-xs tracking-[4px] uppercase"
                style={{ background: 'linear-gradient(135deg, #C9A961, #9C7B3E)', color: 'var(--noir)' }}>
                Emblème de la Maison
              </div>
              <div className="grid grid-cols-2 gap-0">
                {/* Visual */}
                <div className="flex items-center justify-center p-16"
                  style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(50,37,10,1) 0%, transparent 70%)', minHeight: '280px' }}>
                  <span className="serif" style={{ fontSize: '7rem', color: 'var(--or-fonce)', lineHeight: 1 }}>RI</span>
                </div>
                {/* Info */}
                <div className="p-12 flex flex-col justify-center">
                  <p className="text-xs tracking-[5px] uppercase mb-3" style={{ color: 'var(--or)' }}>
                    {embleme.sous_titre}
                  </p>
                  <h2 className="serif text-4xl font-normal mb-4" style={{ color: 'var(--creme)' }}>{embleme.nom}</h2>
                  <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--nacre)', maxWidth: '380px' }}>
                    {embleme.description}
                  </p>
                  <div className="flex items-baseline gap-4">
                    <span className="serif text-4xl" style={{ color: 'var(--or)' }}>
                      {formatPrix(prixFinal(embleme.prix))}
                    </span>
                    {remise > 0 && (
                      <span className="text-sm line-through" style={{ color: 'var(--gris)' }}>
                        {formatPrix(embleme.prix)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-2 mb-8" style={{ color: 'var(--or)' }}>
                    +{Math.floor(prixFinal(embleme.prix))} points fidélité · Livraison offerte
                  </p>
                  <div className="inline-flex">
                    <span className="text-xs tracking-[4px] uppercase px-6 py-3 border transition-colors"
                      style={{ borderColor: 'var(--or)', color: 'var(--or)' }}>
                      Voir le détail →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

        {champagnes.slice(1).length > 0 && (
          <div className="grid grid-cols-4 gap-6 mb-16">
            {champagnes.slice(1).map(p => (
              <ProductCard key={p.id} produit={p} prixFinal={prixFinal(p.prix)} remise={remise}
                formatPrix={formatPrix} onClick={() => setSelected(p)} />
            ))}
          </div>
        )}

        {/* Cognacs & Spiritueux */}
        {spiritueux.length > 0 && (
          <>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex-1 h-px" style={{ background: 'rgba(201,169,97,0.2)' }} />
              <span className="text-xs tracking-[6px] uppercase" style={{ color: 'var(--or)' }}>Cognacs &amp; Spiritueux</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(201,169,97,0.2)' }} />
            </div>
            <div className="grid grid-cols-4 gap-6 max-w-sm">
              {spiritueux.map(p => (
                <ProductCard key={p.id} produit={p} prixFinal={prixFinal(p.prix)} remise={remise}
                  formatPrix={formatPrix} onClick={() => setSelected(p)} />
              ))}
            </div>
          </>
        )}

        {/* Next-tier upsell banner (Goal-Gradient) */}
        {nextNiveau && pointsManquants > 0 && (
          <div className="mt-16 p-6 border relative overflow-hidden"
            style={{ borderColor: 'rgba(201,169,97,0.3)', background: 'linear-gradient(135deg, rgba(20,15,3,1), rgba(10,10,10,1))' }}>
            {/* subtle glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 40% 60% at 0% 50%, rgba(201,169,97,0.06), transparent)' }} />
            <div className="relative z-10 flex items-center justify-between gap-8">
              <div className="flex-1">
                <p className="text-xs tracking-[5px] uppercase mb-2" style={{ color: 'var(--or)' }}>
                  Votre progression · Rang {nextNiveau.label}
                </p>
                <div className="h-px w-full mb-3" style={{ background: 'rgba(201,169,97,0.12)' }}>
                  <div style={{
                    height: '1px',
                    width: `${progressPct}%`,
                    background: 'linear-gradient(90deg, #9C7B3E, #E8C77E)',
                    boxShadow: progressPct >= 70 ? '0 0 6px rgba(232,199,126,0.5)' : 'none',
                    transition: 'width 1s ease',
                  }} />
                </div>
                <p className="text-sm" style={{ color: 'var(--nacre)' }}>
                  Il vous manque environ{' '}
                  <strong style={{ color: 'var(--or)' }}>{pointsManquants.toLocaleString('fr-FR')} €</strong>
                  {' '}d&apos;achats pour devenir{' '}
                  <strong style={{ color: nextNiveau.couleur }}>{nextNiveau.label}</strong>
                  {nextNiveau.remise > 0 && (
                    <span style={{ color: 'var(--gris)' }}> · −{nextNiveau.remise}% sur toutes vos commandes</span>
                  )}
                </p>
              </div>
              <div className="text-right whitespace-nowrap">
                <p className="serif text-3xl" style={{ color: 'var(--or)' }}>{progressPct}%</p>
                <p className="text-xs tracking-[2px] uppercase" style={{ color: 'var(--gris)' }}>accompli</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal produit */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8"
          style={{ background: 'rgba(0,0,0,0.92)' }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}>
          <div className="max-w-3xl w-full grid grid-cols-2 gap-0 relative"
            style={{ background: 'var(--noir-doux)', border: '1px solid rgba(201,169,97,0.3)' }}>

            {/* Image */}
            <div className="flex items-center justify-center p-12" style={{
              background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(50,37,10,1) 0%, rgba(10,10,10,1) 70%)',
              minHeight: '400px'
            }}>
              <span className="serif text-9xl" style={{ color: 'var(--or-fonce)' }}>RI</span>
            </div>

            {/* Infos */}
            <div className="p-10 flex flex-col justify-between">
              <div>
                <button onClick={() => setSelected(null)}
                  className="absolute top-6 right-6 text-xl hover:text-[var(--or)] transition-colors"
                  style={{ color: 'var(--gris)', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>

                <p className="text-xs tracking-[5px] uppercase mb-3" style={{ color: 'var(--or)' }}>
                  {selected.sous_titre}
                </p>
                <h2 className="serif text-3xl font-normal mb-6" style={{ color: 'var(--creme)' }}>{selected.nom}</h2>
                <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--nacre)' }}>{selected.description}</p>

                {/* Specs */}
                <table className="w-full text-sm mb-8">
                  <tbody>
                    {selected.volume_cl && (
                      <tr style={{ borderBottom: '1px solid rgba(201,169,97,0.1)' }}>
                        <td className="py-2 text-xs tracking-[2px] uppercase" style={{ color: 'var(--gris)' }}>Volume</td>
                        <td className="py-2 text-right" style={{ color: 'var(--creme)' }}>{selected.volume_cl} cl</td>
                      </tr>
                    )}
                    <tr style={{ borderBottom: '1px solid rgba(201,169,97,0.1)' }}>
                      <td className="py-2 text-xs tracking-[2px] uppercase" style={{ color: 'var(--gris)' }}>Alcool</td>
                      <td className="py-2 text-right" style={{ color: 'var(--creme)' }}>
                        {selected.categorie === 'cognac' ? '40 % vol.' : '12 % vol.'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-xs tracking-[2px] uppercase" style={{ color: 'var(--gris)' }}>Service</td>
                      <td className="py-2 text-right" style={{ color: 'var(--creme)' }}>
                        {selected.categorie === 'cognac' ? '16 – 18 °C' : '8 – 10 °C'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <div className="serif text-4xl mb-1" style={{ color: 'var(--or)' }}>
                  {formatPrix(prixFinal(selected.prix))}
                </div>
                {remise > 0 && (
                  <p className="text-xs line-through mb-1" style={{ color: 'var(--gris)' }}>
                    {formatPrix(selected.prix)}
                  </p>
                )}
                <p className="text-xs mb-6" style={{ color: 'var(--or)' }}>
                  +{Math.floor(prixFinal(selected.prix))} points fidélité · Livraison offerte
                </p>
                <button
                  onClick={() => handleCommander(selected)}
                  disabled={loading}
                  className="w-full py-4 text-xs tracking-[4px] uppercase transition-all duration-300 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #C9A961, #9C7B3E)', color: 'var(--noir)', border: 'none', cursor: 'pointer' }}>
                  {loading ? 'Redirection...' : `Commander · ${formatPrix(prixFinal(selected.prix))}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductCard({ produit, prixFinal, remise, formatPrix, onClick }: {
  produit: Produit; prixFinal: number; remise: number; formatPrix: (n: number) => string; onClick: () => void
}) {
  return (
    <div onClick={onClick} className="group cursor-pointer border transition-all duration-400"
      style={{ background: 'var(--noir-doux)', borderColor: 'rgba(201,169,97,0.15)' }}
      onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(201,169,97,0.6)')}
      onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(201,169,97,0.15)')}>
      <div className="h-48 flex items-center justify-center"
        style={{ background: 'radial-gradient(ellipse 60% 65% at 50% 50%, rgba(40,30,8,1) 0%, rgba(10,10,10,1) 70%)' }}>
        <span className="serif text-6xl" style={{ color: 'var(--or-fonce)' }}>RI</span>
      </div>
      <div className="p-6">
        <p className="text-xs tracking-[3px] uppercase mb-2" style={{ color: 'var(--or)' }}>
          {produit.categorie === 'champagne' ? `Champagne · ${produit.volume_cl} cl` : `Cognac · Cuvée n°8`}
        </p>
        <h3 className="serif text-xl font-normal mb-3" style={{ color: 'var(--creme)' }}>{produit.nom}</h3>
        <div className="serif text-2xl" style={{ color: 'var(--or)' }}>{formatPrix(prixFinal)}</div>
        {remise > 0 && (
          <p className="text-xs line-through mt-1" style={{ color: 'var(--gris)' }}>{formatPrix(produit.prix)}</p>
        )}
        <p className="text-xs mt-1" style={{ color: 'var(--gris)' }}>
          +{Math.floor(prixFinal)} pts fidélité
        </p>
        <p className="text-xs mt-3" style={{ color: 'var(--gris)' }}>En savoir plus →</p>
      </div>
    </div>
  )
}
