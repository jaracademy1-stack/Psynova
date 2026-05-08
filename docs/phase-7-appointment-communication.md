# Phase 7 Appointment Communication

This upgrade adds controlled appointment coordination features. It does not add chat, in-app video calls, payments, clinical notes, diagnosis, prescriptions, ratings, or reviews.

## What Changed

- Assigned doctors can see a patient's phone number only through their own appointment list.
- Doctors can add, update, or clear a meeting link for their own online appointments.
- Patients can see the meeting link for their own online appointments.
- Public pages and unrelated users do not receive patient phone numbers or meeting links.

## Database Columns Added

`public.appointments`

- `meeting_url text`
- `meeting_url_updated_at timestamptz`
- `meeting_url_updated_by uuid references public.profiles(id) on delete set null`

`meeting_url` is constrained to either `null` or a 500-character-or-shorter URL beginning with `http://` or `https://`. Meeting passwords are not stored separately.

## RPCs Added Or Updated

Updated:

- `public.get_patient_appointments()`
  - Adds `meeting_url` and `meeting_url_updated_at`.
  - Returns rows only for the authenticated patient.

- `public.get_doctor_appointments()`
  - Adds `patient_phone`, `meeting_url`, and `meeting_url_updated_at`.
  - Returns rows only for the authenticated assigned doctor.

Added:

- `public.set_doctor_appointment_meeting_url(p_appointment_id, p_meeting_url)`
  - Authenticated doctor-only.
  - Requires the appointment to belong to the doctor's own doctor profile.
  - Allows only `requested` or `confirmed` appointments.
  - Allows only `online` appointments.
  - Accepts an empty value to clear the meeting link.
  - Returns only appointment id and meeting URL update fields.

The privileged implementation lives in `app_private` with a fixed `search_path`; the public function is a stable wrapper.

## Patient Phone Visibility Rules

- Patient phone comes from `public.profiles.phone`.
- Only the doctor assigned to the appointment can see it through `get_doctor_appointments()`.
- If no phone is present, the UI shows `No phone provided`.
- Patient email is not exposed.
- Public doctor pages never fetch or display patient contact data.

## Meeting Link Visibility Rules

- The patient who owns the appointment can see the meeting link through `get_patient_appointments()`.
- The assigned doctor can see and update the meeting link through doctor appointment RPCs.
- Public users cannot read meeting links.
- Other patients and other doctors cannot read meeting links.
- Meeting links are not shown in the doctor directory or public doctor profile data.

## Doctor Dashboard Flow

1. Doctor opens `/doctor/dashboard`.
2. Assigned appointment cards show patient name and phone number with coordination-only helper copy.
3. Online appointment cards show a meeting link input.
4. Doctor saves, updates, or clears the meeting link.
5. Invalid URLs show a friendly validation error.
6. In-person appointment cards do not show the online link input.

## Patient Dashboard Flow

1. Patient opens `/patient/dashboard`.
2. Online appointments show meeting instructions.
3. If a meeting link exists, the patient sees a `Join meeting` button opening in a new tab.
4. If no link exists, the patient sees that the link will appear after the provider adds it.
5. In-person appointments do not show an online join button.

## Security And RLS Notes

- Existing appointment RLS remains in place.
- Direct public access to appointments remains blocked.
- Meeting link writes go through a doctor-owned RPC, not direct client updates.
- The client never supplies patient profile ids or doctor ids for authorization.
- The service role key is not used.
- Patient phone and meeting URLs are not logged by application code.

## Manual Test Checklist

- [ ] Doctor can see phone for assigned patient appointment.
- [ ] Doctor cannot see phone for unrelated appointments.
- [ ] Public user cannot see patient phone.
- [ ] Patient can see own meeting link.
- [ ] Another patient cannot see meeting link.
- [ ] Doctor can add meeting link to own online appointment.
- [ ] Doctor cannot add meeting link to another doctor's appointment.
- [ ] Invalid meeting URL is rejected.
- [ ] Empty meeting URL clears link.
- [ ] Patient dashboard shows Join meeting button.
- [ ] In-person appointment does not show online join button.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `supabase db push` passes.
- [ ] `supabase db lint --linked --fail-on error` passes if access is available.

## Known Limitations

- No in-app chat.
- No in-app video calling.
- No meeting password storage.
- No email or SMS notification when a meeting link is added.
- No admin meeting-link editing UI.
