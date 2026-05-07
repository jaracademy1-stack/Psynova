# Phase 4 Availability And Booking

Phase 4 adds the first real booking flow. It does not add payments, chat, video calls, clinical notes, diagnosis features, ratings, reviews, AI therapy, or admin approval UI.

## Tables Added

`doctor_availability_rules`

- Stores recurring weekly availability.
- Owned by the doctor profile.
- Includes day of week, start/end time, timezone, slot duration, buffer, and active flag.

`doctor_time_off`

- Stores blocked unavailable time.
- Owned by the doctor profile.
- Reason is private to the doctor/admin path and is not exposed publicly.

`appointments`

- Stores patient booking requests with doctors.
- Uses statuses: `requested`, `confirmed`, `declined`, `cancelled_by_patient`, `cancelled_by_doctor`, `completed`, `no_show`.
- Does not store payment data, video links, clinical notes, prescriptions, or diagnosis fields.

## RPC Functions Added

Phase 4.5 adds a hardening migration that keeps these public RPC names stable
while moving privileged implementations into `app_private` security-definer
functions. The public functions are security-invoker wrappers.

`public.get_available_slots(p_doctor_profile_id, p_from_date, p_to_date)`

- Returns future available slots for approved, public, active doctors only.
- Excludes time off.
- Excludes `requested` and `confirmed` appointments.
- Does not expose blocked-time reasons or appointment details.

`public.book_appointment(p_doctor_profile_id, p_starts_at, p_ends_at, p_session_type, p_patient_message)`

- Authenticated patient-only booking.
- Looks up `patient_profile_id` from `auth.uid()`.
- Requires patient consent.
- Verifies doctor is approved and public.
- Verifies the selected slot is still available.
- Inserts status `requested`.
- Relies on database exclusion constraints to prevent race-condition double booking.

`public.cancel_patient_appointment(p_appointment_id, p_cancellation_reason)`

- Allows patient owner to cancel `requested` or `confirmed` appointments.

`public.update_doctor_appointment_status(p_appointment_id, p_next_status, p_note)`

- Allows doctor owner to transition:
  - `requested -> confirmed`
  - `requested -> declined`
  - `confirmed -> cancelled_by_doctor`
  - `confirmed -> completed`

`public.get_patient_appointments()`

- Returns a patient-safe appointment list for the authenticated patient.

`public.get_doctor_appointments()`

- Returns a doctor-safe appointment list for the authenticated doctor.
- Shows patient display name and booking message only, not patient phone/email/private profile fields.

## RLS Summary

- RLS is enabled on all new public tables.
- Doctors can manage only their own availability rules and blocked time.
- Patients cannot directly read availability or blocked time tables.
- Public users cannot access appointments.
- Patients can select only their own appointments.
- Doctors can select only appointments assigned to their doctor profile.
- Direct appointment inserts/updates are not granted to client roles; booking and status changes go through RPC functions.

## Booking Flow

1. Patient opens an approved public doctor profile.
2. The page fetches safe public doctor data and available slots.
3. Unauthenticated users see `Log in to book`.
4. Patient users can choose a slot and optional short message.
5. Booking calls `book_appointment`.
6. Appointment is created as `requested`.
7. Patient sees the request in `/patient/dashboard`.
8. Doctor sees the request in `/doctor/dashboard`.

## Doctor Availability Flow

Route: `/doctor/dashboard/availability`

Doctors can:

- Add weekly availability rules.
- Edit weekly availability rules, including active status.
- Delete weekly availability rules.
- Add blocked time.
- Delete blocked time.

Only the owner doctor can manage these records.

## Patient Dashboard Flow

`/patient/dashboard` now shows:

- Active appointment requests.
- Confirmed appointments.
- Recent cancelled/declined/completed history.
- Cancel action for requested/confirmed appointments.

## Doctor Dashboard Flow

`/doctor/dashboard` now shows:

- Appointment requests.
- Confirmed appointments.
- Recent history.
- Confirm, decline, cancel, and complete actions.
- Link to availability management.

## Manual Test Checklist

- [ ] Doctor creates an availability rule.
- [ ] Doctor edits an availability rule.
- [ ] Approved public doctor profile shows available slots.
- [ ] Unauthenticated user cannot book and sees login CTA.
- [ ] Doctor/admin account cannot book as a patient.
- [ ] Patient can book an available slot.
- [ ] Patient cannot double-book the same slot.
- [ ] Another patient cannot book an already requested/confirmed slot.
- [ ] Patient sees appointment in dashboard.
- [ ] Doctor sees appointment in dashboard.
- [ ] Doctor confirms appointment.
- [ ] Patient sees confirmed status.
- [ ] Patient cancels appointment.
- [ ] Cancelled appointment no longer blocks future slots.
- [ ] Doctor adds time off.
- [ ] Slots during time off disappear.
- [ ] Pending/private doctor slots are not exposed.
- [ ] RLS prevents reading another user's appointment.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `supabase db lint --linked --fail-on error` passes.
- [ ] Apply `20260507205632_phase_4_5_booking_hardening.sql` before Phase 5.

## Known Limitations

- No payments.
- No chat.
- No video session links.
- No clinical notes.
- No appointment reminders.
- No rescheduling flow yet.
- No admin appointment management UI yet.
- No timezone UI beyond the default `Africa/Cairo`.

## Next Phase Recommendation

Phase 5 should add the admin verification queue and admin operational tools, or a Phase 4.5 pass can harden cancellation windows, reminders, and appointment detail pages before admin work.
