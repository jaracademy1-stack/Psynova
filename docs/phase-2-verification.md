# Phase 2.5 Verification Checklist

Use this checklist after applying the Phase 2 and Phase 2.5 migrations to a Supabase project.

## Setup

- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` to `.env.local`.
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.
- [ ] Leave `SUPABASE_SERVICE_ROLE_KEY` out of browser code. It is not needed for Phase 2 UI flows.
- [ ] Restart the Next.js dev server after changing environment variables.
- [ ] Apply migrations:

```bash
supabase db push
```

For local Supabase:

```bash
supabase start
supabase db reset
```

## Patient Registration

- [ ] Visit `/register`.
- [ ] Register with full name, email, password, optional phone, and consent checked.
- [ ] Confirm an `auth.users` row exists.
- [ ] Confirm `public.profiles` has one row for the user with `role = 'patient'`.
- [ ] Confirm `public.patient_profiles` has one row for the same user.
- [ ] Confirm `patient_profiles.consent_accepted = true`.
- [ ] Login as the patient from `/login`.
- [ ] Confirm login redirects to `/patient/dashboard`.
- [ ] Confirm `/doctor/dashboard` redirects back to `/patient/dashboard`.
- [ ] Confirm `/dashboard` redirects back to `/patient/dashboard`.

## Doctor Registration

- [ ] Visit `/doctor/register`.
- [ ] Register with professional details, license details, specialties, languages, and session settings.
- [ ] Confirm an `auth.users` row exists.
- [ ] Confirm `public.profiles` has one row for the user with `role = 'doctor'`.
- [ ] Confirm `public.doctor_profiles` has one row for the same user.
- [ ] Confirm `doctor_profiles.verification_status = 'pending'`.
- [ ] Confirm `doctor_profiles.is_public = false`.
- [ ] Login as the doctor from `/login`.
- [ ] Confirm login redirects to `/doctor/dashboard`.
- [ ] Confirm the doctor dashboard shows the pending verification state.
- [ ] Confirm `/patient/dashboard` redirects back to `/doctor/dashboard`.
- [ ] Confirm `/dashboard` redirects back to `/doctor/dashboard`.

## Admin Guard

- [ ] Manually create or update a trusted test user profile with `role = 'admin'` in Supabase.
- [ ] Login as the admin user.
- [ ] Confirm login redirects to `/dashboard`.
- [ ] Confirm patient and doctor users cannot access `/dashboard`.
- [ ] Confirm admin users can access `/dashboard`.

## Public Doctor Directory

- [ ] Confirm the app reads public listings from `public.public_doctor_profiles`, not directly from `public.doctor_profiles`.
- [ ] Confirm anonymous users cannot select directly from `public.doctor_profiles`.
- [ ] Visit `/doctors` before approving any doctor.
- [ ] Confirm the polished empty state appears.
- [ ] Confirm pending doctors do not appear.
- [ ] Confirm rejected doctors do not appear.
- [ ] Confirm private doctors do not appear.
- [ ] Manually approve one doctor in Supabase:

```sql
update public.doctor_profiles
set verification_status = 'approved',
    is_public = true
where user_id = '<doctor-user-id>';
```

- [ ] Visit `/doctors`.
- [ ] Confirm the approved public doctor appears.
- [ ] Open `/doctor/<doctor-profile-id>`.
- [ ] Confirm the public doctor profile loads.
- [ ] Confirm the booking button is disabled or marked as coming in the next phase.
- [ ] Set the doctor back to `pending` or `is_public = false`.
- [ ] Confirm the doctor disappears from `/doctors`.
- [ ] Confirm `/doctor/<doctor-profile-id>` shows the unavailable state.

## Common Problems And Fixes

Missing env vars:
Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`, then restart `npm run dev`.

Email confirmation blocks login:
If Supabase email confirmation is enabled, a new user may need to confirm email before login/session redirects work. For local testing, either confirm the user in Supabase Auth or temporarily disable confirmation in the Supabase Auth settings.

RLS insert failure:
Make sure both migrations are applied. The auth trigger creates `profiles`, `patient_profiles`, and `doctor_profiles` during signup. Check Supabase logs for trigger errors if rows are missing.

Trigger failure:
Apply the Phase 2.5 corrective migration. It hardens metadata parsing for booleans, numbers, and text arrays so malformed metadata falls back safely.

Wrong redirect:
Check `public.profiles.role` and `public.profiles.is_active`. Redirects are based on `profiles.role`, not auth metadata.

Cookie/session issue:
Confirm `src/proxy.ts` is active and the matcher is running for app routes. Restart the dev server after auth helper changes.

Build error:
Run `npm run lint` first, then `npm run build`. Fix TypeScript/import errors before testing auth flows.

Supabase local not running:
Start it with:

```bash
supabase start
```

Then rerun database checks:

```bash
supabase db lint --local
```
