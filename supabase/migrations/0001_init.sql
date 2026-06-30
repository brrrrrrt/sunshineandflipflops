-- ============================================================
-- Sunshine & Flip Flops — initial schema
-- Blog posts, gallery postcards, inbound leads + storage + RLS.
--
-- Security model: only emails in ALLOWED_ADMIN_EMAILS can ever create an
-- account (open signups are DISABLED in Supabase Auth; accounts are minted
-- by the gated /api/studio/signup route using the service-role key). Because
-- the only accounts that can exist are the allowlisted admins, RLS treats
-- any `authenticated` user as an admin. No emails are stored in this file.
-- ============================================================

create extension if not exists "pgcrypto";

-- Shared updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- POSTS (blog / journal) ----------
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text not null default '',
  body         text not null default '',
  category     text not null default 'tips',
  cover_image  text,
  read_minutes int  not null default 4,
  featured     boolean not null default false,
  status       text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at before update on public.posts
  for each row execute function public.set_updated_at();
create index if not exists posts_status_idx on public.posts(status, published_at desc);

-- ---------- POSTCARDS (gallery / carousel) ----------
create table if not exists public.postcards (
  id          uuid primary key default gen_random_uuid(),
  destination text not null default '',
  title       text not null default '',
  image       text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
drop trigger if exists postcards_set_updated_at on public.postcards;
create trigger postcards_set_updated_at before update on public.postcards
  for each row execute function public.set_updated_at();
create index if not exists postcards_sort_idx on public.postcards(sort_order);

-- ---------- LEADS (inbound contact form) ----------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  trip_type   text not null default '',
  message     text not null,
  -- Heuristic spam / salesperson detection (computed at insert time).
  flagged     boolean not null default false,
  flag_reason text not null default '',
  status      text not null default 'new' check (status in ('new','read','archived')),
  created_at  timestamptz not null default now()
);
create index if not exists leads_status_idx on public.leads(status, created_at desc);

-- ============================================================
-- Admin allowlist — the ONLY accounts with write access. Emails are added
-- here (by the service-role signup route) only when they're also in the
-- ALLOWED_ADMIN_EMAILS env list. RLS checks membership via is_admin(), so a
-- stray Supabase signup gets zero access even if open signups are left on.
-- No emails are committed to the repo; the table is seeded at signup time.
-- ============================================================
create table if not exists public.admin_allowlist (
  email      text primary key,
  created_at timestamptz not null default now()
);
alter table public.admin_allowlist enable row level security;
-- Intentionally no policies: only the service role (bypasses RLS) touches it.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_allowlist a
    where a.email = (auth.jwt() ->> 'email')
  );
$$;

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.posts     enable row level security;
alter table public.postcards enable row level security;
alter table public.leads     enable row level security;

-- Public (anon + authenticated) read: published posts + all postcards
drop policy if exists "posts public read published" on public.posts;
create policy "posts public read published" on public.posts
  for select using (status = 'published');

drop policy if exists "postcards public read" on public.postcards;
create policy "postcards public read" on public.postcards
  for select using (true);

-- Admins (allowlisted accounts only): full access
drop policy if exists "posts admin all" on public.posts;
create policy "posts admin all" on public.posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "postcards admin all" on public.postcards;
create policy "postcards admin all" on public.postcards
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Leads: anyone may submit; only admins may read / triage / delete
drop policy if exists "leads anon insert" on public.leads;
create policy "leads anon insert" on public.leads
  for insert to anon with check (true);

drop policy if exists "leads auth insert" on public.leads;
create policy "leads auth insert" on public.leads
  for insert to authenticated with check (true);

drop policy if exists "leads admin read" on public.leads;
create policy "leads admin read" on public.leads
  for select to authenticated using (public.is_admin());

drop policy if exists "leads admin update" on public.leads;
create policy "leads admin update" on public.leads
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "leads admin delete" on public.leads;
create policy "leads admin delete" on public.leads
  for delete to authenticated using (public.is_admin());

-- ============================================================
-- Storage — public "media" bucket for blog covers + postcard images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
