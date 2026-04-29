import { createClient } from '@/lib/supabase/server'
import type { Produit, Profile } from '@/types/database'
import { NIVEAUX_CONFIG } from '@/types/database'
import BoutiqueClient from './BoutiqueClient'

export default async function BoutiquePage() {
  const supabase = await createClient()

  const [{ data: { user } }, { data: produits }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('produits').select('*').eq('actif', true).order('position'),
  ])

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  return <BoutiqueClient produits={produits || []} profile={profile} />
}
