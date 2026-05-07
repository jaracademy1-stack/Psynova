# Phase 3 Doctor Directory Manual Tests

Phase 3 refines public doctor discovery only. It does not create appointments, availability, payments, chat, video calls, clinical notes, or admin approval UI.

## Apply The Migration

```bash
supabase db push
```

The Phase 3 migration refines `public.public_doctor_profiles` so public pages can read only approved, public, active doctor data.

## Public Data Contract

Public doctor pages must read from `public.public_doctor_profiles`.

Allowed public fields:

- `id`
- `display_name`
- `avatar_url`
- `professional_title`
- `bio`
- `specialties`
- `languages`
- `years_of_experience`
- `session_price`
- `session_duration_minutes`
- `offers_online`
- `offers_in_person`
- `verification_status`
- `is_public`
- `created_at`
- `updated_at`

Fields intentionally not exposed:

- `user_id`
- email
- phone
- license number
- license country
- education
- patient profile data
- auth user data
- hidden admin or verification notes

## Directory Tests

- [ ] With no approved public doctors, visit `/doctors`.
- [ ] Confirm the empty state appears.
- [ ] Confirm a pending doctor does not appear.
- [ ] Confirm a rejected doctor does not appear.
- [ ] Confirm a private doctor does not appear.
- [ ] Manually approve one doctor:

```sql
update public.doctor_profiles
set verification_status = 'approved',
    is_public = true
where user_id = '<doctor-user-id>';
```

- [ ] Confirm the doctor appears in `/doctors`.
- [ ] Search by display name.
- [ ] Search by professional title.
- [ ] Search by specialty.
- [ ] Search by language.
- [ ] Filter by specialty.
- [ ] Filter by language.
- [ ] Filter by online session type.
- [ ] Filter by in-person session type.
- [ ] Filter by max price.
- [ ] Filter by minimum experience.
- [ ] Sort by recommended/default.
- [ ] Sort by price low to high.
- [ ] Sort by experience high to low.
- [ ] Confirm clearing filters restores the full approved public list.

## Public Profile Tests

- [ ] Open `/doctor/<doctor-profile-id>` for an approved public doctor.
- [ ] Confirm the profile header shows public name, title, specialties, languages, and session type badges.
- [ ] Confirm the about section shows only public bio/focus/session data.
- [ ] Confirm the session information card shows duration, price, languages, and session options.
- [ ] Confirm the booking button is disabled and does not create an appointment.
- [ ] Confirm the safety note explains only approved public profile data is shown.
- [ ] Set the same doctor to `pending`, `rejected`, or `is_public = false`.
- [ ] Refresh `/doctor/<doctor-profile-id>`.
- [ ] Confirm the unavailable state appears without revealing private status details.

## Security Tests

- [ ] Confirm public pages do not query `doctor_profiles` directly.
- [ ] Confirm public pages do not query `profiles` directly.
- [ ] Confirm public pages do not query `patient_profiles`.
- [ ] Confirm no email, phone, user id, license number, or patient data appears in the browser UI.
- [ ] Confirm anon REST access to `public_doctor_profiles` works.
- [ ] Confirm anon REST access to direct private doctor fields remains blocked.

## Responsive And UI Tests

- [ ] Test `/doctors` on mobile width.
- [ ] Confirm filters stack cleanly and remain usable.
- [ ] Confirm doctor cards fit without horizontal scroll.
- [ ] Test `/doctor/<doctor-profile-id>` on mobile width.
- [ ] Confirm the booking placeholder appears below profile content.
- [ ] Confirm keyboard focus works on search, filters, sort, clear button, and profile links.

## Verification Commands

```bash
npm run lint
npm run build
supabase db lint --local
```

If local Supabase is not running:

```bash
supabase start
supabase db lint --local
```

For the linked remote project:

```bash
supabase db lint --linked --fail-on error
```
