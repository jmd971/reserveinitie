export type Territoire = '971' | '972' | '973' | '977' | '978'
export type Niveau = 'standard' | 'gold' | 'vip'
export type StatutMembre = 'en_attente' | 'actif' | 'suspendu'
export type Categorie = 'champagne' | 'cognac' | 'whisky' | 'rhum' | 'spiritueux'
export type StatutCommande = 'en_attente' | 'payee' | 'expediee' | 'livree' | 'annulee'
export type TypePoint = 'achat' | 'parrainage' | 'bonus' | 'correction'

export interface Profile {
  id: string
  prenom: string
  nom: string
  email: string
  telephone: string | null
  adresse: string | null
  ville: string | null
  territoire: Territoire | null
  date_naissance: string | null
  niveau: Niveau
  points: number
  parrain_id: string | null
  numero_membre: string | null
  statut: StatutMembre
  kyc_url: string | null
  created_at: string
  updated_at: string
}

export interface Produit {
  id: string
  nom: string
  sous_titre: string | null
  categorie: Categorie
  volume_cl: number | null
  prix: number
  points_achat: number
  description: string | null
  image_path: string | null
  badge: string | null
  actif: boolean
  position: number
}

export interface Invitation {
  id: string
  parrain_id: string
  email_filleul: string
  token: string
  statut: 'envoyee' | 'acceptee' | 'expiree'
  points_attribues: boolean
  created_at: string
  expires_at: string
}

export interface Commande {
  id: string
  membre_id: string
  produit_id: string
  quantite: number
  prix_unitaire: number
  remise_pct: number
  prix_total: number
  points_gagnes: number
  statut: StatutCommande
  stripe_payment_intent: string | null
  stripe_session_id: string | null
  adresse_livraison: AdresseLivraison | null
  created_at: string
  updated_at: string
  produit?: Produit
}

export interface AdresseLivraison {
  nom: string
  adresse: string
  ville: string
  territoire: Territoire
  telephone: string
}

export interface PointsTransaction {
  id: string
  membre_id: string
  type: TypePoint
  points: number
  description: string | null
  ref_id: string | null
  created_at: string
}

export const TERRITOIRES: Record<Territoire, string> = {
  '971': 'Guadeloupe',
  '972': 'Martinique',
  '973': 'Guyane',
  '977': 'Saint-Barthélemy',
  '978': 'Saint-Martin',
}

export const NIVEAUX_CONFIG: Record<Niveau, { label: string; min: number; max: number | null; remise: number; couleur: string }> = {
  standard: { label: 'Standard',  min: 0,    max: 999,  remise: 0,  couleur: '#9C7B3E' },
  gold:     { label: 'Gold',      min: 1000, max: 4999, remise: 5,  couleur: '#C9A961' },
  vip:      { label: 'VIP',       min: 5000, max: null,  remise: 10, couleur: '#E8C77E' },
}
