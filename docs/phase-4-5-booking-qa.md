# Phase 4.5 Booking QA And Hardening

Phase 4.5 reviewed and hardened the appointment booking system before Phase 5. No admin operations, payments, chat, video calls, clinical notes, diagnosis, ratings, reviews, or AI therapy were added.

## Reviewed

- `supabase/migrations/20260507203011_phase_4_availability_booking.sql`
- Availability services and UI
- Appointment services and UI
- Public doctor booking panel
- Doctor profile booking section
- Patient and doctor dashboard appointment sections
- Phase 4 documentation

## SQL And RLS Review Summary

- `doctor_availability_rules`, `doctor_time_off`, and `appointments` have RLS enabled.
- Availability and time-off rows are owner-managed by the doctor profile.
- Public users cannot directly read appointments or doctor time-off rows.
- Patients can select only their own appointments.
- Doctors can select only appointments assigned to their doctor profile.
- Direct appointment insert/update/delete is not granted to client roles.
- Active appointment overlap is blocked at the database level for both doctor and patient using exclusion constraints on `requested` and `confirmed`.
- Declined, cancelled, completed, and no-show appointments do not block future slots.

## Fixes Made

- Added corrective migration `20260507205632_phase_4_5_booking_hardening.sql`.
- Moved privileged booking logic into `app_private` security-definer functions with fixed `search_path`.
- Replaced exposed `public` RPC functions with security-invoker wrappers that preserve the existing app contract.
- Explicitly revoked broad function execution and granted only the intended `anon`/`authenticated` access.
- Added role and active-profile checks to appointment list and doctor status update functions.
- Fixed patient dashboard copy that still referred to booking as a future phase.
- Adjusted slot date-range requests to use the platform timezone, `Africa/Cairo`, instead of UTC date slicing.

## Booking RPC Review Summary

`book_appointment` now remains callable through `public.book_appointment`, but the privileged implementation lives in `app_private.book_appointment`.

Verified design:

- Requires authenticated user.
- Requires a patient profile derived from `auth.uid()`.
- Does not allow the client to pass `patient_profile_id`.
- Rejects doctor/admin accounts.
- Requires patient consent.
- Requires approved, public, active doctor profile.
- Requires future slot.
- Requires exact match against generated available slots.
- Rejects unavailable, time-off, or already requested/confirmed slots.
- Inserts appointment with status `requested`.
- Returns only appointment id, start/end time, status, and session type.

## Available Slots Review Summary

`get_available_slots`:

- Returns slots only for approved, public, active doctors.
- Generates slots from active weekly rules.
- Uses rule timezone when converting local weekly slots to `timestamptz`.
- Excludes past slots.
- Excludes slots overlapping `doctor_time_off`.
- Excludes slots overlapping `requested` or `confirmed` appointments.
- Does not return blocked-time reasons or appointment details.
- Limits generated output to 100 rows and caps the request window to 30 days.

## Status Transition Review Summary

Allowed patient transitions:

- `requested -> cancelled_by_patient`
- `confirmed -> cancelled_by_patient`

Allowed doctor transitions:

- `requested -> confirmed`
- `requested -> declined`
- `confirmed -> cancelled_by_doctor`
- `confirmed -> completed`

Invalid transitions are rejected inside the RPC layer. Patient and doctor ownership is checked server-side using `auth.uid()`.

## RLS Manual Tests

Use real test users in Supabase Auth. These are practical checks rather than seed data.

1. As anon, request `appointments?select=id` through the REST API. Expect denied/no access.
2. As anon, request `doctor_time_off?select=id,reason`. Expect denied/no access.
3. As patient A, call `get_patient_appointments()`. Expect only patient A rows.
4. As patient B, call `get_patient_appointments()`. Expect no patient A rows.
5. As doctor A, call `get_doctor_appointments()`. Expect only doctor A rows.
6. As doctor B, call `get_doctor_appointments()`. Expect no doctor A rows.
7. As patient, attempt direct insert into `doctor_availability_rules`. Expect RLS failure.
8. As doctor A, attempt to update doctor B availability id. Expect no row changed/RLS block.
9. As anon, attempt direct insert into `appointments`. Expect no permission.
10. As anon, call `get_available_slots()` for an approved public doctor. Expect only available slots.
11. As anon, call `get_available_slots()` for pending/private/rejected doctor. Expect empty result.
12. As patient, call `book_appointment()` twice for the same active slot. Expect second call to fail.

## End-To-End Manual Test Checklist

- [ ] Register/login doctor.
- [ ] Manually approve doctor in Supabase.
- [ ] Set doctor `is_public = true`.
- [ ] Doctor creates weekly availability.
- [ ] Doctor edits weekly availability.
- [ ] Doctor adds time off.
- [ ] Public profile shows slots outside time off.
- [ ] Public profile hides slots inside time off.
- [ ] Logout.
- [ ] Public user sees login CTA when trying to book.
- [ ] Register/login patient.
- [ ] Patient books available slot.
- [ ] Patient sees appointment in dashboard.
- [ ] Doctor sees requested appointment.
- [ ] Doctor confirms appointment.
- [ ] Patient sees confirmed appointment.
- [ ] Patient cancels confirmed appointment.
- [ ] Cancelled slot can become available again if it still matches availability and time off.
- [ ] Try booking the same active slot twice.
- [ ] Confirm duplicate booking is blocked.
- [ ] Confirm pending/private/rejected doctors expose no slots.
- [ ] Confirm assigned doctors can see patient phone for appointment coordination, but patient email remains hidden.
- [ ] Confirm no time-off reason appears on public doctor profile.

## Known Issues Found

- Phase 4 had `SECURITY DEFINER` RPC implementations in the exposed `public` schema.
- Patient dashboard copy still described booking as a future phase.
- Slot query date range used UTC date slicing from the server.

## Remaining Limitations

- No 24-hour cancellation window yet.
- No appointment status history table yet.
- No appointment detail page yet.
- No notifications or reminders yet.
- Meeting links and assigned-doctor patient phone visibility are documented in Phase 7.
- No timezone picker; `Africa/Cairo` is the MVP platform timezone.
- No rescheduling flow.

## Readiness Decision

Phase 4 is ready for Phase 5 after the corrective migration is applied and the manual RLS/booking checklist passes against the linked Supabase project.

Apply the corrective migration with:

```bash
supabase db push
```

If linked commands fail with access-control `403`, set `SUPABASE_DB_PASSWORD` for the linked database or authenticate the CLI with an account that has sufficient project database privileges.
