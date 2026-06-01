import { NextRequest, NextResponse } from 'next/server'
import { getStripeServer } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const stripe = getStripeServer()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const meta = session.metadata!

    const supabase = await createAdminClient()

    const prix_unitaire = parseFloat((session.amount_total! / 100).toFixed(2))

    await supabase.from('commandes').insert({
      membre_id: meta.membre_id,
      produit_id: meta.produit_id,
      quantite: parseInt(meta.quantite),
      prix_unitaire,
      remise_pct: parseFloat(meta.remise_pct),
      prix_total: prix_unitaire,
      points_gagnes: parseInt(meta.points_gagnes),
      statut: 'payee',
      stripe_payment_intent: session.payment_intent as string,
      stripe_session_id: session.id,
      adresse_livraison: session.shipping_details ? {
        nom: session.shipping_details.name,
        adresse: session.shipping_details.address?.line1,
        ville: session.shipping_details.address?.city,
        territoire: session.shipping_details.address?.postal_code?.substring(0, 3),
      } : null,
    })
  }

  return NextResponse.json({ received: true })
}