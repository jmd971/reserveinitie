import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import { NIVEAUX_CONFIG } from '@/types/database'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { produit_id, quantite = 1 } = await req.json()

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const { data: produit } = await supabase
      .from('produits')
      .select('*')
      .eq('id', produit_id)
      .eq('actif', true)
      .single()

    if (!profile || !produit) {
      return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 })
    }

    const remise = NIVEAUX_CONFIG[profile.niveau as keyof typeof NIVEAUX_CONFIG].remise
    const prix_final = produit.prix * (1 - remise / 100) * quantite
    const points_gagnes = Math.floor(prix_final)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: profile.email,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: produit.nom,
            description: `${produit.sous_titre} — La Réserve des Initiés${remise > 0 ? ` (remise ${remise}% ${profile.niveau.toUpperCase()})` : ''}`,
            metadata: { produit_id: produit.id },
          },
          unit_amount: Math.round(prix_final * 100),
        },
        quantity: 1,
      }],
      metadata: {
        membre_id: user.id,
        produit_id,
        quantite: quantite.toString(),
        remise_pct: remise.toString(),
        points_gagnes: points_gagnes.toString(),
      },
      shipping_address_collection: {
        allowed_countries: ['GP', 'MQ', 'GF', 'MF', 'BL'],
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/commande/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/boutique`,
      locale: 'fr',
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
