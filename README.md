# Psynova

Mental health booking platform built with Next.js App Router, TypeScript, Tailwind CSS, HeroUI, shadcn/ui compatibility components, and Supabase.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env.local
```

3. Fill in the public Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

4. Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

Apply the Phase 2 profile/auth migration to your Supabase project before testing registration:

```bash
supabase db push
```

If you are not linked to a remote project yet, run:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

The migration creates:

- `profiles`
- `patient_profiles`
- `doctor_profiles`
- RLS policies for patient, doctor, admin, and public approved doctor reads
- `updated_at` triggers
- an auth trigger that creates profile rows after Supabase Auth signup

## Project Structure

- `src/app`: App Router pages, layouts, and route-level UI.
- `src/components`: Reusable layout, shared, marketing, domain, and shadcn/ui components.
- `src/lib`: Shared utilities, environment helpers, and Supabase clients.
- `src/lib/supabase`: Browser, server, and request proxy Supabase helpers.
- `src/types`: Application and generated database types.
- `src/hooks`: Reusable React hooks for future client-side behavior.
- `src/services`: Auth and domain service modules.
- `supabase/migrations`: Database schema, triggers, grants, and RLS policies.

## Current Scope

Phase 2 includes authentication and role-based profile foundations. It intentionally does not include appointments, doctor availability, payments, video calls, chat, or admin management workflows.

Never commit `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code.
