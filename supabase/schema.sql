-- Run this in Supabase > SQL Editor

-- Profiles table (extends auth.users)
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  role        text not null default 'customer' check (role in ('admin', 'customer')),
  created_at  timestamptz default now()
);

-- Auto-create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Leads table (for landing page form submissions)
create table public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text,
  whatsapp    text,
  business    text,
  region      text,
  message     text,
  created_at  timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.leads enable row level security;

-- Profiles: users can read/update their own row; admins can read all
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Leads: only admins can read; anyone (anon) can insert via the contact form
create policy "Admins can view all leads"
  on public.leads for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Public can insert leads"
  on public.leads for insert
  with check (true);
