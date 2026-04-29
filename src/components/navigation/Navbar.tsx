'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { Profile } from '@/types/database'

export default function Navbar() {
  const pathname = usePathname()
  const [profile, setProfile] = useState<Profile | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('profiles').select('*').eq('id', user.id).single()
          .then(({ data }) => setProfile(data))
      }
    })
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-16 py-6"
      style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(201,169,97,0.15)' }}>

      <Link href="/" className="serif text-xl tracking-[4px] uppercase"
        style={{ color: 'var(--or)' }}>
        La Réserve
      </Link>

      <div className="flex gap-12 text-xs tracking-[3px] uppercase">
        <Link href="/#collection" style={{ color: isActive('/#') ? 'var(--or)' : 'var(--creme)' }}
          className="hover:text-[var(--or)] transition-colors">La Collection</Link>
        <Link href="/#cooptation" style={{ color: 'var(--creme)' }}
          className="hover:text-[var(--or)] transition-colors">Le Cercle</Link>
        {!profile ? (
          <Link href="/adherer" style={{ color: 'var(--creme)' }}
            className="hover:text-[var(--or)] transition-colors">Adhérer</Link>
        ) : null}
        {profile?.statut === 'actif' ? (
          <>
            <Link href="/boutique" style={{ color: isActive('/boutique') ? 'var(--or)' : 'var(--creme)' }}
              className="hover:text-[var(--or)] transition-colors">Boutique</Link>
            <Link href="/espace-membre" style={{ color: isActive('/espace-membre') ? 'var(--or)' : 'var(--creme)' }}
              className="hover:text-[var(--or)] transition-colors">
              Mon Espace · <span style={{ color: 'var(--or)' }}>{profile.niveau.toUpperCase()}</span>
            </Link>
            <button onClick={handleSignOut} className="text-xs tracking-[3px] uppercase hover:text-[var(--or)] transition-colors"
              style={{ color: 'var(--gris)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Déconnexion
            </button>
          </>
        ) : !profile ? (
          <Link href="/auth/login" style={{ color: 'var(--creme)' }}
            className="hover:text-[var(--or)] transition-colors">Connexion</Link>
        ) : null}
      </div>
    </nav>
  )
}
