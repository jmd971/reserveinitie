import Navbar from '@/components/navigation/Navbar'
import { createClient } from '@/lib/supabase/server'
import type { Produit } from '@/types/database'
import Link from 'next/link'

const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E8C77E"/>
        <stop offset="50%" stopColor="#C9A961"/>
        <stop offset="100%" stopColor="#9C7B3E"/>
      </linearGradient>
    </defs>
    <rect width="600" height="600" fill="#0A0A0A"/>
    <circle cx="300" cy="300" r="240" fill="none" stroke="url(#g1)" strokeWidth="1.5"/>
    <circle cx="300" cy="300" r="225" fill="none" stroke="url(#g1)" strokeWidth="0.7"/>
    <path id="topArc" d="M 100 300 A 200 200 0 0 1 500 300" fill="none"/>
    <text fontFamily="Georgia, serif" fontSize="22" fill="url(#g1)" letterSpacing="8">
      <textPath href="#topArc" startOffset="50%" textAnchor="middle">LA RÉSERVE DES INITIÉS</textPath>
    </text>
    <path id="botArc" d="M 110 300 A 190 190 0 0 0 490 300" fill="none"/>
    <text fontFamily="Georgia, serif" fontSize="14" fill="url(#g1)" letterSpacing="12">
      <textPath href="#botArc" startOffset="50%" textAnchor="middle">EST. ANTILLES · MMXXVI</textPath>
    </text>
    <text x="100" y="306" fontFamily="Georgia, serif" fontSize="20" fill="url(#g1)" textAnchor="middle">✦</text>
    <text x="500" y="306" fontFamily="Georgia, serif" fontSize="20" fill="url(#g1)" textAnchor="middle">✦</text>
    <g transform="translate(300,300)">
      <text x="-75" y="55" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="220" fontWeight="500" fill="url(#g1)" textAnchor="middle">R</text>
      <g transform="translate(0,-15)" fill="url(#g1)"><polygon points="0,-7 6,0 0,7 -6,0"/></g>
      <text x="75" y="55" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="220" fontWeight="500" fill="url(#g1)" textAnchor="middle">I</text>
    </g>
    <text x="300" y="575" fontFamily="Georgia, serif" fontSize="11" fill="url(#g1)" letterSpacing="10" textAnchor="middle">CERCLE PRIVÉ · ANTILLES</text>
  </svg>
)

async function getProduits(): Promise<Produit[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('produits').select('*').eq('actif', true).order('position')
  return data || []
}

export default async function HomePage() {
  const produits = await getProduits()
  const champagnes = produits.filter(p => p.categorie === 'champagne')
  const spiritueux = produits.filter(p => p.categorie !== 'champagne')

  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-8 pt-32 pb-16 relative"
        style={{ background: 'radial-gradient(ellipse at center top, rgba(201,169,97,0.08) 0%, transparent 60%), var(--noir)' }}>
        <p className="text-xs tracking-[8px] uppercase mb-8" style={{ color: 'var(--or)' }}>
          Cercle Privé · Antilles · Sur Cooptation
        </p>
        <div className="w-64 h-64 mb-6"><Logo /></div>
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
        <p className="absolute bottom-12 left-1/2 text-xs tracking-[4px] uppercase"
          style={{ color: 'var(--or)', transform: 'translateX(-50%)', animation: 'bounce 2.5s infinite' }}>
          ↓ Découvrir
        </p>
      </section>

      {/* ===== MANIFESTE ===== */}
      <section className="py-32 px-8 text-center" style={{ background: 'var(--noir-doux)' }} id="manifeste">
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
      <section className="py-32 px-8" style={{ background: 'var(--noir)' }} id="maison">
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
      <section className="py-32 px-8" style={{ background: 'var(--noir-doux)' }} id="collection">
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

      {/* ===== L'ART DE LA SÉLECTION ===== */}
      <section className="py-32 px-8" style={{ background: 'var(--noir)' }}>
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
      <section className="py-32 px-8 text-center" style={{ background: 'var(--noir-doux)' }} id="cooptation">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-[8px] uppercase mb-4" style={{ color: 'var(--or)' }}>Accès Exclusif</p>
          <h2 className="serif text-4xl font-normal mb-4">Rejoindre le Cercle</h2>
          <p className="mb-16" style={{ color: 'var(--nacre)' }}>
            La Réserve des Initiés n&apos;est pas ouverte au public. L&apos;accès se fait uniquement sur cooptation d&apos;un membre existant.
          </p>
          <div className="grid grid-cols-4 gap-8 mb-16">
            {[
              { n: '1', title: 'Cooptation', text: 'Un membre actif vous parraine et partage son lien d\'invitation personnel.' },
              { n: '2', title: 'Inscription', text: 'Vous complétez votre dossier et vérification d\'identité (KYC).' },
              { n: '3', title: 'Validation', text: 'Notre équipe valide votre profil sous 48h.' },
              { n: '4', title: 'Bienvenue', text: 'Vous recevez votre carte virtuelle et accédez à la Boutique.' },
            ].map(({ n, title, text }) => (
              <div key={n} className="text-center">
                <div className="w-16 h-16 rounded-full border flex items-center justify-center mx-auto mb-6 serif text-2xl"
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
      <section className="py-32 px-8" style={{ background: 'var(--noir)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="serif text-4xl font-normal gold-text">L&apos;expérience Initiés</h2>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {[
              { icon: '◈', title: 'Carte Virtuelle', text: 'Carte de membre personnalisée avec QR code, téléchargeable en PDF.' },
              { icon: '✦', title: 'Programme Fidélité', text: '1€ = 1 point · Gold dès 1000 pts (−5%) · VIP dès 5000 pts (−10%)' },
              { icon: '◆', title: 'Soirées du Cercle', text: 'Événements exclusifs réservés aux membres dans les territoires.' },
              { icon: '◇', title: 'Cooptation Active', text: 'Parrainez vos proches et gagnez 20 points à leur premier achat.' },
              { icon: '▲', title: 'Livraison Offerte', text: 'Livraison gratuite sur les 5 territoires des Antilles françaises.' },
              { icon: '★', title: 'Confidentialité', text: 'Vos données restent en France/EU. Discrétion et sécurité garanties.' },
            ].map(({ icon, title, text }) => (
              <div key={title} className="p-12 border text-center transition-all duration-500 hover:border-[var(--or)] hover:-translate-y-1"
                style={{ background: 'var(--noir-doux)', borderColor: 'rgba(201,169,97,0.15)' }}>
                <div className="w-16 h-16 rounded-full border flex items-center justify-center mx-auto mb-8 serif text-2xl"
                  style={{ borderColor: 'var(--or)', color: 'var(--or)' }}>
                  {icon}
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
