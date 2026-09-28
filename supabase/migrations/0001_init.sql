-- ============================================================
-- KUA Ngoro – Supabase Initial Migration
-- Run via: supabase db push  OR  Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── Helper: auto-update updated_at ─────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Table: admins ───────────────────────────────────────────
-- To add the first admin after creating the user in Supabase Auth:
--   insert into public.admins (user_id) values ('<auth-user-uuid>');
create table if not exists public.admins (
  user_id uuid primary key references auth.users on delete cascade,
  created_at timestamptz not null default now()
);

-- ─── Security helper: is_admin() ─────────────────────────────
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

-- ─── Table: profil (singleton) ───────────────────────────────
create table if not exists public.profil (
  id          uuid primary key default gen_random_uuid(),
  office_name text not null default '',
  description text not null default '',
  history     text not null default '',
  vision      text not null default '',
  mission     text[] not null default '{}',
  address     text not null default '',
  phone       text not null default '',
  email       text not null default '',
  office_hours jsonb not null default '{"workDays":"","fridayHours":"","weekend":""}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger profil_updated_at
  before update on public.profil
  for each row execute function public.set_updated_at();

-- ─── Table: berita ───────────────────────────────────────────
create table if not exists public.berita (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  slug           text not null unique,
  excerpt        text not null default '',
  content        text not null default '',
  featured_image text not null default '',
  category       text not null default 'Berita',
  author         text not null default 'Tim Humas KUA Ngoro',
  published_at   text not null default to_char(now(), 'YYYY-MM-DD'),
  status         text not null default 'draft'
                   check (status in ('draft','published')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger berita_updated_at
  before update on public.berita
  for each row execute function public.set_updated_at();

-- ─── Table: pengumuman ───────────────────────────────────────
create table if not exists public.pengumuman (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  content      text not null default '',
  published_at text not null default to_char(now(), 'YYYY-MM-DD'),
  expires_at   text,                                         -- nullable
  priority     text not null default 'normal'
                 check (priority in ('normal','important')),
  status       text not null default 'draft'
                 check (status in ('draft','published')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger pengumuman_updated_at
  before update on public.pengumuman
  for each row execute function public.set_updated_at();

-- ─── Table: layanan ──────────────────────────────────────────
create table if not exists public.layanan (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  slug           text not null unique,
  description    text not null default '',
  requirements   text[] not null default '{}',
  procedure      text[] not null default '{}',
  estimated_time text,
  icon           text not null default 'Landmark',
  status         text not null default 'active'
                   check (status in ('active','inactive')),
  "order"        integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger layanan_updated_at
  before update on public.layanan
  for each row execute function public.set_updated_at();

-- ─── Table: staf ─────────────────────────────────────────────
create table if not exists public.staf (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  position   text not null,
  photo      text not null default '',
  bio        text not null default '',
  "order"    integer not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger staf_updated_at
  before update on public.staf
  for each row execute function public.set_updated_at();

-- ─── Table: galeri ───────────────────────────────────────────
create table if not exists public.galeri (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  image        text not null default '',
  description  text not null default '',
  category     text not null default 'Kegiatan'
                 check (category in ('Kegiatan','Pelayanan','Acara','Lainnya')),
  published_at text not null default to_char(now(), 'YYYY-MM-DD'),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger galeri_updated_at
  before update on public.galeri
  for each row execute function public.set_updated_at();

-- ═══════════════════════════════════════════════════════════
-- Row Level Security (RLS)
-- ═══════════════════════════════════════════════════════════

alter table public.admins     enable row level security;
alter table public.profil     enable row level security;
alter table public.berita     enable row level security;
alter table public.pengumuman enable row level security;
alter table public.layanan    enable row level security;
alter table public.staf       enable row level security;
alter table public.galeri     enable row level security;

-- ── admins: only admins can manage, no anon read ────────────
create policy "admins_manage" on public.admins
  for all using (public.is_admin());

-- ── profil: anyone reads, only admin writes ──────────────────
create policy "profil_read"  on public.profil for select using (true);
create policy "profil_write" on public.profil for all    using (public.is_admin());

-- ── berita: anon reads published only ────────────────────────
create policy "berita_read"  on public.berita for select using (status = 'published');
create policy "berita_write" on public.berita for all    using (public.is_admin());

-- ── pengumuman: anon reads published & not expired ───────────
create policy "pengumuman_read" on public.pengumuman
  for select using (
    status = 'published' and
    (expires_at is null or expires_at >= to_char(now(), 'YYYY-MM-DD'))
  );
create policy "pengumuman_write" on public.pengumuman for all using (public.is_admin());

-- ── layanan: anon reads active only ─────────────────────────
create policy "layanan_read"  on public.layanan for select using (status = 'active');
create policy "layanan_write" on public.layanan for all    using (public.is_admin());

-- ── staf: anon reads active only ────────────────────────────
create policy "staf_read"  on public.staf for select using (active = true);
create policy "staf_write" on public.staf for all    using (public.is_admin());

-- ── galeri: anyone reads ─────────────────────────────────────
create policy "galeri_read"  on public.galeri for select using (true);
create policy "galeri_write" on public.galeri for all    using (public.is_admin());

-- ═══════════════════════════════════════════════════════════
-- Storage – bucket "media"
-- Run these statements in Supabase Dashboard → Storage → Policies
-- OR via the Storage API. Bucket must be created first via UI.
-- ═══════════════════════════════════════════════════════════

-- Create the bucket (public read):
-- insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- values (
--   'media', 'media', true,
--   2097152,                                          -- 2 MB
--   array['image/jpeg','image/png','image/webp','image/gif']
-- )
-- on conflict (id) do nothing;

-- Public read policy for the media bucket:
-- create policy "media_public_read" on storage.objects
--   for select using (bucket_id = 'media');

-- Admin-only upload / update / delete:
-- create policy "media_admin_write" on storage.objects
--   for insert with check (bucket_id = 'media' and public.is_admin());
-- create policy "media_admin_update" on storage.objects
--   for update using (bucket_id = 'media' and public.is_admin());
-- create policy "media_admin_delete" on storage.objects
--   for delete using (bucket_id = 'media' and public.is_admin());
