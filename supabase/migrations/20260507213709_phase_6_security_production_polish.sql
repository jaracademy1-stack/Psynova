create table public.admin_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action text not null check (
    action in (
      'doctor_approved',
      'doctor_rejected',
      'doctor_public_status_changed',
      'profile_active_status_changed'
    )
  ),
  entity_type text not null check (entity_type in ('doctor_profile', 'profile')),
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.admin_audit_events is
  'Admin-only audit trail for sensitive operational actions. Do not store secrets, clinical data, or patient-sensitive details in metadata.';

create index admin_audit_events_actor_idx
  on public.admin_audit_events (actor_profile_id, created_at desc);

create index admin_audit_events_entity_idx
  on public.admin_audit_events (entity_type, entity_id, created_at desc);

alter table public.admin_audit_events enable row level security;

revoke all on public.admin_audit_events from anon;
revoke all on public.admin_audit_events from authenticated;
grant select on public.admin_audit_events to authenticated;

create policy "Admins can select audit events"
on public.admin_audit_events
for select
to authenticated
using (app_private.is_admin());

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

  insert into public.admin_audit_events (
    actor_profile_id,
    action,
    entity_type,
    entity_id,
    metadata
  )
  values (
    admin_profile_id,
    'doctor_approved',
    'doctor_profile',
    p_doctor_profile_id,
    jsonb_build_object(
      'previous_verification_status', doctor_record.verification_status,
      'previous_is_public', doctor_record.is_public,
      'new_is_public', is_public
    )
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

  insert into public.admin_audit_events (
    actor_profile_id,
    action,
    entity_type,
    entity_id,
    metadata
  )
  values (
    admin_profile_id,
    'doctor_rejected',
    'doctor_profile',
    p_doctor_profile_id,
    jsonb_build_object(
      'previous_verification_status', doctor_record.verification_status,
      'previous_is_public', doctor_record.is_public
    )
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
  admin_profile_id uuid;
  doctor_record public.doctor_profiles%rowtype;
begin
  if not app_private.is_admin() then
    raise exception 'Only admins can update public status';
  end if;

  admin_profile_id := auth.uid();

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

  insert into public.admin_audit_events (
    actor_profile_id,
    action,
    entity_type,
    entity_id,
    metadata
  )
  values (
    admin_profile_id,
    'doctor_public_status_changed',
    'doctor_profile',
    p_doctor_profile_id,
    jsonb_build_object(
      'verification_status', doctor_record.verification_status,
      'previous_is_public', doctor_record.is_public,
      'new_is_public', is_public
    )
  );

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
declare
  admin_profile_id uuid;
  profile_record public.profiles%rowtype;
begin
  if not app_private.is_admin() then
    raise exception 'Only admins can update active status';
  end if;

  admin_profile_id := auth.uid();

  if p_profile_id = admin_profile_id and p_is_active is false then
    raise exception 'Admins cannot deactivate their own account';
  end if;

  select *
    into profile_record
  from public.profiles
  where id = p_profile_id;

  if profile_record.id is null then
    raise exception 'Profile not found';
  end if;

  update public.profiles
  set is_active = coalesce(p_is_active, true)
  where id = p_profile_id
  returning id, profiles.is_active
  into profile_id, is_active;

  insert into public.admin_audit_events (
    actor_profile_id,
    action,
    entity_type,
    entity_id,
    metadata
  )
  values (
    admin_profile_id,
    'profile_active_status_changed',
    'profile',
    p_profile_id,
    jsonb_build_object(
      'target_role', profile_record.role,
      'previous_is_active', profile_record.is_active,
      'new_is_active', is_active
    )
  );

  return next;
end;
$$;

revoke all on function app_private.admin_approve_doctor(uuid, boolean, text) from public;
revoke all on function app_private.admin_reject_doctor(uuid, text) from public;
revoke all on function app_private.admin_set_doctor_public_status(uuid, boolean) from public;
revoke all on function app_private.admin_set_profile_active_status(uuid, boolean) from public;

grant execute on function app_private.admin_approve_doctor(uuid, boolean, text) to authenticated;
grant execute on function app_private.admin_reject_doctor(uuid, text) to authenticated;
grant execute on function app_private.admin_set_doctor_public_status(uuid, boolean) to authenticated;
grant execute on function app_private.admin_set_profile_active_status(uuid, boolean) to authenticated;
