-- Find: College roommate matching — run in Supabase SQL Editor (Dashboard → SQL)

-- Profiles linked to auth.users (one row per user)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  college_name text,
  major text,
  gender text,
  sleep_schedule text,
  partying_level smallint check (partying_level is null or partying_level between 1 and 5),
  sports_interest text,
  study_oriented_level smallint check (study_oriented_level is null or study_oriented_level between 1 and 5),
  social_exposure_level smallint check (social_exposure_level is null or social_exposure_level between 1 and 5),
  hobbies text[] default '{}' not null,
  bio text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Migrate older schema (safe if columns already exist / were renamed)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'college'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'college_name'
  ) then
    alter table public.profiles rename column college to college_name;
  end if;
end $$;

alter table public.profiles
  add column if not exists college_name text,
  add column if not exists major text,
  add column if not exists gender text,
  add column if not exists sleep_schedule text,
  add column if not exists partying_level smallint,
  add column if not exists sports_interest text,
  add column if not exists study_oriented_level smallint,
  add column if not exists social_exposure_level smallint,
  add column if not exists hobbies text[] default '{}',
  add column if not exists bio text,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by authenticated users" on public.profiles;
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can delete their own profile" on public.profiles;
create policy "Users can delete their own profile"
  on public.profiles for delete
  to authenticated
  using (auth.uid() = id);

-- Keep updated_at in sync
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create empty profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
