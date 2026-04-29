-- ============================================================
-- La Réserve des Initiés — Schéma Supabase
-- ============================================================

-- Extension UUID
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILS MEMBRES (étend auth.users)
-- ============================================================
create table public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  prenom        text not null,
  nom           text not null,
  email         text not null,
  telephone     text,
  adresse       text,
  ville         text,
  territoire    text check (territoire in ('971','972','973','977','978')),
  date_naissance date,
  niveau        text not null default 'standard'
                  check (niveau in ('standard','gold','vip')),
  points        integer not null default 0,
  parrain_id    uuid references public.profiles(id),
  numero_membre text unique,
  statut        text not null default 'en_attente'
                  check (statut in ('en_attente','actif','suspendu')),
  kyc_url       text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Trigger updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Numéro membre auto (RI-2026-XXXX)
create or replace function public.generate_numero_membre()
returns trigger language plpgsql as $$
declare seq integer;
begin
  select coalesce(max(cast(substring(numero_membre from 9) as integer)), 0) + 1
  into seq from public.profiles where numero_membre is not null;
  new.numero_membre := 'RI-' || to_char(now(), 'YYYY') || '-' || lpad(seq::text, 4, '0');
  return new;
end;
$$;

create trigger profiles_numero_membre
  before insert on public.profiles
  for each row when (new.numero_membre is null)
  execute function public.generate_numero_membre();

-- ============================================================
-- PRODUITS
-- ============================================================
create table public.produits (
  id          text primary key,
  nom         text not null,
  sous_titre  text,
  categorie   text not null check (categorie in ('champagne','cognac','whisky','rhum','spiritueux')),
  volume_cl   integer,
  prix        numeric(10,2) not null,
  points_achat integer generated always as (floor(prix)::integer) stored,
  description text,
  image_path  text,
  badge       text,
  actif       boolean not null default true,
  position    integer not null default 0
);

-- Données initiales
insert into public.produits (id, nom, sous_titre, categorie, volume_cl, prix, description, badge, position) values
  ('brut75',   'Brut 24K',            'Champagne · Pure Gold 24K',       'champagne', 75,  350.00, 'Cuvée Blending à la robe dorée, enrichie de fines particules d''or 24 carats. Bulles d''une finesse rare, nez de fruits blancs et brioche, finale longue et soyeuse. Le fleuron de la Maison. Service : 8–10 °C.', null, 1),
  ('rose75',   'Rosé 24K',            'Champagne Rosé · Pure Gold 24K',  'champagne', 75,  420.00, 'Champagne rosé d''exception, robe saumonée aux reflets dorés, particules d''or 24 carats en suspension. Notes de fruits rouges, fraise des bois, finale fraîche et persistante. Service : 8–10 °C.', 'Nouveauté', 2),
  ('brut150',  'Brut 24K · Magnum',   'Champagne · Magnum 150 cl',       'champagne', 150, 720.00, 'Le Brut 24K en format Magnum pour les grandes célébrations. La double contenance offre une maturation optimale, des bulles encore plus fines et une complexité aromatique accrue. Pièce maîtresse de table. Service : 8–10 °C.', 'Format Prestige', 3),
  ('rose150',  'Rosé 24K · Magnum',   'Champagne Rosé · Magnum 150 cl',  'champagne', 150, 900.00, 'Le Rosé 24K en format Magnum, pièce de collection. Robe rosée lumineuse, particules d''or en suspension, arômes intensifiés par le vieillissement en grand format. Pour les occasions d''exception. Service : 8–10 °C.', 'Collection', 4),
  ('xo',       'XO · Édition Exclusive','Cognac · Pure Gold 24K · Cuvée n°8', 'cognac', 70, 2390.00, 'Cognac d''exception de la Maison Comte de Mazeray, Cuvée n°8, élevé en fûts de chêne français. Robe acajou profond aux reflets or, enrichie de fines particules d''or 24 carats. Nez puissant de fruits secs, tabac blond et épices douces. Bouche veloutée, finale interminable. L''édition la plus exclusive de la Maison. Service : 16–18 °C.', 'Édition Limitée', 5);

-- ============================================================
-- INVITATIONS (cooptation)
-- ============================================================
create table public.invitations (
  id            uuid primary key default gen_random_uuid(),
  parrain_id    uuid not null references public.profiles(id),
  email_filleul text not null,
  token         text not null unique default gen_random_uuid()::text,
  statut        text not null default 'envoyee'
                  check (statut in ('envoyee','acceptee','expiree')),
  points_attribues boolean not null default false,
  created_at    timestamptz not null default now(),
  expires_at    timestamptz not null default now() + interval '30 days'
);

