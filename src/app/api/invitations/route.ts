import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { email_filleul } = await req.json()
  if (!email_filleul) return NextResponse.json({ error: 'Email requis' }, { status: 400 })

  const { data: existing } = await supabase
    .from('invitations')
    .select('id')
    .eq('parrain_id', user.id)
    .eq('email_filleul', email_filleul)
    .eq('statut', 'envoyee')
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Invitation déjà envoyée à cet email' }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('invitations')
    .insert({ parrain_id: user.id, email_filleul })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ invitation: data })
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data } = await supabase
    .from('invitations')
    .select('*')
    .eq('parrain_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ invitations: data })
}
