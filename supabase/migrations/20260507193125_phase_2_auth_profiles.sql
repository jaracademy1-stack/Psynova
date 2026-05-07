create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('patient', 'doctor', 'admin')),
  full_name text not null,
  email text,
  phone text,
  avatar_url text,
  onboarding_completed boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.patient_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  preferred_name text,
  date_of_birth date,
  gender text check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
  country text,
  city text,
  primary_concern text,
  therapy_goal text,
  preferred_session_type text check (preferred_session_type in ('online', 'in_person', 'either')),
  emergency_contact_name text,
  emergency_contact_phone text,
  consent_accepted boolean not null default false,
  consent_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.doctor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  professional_title text,
  bio text,
  specialties text[] not null default '{}',
  languages text[] not null default '{}',
  years_of_experience integer not null default 0 check (years_of_experience >= 0),
  license_number text,
  license_country text,
  education text,
  session_price numeric(10,2) check (session_price is null or session_price >= 0),
  session_duration_minutes integer not null default 50 check (session_duration_minutes > 0),
  offers_online boolean not null default true,
  offers_in_person boolean not null default false,
  clinic_address text,
  verification_status text not null default 'pending' check (verification_status in ('pending', 'approved', 'rejected')),
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index doctor_profiles_public_status_idx
  on public.doctor_profiles (verification_status, is_public);

create schema if not exists app_private;
revoke all on schema app_private from public;

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function app_private.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
      and profiles.is_active = true
  );
$$;

create or replace function app_private.prevent_profile_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not app_private.is_admin() then
    if new.role is distinct from old.role then
      raise exception 'Users cannot change their own role';
    end if;

    if new.is_active is distinct from old.is_active then
      raise exception 'Users cannot change their own active status';
    end if;
  end if;

  return new;
end;
$$;

create or replace function app_private.prevent_doctor_self_verification()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not app_private.is_admin() then
    if new.verification_status is distinct from old.verification_status then
      raise exception 'Doctors cannot change their own verification status';
    end if;

    if new.is_public is distinct from old.is_public then
      raise exception 'Doctors cannot change their own public status';
    end if;
  end if;

  return new;
end;
$$;

create or replace function app_private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role text;
  doctor_specialties text[];
  doctor_languages text[];
begin
  requested_role := coalesce(new.raw_user_meta_data ->> 'role', 'patient');

  if requested_role not in ('patient', 'doctor') then
    requested_role := 'patient';
  end if;

  insert into public.profiles (id, role, full_name, email, phone, onboarding_completed)
  values (
    new.id,
    requested_role,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), 'New user'),
    new.email,
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    requested_role = 'doctor'
  );

  if requested_role = 'patient' then
    insert into public.patient_profiles (
      user_id,
      consent_accepted,
      consent_accepted_at
    )
    values (
      new.id,
      coalesce((new.raw_user_meta_data ->> 'consent_accepted')::boolean, false),
      case
        when coalesce((new.raw_user_meta_data ->> 'consent_accepted')::boolean, false)
          then now()
        else null
      end
    );
  elsif requested_role = 'doctor' then
    select coalesce(array_agg(value), '{}')
      into doctor_specialties
    from jsonb_array_elements_text(coalesce(new.raw_user_meta_data -> 'specialties', '[]'::jsonb)) as value;

    select coalesce(array_agg(value), '{}')
      into doctor_languages
    from jsonb_array_elements_text(coalesce(new.raw_user_meta_data -> 'languages', '[]'::jsonb)) as value;

    insert into public.doctor_profiles (
      user_id,
      professional_title,
      bio,
      specialties,
      languages,
      years_of_experience,
      license_number,
      license_country,
      session_price,
      offers_online,
      offers_in_person,
      verification_status,
      is_public
    )
    values (
      new.id,
      nullif(new.raw_user_meta_data ->> 'professional_title', ''),
      nullif(new.raw_user_meta_data ->> 'bio', ''),
      doctor_specialties,
      doctor_languages,
      coalesce(nullif(new.raw_user_meta_data ->> 'years_of_experience', '')::integer, 0),
      nullif(new.raw_user_meta_data ->> 'license_number', ''),
      nullif(new.raw_user_meta_data ->> 'license_country', ''),
      nullif(new.raw_user_meta_data ->> 'session_price', '')::numeric(10,2),
      coalesce((new.raw_user_meta_data ->> 'offers_online')::boolean, true),
      coalesce((new.raw_user_meta_data ->> 'offers_in_person')::boolean, false),
      'pending',
      false
    );
  end if;

  return new;
end;
$$;

create trigger profiles_handle_updated_at
before update on public.profiles
for each row execute function public.handle_updated_at();

create trigger profiles_prevent_privilege_escalation
before update on public.profiles
for each row execute function app_private.prevent_profile_privilege_escalation();

create trigger patient_profiles_handle_updated_at
before update on public.patient_profiles
for each row execute function public.handle_updated_at();

create trigger doctor_profiles_handle_updated_at
before update on public.doctor_profiles
for each row execute function public.handle_updated_at();

create trigger doctor_profiles_prevent_self_verification
before update on public.doctor_profiles
for each row execute function app_private.prevent_doctor_self_verification();

create trigger on_auth_user_created
after insert on auth.users
for each row execute function app_private.handle_new_auth_user();

alter table public.profiles enable row level security;
alter table public.patient_profiles enable row level security;
alter table public.doctor_profiles enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.patient_profiles to authenticated;
grant select on public.doctor_profiles to anon;
grant select, insert, update on public.doctor_profiles to authenticated;

create policy "Users can select own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "Admins can select all profiles"
on public.profiles
for select
to authenticated
using (app_private.is_admin());

create policy "Users can insert own patient or doctor profile"
on public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
  and role in ('patient', 'doctor')
);

create policy "Users can update own basic profile fields"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Admins can manage all profiles"
on public.profiles
for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "Patients can select own patient profile"
on public.patient_profiles
for select
to authenticated
using (user_id = auth.uid());

create policy "Patients can insert own patient profile"
on public.patient_profiles
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'patient'
      and profiles.is_active = true
  )
);

create policy "Patients can update own patient profile"
on public.patient_profiles
for update
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'patient'
      and profiles.is_active = true
  )
);

create policy "Admins can manage patient profiles"
on public.patient_profiles
for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "Doctors can select own doctor profile"
on public.doctor_profiles
for select
to authenticated
using (user_id = auth.uid());

create policy "Public can select approved public doctor profiles"
on public.doctor_profiles
for select
to anon, authenticated
using (
  verification_status = 'approved'
  and is_public = true
);

create policy "Doctors can insert own doctor profile"
on public.doctor_profiles
for insert
to authenticated
with check (
  user_id = auth.uid()
  and verification_status = 'pending'
  and is_public = false
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'doctor'
      and profiles.is_active = true
  )
);

create policy "Doctors can update own doctor profile without self-approval"
on public.doctor_profiles
for update
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'doctor'
      and profiles.is_active = true
  )
);

create policy "Admins can manage doctor profiles"
on public.doctor_profiles
for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());
