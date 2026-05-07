# Phase 6 Security, Production Polish, And Deployment Readiness

Phase 6 prepares Psynova for safer preview/production deployment. It does not add payments, chat, video calls, clinical notes, diagnosis, ratings, reviews, AI therapy, or complex new product features.

## Security Review Summary

- Reviewed migrations for profile, doctor directory, availability, appointments, booking hardening, and admin verification.
- Sensitive public-schema tables use RLS.
- Public doctor pages read from `public.public_doctor_profiles`, not from private profile tables.
- Patient data and appointment data are not publicly readable.
- Doctor license fields and verification review notes remain admin-only.
- Admin actions validate `profiles.role = 'admin'` in server actions and database functions.
- Service role usage was not found in frontend code.
- Real Supabase access tokens must be rotated if they were pasted into chat, logs, or shared tools.

## RLS And RPC Review Summary

- `profiles`, `patient_profiles`, `doctor_profiles`, `doctor_availability_rules`, `doctor_time_off`, `appointments`, `doctor_verification_reviews`, and `admin_audit_events` have RLS enabled.
- Booking and appointment status changes go through RPC wrappers that call `app_private` security-definer implementations with fixed `search_path`.
- Admin verification RPC wrappers call `app_private` implementations and now write admin audit events.
- Public wrappers expose only stable app APIs; privileged logic remains outside the exposed `public` schema.
- Direct appointment inserts are not granted to client roles.
- Public slot generation returns only available slots, not blocked time reasons or appointment details.

## Environment Variable Checklist

- Browser-safe:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL`
- Server-only or local CLI:
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_ACCESS_TOKEN`
  - `SUPABASE_DB_PASSWORD`
- Do not commit `.env.local`.
- Do not place service role keys, access tokens, database passwords, or private API keys in client components.
- Configure the browser-safe variables in Vercel before deploying previews.

## Static And Legal Pages

Created product placeholder pages:

- `/privacy`
- `/terms`
- `/consent`
- `/crisis-resources`

Each page includes this notice:

> This page is a product placeholder and should be reviewed by a qualified legal/compliance professional before launch.

These pages are not final legal documents and do not claim jurisdiction-specific compliance.

## Route Protection Checklist

- Public routes:
  - `/`
  - `/login`
  - `/register`
  - `/doctor/register`
  - `/doctors`
  - `/doctor/[id]`
  - `/privacy`
  - `/terms`
  - `/consent`
  - `/crisis-resources`
- Patient route:
  - `/patient/dashboard`
- Doctor routes:
  - `/doctor/dashboard`
  - `/doctor/dashboard/availability`
- Admin routes:
  - `/dashboard`
  - `/dashboard/doctors`
  - `/dashboard/doctors/[id]`

Protected pages use server-side role checks. Unauthenticated users redirect to `/login`; authenticated users are redirected to the correct dashboard when they attempt to access another role's dashboard.

## UI Polish Summary

- Added legal/static pages using calm card layouts and clear placeholder warnings.
- Added global not-found and error states with user-friendly copy.
- Added footer links for legal and crisis resource pages.
- Improved appointment copy around cancellation, status meaning, and doctor action expectations.
- Kept booking copy active, not "coming soon".
- Kept crisis warning near the booking message field.

## Deployment Readiness Checklist

1. Push code to GitHub.
2. Import the project into Vercel.
3. Add Vercel environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Do not add `SUPABASE_SERVICE_ROLE_KEY` unless a future server-only feature truly requires it.
5. Confirm build command:

```bash
npm run build
```

6. Confirm Supabase Auth redirect URLs:
   - local dev URL
   - Vercel preview URL
   - production domain
7. Review Supabase Auth rate limits, CAPTCHA/bot protection, email confirmation behavior, and allowed redirect domains.
8. Rotate or revoke any Supabase access token that was exposed outside a secure secret manager.
9. Test protected routes on preview deployment.

## Manual QA Checklist

- [ ] Public user can browse only approved/public doctors.
- [ ] Public user cannot access patient, doctor, or admin dashboards.
- [ ] Patient can book only their own appointment.
- [ ] Patient cannot see another patient's appointment.
- [ ] Doctor sees only their own appointments.
- [ ] Admin can approve/reject doctor applications.
- [ ] License number is admin-only.
- [ ] `/privacy` exists.
- [ ] `/terms` exists.
- [ ] `/consent` exists.
- [ ] `/crisis-resources` exists.
- [ ] Booking copy no longer says the feature is coming soon.
- [ ] No raw SQL errors are visible in user-facing UI.
- [ ] Mobile layout works for auth, directory, booking, dashboard, admin, and legal pages.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `supabase db lint --linked --fail-on error` passes if linked access is available.
- [ ] Vercel environment variables are documented and configured.
- [ ] Supabase access token is rotated/revoked if it was exposed.

## Known Limitations

- Legal/static pages are placeholders and need professional review.
- No payments, refunds, cancellation fees, or payment policy enforcement.
- No notifications or email delivery.
- No appointment detail page.
- No rescheduling flow.
- No support ticket workflow.
- No license document upload/review workflow.
- No final production compliance assessment has been completed.

## Recommended Next Phase

Phase 7 should focus on account/profile management and safe support workflows, or a dedicated production QA pass after Vercel preview deployment. Payments, chat, video, clinical notes, ratings, and reviews should remain separate future phases.
