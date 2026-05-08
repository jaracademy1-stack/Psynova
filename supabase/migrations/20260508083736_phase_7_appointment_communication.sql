alter table public.appointments
add column meeting_url text,
add column meeting_url_updated_at timestamptz,
add column meeting_url_updated_by uuid references public.profiles(id) on delete set null,
add constraint appointments_meeting_url_safe
  check (
    meeting_url is null
    or (
      length(meeting_url) <= 500
      and meeting_url ~* '^https?://'
    )
  );

comment on column public.appointments.meeting_url is
  'Online session link visible only through patient/assigned-doctor/admin appointment access paths. Do not store meeting passwords separately.';

create index appointments_meeting_url_updated_by_idx
  on public.appointments (meeting_url_updated_by, meeting_url_updated_at desc)
  where meeting_url_updated_by is not null;

drop function if exists public.get_patient_appointments();
drop function if exists public.get_doctor_appointments();
drop function if exists app_private.get_patient_appointments();
drop function if exists app_private.get_doctor_appointments();

create or replace function app_private.get_patient_appointments()
returns table (
  id uuid,
  doctor_profile_id uuid,
  doctor_display_name text,
  doctor_professional_title text,
  starts_at timestamptz,
  ends_at timestamptz,
  status text,
  session_type text,
  patient_message text,
  doctor_response_note text,
  cancellation_reason text,
  meeting_url text,
  meeting_url_updated_at timestamptz
)
language sql
security definer
stable
set search_path = ''
as $$
  select
    appointments.id,
    appointments.doctor_profile_id,
    doctor_profiles_owner.full_name as doctor_display_name,
    doctor_profiles.professional_title as doctor_professional_title,
    appointments.starts_at,
    appointments.ends_at,
    appointments.status,
    appointments.session_type,
    appointments.patient_message,
    appointments.doctor_response_note,
    appointments.cancellation_reason,
    appointments.meeting_url,
    appointments.meeting_url_updated_at
  from public.appointments
  join public.patient_profiles
    on patient_profiles.id = appointments.patient_profile_id
  join public.profiles patient_profile_owner
    on patient_profile_owner.id = patient_profiles.user_id
  join public.doctor_profiles
    on doctor_profiles.id = appointments.doctor_profile_id
  join public.profiles doctor_profiles_owner
    on doctor_profiles_owner.id = doctor_profiles.user_id
  where patient_profiles.user_id = auth.uid()
    and patient_profile_owner.role = 'patient'
    and patient_profile_owner.is_active = true
  order by appointments.starts_at desc;
$$;

create or replace function app_private.get_doctor_appointments()
returns table (
  id uuid,
  patient_display_name text,
  patient_phone text,
  starts_at timestamptz,
  ends_at timestamptz,
  status text,
  session_type text,
  patient_message text,
  doctor_response_note text,
  cancellation_reason text,
  meeting_url text,
  meeting_url_updated_at timestamptz
)
language sql
security definer
stable
set search_path = ''
as $$
  select
    appointments.id,
    coalesce(patient_profiles.preferred_name, patient_profile_owner.full_name) as patient_display_name,
    patient_profile_owner.phone as patient_phone,
    appointments.starts_at,
    appointments.ends_at,
    appointments.status,
    appointments.session_type,
    appointments.patient_message,
    appointments.doctor_response_note,
    appointments.cancellation_reason,
    appointments.meeting_url,
    appointments.meeting_url_updated_at
  from public.appointments
  join public.doctor_profiles
    on doctor_profiles.id = appointments.doctor_profile_id
  join public.profiles doctor_profile_owner
    on doctor_profile_owner.id = doctor_profiles.user_id
  join public.patient_profiles
    on patient_profiles.id = appointments.patient_profile_id
  join public.profiles patient_profile_owner
    on patient_profile_owner.id = patient_profiles.user_id
  where doctor_profiles.user_id = auth.uid()
    and doctor_profile_owner.role = 'doctor'
    and doctor_profile_owner.is_active = true
  order by appointments.starts_at desc;
$$;

