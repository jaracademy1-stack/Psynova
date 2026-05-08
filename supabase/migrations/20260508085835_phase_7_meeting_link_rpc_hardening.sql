create schema if not exists app_private;

revoke all on schema app_private from public;
grant usage on schema app_private to authenticated;

alter table public.appointments
add column if not exists meeting_url text,
add column if not exists meeting_url_updated_at timestamptz,
add column if not exists meeting_url_updated_by uuid references public.profiles(id) on delete set null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'appointments_meeting_url_safe'
      and conrelid = 'public.appointments'::regclass
  ) then
    alter table public.appointments
    add constraint appointments_meeting_url_safe
      check (
        meeting_url is null
        or (
          length(meeting_url) <= 500
          and meeting_url ~* '^https?://'
        )
      );
  end if;
end;
$$;

create index if not exists appointments_meeting_url_updated_by_idx
  on public.appointments (meeting_url_updated_by, meeting_url_updated_at desc)
  where meeting_url_updated_by is not null;

drop function if exists public.set_doctor_appointment_meeting_url(uuid, text);
drop function if exists app_private.set_doctor_appointment_meeting_url(uuid, text);

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
  result_id uuid;
  result_meeting_url text;
  result_meeting_url_updated_at timestamptz;
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
  into result_id, result_meeting_url, result_meeting_url_updated_at;

  id := result_id;
  meeting_url := result_meeting_url;
  meeting_url_updated_at := result_meeting_url_updated_at;

  return next;
end;
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

revoke all on function app_private.set_doctor_appointment_meeting_url(uuid, text) from public;
revoke all on function public.set_doctor_appointment_meeting_url(uuid, text) from public;

grant execute on function app_private.set_doctor_appointment_meeting_url(uuid, text) to authenticated;
grant execute on function public.set_doctor_appointment_meeting_url(uuid, text) to authenticated;

notify pgrst, 'reload schema';
