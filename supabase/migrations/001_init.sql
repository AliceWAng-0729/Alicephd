create extension if not exists pgcrypto;

create table if not exists programs (
  id text primary key,
  university text not null,
  title text not null,
  country text not null,
  field text,
  research_areas jsonb not null default '[]',
  deadline jsonb not null default '{}',
  funding jsonb not null default '{}',
  requirements jsonb not null default '[]',
  application_url text,
  official_url text,
  verification_status text not null default 'QUEUED',
  verified_at timestamptz
);

create table if not exists faculty (
  id uuid primary key default gen_random_uuid(),
  program_id text references programs(id) on delete cascade,
  name text not null,
  institution text,
  department text,
  official_profile_url text,
  openalex_id text,
  research_areas jsonb not null default '[]',
  identity_confidence numeric
);

create table if not exists user_profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  profile jsonb not null
);

create index if not exists programs_search_idx on programs using gin
(to_tsvector('english', coalesce(university,'') || ' ' || coalesce(title,'') || ' ' || coalesce(field,'')));

alter table programs enable row level security;
alter table faculty enable row level security;
create policy "public read verified programs" on programs for select using (true);
create policy "public read faculty" on faculty for select using (true);
