# Psynova

Mental health booking platform built with Next.js App Router, TypeScript, Tailwind CSS, HeroUI, shadcn/ui compatibility components, and Supabase.

Psynova is a booking and practice-management platform. It is not an emergency service and does not provide diagnosis, clinical notes, payments, chat, or video sessions in the current scope.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env.local
```

3. Fill in the browser-safe Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For the current Vercel production deployment, set:

```env
NEXT_PUBLIC_SITE_URL=https://psynova-phi.vercel.app
```

4. Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

Apply database migrations to your linked Supabase project:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

The migrations create profile, doctor directory, availability, appointment, admin verification, and admin audit structures with RLS policies and safe RPC wrappers.

Useful verification commands:

```bash
npm run lint
npm run build
supabase db lint --linked --fail-on error
```

For local database linting, start Supabase first:

```bash
supabase start
supabase db lint --local
```

## Environment Variables

Browser-safe variables:

- `NEXT_PUBLIC_SUPABASE_URL` - browser-safe Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - browser-safe anonymous key protected by RLS.
- `NEXT_PUBLIC_SITE_URL` - browser-safe site URL. Use `https://psynova-phi.vercel.app` for the current production deployment.

Server-only or local CLI variables:

- `SUPABASE_SERVICE_ROLE_KEY` is not needed for the current app flows. Never expose it to client components.
- `SUPABASE_ACCESS_TOKEN` is for local Supabase CLI automation only. Do not commit real tokens.
- `SUPABASE_DB_PASSWORD` is only needed for some linked CLI/database operations.

Never commit `.env.local` or real secrets. Rotate any access token that was pasted into chat, logs, commits, or shared screenshots.

## Vercel Deployment Notes

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Add Vercel environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL=https://psynova-phi.vercel.app`
4. Do not add `SUPABASE_SERVICE_ROLE_KEY` to Vercel unless a future server-only feature truly requires it.
5. Redeploy after changing any Vercel environment variable.
6. Use the default build command:

```bash
npm run build
```

7. In Supabase Auth settings, configure redirect URLs for:
   - `http://localhost:3000`
   - Vercel preview URLs
   - `https://psynova-phi.vercel.app`
8. Review Supabase Auth rate limits, CAPTCHA/bot protection, email confirmation, and allowed redirect domains before launch.
9. Test protected routes on the Vercel preview deployment.

## Project Structure

- `src/app`: App Router pages, layouts, and route-level UI.
- `src/components`: Reusable layout, legal/static, auth, doctor, appointment, admin, dashboard, and UI components.
- `src/lib`: Shared utilities, constants, validation, date formatting, and Supabase helpers.
- `src/lib/supabase`: Browser, server, and request proxy Supabase clients.
- `src/types`: Manual TypeScript database and domain types.
- `src/services`: Server actions and query modules for auth, doctors, availability, appointments, and admin operations.
- `supabase/migrations`: Database schema, triggers, grants, RLS policies, safe views, and RPC functions.
- `docs`: Phase-specific QA, security, and deployment checklists.

## Static Pages

The app includes product-ready placeholder pages for:

- `/privacy`
- `/terms`
- `/consent`
- `/crisis-resources`

These pages are not final legal documents. They must be reviewed by qualified legal/compliance professionals before launch.
