alter table public.doctor_profiles
  add column if not exists rejection_reason text,
  add column if not exists verified_at timestamptz,
  add column if not exists verified_by uuid references public.profiles(id) on delete set null;

create table public.doctor_verification_reviews (
  id uuid primary key default gen_random_uuid(),
  doctor_profile_id uuid not null references public.doctor_profiles(id) on delete cascade,
  reviewed_by uuid references public.profiles(id) on delete set null,
  decision text not null check (decision in ('approved', 'rejected')),
  review_note text check (review_note is null or length(review_note) <= 1000),
  created_at timestamptz not null default now()
);

create index doctor_verification_reviews_doctor_idx
  on public.doctor_verification_reviews (doctor_profile_id, created_at desc);

create index doctor_verification_reviews_reviewed_by_idx
  on public.doctor_verification_reviews (reviewed_by, created_at desc);

alter table public.doctor_verification_reviews enable row level security;

grant select, insert on public.doctor_verification_reviews to authenticated;
revoke all on public.doctor_verification_reviews from anon;

create policy "Admins can select verification reviews"
on public.doctor_verification_reviews
for select
to authenticated
using (app_private.is_admin());

create policy "Admins can insert verification reviews"
on public.doctor_verification_reviews
for insert
to authenticated
with check (app_private.is_admin());

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

    if new.rejection_reason is distinct from old.rejection_reason then
      raise exception 'Doctors cannot change their own review fields';
    end if;

    if new.verified_at is distinct from old.verified_at then
      raise exception 'Doctors cannot change their own verification timestamp';
    end if;

    if new.verified_by is distinct from old.verified_by then
      raise exception 'Doctors cannot change their own verifier';
    end if;
  end if;

  if new.verification_status <> 'approved' and new.is_public = true then
    raise exception 'Only approved doctors can be public';
  end if;

  return new;
end;
$$;

