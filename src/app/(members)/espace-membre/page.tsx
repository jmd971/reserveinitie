import { createClient } from '@/lib/supabase/server'
import { NIVEAUX_CONFIG, TERRITOIRES } from '@/types/database'
import type { Profile, Commande, PointsTransaction, Invitation } from '@/types/database'
import EspaceMembreClient from './EspaceMembreClient'

export default async function EspaceMembrePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [profileRes, commandesRes, pointsRes, invitationsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('commandes').select('*, produit:produits(*)').eq('membre_id', user!.id).order('created_at', { ascending: false }).limit(10),
    supabase.from('points_transactions').select('*').eq('membre_id', user!.id).order('created_at', { ascending: false }).limit(20),
    supabase.from('invitations').select('*').eq('parrain_id', user!.id).order('created_at', { ascending: false }),
  ])

  return (
    <EspaceMembreClient
      profile={profileRes.data}
      commandes={commandesRes.data || []}
      pointsHistory={pointsRes.data || []}
      invitations={invitationsRes.data || []}
    />
  )
}
