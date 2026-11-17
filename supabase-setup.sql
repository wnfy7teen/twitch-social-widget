-- Run this once in Supabase Dashboard → SQL Editor.
-- This table stores only public widget presentation settings (never passwords or private data).
create table if not exists public.widget_config (
  id text primary key check (id = 'default'),
  config jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.widget_config enable row level security;

drop policy if exists "Anyone can read widget config" on public.widget_config;
create policy "Anyone can read widget config"
  on public.widget_config for select
  to anon, authenticated
  using (id = 'default');

drop policy if exists "Anyone can create widget config" on public.widget_config;
create policy "Anyone can create widget config"
  on public.widget_config for insert
  to anon, authenticated
  with check (id = 'default');

drop policy if exists "Anyone can update widget config" on public.widget_config;
create policy "Anyone can update widget config"
  on public.widget_config for update
  to anon, authenticated
  using (id = 'default')
  with check (id = 'default');

grant select, insert, update on public.widget_config to anon, authenticated;
