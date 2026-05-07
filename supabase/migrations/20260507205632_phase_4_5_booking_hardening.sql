-- Phase 4.5 hardening:
-- Keep the public RPC contract used by the app, but move privileged booking
-- logic into app_private so SECURITY DEFINER functions do not live in the
-- exposed public schema.

create schema if not exists app_private;

revoke all on schema app_private from public;
grant usage on schema app_private to anon, authenticated;

create or replace function app_private.get_available_slots(
  p_doctor_profile_id uuid,
  p_from_date date default current_date,
  p_to_date date default (current_date + 14)
)
returns table (
  starts_at timestamptz,
  ends_at timestamptz,
  session_types text[],
  label text
)
language sql
security definer
stable
set search_path = ''
as $$
  with approved_doctor as (
    select
      doctor_profiles.id,
      doctor_profiles.offers_online,
      doctor_profiles.offers_in_person
    from public.doctor_profiles
    join public.profiles on profiles.id = doctor_profiles.user_id
    where doctor_profiles.id = p_doctor_profile_id
      and doctor_profiles.verification_status = 'approved'
      and doctor_profiles.is_public = true
      and profiles.role = 'doctor'
      and profiles.is_active = true
  ),
  date_bounds as (
    select
      greatest(coalesce(p_from_date, current_date), current_date) as from_date,
      least(
        coalesce(p_to_date, current_date + 14),
        greatest(coalesce(p_from_date, current_date), current_date) + 30
      ) as to_date
  ),
  bounded_dates as (
    select generate_series(date_bounds.from_date, date_bounds.to_date, interval '1 day')::date as slot_date
    from date_bounds
    where date_bounds.to_date >= date_bounds.from_date
  ),
  candidate_slots as (
    select
      (slot_start_local at time zone rules.timezone) as starts_at,
      ((slot_start_local + make_interval(mins => rules.slot_duration_minutes)) at time zone rules.timezone) as ends_at,
      array_remove(array[
        case when approved_doctor.offers_online then 'online' end,
        case when approved_doctor.offers_in_person then 'in_person' end
      ], null)::text[] as session_types,
      rules.timezone
    from approved_doctor
    join public.doctor_availability_rules rules
      on rules.doctor_profile_id = approved_doctor.id
     and rules.is_active = true
    join bounded_dates
      on extract(dow from bounded_dates.slot_date)::integer = rules.day_of_week
    cross join lateral generate_series(
      bounded_dates.slot_date + rules.start_time,
      bounded_dates.slot_date + rules.end_time - make_interval(mins => rules.slot_duration_minutes),
      make_interval(mins => rules.slot_duration_minutes + rules.buffer_minutes)
    ) as generated(slot_start_local)
  )
  select
    candidate_slots.starts_at,
    candidate_slots.ends_at,
    candidate_slots.session_types,
    to_char(candidate_slots.starts_at at time zone candidate_slots.timezone, 'Dy, Mon DD HH24:MI') as label
  from candidate_slots
  where candidate_slots.starts_at > now()
    and cardinality(candidate_slots.session_types) > 0
    and not exists (
      select 1
      from public.doctor_time_off
      where doctor_time_off.doctor_profile_id = p_doctor_profile_id
        and tstzrange(doctor_time_off.starts_at, doctor_time_off.ends_at, '[)')
          && tstzrange(candidate_slots.starts_at, candidate_slots.ends_at, '[)')
    )
    and not exists (
      select 1
      from public.appointments
      where appointments.doctor_profile_id = p_doctor_profile_id
        and appointments.status in ('requested', 'confirmed')
        and appointments.appointment_range
          && tstzrange(candidate_slots.starts_at, candidate_slots.ends_at, '[)')
    )
  order by candidate_slots.starts_at
  limit 100;
$$;

