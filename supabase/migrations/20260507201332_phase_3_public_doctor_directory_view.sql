drop view if exists public.public_doctor_profiles;

create view public.public_doctor_profiles
as
select
  doctor_profiles.id,
  profiles.full_name as display_name,
  profiles.avatar_url,
  doctor_profiles.professional_title,
  doctor_profiles.bio,
  doctor_profiles.specialties,
  doctor_profiles.languages,
  doctor_profiles.years_of_experience,
  doctor_profiles.session_price,
  doctor_profiles.session_duration_minutes,
  doctor_profiles.offers_online,
  doctor_profiles.offers_in_person,
  doctor_profiles.verification_status,
  doctor_profiles.is_public,
  doctor_profiles.created_at,
  doctor_profiles.updated_at
from public.doctor_profiles
join public.profiles
  on profiles.id = doctor_profiles.user_id
where doctor_profiles.verification_status = 'approved'
  and doctor_profiles.is_public = true
  and profiles.role = 'doctor'
  and profiles.is_active = true;

comment on view public.public_doctor_profiles is
  'Safe public directory view for approved, public, active doctor profiles. Excludes user_id, email, phone, license fields, patient data, and auth data.';

revoke all on public.public_doctor_profiles from public;
grant select on public.public_doctor_profiles to anon, authenticated;

revoke select on public.doctor_profiles from anon;