create or replace function app_private.admin_approve_doctor(
  p_doctor_profile_id uuid,
  p_make_public boolean default true,
  p_review_note text default null
)
returns table (
  doctor_profile_id uuid,
  verification_status text,
  is_public boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  admin_profile_id uuid;
  doctor_record public.doctor_profiles%rowtype;
begin
  if not app_private.is_admin() then
    raise exception 'Only admins can approve doctor applications';
  end if;

  admin_profile_id := auth.uid();

  select *
    into doctor_record
  from public.doctor_profiles
  where id = p_doctor_profile_id;

  if doctor_record.id is null then
    raise exception 'Doctor application not found';
  end if;

  update public.doctor_profiles
  set verification_status = 'approved',
      is_public = coalesce(p_make_public, true),
      verified_at = now(),
      verified_by = admin_profile_id,
      rejection_reason = null
  where id = p_doctor_profile_id
  returning id, doctor_profiles.verification_status, doctor_profiles.is_public
  into doctor_profile_id, verification_status, is_public;

  insert into public.doctor_verification_reviews (
    doctor_profile_id,
    reviewed_by,
    decision,
    review_note
  )
  values (
    p_doctor_profile_id,
    admin_profile_id,
    'approved',
    nullif(left(btrim(coalesce(p_review_note, '')), 1000), '')
  );

  return next;
end;
$$;

create or replace function app_private.admin_reject_doctor(
  p_doctor_profile_id uuid,
  p_review_note text default null
)
returns table (
  doctor_profile_id uuid,
  verification_status text,
  is_public boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  admin_profile_id uuid;
  doctor_record public.doctor_profiles%rowtype;
begin
  if not app_private.is_admin() then
    raise exception 'Only admins can reject doctor applications';
  end if;

  admin_profile_id := auth.uid();

  select *
    into doctor_record
  from public.doctor_profiles
  where id = p_doctor_profile_id;

  if doctor_record.id is null then
    raise exception 'Doctor application not found';
  end if;

  update public.doctor_profiles
  set verification_status = 'rejected',
      is_public = false,
      verified_at = null,
      verified_by = admin_profile_id,
      rejection_reason = null
  where id = p_doctor_profile_id
  returning id, doctor_profiles.verification_status, doctor_profiles.is_public
  into doctor_profile_id, verification_status, is_public;

  insert into public.doctor_verification_reviews (
    doctor_profile_id,
    reviewed_by,
    decision,
    review_note
  )
  values (
    p_doctor_profile_id,
    admin_profile_id,
    'rejected',
    nullif(left(btrim(coalesce(p_review_note, '')), 1000), '')
  );

  return next;
end;
$$;

create or replace function app_private.admin_set_doctor_public_status(
  p_doctor_profile_id uuid,
  p_is_public boolean
)
returns table (
  doctor_profile_id uuid,
  verification_status text,
  is_public boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  doctor_record public.doctor_profiles%rowtype;
begin
  if not app_private.is_admin() then
    raise exception 'Only admins can update public status';
  end if;

  select *
    into doctor_record
  from public.doctor_profiles
  where id = p_doctor_profile_id;

  if doctor_record.id is null then
    raise exception 'Doctor application not found';
  end if;

  if p_is_public = true and doctor_record.verification_status <> 'approved' then
    raise exception 'Only approved doctors can be made public';
  end if;

  update public.doctor_profiles
  set is_public = coalesce(p_is_public, false)
  where id = p_doctor_profile_id
  returning id, doctor_profiles.verification_status, doctor_profiles.is_public
  into doctor_profile_id, verification_status, is_public;

  return next;
end;
$$;

create or replace function app_private.admin_set_profile_active_status(
  p_profile_id uuid,
  p_is_active boolean
)
returns table (
  profile_id uuid,
  is_active boolean
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not app_private.is_admin() then
    raise exception 'Only admins can update active status';
  end if;

  if p_profile_id = auth.uid() and p_is_active is false then
    raise exception 'Admins cannot deactivate their own account';
  end if;

  update public.profiles
  set is_active = coalesce(p_is_active, true)
  where id = p_profile_id
  returning id, profiles.is_active
  into profile_id, is_active;

  if profile_id is null then
    raise exception 'Profile not found';
  end if;

  return next;
end;
$$;

create or replace function public.admin_approve_doctor(
  p_doctor_profile_id uuid,
  p_make_public boolean default true,
  p_review_note text default null
)
returns table (
  doctor_profile_id uuid,
  verification_status text,
  is_public boolean
)
language sql
security invoker
set search_path = ''
as $$
  select *
  from app_private.admin_approve_doctor(
    p_doctor_profile_id,
    p_make_public,
    p_review_note
  );
$$;

create or replace function public.admin_reject_doctor(
  p_doctor_profile_id uuid,
  p_review_note text default null
)
returns table (
  doctor_profile_id uuid,
  verification_status text,
  is_public boolean
)
language sql
security invoker
set search_path = ''
as $$
  select *
  from app_private.admin_reject_doctor(p_doctor_profile_id, p_review_note);
$$;

create or replace function public.admin_set_doctor_public_status(
  p_doctor_profile_id uuid,
  p_is_public boolean
)
returns table (
  doctor_profile_id uuid,
  verification_status text,
  is_public boolean
)
language sql
security invoker
set search_path = ''
as $$
  select *
  from app_private.admin_set_doctor_public_status(
    p_doctor_profile_id,
    p_is_public
  );
$$;

create or replace function public.admin_set_profile_active_status(
  p_profile_id uuid,
  p_is_active boolean
)
returns table (
  profile_id uuid,
  is_active boolean
)
language sql
security invoker
set search_path = ''
as $$
  select *
  from app_private.admin_set_profile_active_status(p_profile_id, p_is_active);
$$;

revoke all on function app_private.admin_approve_doctor(uuid, boolean, text) from public;
revoke all on function app_private.admin_reject_doctor(uuid, text) from public;
revoke all on function app_private.admin_set_doctor_public_status(uuid, boolean) from public;
revoke all on function app_private.admin_set_profile_active_status(uuid, boolean) from public;

revoke all on function public.admin_approve_doctor(uuid, boolean, text) from public;
revoke all on function public.admin_reject_doctor(uuid, text) from public;
revoke all on function public.admin_set_doctor_public_status(uuid, boolean) from public;
revoke all on function public.admin_set_profile_active_status(uuid, boolean) from public;

grant execute on function app_private.admin_approve_doctor(uuid, boolean, text) to authenticated;
grant execute on function app_private.admin_reject_doctor(uuid, text) to authenticated;
grant execute on function app_private.admin_set_doctor_public_status(uuid, boolean) to authenticated;
grant execute on function app_private.admin_set_profile_active_status(uuid, boolean) to authenticated;

grant execute on function public.admin_approve_doctor(uuid, boolean, text) to authenticated;
grant execute on function public.admin_reject_doctor(uuid, text) to authenticated;
grant execute on function public.admin_set_doctor_public_status(uuid, boolean) to authenticated;
grant execute on function public.admin_set_profile_active_status(uuid, boolean) to authenticated;