create or replace function app_private.set_doctor_appointment_meeting_url(
  p_appointment_id uuid,
  p_meeting_url text default null
)
returns table (
  id uuid,
  meeting_url text,
  meeting_url_updated_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  clean_meeting_url text;
  appointment_record public.appointments%rowtype;
  doctor_profile_owner public.profiles%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Please log in to manage appointments';
  end if;

  clean_meeting_url := nullif(btrim(coalesce(p_meeting_url, '')), '');

  if clean_meeting_url is not null then
    if length(clean_meeting_url) > 500 or clean_meeting_url !~* '^https?://' then
      raise exception 'Enter a valid meeting link starting with http:// or https://.';
    end if;
  end if;

  select appointments.*
    into appointment_record
  from public.appointments
  join public.doctor_profiles
    on doctor_profiles.id = appointments.doctor_profile_id
  join public.profiles
    on profiles.id = doctor_profiles.user_id
  where appointments.id = p_appointment_id
    and doctor_profiles.user_id = auth.uid()
    and profiles.role = 'doctor'
    and profiles.is_active = true;

  if appointment_record.id is null then
    raise exception 'Appointment not found';
  end if;

  select profiles.*
    into doctor_profile_owner
  from public.profiles
  join public.doctor_profiles
    on doctor_profiles.user_id = profiles.id
  where doctor_profiles.id = appointment_record.doctor_profile_id
    and profiles.id = auth.uid()
    and profiles.role = 'doctor'
    and profiles.is_active = true;

  if doctor_profile_owner.id is null then
    raise exception 'Only doctor accounts can update meeting links';
  end if;

  if appointment_record.status not in ('requested', 'confirmed') then
    raise exception 'Meeting links can only be changed for active appointments';
  end if;

  if appointment_record.session_type <> 'online' then
    raise exception 'Meeting links are only available for online appointments';
  end if;

  update public.appointments
  set meeting_url = clean_meeting_url,
      meeting_url_updated_at = now(),
      meeting_url_updated_by = auth.uid()
  where appointments.id = p_appointment_id
  returning appointments.id,
            appointments.meeting_url,
            appointments.meeting_url_updated_at
  into id, meeting_url, meeting_url_updated_at;

  return next;
end;
$$;

create or replace function public.get_patient_appointments()
returns table (
  id uuid,
  doctor_profile_id uuid,
  doctor_display_name text,
  doctor_professional_title text,
  starts_at timestamptz,
  ends_at timestamptz,
  status text,
  session_type text,
  patient_message text,
  doctor_response_note text,
  cancellation_reason text,
  meeting_url text,
  meeting_url_updated_at timestamptz
)
language sql
security invoker
stable
set search_path = ''
as $$
  select *
  from app_private.get_patient_appointments();
$$;

create or replace function public.get_doctor_appointments()
returns table (
  id uuid,
  patient_display_name text,
  patient_phone text,
  starts_at timestamptz,
  ends_at timestamptz,
  status text,
  session_type text,
  patient_message text,
  doctor_response_note text,
  cancellation_reason text,
  meeting_url text,
  meeting_url_updated_at timestamptz
)
language sql
security invoker
stable
set search_path = ''
as $$
  select *
  from app_private.get_doctor_appointments();
$$;

create or replace function public.set_doctor_appointment_meeting_url(
  p_appointment_id uuid,
  p_meeting_url text default null
)
returns table (
  id uuid,
  meeting_url text,
  meeting_url_updated_at timestamptz
)
language sql
security invoker
set search_path = ''
as $$
  select *
  from app_private.set_doctor_appointment_meeting_url(
    p_appointment_id,
    p_meeting_url
  );
$$;

revoke all on function app_private.get_patient_appointments() from public;
revoke all on function app_private.get_doctor_appointments() from public;
revoke all on function app_private.set_doctor_appointment_meeting_url(uuid, text) from public;

revoke all on function public.get_patient_appointments() from public;
revoke all on function public.get_doctor_appointments() from public;
revoke all on function public.set_doctor_appointment_meeting_url(uuid, text) from public;

grant execute on function app_private.get_patient_appointments() to authenticated;
grant execute on function app_private.get_doctor_appointments() to authenticated;
grant execute on function app_private.set_doctor_appointment_meeting_url(uuid, text) to authenticated;

grant execute on function public.get_patient_appointments() to authenticated;
grant execute on function public.get_doctor_appointments() to authenticated;
grant execute on function public.set_doctor_appointment_meeting_url(uuid, text) to authenticated;
