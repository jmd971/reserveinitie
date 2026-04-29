export default function EnAttentePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-8" style={{ background: 'var(--noir)' }}>
      <div className="text-center max-w-md">
        <p className="text-xs tracking-[8px] uppercase mb-8" style={{ color: 'var(--or)' }}>Dossier reçu</p>
        <h1 className="serif text-4xl font-normal mb-6">Validation en cours</h1>
        <p className="mb-8 leading-relaxed" style={{ color: 'var(--nacre)' }}>
          Votre demande d&apos;adhésion a bien été reçue. Notre équipe valide votre profil sous 48h.
          Vous recevrez un email dès que votre accès est activé.
        </p>
        <a href="/" className="text-xs tracking-[4px] uppercase" style={{ color: 'var(--or)' }}>← Retour à l&apos;accueil</a>
      </div>
    </div>
  )
}