create or replace function app_private.book_appointment(
  p_doctor_profile_id uuid,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_session_type text,
  p_patient_message text default null
)
returns table (
  id uuid,
  starts_at timestamptz,
  ends_at timestamptz,
  status text,
  session_type text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid;
  patient_profile_record public.patient_profiles%rowtype;
  doctor_record record;
  created_appointment public.appointments%rowtype;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Please log in to book a session';
  end if;

  select patient_profiles.*
    into patient_profile_record
  from public.patient_profiles
  join public.profiles on profiles.id = patient_profiles.user_id
  where patient_profiles.user_id = current_user_id
    and profiles.role = 'patient'
    and profiles.is_active = true;

  if patient_profile_record.id is null then
    raise exception 'Only patient accounts can book sessions';
  end if;

  if patient_profile_record.consent_accepted is not true then
    raise exception 'Please accept consent before booking';
  end if;

  if p_session_type not in ('online', 'in_person') then
    raise exception 'Choose a valid session type';
  end if;

  if p_starts_at <= now() or p_ends_at <= p_starts_at then
    raise exception 'Choose a future available time slot';
  end if;

  select
    doctor_profiles.id,
    doctor_profiles.offers_online,
    doctor_profiles.offers_in_person
    into doctor_record
  from public.doctor_profiles
  join public.profiles on profiles.id = doctor_profiles.user_id
  where doctor_profiles.id = p_doctor_profile_id
    and doctor_profiles.verification_status = 'approved'
    and doctor_profiles.is_public = true
    and profiles.role = 'doctor'
    and profiles.is_active = true;

  if doctor_record.id is null then
    raise exception 'This professional is not available for booking';
  end if;

  if p_session_type = 'online' and doctor_record.offers_online is not true then
    raise exception 'Online sessions are not available for this professional';
  end if;

  if p_session_type = 'in_person' and doctor_record.offers_in_person is not true then
    raise exception 'In-person sessions are not available for this professional';
  end if;

  if not exists (
    select 1
    from app_private.get_available_slots(
      p_doctor_profile_id,
      ((p_starts_at at time zone 'Africa/Cairo')::date - 1),
      ((p_starts_at at time zone 'Africa/Cairo')::date + 1)
    ) as slots
    where slots.starts_at = p_starts_at
      and slots.ends_at = p_ends_at
      and p_session_type = any(slots.session_types)
  ) then
    raise exception 'This time slot is no longer available';
  end if;

  begin
    insert into public.appointments (
      patient_profile_id,
      doctor_profile_id,
      starts_at,
      ends_at,
      status,
      session_type,
      patient_message
    )
    values (
      patient_profile_record.id,
      p_doctor_profile_id,
      p_starts_at,
      p_ends_at,
      'requested',
      p_session_type,
      nullif(left(btrim(coalesce(p_patient_message, '')), 500), '')
    )
    returning * into created_appointment;
  exception
    when exclusion_violation then
      raise exception 'This time slot is no longer available';
  end;

  return query
  select
    created_appointment.id,
    created_appointment.starts_at,
    created_appointment.ends_at,
    created_appointment.status,
    created_appointment.session_type;
end;
$$;

create or replace function app_private.cancel_patient_appointment(
  p_appointment_id uuid,
  p_cancellation_reason text default null
)
returns table (
  id uuid,
  status text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  appointment_record public.appointments%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Please log in to manage appointments';
  end if;

  select appointments.*
    into appointment_record
  from public.appointments
  join public.patient_profiles on patient_profiles.id = appointments.patient_profile_id
  join public.profiles on profiles.id = patient_profiles.user_id
  where appointments.id = p_appointment_id
    and patient_profiles.user_id = auth.uid()
    and profiles.role = 'patient'
    and profiles.is_active = true;

  if appointment_record.id is null then
    raise exception 'Appointment not found';
  end if;

  if appointment_record.status not in ('requested', 'confirmed') then
    raise exception 'This appointment cannot be cancelled';
  end if;

  update public.appointments
  set status = 'cancelled_by_patient',
      cancellation_reason = nullif(left(btrim(coalesce(p_cancellation_reason, '')), 500), '')
  where appointments.id = p_appointment_id
  returning appointments.id, appointments.status
  into id, status;

  return next;
end;
$$;

create or replace function app_private.update_doctor_appointment_status(
  p_appointment_id uuid,
  p_next_status text,
  p_note text default null
)
returns table (
  id uuid,
  status text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  appointment_record public.appointments%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Please log in to manage appointments';
  end if;

  select appointments.*
    into appointment_record
  from public.appointments
  join public.doctor_profiles on doctor_profiles.id = appointments.doctor_profile_id
  join public.profiles on profiles.id = doctor_profiles.user_id
  where appointments.id = p_appointment_id
    and doctor_profiles.user_id = auth.uid()
    and profiles.role = 'doctor'
    and profiles.is_active = true;

  if appointment_record.id is null then
    raise exception 'Appointment not found';
  end if;

  if not (
    (appointment_record.status = 'requested' and p_next_status in ('confirmed', 'declined'))
    or (appointment_record.status = 'confirmed' and p_next_status in ('cancelled_by_doctor', 'completed'))
  ) then
    raise exception 'This status change is not allowed';
  end if;

  update public.appointments
  set status = p_next_status,
      doctor_response_note = case
        when p_next_status in ('confirmed', 'declined', 'completed')
          then nullif(left(btrim(coalesce(p_note, '')), 500), '')
        else doctor_response_note
      end,
      cancellation_reason = case
        when p_next_status = 'cancelled_by_doctor'
          then nullif(left(btrim(coalesce(p_note, '')), 500), '')
        else cancellation_reason
      end
  where appointments.id = p_appointment_id
  returning appointments.id, appointments.status
  into id, status;

  return next;
end;
$$;

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
  cancellation_reason text
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
    appointments.cancellation_reason
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
  starts_at timestamptz,
  ends_at timestamptz,
  status text,
  session_type text,
  patient_message text,
  doctor_response_note text,
  cancellation_reason text
)
language sql
security definer
stable
set search_path = ''
as $$
  select
    appointments.id,
    coalesce(patient_profiles.preferred_name, patient_profile_owner.full_name) as patient_display_name,
    appointments.starts_at,
    appointments.ends_at,
    appointments.status,
    appointments.session_type,
    appointments.patient_message,
    appointments.doctor_response_note,
    appointments.cancellation_reason
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

create or replace function public.get_available_slots(
  p_doctor_profile_id uuid,
  p_from_date date default current_date,
  p_to_date date default (current_date + 14)
)
returns table (
  starts_at timestamptz,
  ends_at timestamptz,
  session_types text[],
  label text
)
language sql
security invoker
stable
set search_path = ''
as $$
  select *
  from app_private.get_available_slots(p_doctor_profile_id, p_from_date, p_to_date);
$$;

create or replace function public.book_appointment(
  p_doctor_profile_id uuid,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_session_type text,
  p_patient_message text default null
)
returns table (
  id uuid,
  starts_at timestamptz,
  ends_at timestamptz,
  status text,
  session_type text
)
language sql
security invoker
set search_path = ''
as $$
  select *
  from app_private.book_appointment(
    p_doctor_profile_id,
    p_starts_at,
    p_ends_at,
    p_session_type,
    p_patient_message
  );
$$;

create or replace function public.cancel_patient_appointment(
  p_appointment_id uuid,
  p_cancellation_reason text default null
)
returns table (
  id uuid,
  status text
)
language sql
security invoker
set search_path = ''
as $$
  select *
  from app_private.cancel_patient_appointment(p_appointment_id, p_cancellation_reason);
$$;

create or replace function public.update_doctor_appointment_status(
  p_appointment_id uuid,
  p_next_status text,
  p_note text default null
)
returns table (
  id uuid,
  status text
)
language sql
security invoker
set search_path = ''
as $$
  select *
  from app_private.update_doctor_appointment_status(p_appointment_id, p_next_status, p_note);
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
  cancellation_reason text
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
  starts_at timestamptz,
  ends_at timestamptz,
  status text,
  session_type text,
  patient_message text,
  doctor_response_note text,
  cancellation_reason text
)
language sql
security invoker
stable
set search_path = ''
as $$
  select *
  from app_private.get_doctor_appointments();
$$;

revoke all on function app_private.get_available_slots(uuid, date, date) from public;
revoke all on function app_private.book_appointment(uuid, timestamptz, timestamptz, text, text) from public;
revoke all on function app_private.cancel_patient_appointment(uuid, text) from public;
revoke all on function app_private.update_doctor_appointment_status(uuid, text, text) from public;
revoke all on function app_private.get_patient_appointments() from public;
revoke all on function app_private.get_doctor_appointments() from public;

revoke all on function public.get_available_slots(uuid, date, date) from public;
revoke all on function public.book_appointment(uuid, timestamptz, timestamptz, text, text) from public;
revoke all on function public.cancel_patient_appointment(uuid, text) from public;
revoke all on function public.update_doctor_appointment_status(uuid, text, text) from public;
revoke all on function public.get_patient_appointments() from public;
revoke all on function public.get_doctor_appointments() from public;

grant execute on function app_private.get_available_slots(uuid, date, date) to anon, authenticated;
grant execute on function app_private.book_appointment(uuid, timestamptz, timestamptz, text, text) to authenticated;
grant execute on function app_private.cancel_patient_appointment(uuid, text) to authenticated;
grant execute on function app_private.update_doctor_appointment_status(uuid, text, text) to authenticated;
grant execute on function app_private.get_patient_appointments() to authenticated;
grant execute on function app_private.get_doctor_appointments() to authenticated;

grant execute on function public.get_available_slots(uuid, date, date) to anon, authenticated;
grant execute on function public.book_appointment(uuid, timestamptz, timestamptz, text, text) to authenticated;
grant execute on function public.cancel_patient_appointment(uuid, text) to authenticated;
grant execute on function public.update_doctor_appointment_status(uuid, text, text) to authenticated;
grant execute on function public.get_patient_appointments() to authenticated;
grant execute on function public.get_doctor_appointments() to authenticated;
