import Navbar from '@/components/navigation/Navbar'
import { createClient } from '@/lib/supabase/server'
import type { Produit } from '@/types/database'
import Link from 'next/link'

async function getProduits(): Promise<Produit[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('produits').select('*').eq('actif', true).order('position')
  return data || []
}

export default async function HomePage() {
  const produits = await getProduits()
  const champagnes = produits.filter(p => p.categorie === 'champagne')
  const spiritueux = produits.filter(p => p.categorie !== 'champagne')

  const avantages = [
    {
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 L22 12 L12 22 L2 12 Z"/><path d="M12 6 L18 12 L12 18 L6 12 Z" opacity="0.4"/></svg>,
      title: 'Soirées du Cercle',
      text: 'Événements exclusifs réservés aux membres dans chaque territoire : dégustations privées, soirées de prestige, rencontres entre initiés.'
    },
    {
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>,
      title: 'Avant-Premières',
      text: 'Accès prioritaire aux nouvelles cuvées et aux expressions hors catalogue, avant toute mise en vente publique.'
    },
    {
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
      title: 'Carte Virtuelle',
      text: "Carte de membre nominative avec votre numéro d'initié, vos points et votre rang. Téléchargeable et présentable."
    },
    {
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
      title: 'Programme Fidélité',
      text: "1€ d'achat = 1 point · Rang Gold dès 1 000 pts (−5%) · Rang VIP dès 5 000 pts (−10% + coffret offert)."
    },
    {
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><line x1="12" y1="16" x2="12" y2="16" strokeWidth="2"/></svg>,
      title: 'Livraison Offerte',
      text: 'Livraison gratuite sur les cinq territoires des Antilles françaises. Conditionnement premium garanti.'
    },
    {
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      title: 'Cooptation Active',
      text: "Parrainez vos proches et gagnez 20 points à leur premier achat. Chaque initié que vous introduisez renforce le Cercle."
    },
  ]

  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-8 pt-32 pb-16 relative hero-grain"
        style={{ background: 'radial-gradient(ellipse at center top, rgba(201,169,97,0.08) 0%, transparent 60%), var(--noir)' }}>
        <p className="text-xs tracking-[8px] uppercase mb-8" style={{ color: 'var(--or)' }}>
          Cercle Privé · Antilles · Sur Cooptation
        </p>
        <div className="w-56 h-56 mb-6">
          <img src="/logo-premium.png" alt="La Réserve des Initiés" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <h1 className="serif text-5xl font-normal leading-tight mb-6">
          Des spiritueux d&apos;exception,<br />
          <em className="italic" style={{ color: 'var(--or-clair)' }}>partagés entre initiés.</em>
        </h1>
        <p className="text-lg max-w-lg mb-12 leading-relaxed" style={{ color: 'var(--nacre)' }}>
          Champagnes, cognacs et spiritueux rares enrichis d&apos;or 24 carats,
          accessibles uniquement aux membres cooptés du Cercle aux Antilles.
        </p>
        <div className="flex gap-6 flex-wrap justify-center">
          <Link href="/adherer"
            className="inline-flex items-center px-10 py-4 text-xs tracking-[4px] uppercase transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #C9A961, #9C7B3E)', color: 'var(--noir)' }}>
            Demander à rejoindre
          </Link>
          <Link href="#collection"
            className="inline-flex items-center px-10 py-4 text-xs tracking-[4px] uppercase border transition-all duration-300 hover:bg-[var(--or)] hover:text-[var(--noir)]"
            style={{ borderColor: 'var(--or)', color: 'var(--or)' }}>
            Découvrir le Cercle
          </Link>
        </div>
        <p className="mt-10 text-xs tracking-[4px] uppercase" style={{ color: 'var(--gris)' }}>
          Cercle en cours de formation · Antilles françaises · 2026
        </p>
        <p className="absolute bottom-12 left-1/2 text-xs tracking-[4px] uppercase"
          style={{ color: 'var(--or)', transform: 'translateX(-50%)', animation: 'bounce 2.5s infinite' }}>
          ↓ Découvrir
        </p>
      </section>

      {/* ===== MANIFESTE ===== */}
      <section className="py-32 px-8 text-center reveal" style={{ background: 'var(--noir-doux)' }} id="manifeste">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[8px] uppercase mb-6" style={{ color: 'var(--or)' }}>Notre Engagement</p>
          <h2 className="serif text-4xl font-normal mb-8 gold-text">Un Cercle, pas une boutique.</h2>
          <blockquote className="serif italic text-2xl font-light leading-relaxed max-w-3xl mx-auto" style={{ color: 'var(--creme)' }}>
            &laquo; Nous ne réunissons pas des collectionneurs, mais des esprits rares qui comprennent
            qu&apos;un grand flacon ne se possède pas — il se partage, il se transmet, il se vit. &raquo;
          </blockquote>
        </div>
      </section>

      {/* ===== LA MAISON ===== */}
      <section className="py-32 px-8 reveal" style={{ background: 'var(--noir)' }} id="maison">
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-xs tracking-[8px] uppercase mb-6" style={{ color: 'var(--or)' }}>Maison Comte de Mazeray · Pure Gold 24K</p>
            <h2 className="serif text-5xl font-normal leading-tight mb-6">
              L&apos;Art de<br /><em className="italic" style={{ color: 'var(--or-clair)' }}>l&apos;Exception</em>
            </h2>
            <p className="leading-loose mb-8" style={{ color: 'var(--nacre)' }}>
              Champagnes de prestige, cognacs d&apos;exception, spiritueux rares — chaque flacon de la Maison
              Comte de Mazeray est enrichi de fines particules d&apos;or 24 carats, expression ultime
              d&apos;un héritage antillais d&apos;excellence.
            </p>
            <p className="leading-loose mb-10" style={{ color: 'var(--nacre)' }}>
              Joseph de Mazeray, navigateur et négociant du XVIIIe siècle, forgea sa fortune entre
              les Antilles et les grandes maisons de France. Aujourd&apos;hui, son héritage continue :
              sélectionner l&apos;exception, la réserver aux initiés.
            </p>
            <div className="flex gap-4 flex-wrap mb-8">
              {['Champagnes', 'Cognacs', 'Spiritueux Rares'].map(cat => (
                <span key={cat} className="text-xs tracking-[4px] uppercase px-5 py-2"
                  style={{ border: '1px solid rgba(201,169,97,0.4)', color: 'var(--or)' }}>
                  {cat}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-0 border-t border-b py-6 mb-10"
              style={{ borderColor: 'rgba(201,169,97,0.2)' }}>
              {[['Or 24K', 'Particules pures'], ['5', 'Expressions'], ['5', 'Territoires Antilles']].map(([val, label]) => (
                <div key={label}>
                  <strong className="block serif text-2xl mb-1" style={{ color: 'var(--or)' }}>{val}</strong>
                  <span className="text-xs tracking-[3px] uppercase" style={{ color: 'var(--gris)' }}>{label}</span>
                </div>
              ))}
            </div>
            <Link href="#collection"
              className="inline-flex items-center px-10 py-4 text-xs tracking-[4px] uppercase transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #C9A961, #9C7B3E)', color: 'var(--noir)' }}>
              Voir la Collection
            </Link>
          </div>
          <div className="relative flex items-center justify-center" style={{ minHeight: '500px' }}>
            <div className="w-full h-full rounded-none" style={{
              background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(50,37,10,1) 0%, rgba(10,10,10,1) 70%)',
              border: '1px solid rgba(201,169,97,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '3rem', aspectRatio: '4/5'
            }}>
              <div className="text-center" style={{ color: 'var(--or)' }}>
                <div className="serif text-8xl mb-4">RI</div>
                <div className="text-xs tracking-[6px] uppercase" style={{ color: 'var(--or-fonce)' }}>Maison · MMXXVI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LA COLLECTION ===== */}
      <section className="py-32 px-8 reveal" style={{ background: 'var(--noir-doux)' }} id="collection">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs tracking-[8px] uppercase mb-4" style={{ color: 'var(--or)' }}>Maison Comte de Mazeray · Pure Gold 24K</p>
            <h2 className="serif text-4xl font-normal mb-4">
              La <em className="italic" style={{ color: 'var(--or-clair)' }}>Collection</em>
            </h2>
            <p style={{ color: 'var(--nacre)' }}>
              Champagnes, cognacs et spiritueux d&apos;exception — accès réservé aux membres.
            </p>
          </div>

          {champagnes.length > 0 && (
            <>
              <p className="text-xs tracking-[6px] uppercase mb-4" style={{ color: 'var(--or)' }}>Champagnes 24K</p>
              <div className="grid grid-cols-4 gap-6 mb-16">
                {champagnes.map(p => <ProductCard key={p.id} produit={p} />)}
              </div>
            </>
          )}

          {spiritueux.length > 0 && (
            <>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex-1 h-px" style={{ background: 'rgba(201,169,97,0.2)' }} />
                <span className="text-xs tracking-[6px] uppercase" style={{ color: 'var(--or)' }}>Cognacs &amp; Spiritueux</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(201,169,97,0.2)' }} />
              </div>
              <div className="grid grid-cols-4 gap-6 max-w-sm mx-auto">
                {spiritueux.map(p => <ProductCard key={p.id} produit={p} />)}
              </div>
            </>
          )}

          {produits.length === 0 && (
            <div className="grid grid-cols-4 gap-6">
              {['Brut 24K', 'Rosé 24K', 'Brut Magnum', 'Rosé Magnum'].map((nom, i) => (
                <StaticProductCard key={i} nom={nom} categorie="Champagne" />
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link href="/adherer"
              className="inline-flex items-center px-10 py-4 text-xs tracking-[4px] uppercase transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #C9A961, #9C7B3E)', color: 'var(--noir)' }}>
              Rejoindre le Cercle pour accéder aux prix
            </Link>
          </div>
        </div>
      </section>

      {/* ===== MEMBRES FONDATEURS ===== */}
      <section className="py-24 px-8 reveal" style={{ background: '#0d0d0d', borderTop: '1px solid rgba(201,169,97,0.1)', borderBottom: '1px solid rgba(201,169,97,0.1)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-[8px] uppercase mb-4" style={{ color: 'var(--or)' }}>Places limitées</p>
            <h2 className="serif text-4xl font-normal mb-6">
              Membres <em className="italic" style={{ color: 'var(--or-clair)' }}>Fondateurs</em>
            </h2>
            <p className="leading-loose mb-6" style={{ color: 'var(--nacre)' }}>
              Les cinquante premiers membres cooptés dans chaque territoire obtiennent le statut <strong style={{ color: 'var(--or)' }}>Fondateur</strong> —
              inscrit à vie sur leur carte, reconnu par l&apos;ensemble du Cercle.
            </p>
            <p className="leading-loose mb-10" style={{ color: 'var(--nacre)' }}>
              Ce statut n&apos;est pas accessible par l&apos;argent, ni par le temps. Il appartient uniquement à ceux qui ont eu le discernement de rejoindre le Cercle à ses premières heures.
            </p>
            <Link href="/adherer"
              className="inline-flex items-center px-10 py-4 text-xs tracking-[4px] uppercase transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #C9A961, #9C7B3E)', color: 'var(--noir)' }}>
              Vérifier les places disponibles
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { territoire: 'Guadeloupe', places: 'Ouvert', code: '971' },
              { territoire: 'Martinique', places: 'Ouvert', code: '972' },
              { territoire: 'Guyane', places: 'Ouvert', code: '973' },
              { territoire: 'Saint-Martin', places: 'Ouvert', code: '978' },
              { territoire: 'Saint-Barthélemy', places: 'Ouvert', code: '977' },
            ].map(({ territoire, places, code }) => (
              <div key={code} className="p-6 border text-center"
                style={{ background: 'var(--noir)', borderColor: 'rgba(201,169,97,0.15)' }}>
                <p className="text-xs tracking-[2px] uppercase mb-1" style={{ color: 'var(--gris)' }}>{territoire}</p>
                <p className="text-xs tracking-[3px]" style={{ color: 'var(--or)' }}>{places}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== L'ART DE LA SÉLECTION ===== */}
      <section className="py-32 px-8 reveal" style={{ background: 'var(--noir)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs tracking-[8px] uppercase mb-4" style={{ color: 'var(--or)' }}>Notre Savoir-Faire</p>
            <h2 className="serif text-4xl font-normal mb-4 gold-text">L&apos;art de la Sélection</h2>
            <p style={{ color: 'var(--nacre)' }}>Chaque flacon, une promesse de rareté.</p>
          </div>
          <div className="grid grid-cols-3 gap-12">
            {[
              { label: 'Provenance', title: 'Maisons d\'Exception', text: 'Nos flacons sont issus des plus grandes maisons françaises, sélectionnés pour leur singularité, leur caractère et leur capacité à traverser le temps.' },
              { label: 'Signature', title: 'Or 24 Carats', text: 'Chaque expression de la Maison Comte de Mazeray intègre de fines particules d\'or 24 carats, marque d\'appartenance à une tradition d\'excellence absolue.' },
              { label: 'Partage', title: 'Réservé aux Initiés', text: 'Ces flacons ne s\'achètent pas, ils se méritent. Accessibles uniquement aux membres cooptés du Cercle, ils incarnent un privilège rare aux Antilles.' },
            ].map(({ label, title, text }) => (
              <div key={label} className="text-center px-8 border-l" style={{ borderColor: 'rgba(201,169,97,0.3)' }}>
                <p className="text-xs tracking-[4px] uppercase mb-3" style={{ color: 'var(--gris)' }}>{label}</p>
                <h4 className="serif text-2xl mb-4" style={{ color: 'var(--or)' }}>{title}</h4>
                <p style={{ color: 'var(--nacre)' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COOPTATION ===== */}
      <section className="py-32 px-8 text-center reveal" style={{ background: 'var(--noir-doux)' }} id="cooptation">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-[8px] uppercase mb-4" style={{ color: 'var(--or)' }}>Accès Exclusif</p>
          <h2 className="serif text-4xl font-normal mb-4">Rejoindre le Cercle</h2>
          <p className="mb-16" style={{ color: 'var(--nacre)' }}>
            La Réserve des Initiés n&apos;est pas ouverte au public. L&apos;accès se fait uniquement sur cooptation d&apos;un membre existant.
          </p>
          <div className="grid grid-cols-4 gap-8 mb-16 reveal-stagger">
            {[
              { n: '1', title: 'Cooptation', text: 'Un membre actif vous parraine et partage son lien d\'invitation personnel.' },
              { n: '2', title: 'Inscription', text: 'Vous complétez votre dossier et vérification d\'identité (KYC).' },
              { n: '3', title: 'Validation', text: 'Notre équipe valide votre profil sous 48h.' },
              { n: '4', title: 'Bienvenue', text: 'Vous recevez votre carte virtuelle et accédez à la Boutique.' },
            ].map(({ n, title, text }) => (
              <div key={n} className="text-center">
                <div className="w-14 h-14 border flex items-center justify-center mx-auto mb-6 serif text-2xl"
                  style={{ borderColor: 'var(--or)', color: 'var(--or)', background: 'var(--noir)' }}>
                  {n}
                </div>
                <h4 className="serif text-xl mb-3" style={{ color: 'var(--creme)' }}>{title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--nacre)' }}>{text}</p>
              </div>
            ))}
          </div>
          <Link href="/adherer"
            className="inline-flex items-center px-10 py-4 text-xs tracking-[4px] uppercase transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #C9A961, #9C7B3E)', color: 'var(--noir)' }}>
            J&apos;ai été coopté · Adhérer
          </Link>
        </div>
      </section>

      {/* ===== AVANTAGES ===== */}
      <section className="py-32 px-8 reveal" style={{ background: 'var(--noir)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="serif text-4xl font-normal gold-text">L&apos;expérience Initiés</h2>
          </div>
          <div className="grid grid-cols-3 gap-8 reveal-stagger">
            {avantages.map(({ svg, title, text }) => (
              <div key={title} className="p-12 border text-center transition-all duration-500 hover:border-[var(--or)] hover:-translate-y-1"
                style={{ background: 'var(--noir-doux)', borderColor: 'rgba(201,169,97,0.15)' }}>
                <div className="w-16 h-16 border flex items-center justify-center mx-auto mb-8"
                  style={{ borderColor: 'rgba(201,169,97,0.35)', color: 'var(--or)' }}>
                  {svg}
                </div>
                <h3 className="serif text-2xl mb-4" style={{ color: 'var(--creme)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--nacre)' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="px-8 pt-20 pb-8" style={{ background: 'var(--noir-elev)', borderTop: '1px solid rgba(201,169,97,0.15)' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-12 mb-12">
          <div>
            <div className="serif text-xl tracking-[4px] uppercase mb-4" style={{ color: 'var(--or)' }}>LA RÉSERVE</div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--gris)', maxWidth: '280px' }}>
              Cercle privé de spiritueux d&apos;exception, sur cooptation, aux Antilles françaises.
            </p>
          </div>
          <div>
            <h5 className="text-xs tracking-[4px] uppercase mb-6" style={{ color: 'var(--or)' }}>Navigation</h5>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--nacre)' }}>
              <li><Link href="/#collection" className="hover:text-[var(--or)] transition-colors">La Collection</Link></li>
              <li><Link href="/#cooptation" className="hover:text-[var(--or)] transition-colors">Le Cercle</Link></li>
              <li><Link href="/adherer" className="hover:text-[var(--or)] transition-colors">Adhérer</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs tracking-[4px] uppercase mb-6" style={{ color: 'var(--or)' }}>Territoires</h5>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--nacre)' }}>
              {['Guadeloupe', 'Martinique', 'Guyane', 'Saint-Martin', 'Saint-Barthélemy'].map(t => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-xs tracking-[4px] uppercase mb-6" style={{ color: 'var(--or)' }}>Légal</h5>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--nacre)' }}>
              <li><Link href="/mentions-legales" className="hover:text-[var(--or)] transition-colors">Mentions légales</Link></li>
              <li><Link href="/cgv" className="hover:text-[var(--or)] transition-colors">CGV</Link></li>
              <li><Link href="/confidentialite" className="hover:text-[var(--or)] transition-colors">Confidentialité</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 flex justify-between text-xs" style={{ borderTop: '1px solid rgba(201,169,97,0.1)', color: 'var(--gris)' }}>
          <span>© 2026 La Réserve des Initiés · Tous droits réservés</span>
          <span style={{ color: 'var(--or)' }}>L&apos;ABUS D&apos;ALCOOL EST DANGEREUX POUR LA SANTÉ — À CONSOMMER AVEC MODÉRATION</span>
        </div>
      </footer>
    </>
  )
}

function ProductCard({ produit }: { produit: Produit }) {
  return (
    <Link href="/adherer" className="block group">
      <div className="border p-8 text-center transition-all duration-500 group-hover:border-[var(--or)] group-hover:-translate-y-1"
        style={{ background: 'var(--noir)', borderColor: 'rgba(201,169,97,0.15)' }}>
        <div className="h-36 flex items-center justify-center mb-6"
          style={{ background: 'radial-gradient(ellipse 60% 65% at 50% 50%, rgba(40,30,8,1) 0%, rgba(10,10,10,1) 70%)' }}>
          <span className="serif text-5xl" style={{ color: 'var(--or-fonce)' }}>RI</span>
        </div>
        <p className="text-xs tracking-[3px] uppercase mb-2" style={{ color: 'var(--or)' }}>
          {produit.categorie === 'champagne' ? `Champagne · ${produit.volume_cl} cl` : `${produit.categorie} · Cuvée n°8`}
        </p>
        <h3 className="serif text-xl font-normal" style={{ color: 'var(--creme)' }}>{produit.nom}</h3>
        {produit.badge && (
          <span className="inline-block mt-3 text-xs tracking-[2px] px-3 py-1"
            style={{ border: '1px solid rgba(201,169,97,0.4)', color: 'var(--or)' }}>
            {produit.badge}
          </span>
        )}
      </div>
    </Link>
  )
}

function StaticProductCard({ nom, categorie }: { nom: string; categorie: string }) {
  return (
    <div className="border p-8 text-center" style={{ background: 'var(--noir)', borderColor: 'rgba(201,169,97,0.15)' }}>
      <div className="h-36 flex items-center justify-center mb-6"
        style={{ background: 'radial-gradient(ellipse 60% 65% at 50% 50%, rgba(40,30,8,1) 0%, rgba(10,10,10,1) 70%)' }}>
        <span className="serif text-5xl" style={{ color: 'var(--or-fonce)' }}>RI</span>
      </div>
      <p className="text-xs tracking-[3px] uppercase mb-2" style={{ color: 'var(--or)' }}>{categorie}</p>
      <h3 className="serif text-xl font-normal" style={{ color: 'var(--creme)' }}>{nom}</h3>
    </div>
  )
}
