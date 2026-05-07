# Phase 5 Admin Operations And Doctor Verification

Phase 5 adds a protected admin workflow for doctor application review. It does not add payments, chat, video calls, clinical notes, diagnosis, ratings, reviews, AI therapy, or notification delivery.

## Tables Added

`doctor_verification_reviews`

- Stores admin review decisions for doctor applications.
- Columns include doctor profile, reviewer profile, decision, internal review note, and created timestamp.
- Review notes are admin-only and are not exposed publicly or to doctors.

Phase 6 adds `admin_audit_events` for admin-only operational audit logging of doctor approval, rejection, public status changes, and active status changes.

## Doctor Profile Fields Added

`doctor_profiles`

- `rejection_reason`
- `verified_at`
- `verified_by`

`rejection_reason` is kept private in this phase. Doctor-facing rejected messaging stays generic and support-oriented.

## RPC Functions Added

Public wrappers:

- `public.admin_approve_doctor(p_doctor_profile_id, p_make_public, p_review_note)`
- `public.admin_reject_doctor(p_doctor_profile_id, p_review_note)`
- `public.admin_set_doctor_public_status(p_doctor_profile_id, p_is_public)`
- `public.admin_set_profile_active_status(p_profile_id, p_is_active)`

Privileged implementations live in `app_private` with fixed `search_path` and admin role checks based on `profiles.role = 'admin'`.

## RLS Summary

- RLS is enabled on `doctor_verification_reviews`.
- Only admins can select review records.
- Only admins can insert review records.
- Public users and patients cannot read verification reviews.
- Doctors cannot read internal review notes.
- Existing doctor profile protections remain in place.
- The doctor self-verification trigger was hardened so non-admin doctors cannot update verification status, public status, verifier fields, or review fields.

## Admin Dashboard Flow

Route: `/dashboard`

Admin sees:

- Pending doctor applications count.
- Approved public doctors count.
- Requested appointments count.
- Active users count.
- Pending doctor application preview.
- Recent verification activity.

Unauthenticated users are redirected to `/login`. Patient and doctor users are redirected to their role dashboards.

## Doctor Verification Flow

Routes:

- `/dashboard/doctors`
- `/dashboard/doctors/[id]`

Admin can:

- Browse applications by status.
- Search by name, title, specialty, language, or license country.
- Sort by newest, oldest, or experience.
- Review doctor application details.
- Approve a doctor and optionally make the profile public.
- Reject a doctor with an internal review note.
- Toggle approved doctors public/private.
- Deactivate/reactivate doctor accounts.

## Doctor Dashboard Verification States

Doctor dashboard now shows:

- Pending: profile is under admin review and public listing/booking are unavailable.
- Approved: profile is approved, with public profile link when public.
- Rejected: profile needs attention and should contact platform support.

Internal admin review notes are not shown to doctors.

## Manual Test Checklist

- [ ] Non-authenticated user cannot access `/dashboard`.
- [ ] Patient cannot access `/dashboard`.
- [ ] Doctor cannot access `/dashboard`.
- [ ] Admin can access `/dashboard`.
- [ ] Pending doctor appears in admin doctor applications.
- [ ] Admin can view doctor application details.
- [ ] Admin can approve doctor.
- [ ] Approved doctor becomes public if selected.
- [ ] Approved public doctor appears in `/doctors`.
- [ ] Admin can reject doctor.
- [ ] Rejected doctor does not appear publicly.
- [ ] Admin can toggle public/private for approved doctor.
- [ ] Private approved doctor does not appear publicly.
- [ ] Doctor dashboard shows correct pending/approved/rejected message.
- [ ] Public user cannot access admin routes.
- [ ] License number is not visible publicly.
- [ ] Review notes are not visible publicly or to doctor dashboard.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `supabase db lint --linked --fail-on error` passes.

## Security Notes

- Admin actions validate role server-side and in the database.
- No service role key is used in frontend code.
- Public doctor pages still use safe public doctor data only.
- Admin routes do not fetch patient profile data.
- Admin operational appointment data is limited to aggregate counts.
- New public-schema table includes explicit grants because Supabase is moving toward explicit Data API grants for new tables.

## Known Limitations

- No license document storage/review workflow yet.
- No admin user search page yet.
- No notification delivery when doctors are approved or rejected.
- No support ticket workflow.

## Next Phase Recommendation

Phase 6 should focus on security and production polish: RLS test coverage, legal/static pages, cancellation windows, audit log expansion, and deployment readiness.