-- ============================================================
-- COMMANDES
-- ============================================================
create table public.commandes (
  id                      uuid primary key default gen_random_uuid(),
  membre_id               uuid not null references public.profiles(id),
  produit_id              text not null references public.produits(id),
  quantite                integer not null default 1,
  prix_unitaire           numeric(10,2) not null,
  remise_pct              numeric(5,2) not null default 0,
  prix_total              numeric(10,2) not null,
  points_gagnes           integer not null default 0,
  statut                  text not null default 'en_attente'
                            check (statut in ('en_attente','payee','expediee','livree','annulee')),
  stripe_payment_intent   text,
  stripe_session_id       text,
  adresse_livraison       jsonb,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create trigger commandes_updated_at
  before update on public.commandes
  for each row execute function public.set_updated_at();

-- ============================================================
-- TRANSACTIONS POINTS
-- ============================================================
create table public.points_transactions (
  id           uuid primary key default gen_random_uuid(),
  membre_id    uuid not null references public.profiles(id),
  type         text not null check (type in ('achat','parrainage','bonus','correction')),
  points       integer not null,
  description  text,
  ref_id       uuid,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- FONCTIONS MÉTIER
-- ============================================================

-- Mise à jour niveau selon points
create or replace function public.update_niveau(membre_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.profiles set niveau =
    case
      when points >= 5000 then 'vip'
      when points >= 1000 then 'gold'
      else 'standard'
    end
  where id = membre_id;
end;
$$;

-- Ajouter des points (achat ou parrainage)
create or replace function public.ajouter_points(
  p_membre_id uuid,
  p_points    integer,
  p_type      text,
  p_desc      text,
  p_ref_id    uuid default null
) returns void language plpgsql security definer as $$
begin
  update public.profiles set points = points + p_points where id = p_membre_id;
  insert into public.points_transactions (membre_id, type, points, description, ref_id)
    values (p_membre_id, p_type, p_points, p_desc, p_ref_id);
  perform public.update_niveau(p_membre_id);
end;
$$;

-- Points parrain au premier achat du filleul
create or replace function public.handle_premier_achat()
returns trigger language plpgsql security definer as $$
declare
  v_parrain_id uuid;
  v_premiers   integer;
begin
  if new.statut = 'payee' and old.statut != 'payee' then
    -- Compter commandes payées du membre (avant celle-ci)
    select count(*) into v_premiers
    from public.commandes
    where membre_id = new.membre_id and statut = 'payee' and id != new.id;

    if v_premiers = 0 then
      -- Trouver parrain
      select parrain_id into v_parrain_id from public.profiles where id = new.membre_id;
      if v_parrain_id is not null then
        perform public.ajouter_points(v_parrain_id, 20, 'parrainage',
          'Bonus parrainage — premier achat du filleul', new.id);
        update public.invitations set points_attribues = true
          where parrain_id = v_parrain_id
            and email_filleul = (select email from public.profiles where id = new.membre_id);
      end if;
    end if;

    -- Points achat pour le membre
    perform public.ajouter_points(new.membre_id, new.points_gagnes, 'achat',
      'Points achat — commande ' || new.id::text, new.id);
  end if;
  return new;
end;
$$;

create trigger commandes_premier_achat
  after update on public.commandes
  for each row execute function public.handle_premier_achat();

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
alter table public.profiles           enable row level security;
alter table public.produits           enable row level security;
alter table public.invitations        enable row level security;
alter table public.commandes          enable row level security;
alter table public.points_transactions enable row level security;

-- Profiles : chaque membre voit uniquement le sien
create policy "profiles_self" on public.profiles
  for all using (auth.uid() = id);

-- Admin bypass (role admin via JWT claim)
create policy "profiles_admin" on public.profiles
  for all using ((auth.jwt() ->> 'role') = 'admin');

-- Produits : lecture publique pour actifs
create policy "produits_read" on public.produits
  for select using (actif = true);

-- Invitations : parrain voit les siennes
create policy "invitations_parrain" on public.invitations
  for all using (auth.uid() = parrain_id);

-- Commandes : membre voit les siennes
create policy "commandes_self" on public.commandes
  for all using (auth.uid() = membre_id);

-- Points : membre voit les siennes
create policy "points_self" on public.points_transactions
  for select using (auth.uid() = membre_id);
