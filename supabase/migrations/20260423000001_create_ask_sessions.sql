-- Ask Sessions table: persists per-user Ask conversations and powers the
-- live-shareable-link flow via the is_public flag.
create extension if not exists "pgcrypto";

create table public.ask_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text,
  is_public   boolean not null default false,
  model       text not null,
  messages    jsonb not null default '[]'::jsonb,
  cards       jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_ask_sessions_user_updated
  on public.ask_sessions (user_id, updated_at desc);

create index idx_ask_sessions_public
  on public.ask_sessions (id)
  where is_public = true;

create or replace function public.touch_ask_sessions_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger trg_touch_ask_sessions_updated_at
  before update on public.ask_sessions
  for each row execute function public.touch_ask_sessions_updated_at();

alter table public.ask_sessions enable row level security;

-- Owner can do anything with their own sessions.
create policy "owner_all" on public.ask_sessions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Anyone (including unauthenticated) can read public sessions.
create policy "public_read" on public.ask_sessions
  for select
  using (is_public = true);
