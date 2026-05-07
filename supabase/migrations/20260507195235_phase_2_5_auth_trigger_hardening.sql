create or replace function app_private.safe_boolean(
  value text,
  fallback boolean
)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  normalized text;
begin
  normalized := lower(btrim(coalesce(value, '')));

  if normalized in ('true', 't', '1', 'yes', 'y', 'on') then
    return true;
  end if;

  if normalized in ('false', 'f', '0', 'no', 'n', 'off') then
    return false;
  end if;

  return fallback;
end;
$$;

create or replace function app_private.safe_integer(
  value text,
  fallback integer,
  minimum integer default null,
  maximum integer default null
)
returns integer
language plpgsql
immutable
set search_path = ''
as $$
declare
  parsed integer;
begin
  begin
    parsed := nullif(btrim(coalesce(value, '')), '')::integer;
  exception
    when invalid_text_representation or numeric_value_out_of_range then
      return fallback;
  end;

  if parsed is null then
    return fallback;
  end if;

  if minimum is not null and parsed < minimum then
    return fallback;
  end if;

  if maximum is not null and parsed > maximum then
    return fallback;
  end if;

  return parsed;
end;
$$;

create or replace function app_private.safe_numeric(
  value text,
  fallback numeric,
  minimum numeric default null,
  maximum numeric default null
)
returns numeric
language plpgsql
immutable
set search_path = ''
as $$
declare
  parsed numeric;
begin
  begin
    parsed := nullif(btrim(coalesce(value, '')), '')::numeric;
  exception
    when invalid_text_representation or numeric_value_out_of_range then
      return fallback;
  end;

  if parsed is null then
    return fallback;
  end if;

  if minimum is not null and parsed < minimum then
    return fallback;
  end if;

  if maximum is not null and parsed > maximum then
    return fallback;
  end if;

  return parsed;
end;
$$;

create or replace function app_private.safe_text_array(value jsonb)
returns text[]
language plpgsql
immutable
set search_path = ''
as $$
declare
  items text[];
begin
  if value is null or jsonb_typeof(value) <> 'array' then
    return '{}'::text[];
  end if;

  select coalesce(array_agg(item), '{}'::text[])
    into items
  from (
    select nullif(btrim(element), '') as item
    from jsonb_array_elements_text(value) as elements(element)
  ) normalized
  where item is not null;

  return items;
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
  consent_accepted boolean;
begin
  requested_role := coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), 'patient');

  if requested_role not in ('patient', 'doctor') then
    requested_role := 'patient';
  end if;

  insert into public.profiles (
    id,
    role,
    full_name,
    email,
    phone,
    onboarding_completed
  )
  values (
    new.id,
    requested_role,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''), 'New user'),
    new.email,
    nullif(btrim(new.raw_user_meta_data ->> 'phone'), ''),
    requested_role = 'doctor'
  )
  on conflict (id) do nothing;

  if requested_role = 'patient' then
    consent_accepted := app_private.safe_boolean(
      new.raw_user_meta_data ->> 'consent_accepted',
      false
    );

    insert into public.patient_profiles (
      user_id,
      consent_accepted,
      consent_accepted_at
    )
    values (
      new.id,
      consent_accepted,
      case when consent_accepted then now() else null end
    )
    on conflict (user_id) do nothing;
  elsif requested_role = 'doctor' then
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
      nullif(btrim(new.raw_user_meta_data ->> 'professional_title'), ''),
      nullif(btrim(new.raw_user_meta_data ->> 'bio'), ''),
      app_private.safe_text_array(new.raw_user_meta_data -> 'specialties'),
      app_private.safe_text_array(new.raw_user_meta_data -> 'languages'),
      app_private.safe_integer(
        new.raw_user_meta_data ->> 'years_of_experience',
        0,
        0,
        80
      ),
      nullif(btrim(new.raw_user_meta_data ->> 'license_number'), ''),
      nullif(btrim(new.raw_user_meta_data ->> 'license_country'), ''),
      app_private.safe_numeric(
        new.raw_user_meta_data ->> 'session_price',
        null,
        0,
        100000
      )::numeric(10,2),
      app_private.safe_boolean(new.raw_user_meta_data ->> 'offers_online', true),
      app_private.safe_boolean(new.raw_user_meta_data ->> 'offers_in_person', false),
      'pending',
      false
    )
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

create or replace view public.public_doctor_profiles
as
select
  id,
  professional_title,
  bio,
  specialties,
  languages,
  years_of_experience,
  session_price,
  session_duration_minutes,
  offers_online,
  offers_in_person,
  verification_status,
  is_public,
  created_at,
  updated_at
from public.doctor_profiles
where verification_status = 'approved'
  and is_public = true;

revoke all on public.public_doctor_profiles from public;
grant select on public.public_doctor_profiles to anon, authenticated;

drop policy if exists "Public can select approved public doctor profiles"
on public.doctor_profiles;

revoke select on public.doctor_profiles from anon;
