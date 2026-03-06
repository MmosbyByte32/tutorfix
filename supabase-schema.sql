-- ═══════════════════════════════════════════════════════════════════
--  ExamIQ — Complete Supabase Setup
--  Run this entire file in ONE go:
--  Supabase Dashboard → SQL Editor → New query → paste → Run
--
--  Safe to re-run. Handles "already exists" errors gracefully.
-- ═══════════════════════════════════════════════════════════════════


-- ── STEP 1: PROFILES TABLE ──────────────────────────────────────────
-- Must be created BEFORE you insert a superuser row into it.
-- Links to Supabase's built-in auth.users table.

create table if not exists profiles (
  id    uuid primary key references auth.users(id) on delete cascade,
  role  text not null default 'student'
          check (role in ('superuser', 'student'))
);

-- ── STEP 2: LIBRARY FOLDERS TABLE ──────────────────────────────────

create table if not exists lib_folders (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  grade       text not null default 'All Students',
  curriculum  text not null default 'CAPS',
  subject     text not null default 'General',
  status      text not null default 'active'
                check (status in ('active', 'hidden', 'archived')),
  created_at  timestamptz not null default now()
);

-- ── STEP 3: LIBRARY FILES TABLE ────────────────────────────────────

create table if not exists lib_files (
  id            uuid primary key default gen_random_uuid(),
  folder_id     uuid not null references lib_folders(id) on delete cascade,
  name          text not null,
  type          text not null default 'file'
                  check (type in ('pdf', 'image', 'file')),
  size          text not null default '0 KB',
  storage_path  text not null unique,
  created_at    timestamptz not null default now()
);

-- ── STEP 4: INDEXES ─────────────────────────────────────────────────

create index if not exists lib_files_folder_idx   on lib_files(folder_id);
create index if not exists lib_folders_status_idx on lib_folders(status);

-- ── STEP 5: ROW LEVEL SECURITY ──────────────────────────────────────
-- All tables locked down. Your server uses service_role which bypasses
-- RLS entirely. Direct browser access is denied.

alter table profiles    enable row level security;
alter table lib_folders enable row level security;
alter table lib_files   enable row level security;

drop policy if exists "deny_direct_profiles"       on profiles;
drop policy if exists "deny_direct_access_folders" on lib_folders;
drop policy if exists "deny_direct_access_files"   on lib_files;

create policy "deny_direct_profiles"
  on profiles as restrictive for all to anon, authenticated using (false);

create policy "deny_direct_access_folders"
  on lib_folders as restrictive for all to anon, authenticated using (false);

create policy "deny_direct_access_files"
  on lib_files as restrictive for all to anon, authenticated using (false);

-- ── STEP 6: STORAGE BUCKET ──────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('library', 'library', true)
on conflict (id) do update set public = true;

drop policy if exists "library_public_read"    on storage.objects;
drop policy if exists "library_service_write"  on storage.objects;
drop policy if exists "library_service_delete" on storage.objects;
drop policy if exists "library_service_update" on storage.objects;

create policy "library_public_read"
  on storage.objects for select to public
  using (bucket_id = 'library');

create policy "library_service_write"
  on storage.objects for insert to service_role
  with check (bucket_id = 'library');

create policy "library_service_delete"
  on storage.objects for delete to service_role
  using (bucket_id = 'library');

create policy "library_service_update"
  on storage.objects for update to service_role
  using (bucket_id = 'library');


-- ════════════════════════════════════════════════════════════════════
--  AFTER this runs successfully, do these two things:
--
--  1. Supabase → Authentication → Users → Add user
--     Enter your email + password → click Create user
--
--  2. Run this in a NEW query (replace with your email):
--
--     insert into profiles (id, role)
--     select id, 'superuser'
--     from auth.users
--     where email = 'you@school.co.za'
--     on conflict (id) do update set role = 'superuser';
--
-- ════════════════════════════════════════════════════════════════════
