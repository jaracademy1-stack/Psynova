create extension if not exists btree_gist with schema extensions;

create table public.doctor_availability_rules (
  id uuid primary key default gen_random_uuid(),
  doctor_profile_id uuid not null references public.doctor_profiles(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  timezone text not null default 'Africa/Cairo',
  slot_duration_minutes integer not null default 50 check (slot_duration_minutes between 15 and 180),
  buffer_minutes integer not null default 10 check (buffer_minutes between 0 and 60),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time > start_time)
);

create table public.doctor_time_off (
  id uuid primary key default gen_random_uuid(),
  doctor_profile_id uuid not null references public.doctor_profiles(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_profile_id uuid not null references public.patient_profiles(id) on delete restrict,
  doctor_profile_id uuid not null references public.doctor_profiles(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  appointment_range tstzrange generated always as (tstzrange(starts_at, ends_at, '[)')) stored,
  status text not null default 'requested' check (
    status in (
      'requested',
      'confirmed',
      'declined',
      'cancelled_by_patient',
      'cancelled_by_doctor',
      'completed',
      'no_show'
    )
  ),
  session_type text not null default 'online' check (session_type in ('online', 'in_person')),
  patient_message text check (patient_message is null or length(patient_message) <= 500),
  doctor_response_note text check (doctor_response_note is null or length(doctor_response_note) <= 500),
  cancellation_reason text check (cancellation_reason is null or length(cancellation_reason) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index doctor_availability_rules_doctor_idx
  on public.doctor_availability_rules (doctor_profile_id, day_of_week, is_active);

create index doctor_time_off_doctor_range_idx
  on public.doctor_time_off using gist (
    doctor_profile_id,
    tstzrange(starts_at, ends_at, '[)')
  );

create index appointments_patient_status_idx
  on public.appointments (patient_profile_id, status, starts_at);

create index appointments_doctor_status_idx
  on public.appointments (doctor_profile_id, status, starts_at);

alter table public.appointments
add constraint appointments_no_overlapping_active_doctor_slots
exclude using gist (
  doctor_profile_id with =,
  appointment_range with &&
)
where (status in ('requested', 'confirmed'));

alter table public.appointments
add constraint appointments_no_overlapping_active_patient_slots
exclude using gist (
  patient_profile_id with =,
  appointment_range with &&
)
where (status in ('requested', 'confirmed'));

create trigger doctor_availability_rules_handle_updated_at
before update on public.doctor_availability_rules
for each row execute function public.handle_updated_at();

create trigger doctor_time_off_handle_updated_at
before update on public.doctor_time_off
for each row execute function public.handle_updated_at();

create trigger appointments_handle_updated_at
before update on public.appointments
for each row execute function public.handle_updated_at();

alter table public.doctor_availability_rules enable row level security;
alter table public.doctor_time_off enable row level security;
alter table public.appointments enable row level security;

grant select, insert, update, delete on public.doctor_availability_rules to authenticated;
grant select, insert, update, delete on public.doctor_time_off to authenticated;
grant select on public.appointments to authenticated;

revoke all on public.doctor_availability_rules from anon;
revoke all on public.doctor_time_off from anon;
revoke all on public.appointments from anon;

create policy "Doctors can select own availability rules"
on public.doctor_availability_rules
for select
to authenticated
using (
  exists (
    select 1
    from public.doctor_profiles
    join public.profiles on profiles.id = doctor_profiles.user_id
    where doctor_profiles.id = doctor_availability_rules.doctor_profile_id
      and doctor_profiles.user_id = auth.uid()
      and profiles.role = 'doctor'
      and profiles.is_active = true
  )
);

create policy "Doctors can insert own availability rules"
on public.doctor_availability_rules
for insert
to authenticated
with check (
  exists (
    select 1
    from public.doctor_profiles
    join public.profiles on profiles.id = doctor_profiles.user_id
    where doctor_profiles.id = doctor_availability_rules.doctor_profile_id
      and doctor_profiles.user_id = auth.uid()
      and profiles.role = 'doctor'
      and profiles.is_active = true
  )
);

create policy "Doctors can update own availability rules"
on public.doctor_availability_rules
for update
to authenticated
using (
  exists (
    select 1
    from public.doctor_profiles
    join public.profiles on profiles.id = doctor_profiles.user_id
    where doctor_profiles.id = doctor_availability_rules.doctor_profile_id
      and doctor_profiles.user_id = auth.uid()
      and profiles.role = 'doctor'
      and profiles.is_active = true
  )
)
with check (
  exists (
    select 1
    from public.doctor_profiles
    join public.profiles on profiles.id = doctor_profiles.user_id
    where doctor_profiles.id = doctor_availability_rules.doctor_profile_id
      and doctor_profiles.user_id = auth.uid()
      and profiles.role = 'doctor'
      and profiles.is_active = true
  )
);

create policy "Doctors can delete own availability rules"
on public.doctor_availability_rules
for delete
to authenticated
using (
  exists (
    select 1
    from public.doctor_profiles
    join public.profiles on profiles.id = doctor_profiles.user_id
    where doctor_profiles.id = doctor_availability_rules.doctor_profile_id
      and doctor_profiles.user_id = auth.uid()
      and profiles.role = 'doctor'
      and profiles.is_active = true
  )
);

create policy "Admins can manage all availability rules"
on public.doctor_availability_rules
for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "Doctors can select own time off"
on public.doctor_time_off
for select
to authenticated
using (
  exists (
    select 1
    from public.doctor_profiles
    join public.profiles on profiles.id = doctor_profiles.user_id
    where doctor_profiles.id = doctor_time_off.doctor_profile_id
      and doctor_profiles.user_id = auth.uid()
      and profiles.role = 'doctor'
      and profiles.is_active = true
  )
);

create policy "Doctors can insert own time off"
on public.doctor_time_off
for insert
to authenticated
with check (
  exists (
    select 1
    from public.doctor_profiles
    join public.profiles on profiles.id = doctor_profiles.user_id
    where doctor_profiles.id = doctor_time_off.doctor_profile_id
      and doctor_profiles.user_id = auth.uid()
      and profiles.role = 'doctor'
      and profiles.is_active = true
  )
);

create policy "Doctors can update own time off"
on public.doctor_time_off
for update
to authenticated
using (
  exists (
    select 1
    from public.doctor_profiles
    join public.profiles on profiles.id = doctor_profiles.user_id
    where doctor_profiles.id = doctor_time_off.doctor_profile_id
      and doctor_profiles.user_id = auth.uid()
      and profiles.role = 'doctor'
      and profiles.is_active = true
  )
)
with check (
  exists (
    select 1
    from public.doctor_profiles
    join public.profiles on profiles.id = doctor_profiles.user_id
    where doctor_profiles.id = doctor_time_off.doctor_profile_id
      and doctor_profiles.user_id = auth.uid()
      and profiles.role = 'doctor'
      and profiles.is_active = true
  )
);

create policy "Doctors can delete own time off"
on public.doctor_time_off
for delete
to authenticated
using (
  exists (
    select 1
    from public.doctor_profiles
    join public.profiles on profiles.id = doctor_profiles.user_id
    where doctor_profiles.id = doctor_time_off.doctor_profile_id
      and doctor_profiles.user_id = auth.uid()
      and profiles.role = 'doctor'
      and profiles.is_active = true
  )
);

create policy "Admins can manage all time off"
on public.doctor_time_off
for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "Patients can select own appointments"
on public.appointments
for select
to authenticated
using (
  exists (
    select 1
    from public.patient_profiles
    where patient_profiles.id = appointments.patient_profile_id
      and patient_profiles.user_id = auth.uid()
  )
);

create policy "Doctors can select assigned appointments"
on public.appointments
for select
to authenticated
using (
  exists (
    select 1
    from public.doctor_profiles
    where doctor_profiles.id = appointments.doctor_profile_id
      and doctor_profiles.user_id = auth.uid()
  )
);

create policy "Admins can select all appointments"
on public.appointments
for select
to authenticated
using (app_private.is_admin());

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
  bounded_dates as (
    select generate_series(
      greatest(coalesce(p_from_date, current_date), current_date),
      least(coalesce(p_to_date, current_date + 14), greatest(coalesce(p_from_date, current_date), current_date) + 30),
      interval '1 day'
    )::date as slot_date
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
    from public.get_available_slots(
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

create or replace function public.cancel_patient_appointment(
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
  where appointments.id = p_appointment_id
    and patient_profiles.user_id = auth.uid();

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

create or replace function public.update_doctor_appointment_status(
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
  where appointments.id = p_appointment_id
    and doctor_profiles.user_id = auth.uid();

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
  join public.doctor_profiles
    on doctor_profiles.id = appointments.doctor_profile_id
  join public.profiles doctor_profiles_owner
    on doctor_profiles_owner.id = doctor_profiles.user_id
  where patient_profiles.user_id = auth.uid()
  order by appointments.starts_at desc;
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
  join public.patient_profiles
    on patient_profiles.id = appointments.patient_profile_id
  join public.profiles patient_profile_owner
    on patient_profile_owner.id = patient_profiles.user_id
  where doctor_profiles.user_id = auth.uid()
  order by appointments.starts_at desc;
$$;

grant execute on function public.get_available_slots(uuid, date, date) to anon, authenticated;
grant execute on function public.book_appointment(uuid, timestamptz, timestamptz, text, text) to authenticated;
grant execute on function public.cancel_patient_appointment(uuid, text) to authenticated;
grant execute on function public.update_doctor_appointment_status(uuid, text, text) to authenticated;
grant execute on function public.get_patient_appointments() to authenticated;
grant execute on function public.get_doctor_appointments() to authenticated;
