-- Search Console connection tables. NOT used by the site yet: the OAuth path is
-- unfinished (see supabase/functions/gsc-sync/index.ts). Only the CSV upload path is live.
create table if not exists gsc_connections (
  user_id uuid references auth.users primary key,
  refresh_token text not null,            -- encrypt (pgsodium / Vault) before storing
  connected_at timestamptz default now(),
  last_sync timestamptz
);
alter table gsc_connections enable row level security;
drop policy if exists "own row" on gsc_connections;
create policy "own row" on gsc_connections for all using (auth.uid() = user_id);

create table if not exists gsc_snapshots (
  id bigserial primary key,
  user_id uuid references auth.users,
  site_url text not null,
  period_start date,
  period_end date,
  rows jsonb,                             -- query/page/clicks/impressions/position
  created_at timestamptz default now()
);
alter table gsc_snapshots enable row level security;
drop policy if exists "own rows" on gsc_snapshots;
create policy "own rows" on gsc_snapshots for all using (auth.uid() = user_id);
