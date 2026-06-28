-- Run this in Supabase > SQL Editor

-- ─────────────────────────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────────────────────────

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  email       text,
  whatsapp    text,
  pixel_id    text,
  role        text not null default 'customer' check (role in ('admin', 'customer')),
  created_at  timestamptz default now()
);

-- Auto-create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, email, whatsapp, pixel_id)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'whatsapp',
    new.raw_user_meta_data->>'pixel_id'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Security-definer function to check admin role without recursive RLS
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());


-- ─────────────────────────────────────────────────────────────
-- RESEARCH PLATFORM
-- ─────────────────────────────────────────────────────────────

-- Reusable field definitions shared across form templates
create table public.form_fields (
  id           uuid primary key default gen_random_uuid(),
  key          text not null unique,
  label        text not null,
  field_type   text not null check (field_type in (
                 'text', 'textarea', 'number', 'currency',
                 'select', 'multiselect', 'location', 'range'
               )),
  options      jsonb,        -- [{label, value}] for select/multiselect
  placeholder  text,
  hint         text,         -- helper text shown below the field
  required     boolean not null default true,
  created_at   timestamptz default now()
);

-- One entry per research module / task
create table public.form_templates (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text not null unique,
  title                text not null,
  description          text,
  llm_prompt_template  text,   -- system prompt with {{field_key}} placeholders
  sort_order           int not null default 0,
  created_at           timestamptz default now()
);

-- Many-to-many: which fields appear in which templates, and in what order
create table public.form_template_fields (
  form_template_id  uuid not null references public.form_templates(id) on delete cascade,
  form_field_id     uuid not null references public.form_fields(id) on delete cascade,
  sort_order        int not null default 0,
  section           text,   -- optional visual grouping label within the form
  primary key (form_template_id, form_field_id)
);

-- One row per user per form attempt (users can redo a module)
create table public.form_responses (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  form_template_id  uuid not null references public.form_templates(id) on delete cascade,
  status            text not null default 'draft'
                      check (status in ('draft', 'submitted', 'processing', 'complete')),
  content           text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Individual field values within a form response
create table public.field_responses (
  id                uuid primary key default gen_random_uuid(),
  form_response_id  uuid not null references public.form_responses(id) on delete cascade,
  form_field_id     uuid not null references public.form_fields(id) on delete cascade,
  value             text,
  created_at        timestamptz default now(),
  unique (form_response_id, form_field_id)
);

-- Auto-update updated_at on form_responses
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger form_responses_updated_at
  before update on public.form_responses
  for each row execute procedure public.set_updated_at();

-- ── RLS for research tables ───────────────────────────────────

alter table public.form_fields          enable row level security;
alter table public.form_templates       enable row level security;
alter table public.form_template_fields enable row level security;
alter table public.form_responses       enable row level security;
alter table public.field_responses      enable row level security;

-- form_fields, form_templates, form_template_fields: readable by all authenticated users
create policy "Authenticated users can read form fields"
  on public.form_fields for select using (auth.role() = 'authenticated');

create policy "Authenticated users can read form templates"
  on public.form_templates for select using (auth.role() = 'authenticated');

create policy "Authenticated users can read form template fields"
  on public.form_template_fields for select using (auth.role() = 'authenticated');

-- Admins can manage form definitions
create policy "Admins can manage form fields"
  on public.form_fields for all using (public.is_admin());

create policy "Admins can manage form templates"
  on public.form_templates for all using (public.is_admin());

create policy "Admins can manage form template fields"
  on public.form_template_fields for all using (public.is_admin());

-- form_responses: users own their own responses; admins can read all
create policy "Users can manage own form responses"
  on public.form_responses for all using (auth.uid() = user_id);

create policy "Admins can view all form responses"
  on public.form_responses for select using (public.is_admin());

-- field_responses: scoped through form_response ownership
create policy "Users can manage own field responses"
  on public.field_responses for all
  using (
    exists (
      select 1 from public.form_responses r
      where r.id = form_response_id and r.user_id = auth.uid()
    )
  );

create policy "Admins can view all field responses"
  on public.field_responses for select using (public.is_admin());


-- ─────────────────────────────────────────────────────────────
-- LEADS (landing page contact form)
-- ─────────────────────────────────────────────────────────────

create table public.leads (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  email       text not null,
  whatsapp    text not null,
  negocio     text,
  expansao    text,
  created_at  timestamptz default now()
);

alter table public.leads enable row level security;

-- Anyone (including unauthenticated visitors) can submit a lead
create policy "Anyone can insert leads"
  on public.leads for insert
  with check (true);

-- Only admins can read leads
create policy "Admins can view all leads"
  on public.leads for select using (public.is_admin());
