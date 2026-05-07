---
name: mental-health-heroui-design-system
description: A project-specific UI/UX design system skill for building a professional mental health booking platform using Next.js, TypeScript, Tailwind CSS, HeroUI, Supabase, and Vercel.
version: 1.0.0
last_updated: 2026-05-07
recommended_filename: SKILL.md
project: Mental Health Booking Platform
stack: Next.js App Router, TypeScript, Tailwind CSS, HeroUI, Supabase, Vercel
---

# Mental Health Booking Platform — HeroUI Design System Skill

## 0. Purpose

This file is the design system reference for the Mental Health Booking Platform.

Any AI coding assistant working on this project must read this file before creating or modifying UI.

The goal is to prevent generic, empty, inconsistent, or unfinished interfaces. Every page must feel like part of one calm, trustworthy, professional healthcare product.

This project is not a colorful social app. It is a mental health booking platform where patients can find psychologists/psychiatrists, view profiles, select available times, and book sessions. The UI must reduce anxiety, communicate privacy, and help users complete booking safely and clearly.

## 1. Non-Negotiable Design Rules

1. Use HeroUI as the main component system.
2. Use Tailwind CSS for layout, spacing, responsive behavior, and light customization.
3. Do not create random custom components when HeroUI already provides a suitable accessible component.
4. Do not mix many UI libraries. HeroUI is the primary system.
5. Do not create blank placeholder pages.
6. Do not create ugly generic dashboards.
7. Do not use harsh colors, neon gradients, childish illustrations, or overdramatic medical imagery.
8. Do not make the app look like a hospital ERP system.
9. Do not make the app look like a social media platform.
10. Do not make patients feel exposed, judged, or rushed.
11. Use calm language, clear structure, and supportive microcopy.
12. Every page must be responsive.
13. Every clickable element must have a clear purpose.
14. Every form must have labels, helper text where needed, validation states, and friendly error messages.
15. Every route created must run without broken imports.
16. Every UI task must end with a design QA checklist.

## 2. Product Personality

The product should feel:

- Calm
- Trustworthy
- Human
- Private
- Professional
- Accessible
- Clean
- Warm without being childish
- Modern without being cold
- Medical without being scary

The product should not feel:

- Overly clinical
- Loud
- Salesy
- Dark and depressing
- Empty
- AI-generated
- Template-like
- Randomly decorated
- Overloaded with gradients
- Confusing

## 3. User Roles and Design Mindset

### 3.1 Patient

Patients may arrive stressed, unsure, embarrassed, or emotionally tired.

Design for them by:

- Making actions clear.
- Avoiding overwhelming dashboards.
- Showing privacy reassurance.
- Explaining booking steps simply.
- Avoiding heavy medical words unless needed.
- Reducing the number of choices per screen.
- Making important actions visible.
- Avoiding public exposure of sensitive data.

### 3.2 Doctor / Therapist

Doctors need a professional workspace.

Design for them by:

- Showing appointments clearly.
- Separating upcoming, completed, and cancelled sessions.
- Making availability management simple.
- Making profile completion visible.
- Avoiding messy admin-like layouts.
- Giving them clean cards, tables, filters, and actions.

### 3.3 Admin

Admin needs control, review, and safety.

Design for admin by:

- Using clear dashboards.
- Making verification status obvious.
- Separating review queues from general lists.
- Showing risk/warning states carefully.
- Avoiding destructive actions without confirmation.

## 4. Design Foundation

### 4.1 Main Visual Direction

Use a soft healthcare SaaS style.

Recommended style keywords:

- Soft white surfaces
- Warm off-white backgrounds
- Soft teal or blue primary accents
- Muted green success states
- Gentle amber warning states
- Minimal red danger states
- Rounded cards
- Clear typography
- Spacious layout
- Low visual noise
- Soft shadows
- Strong hierarchy

### 4.2 Preferred Color Direction

Use semantic color naming in code and UI reasoning.

Do not think in terms of “make this blue.” Think in terms of:

- primary: main action / brand action
- secondary: alternative action
- surface: card and panel backgrounds
- muted: helper text and secondary information
- success: confirmed/completed states
- warning: pending/attention states
- danger: cancellation/destructive/critical states
- info: neutral informative messages

### 4.3 Suggested Brand Palette

This palette is a starting point. It may be implemented with HeroUI theme variables and Tailwind utility classes.

#### Light Mode

| Token | Suggested value | Usage |
|---|---:|---|
| background | #F7FAF9 | Main app background |
| foreground | #14213D | Main text |
| surface | #FFFFFF | Cards, forms, panels |
| surface-soft | #F0F7F6 | Soft section backgrounds |
| surface-muted | #EEF4F2 | Dashboard blocks |
| primary | #2F8F83 | Main CTA, active nav, selected states |
| primary-hover | #27786F | Primary hover |
| primary-soft | #DFF3EF | Badges, subtle highlights |
| secondary | #5B7C99 | Secondary actions |
| accent | #8FA7FF | Small decorative accent only |
| success | #2E9D68 | Confirmed/completed |
| success-soft | #E6F6EE | Confirmed badges/cards |
| warning | #B7791F | Pending/attention |
| warning-soft | #FFF4D8 | Pending badges/cards |
| danger | #C94A4A | Cancel/destructive |
| danger-soft | #FDEAEA | Error backgrounds |
| border | #DDE7E4 | Borders/dividers |
| muted | #64748B | Secondary text |
| muted-light | #94A3B8 | Captions/metadata |

#### Dark Mode

Dark mode is optional in MVP. If implemented, keep it calm and readable.

| Token | Suggested value | Usage |
|---|---:|---|
| background | #0F172A | Main background |
| foreground | #E5F0EF | Main text |
| surface | #111C2E | Cards |
| surface-soft | #17243A | Panels |
| primary | #63C8BD | Main CTA |
| primary-soft | #123D3A | Subtle highlight |
| border | #26364D | Dividers |
| muted | #A8B3C5 | Secondary text |
| danger | #F18B8B | Danger states |

### 4.4 Color Usage Rules

1. Primary color is for the main user action only.
2. Each screen should have one visually dominant CTA.
3. Danger red must only be used for destructive or critical actions.
4. Warning amber must only be used for attention/pending state.
5. Success green must only be used for confirmed/completed/verified states.
6. Do not use more than two accent colors on the same screen.
7. Do not use gradients as the main design language.
8. If using gradients, keep them subtle and only in hero background or decorative blobs.
9. Maintain strong text contrast.
10. Never put low-contrast text on colored backgrounds.

## 5. Typography

### 5.1 Font Direction

Use a clean modern sans-serif font.

Recommended options:

- Inter
- Geist Sans
- Manrope
- DM Sans

Use one font family across the platform unless a strong reason exists.

### 5.2 Type Scale

Use a simple scale.

| Purpose | Size | Weight | Tailwind example |
|---|---:|---:|---|
| Hero heading | 48–64px | 700–800 | text-5xl md:text-6xl font-bold |
| Page heading | 32–44px | 700 | text-3xl md:text-4xl font-bold |
| Section heading | 24–32px | 650–700 | text-2xl md:text-3xl font-semibold |
| Card title | 18–22px | 600–700 | text-lg md:text-xl font-semibold |
| Body | 15–17px | 400–500 | text-base |
| Small/helper | 13–14px | 400–500 | text-sm |
| Caption | 12–13px | 400–500 | text-xs |

### 5.3 Typography Rules

1. Headings should be short and clear.
2. Avoid long all-caps labels.
3. Use max-width for paragraphs, usually `max-w-2xl` or `max-w-3xl`.
4. Body text should use comfortable line height: `leading-7` for long paragraphs.
5. Card titles must not compete with page headings.
6. Dashboard numbers may be larger, but should not become flashy.
7. Use text hierarchy before adding decoration.

## 6. Spacing and Layout

### 6.1 Layout Widths

Use consistent containers.

| Layout | Tailwind direction |
|---|---|
| Marketing pages | `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` |
| Form pages | `mx-auto max-w-md px-4` |
| Doctor profile | `mx-auto max-w-6xl px-4 sm:px-6 lg:px-8` |
| Dashboards | `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` |
| Reading/legal pages | `mx-auto max-w-3xl px-4` |

### 6.2 Section Spacing

| Area | Desktop | Mobile |
|---|---:|---:|
| Hero top/bottom | 96–128px | 56–80px |
| Normal section | 72–96px | 48–64px |
| Dashboard block gap | 24–32px | 16–24px |
| Card padding | 24–32px | 16–24px |
| Form field gap | 16–20px | 14–16px |

### 6.3 Layout Rules

1. Use generous whitespace.
2. Do not fill every area with content.
3. Use cards for grouped decisions, not for every small text line.
4. Use grids for doctor cards and dashboard summaries.
5. Use vertical rhythm: headings, descriptions, actions, then content.
6. Mobile first: layout must stack naturally.
7. Important CTAs should remain visible without creating sticky clutter.

## 7. Border Radius and Shadows

### 7.1 Radius

Use rounded, soft shapes.

| Element | Radius |
|---|---:|
| Buttons | 999px or 12–16px depending on HeroUI style |
| Cards | 20–28px |
| Inputs | 12–16px |
| Modals | 24–28px |
| Badges | 999px |
| Avatars | circular |
| Dashboard panels | 20–24px |

### 7.2 Shadows

Use soft shadows only.

Recommended classes:

- `shadow-sm`
- `shadow-md`
- `shadow-[0_20px_60px_rgba(15,23,42,0.08)]`

Do not use harsh black shadows.

### 7.3 Borders

Use subtle borders:

- `border border-slate-200/70`
- `border border-black/5`
- `border border-white/60` on soft backgrounds

Do not use heavy dark borders unless building a focused admin table.

## 8. HeroUI Usage Rules

### 8.1 General

Use HeroUI components where available.

Common components for this project:

- Button
- Link
- Card
- Surface
- Input
- TextField
- TextArea
- Label
- Description
- FieldError
- Form
- Select
- Autocomplete
- Checkbox
- RadioGroup
- Switch
- Tabs
- Badge / Chip
- Avatar
- Modal
- Drawer
- Dropdown
- Tooltip
- Table
- Pagination
- Skeleton
- Spinner
- Toast
- Alert / AlertDialog
- Calendar / DatePicker / TimeField if appropriate

### 8.2 Component Selection Rules

| Need | Prefer |
|---|---|
| Main action | Button variant primary |
| Secondary action | Button variant secondary/outline |
| Cancel action | Button variant tertiary/ghost |
| Destructive action | Button variant danger + confirmation |
| Content grouping | Card |
| Dashboard area | Card or Surface |
| Doctor listing | Card grid |
| Doctor details | Card + sections |
| Search doctors | SearchField or Input |
| Specialty filter | Select or Autocomplete |
| Appointment list | Table on desktop, cards on mobile |
| Booking confirmation | Modal or dedicated page |
| Important warning | Alert |
| Delete/cancel booking | AlertDialog/Modal confirmation |
| Loading data | Skeleton first, Spinner for small actions |
| Global feedback | Toast |

### 8.3 Button Rules

1. Every screen should have one primary action.
2. Primary button text should be action-oriented.
3. Avoid vague labels like “Submit” unless context is obvious.
4. Good examples:
   - Book session
   - View availability
   - Complete profile
   - Save availability
   - Confirm booking
   - Send verification request
5. Bad examples:
   - Click here
   - Go
   - Submit now!!!
   - Continue!!!
6. Loading buttons must show loading state and prevent duplicate submission.
7. Destructive buttons must be visually and semantically danger.
8. Button groups must place primary action on the right in forms/modals unless mobile layout requires stacking.

### 8.4 Card Rules

Use cards to group information.

Doctor card must include:

- Doctor avatar or initials
- Full name
- Specialty
- Short bio or focus areas
- Price or “from” price if available
- Session type: online / in-person / both
- Availability indicator
- Rating/reviews only if real data exists
- CTA: View profile or Book session

Do not invent fake ratings if the database does not support reviews yet.

### 8.5 Form Rules

Forms are critical because patients trust the platform with sensitive information.

Every form must include:

- Clear title
- Short description
- Proper label for every field
- Placeholder as example only, not a replacement for label
- Helper text for sensitive fields
- Inline validation messages
- Friendly error states
- Submit loading state
- Disabled state while submitting
- Success feedback after completion

Never ask for unnecessary mental health details during simple account creation.

### 8.6 Modal Rules

Use modals only when the user needs focused action.

Good modal use cases:

- Confirm booking
- Cancel appointment
- Request doctor verification
- Add availability slot
- Show short privacy note

Bad modal use cases:

- Full doctor profile
- Long terms page
- Large appointment history
- Complex multi-step onboarding

### 8.7 Table Rules

Use tables for admin and doctor dashboards on desktop.

For mobile:

- Convert table rows to stacked cards.
- Keep actions visible.
- Do not create horizontally overflowing tables unless absolutely necessary.

Table columns must be useful. Avoid dumping raw database fields.

## 9. Page-Level Design Specifications

## 9.1 Landing Page `/`

### Purpose

Explain the platform and push patients toward booking while also giving doctors a path to join.

### Required Sections

1. Navbar
2. Hero section
3. Trust signals
4. How it works
5. Featured doctors preview
6. Session types
7. Privacy/support section
8. Doctor CTA section
9. FAQ preview
10. Footer

### Hero Section Rules

Hero must include:

- Clear headline
- Short supportive paragraph
- Primary CTA: Book a session
- Secondary CTA: For doctors
- Optional trust indicators
- Soft visual card on the side: booking preview, doctor card, or appointment card

Example headline direction:

> Find the right mental health professional and book a session with confidence.

Example supporting copy:

> Browse verified professionals, compare availability, and choose a session time that works for you. Your privacy and comfort come first.

Do not write:

> Cure your anxiety today.

Do not promise outcomes.

### Landing Page Visual Requirements

- Use warm background.
- Use subtle abstract shapes only if they do not distract.
- Use real layout, not empty hero with one button.
- Use cards to preview the product.
- Use icons sparingly.
- Keep copy human and simple.

## 9.2 Login Page `/login`

### Purpose

Allow returning users to access their account.

### Required UI

- Centered card layout
- Logo/brand
- Title: Welcome back
- Email field
- Password field
- Forgot password link placeholder if not implemented
- Login button
- Link to register
- Privacy reassurance line

### Rules

1. The page must not look empty.
2. The login form must be accessible.
3. The design must stay calm.
4. Show clear error messages.
5. Do not expose whether a specific email exists if implementing real auth.

## 9.3 Register Page `/register`

### Purpose

Allow patient registration and route doctors to doctor onboarding.

### Required UI

- Patient registration form
- Name
- Email
- Password
- Confirm password if needed
- Role-aware copy: “Looking to join as a doctor?” link to `/doctor/register`
- Terms/privacy acknowledgement if implemented

### Rules

1. Default register path is patient.
2. Doctors should use doctor onboarding, not normal patient registration.
3. Do not collect sensitive mental health data at registration.

## 9.4 Doctors Listing `/doctors`

### Purpose

Help patients find a suitable professional.

### Required UI

- Page title and short intro
- Search field
- Specialty filter
- Session type filter
- Price range placeholder if not implemented
- Availability filter placeholder if not implemented
- Doctor card grid
- Empty state
- Loading skeleton

### Doctor Card Fields

- Avatar / initials
- Name
- Specialty
- Short bio
- Languages if available
- Session type
- Price
- Next available slot if available
- CTA: View profile
- Secondary CTA: Book session if direct booking is ready

### Rules

1. Filters must not look broken if backend is not ready.
2. Use local static seed data only for UI preview if database is not ready.
3. Clearly mark preview data as temporary in code comments, not in UI.
4. Do not invent medical credentials.

## 9.5 Doctor Profile `/doctor/[id]`

### Purpose

Give the patient enough information to decide and book.

### Required UI

- Doctor profile header
- Avatar/photo
- Name
- Specialty
- Credentials/years if real data exists
- Bio
- Focus areas
- Session types
- Price
- Languages
- Availability panel
- Booking CTA
- Privacy note

### Layout

Desktop:

- Left/main: doctor info and sections
- Right/sticky panel: booking card

Mobile:

- Stacked sections
- Booking CTA near top and bottom

### Rules

1. Do not show sensitive patient data on this page.
2. Do not show unverified doctors as fully verified.
3. Do not use fake reviews unless review feature exists.

## 9.6 Patient Dashboard `/patient/dashboard`

### Purpose

Let patient manage their bookings.

### Required UI

- Welcome header
- Next appointment card
- Upcoming appointments
- Past sessions
- Recommended action: browse doctors / book again
- Profile completion card if needed

### Rules

1. Keep it simple.
2. Do not show unnecessary health history.
3. Protect privacy with careful copy.
4. Use empty states when no bookings exist.

## 9.7 Doctor Dashboard `/doctor/dashboard`

### Purpose

Let doctor manage appointments and profile.

### Required UI

- Today’s sessions
- Upcoming appointments
- Availability summary
- Profile status
- Verification status
- Quick actions

### Quick Actions

- Edit profile
- Manage availability
- View bookings
- Request verification if applicable

### Rules

1. Appointment status must be visible.
2. Patient details must be minimal in lists.
3. Sensitive session notes must not appear unless a secure notes feature is intentionally implemented.

## 9.8 Admin Dashboard `/dashboard` or `/admin/dashboard`

### Purpose

Manage platform operations.

### Required UI

- Overview cards
- Doctors pending verification
- Recent bookings
- User management preview
- Safety/issue reports if implemented

### Rules

1. Admin actions must be clear.
2. Destructive actions need confirmation.
3. Use tables carefully.
4. Do not expose secrets or raw auth details.

## 9.9 Doctor Registration `/doctor/register`

### Purpose

Let doctors apply to join.

### Required UI

- Professional onboarding page
- Step-like sections if full wizard not ready
- Basic info
- Professional details
- Session settings
- Documents upload placeholder if storage not ready
- Submit application CTA

### Rules

1. Do not allow doctors to appear publicly until approved/verified if the architecture requires verification.
2. Explain review process calmly.
3. Use secure upload handling once backend is implemented.

## 10. Navigation System

### 10.1 Navbar

Navbar must include:

- Logo/brand
- Doctors link
- How it works link or anchor
- For doctors link
- Login
- Register / Book session CTA

Desktop:

- Horizontal navigation
- Primary CTA on right

Mobile:

- Drawer or menu
- Large tap targets
- No hidden critical action

### 10.2 Footer

Footer must include:

- Brand summary
- Product links
- For doctors
- Privacy
- Terms
- Contact placeholder
- Disclaimer: platform is for booking professionals, not emergency support

## 11. UI Copywriting Rules

### 11.1 Tone

Use supportive, clear, non-judgmental copy.

Good:

- “Choose a professional and time that feels right for you.”
- “Your booking details are private.”
- “You can review the session details before confirming.”

Bad:

- “Fix your mental problems now.”
- “Best doctors guaranteed.”
- “Cure depression fast.”
- “Don’t worry, everything will be fine.”

### 11.2 Medical Claims

Never make medical claims unless legally and clinically verified.

Avoid:

- Guaranteed results
- Cure promises
- Diagnosis statements
- Emergency treatment claims
- Replacing professional advice

Use safer language:

- “connect with licensed professionals”
- “book a session”
- “professional support”
- “private appointment management”

### 11.3 Emergency Disclaimer

Footer or relevant help page should include:

> This platform helps users book appointments with mental health professionals. It is not an emergency service. If you are in immediate danger or experiencing a crisis, contact local emergency services immediately.

## 12. Accessibility Rules

1. Use semantic HTML.
2. Use HeroUI accessible components where possible.
3. Every form field must have a label.
4. Do not rely on color alone to communicate state.
5. Use visible focus states.
6. Maintain good contrast.
7. Use keyboard-accessible navigation.
8. Modals must trap focus and provide close actions.
9. Images must have meaningful alt text or empty alt for decorative images.
10. Loading states should be announced when possible.
11. Error messages should be linked to fields where appropriate.
12. Avoid motion-heavy UI.
13. Respect reduced motion if adding animations.

## 13. Responsive Design Rules

### 13.1 Breakpoints

Use Tailwind defaults unless project config changes.

- Mobile: default
- sm: small screens
- md: tablets
- lg: laptops
- xl: desktop
- 2xl: large desktop

### 13.2 Mobile Rules

1. One column layout.
2. Large tap targets.
3. Avoid tiny filters.
4. Convert sidebars to drawers or top sections.
5. Appointment cards should be stacked.
6. Booking CTA should be easy to find.
7. Do not use wide tables on mobile.
8. Avoid fixed elements that cover content.

### 13.3 Desktop Rules

1. Use two-column layouts for detail pages.
2. Use grids for doctor cards.
3. Use tables for admin/doctor dense data.
4. Keep dashboard max width readable.

## 14. State Design

Every async page or component must handle:

- Loading
- Empty
- Error
- Success
- Disabled
- Unauthorized
- Not found

### 14.1 Loading

Use Skeleton for page/content loading.

Use Spinner for small inline actions.

Do not show a blank screen.

### 14.2 Empty State

Empty states must include:

- Friendly title
- Helpful description
- One recommended action

Example:

> No appointments yet  
> When you book a session, it will appear here.  
> [Find a doctor]

### 14.3 Error State

Error states must:

- Explain what happened simply.
- Avoid blaming user.
- Provide retry or navigation action.

Example:

> We couldn’t load your appointments right now. Please try again.

### 14.4 Unauthorized State

If user is not logged in:

- Show login CTA.
- Explain that dashboard requires authentication.
- Do not show private layout with empty data.

### 14.5 Not Found State

For missing doctor profile:

- Explain that profile is unavailable.
- Provide back to doctors page CTA.

## 15. Booking Flow UI

### 15.1 Ideal Booking Steps

1. Patient visits `/doctors`.
2. Patient filters/searches doctors.
3. Patient opens doctor profile.
4. Patient selects session type.
5. Patient selects available date/time.
6. Patient reviews summary.
7. Patient confirms booking.
8. Patient sees confirmation.
9. Doctor sees booking in dashboard.

### 15.2 Booking UI Requirements

Booking card must show:

- Doctor name
- Session type
- Selected date
- Selected time
- Duration
- Price if implemented
- Privacy note
- Confirm CTA

### 15.3 Booking Confirmation

Confirmation screen/card must show:

- Success state
- Appointment details
- Next steps
- Dashboard CTA
- Optional calendar placeholder if not implemented

### 15.4 Cancellation UI

Cancellation must use danger state and confirmation.

Copy must be calm:

> Are you sure you want to cancel this appointment? The doctor will be notified.

Do not use aggressive language.

## 16. Dashboard Patterns

### 16.1 Dashboard Header

Include:

- Role-specific greeting
- Short context line
- Main action

Patient:

> Your care, in one private place.

Doctor:

> Manage today’s sessions and upcoming appointments.

Admin:

> Review platform activity and pending approvals.

### 16.2 Stats Cards

Stats cards should include:

- Label
- Number/value
- Small explanation
- Icon optional

Do not overload with fake analytics.

### 16.3 Appointment Cards

Appointment cards must include:

- Date/time
- Other party name
- Status
- Session type
- Action buttons

Status badges:

- confirmed: success
- pending: warning
- cancelled: danger/neutral depending context
- completed: muted/success

## 17. Doctor Profile Design Pattern

Doctor profile must communicate trust.

Sections:

1. Header card
2. About
3. Focus areas
4. Session details
5. Availability
6. Booking panel
7. Privacy note

Do not overuse icons. Use structure and spacing.

## 18. Search and Filtering Design

### 18.1 Doctors Page Filter Bar

Filter bar should include:

- Search by name/specialty
- Specialty dropdown
- Session type dropdown
- Availability dropdown
- Price placeholder only if supported

### 18.2 Filter Rules

1. Filters should be easy to reset.
2. Use chips to show active filters when possible.
3. Empty result should tell user to adjust filters.
4. Filters should collapse or stack on mobile.

## 19. Images and Illustrations

### 19.1 Image Style

Use:

- Soft abstract shapes
- Neutral professional portraits if real doctors are available
- Clean healthcare illustrations sparingly

Avoid:

- Sad stock photos
- Crying people
- Hospital emergency photos
- Overly happy fake stock images
- Cartoonish mental health clichés

### 19.2 Doctor Avatars

If no real image:

- Use initials avatar.
- Use calm background colors.
- Do not use random AI-generated doctor portraits unless explicitly requested.

## 20. Iconography

Use one icon library consistently.

Recommended:

- lucide-react

Rules:

1. Icons support text; they do not replace labels.
2. Use stroke icons, not filled mixed styles.
3. Keep icon sizes consistent: 16, 20, 24.
4. Avoid decorative icon overload.

## 21. Animation and Motion

Animations should be subtle.

Allowed:

- Hover lift on cards
- Fade/slide for sections
- Soft modal transitions
- Button loading state

Avoid:

- Bouncy animations
- Fast flashing transitions
- Heavy parallax
- Overanimated hero sections

If using Framer Motion:

- Respect reduced motion.
- Keep duration between 150–300ms.
- Do not animate essential content in a way that blocks reading.

## 22. Implementation Rules for AI Assistants

### 22.1 Before Building Any UI

The AI must answer internally:

1. What user role is this screen for?
2. What is the primary action?
3. What secondary actions exist?
4. What data is sensitive?
5. What loading/empty/error states are needed?
6. What HeroUI components fit this screen?
7. What responsive layout is needed?
8. What accessibility concerns exist?

### 22.2 While Building

The AI must:

1. Use reusable components.
2. Keep components small and meaningful.
3. Avoid repeated layout code.
4. Use TypeScript types.
5. Avoid unused imports.
6. Avoid dead code.
7. Avoid TODOs unless explicitly requested.
8. Make route links work.
9. Make all created pages compile.
10. Keep UI consistent with this design system.

### 22.3 After Building

The AI must report:

1. Files created/changed.
2. Components used.
3. Routes affected.
4. How to run/test.
5. Design checklist result.
6. Any known limitations.
7. Recommended next step.

## 23. Component Architecture

### 23.1 Recommended Folder Structure

```txt
src/
  app/
    (marketing)/
    (auth)/
    (dashboard)/
    doctors/
    doctor/
    globals.css
    layout.tsx
    providers.tsx
  components/
    layout/
      navbar.tsx
      footer.tsx
      mobile-nav.tsx
    marketing/
      hero-section.tsx
      trust-section.tsx
      how-it-works.tsx
      featured-doctors.tsx
      session-types.tsx
      cta-section.tsx
      faq-preview.tsx
    doctors/
      doctor-card.tsx
      doctor-filter-bar.tsx
      doctor-profile-header.tsx
      availability-panel.tsx
      booking-summary-card.tsx
    dashboard/
      dashboard-header.tsx
      stat-card.tsx
      appointment-card.tsx
      appointment-table.tsx
      empty-state.tsx
    auth/
      login-form.tsx
      register-form.tsx
      doctor-register-form.tsx
    shared/
      page-shell.tsx
      section-header.tsx
      status-badge.tsx
      form-error.tsx
      loading-skeleton.tsx
      privacy-note.tsx
  lib/
    supabase/
    utils.ts
    constants.ts
  types/
    doctor.ts
    appointment.ts
    user.ts
  data/
    demo-doctors.ts
```

### 23.2 Naming Rules

1. Components use PascalCase.
2. Files use kebab-case.
3. Types use PascalCase.
4. Utility functions use camelCase.
5. Avoid vague names like `Box`, `Thing`, `Section1`, `Card2`.

Good:

- `DoctorCard`
- `AppointmentStatusBadge`
- `BookingSummaryCard`
- `DoctorFilterBar`

Bad:

- `CoolCard`
- `MainComponent`
- `UIBox`
- `NewDesign`

## 24. HeroUI Theming Guidance

HeroUI v3 uses Tailwind CSS v4 and CSS variables for theming.

### 24.1 Theme Setup Direction

The app root should apply background and foreground colors globally.

Example direction:

```tsx
<html lang="en" className="light" data-theme="light">
  <body className="bg-background text-foreground">
    {children}
  </body>
</html>
```

If dark mode is added, use a proper theme provider such as `next-themes` and avoid hydration issues.

### 24.2 CSS Variable Direction

Design tokens should live in global CSS or a theme file.

Suggested structure:

```txt
src/app/globals.css
src/styles/theme.css
```

Use semantic tokens. Do not scatter raw hex colors everywhere.

Acceptable:

```tsx
<div className="bg-background text-foreground" />
<Card className="border border-border/70 bg-surface" />
```

Avoid:

```tsx
<div className="bg-[#f7faf9] text-[#14213d]" />
```

Raw hex may be used inside theme definitions, not across components.

## 25. Supabase-Aware UI Rules

This design system focuses on UI, but the UI must respect backend security.

1. Never display private patient data unless the role is allowed.
2. Patient dashboard shows only the logged-in patient’s data.
3. Doctor dashboard shows only that doctor’s appointments.
4. Admin dashboard must be protected.
5. UI should not rely on hidden buttons as security.
6. RLS and backend policies must enforce access.
7. Do not expose Supabase service role key.
8. Do not put secrets in client components.
9. Use clear unauthorized states.
10. Avoid leaking IDs or private notes in public pages.

## 26. Mental Health Safety UI Rules

This platform is for booking, not emergency treatment.

The UI must not:

- Provide diagnosis.
- Provide crisis counseling.
- Replace emergency services.
- Promise medical outcomes.
- Encourage users to delay urgent help.

Pages that mention care/support should include safe, neutral language.

If a crisis/emergency feature is added later, it must be handled as a separate safety workflow.

## 27. Page Templates

### 27.1 Marketing Section Template

Every marketing section should follow:

1. Small eyebrow label optional.
2. Strong heading.
3. Short description.
4. Visual content/cards.
5. CTA if needed.

### 27.2 Form Page Template

Every form page should follow:

1. Centered container.
2. Brand/logo.
3. Card.
4. Title.
5. Description.
6. Fields.
7. Primary button.
8. Secondary link.
9. Privacy/security note.

### 27.3 Dashboard Page Template

Every dashboard page should follow:

1. Dashboard shell.
2. Header.
3. Summary cards.
4. Main content grid.
5. Empty/loading/error states.
6. Role-specific quick actions.

### 27.4 Detail Page Template

Every detail page should follow:

1. Back link.
2. Header card.
3. Main content sections.
4. Sidebar or action panel.
5. Mobile stacked layout.

## 28. Status Badge System

Use consistent statuses.

| Status | Meaning | Visual direction |
|---|---|---|
| verified | Doctor approved | success-soft |
| pending_verification | Waiting admin review | warning-soft |
| rejected | Doctor rejected | danger-soft |
| available | Booking available | success-soft |
| unavailable | No slots | muted |
| confirmed | Appointment confirmed | success-soft |
| pending | Appointment pending | warning-soft |
| cancelled | Appointment cancelled | danger-soft or muted |
| completed | Appointment completed | muted/success-soft |

Rules:

1. Status must use text and color.
2. Avoid icon-only status.
3. Do not use red for neutral unavailable states.
4. Keep badge labels human-readable.

## 29. Privacy Notes

Use small privacy notes near sensitive flows.

Examples:

- Login/register: “Your account is protected. Booking details are only visible to authorized users.”
- Booking panel: “Your booking details are private and only shared with the selected professional.”
- Doctor onboarding: “Your profile will be reviewed before appearing publicly.”

Do not overdo privacy notes on every card.

## 30. Error Message Style

Use calm, actionable errors.

Good:

- “We couldn’t save your changes. Please try again.”
- “Please choose an available time before confirming.”
- “This session time is no longer available. Please select another slot.”

Bad:

- “Error!!!”
- “Invalid request.”
- “Failed.”
- “You did something wrong.”

## 31. Do Not Invent Data

AI must not invent:

- Doctor licenses
- Real names of doctors
- Medical claims
- Real ratings
- Real patient stories
- Real certifications
- Emergency contact information unless provided

Use neutral demo data for UI only.

Demo data names should be generic and clearly fake in code.

## 32. MVP Visual Quality Bar

A page is acceptable only if:

1. It has a clear purpose.
2. It has consistent spacing.
3. It uses the design tokens.
4. It works on mobile.
5. It has loading/empty/error thinking where relevant.
6. It uses HeroUI components correctly.
7. It does not look like a default scaffold.
8. It does not contain broken links.
9. It does not contain unfinished TODOs.
10. It matches mental health product tone.

## 33. Anti-Patterns

Never do these:

1. Blank placeholder page with only title.
2. Random gradient background everywhere.
3. Five different button styles on one page.
4. Fake testimonial claims.
5. Fake medical credentials.
6. Dashboard with unreadable tables.
7. Mobile pages with horizontal overflow.
8. Input without label.
9. Error message without recovery action.
10. Destructive action without confirmation.
11. Public page showing private data.
12. Using red as decoration.
13. Using AI-looking generic copy.
14. Mixing shadcn, HeroUI, MUI, and custom UI randomly.
15. Hardcoding colors in every component.
16. Using emojis in professional healthcare UI unless explicitly requested.
17. Overusing icons.
18. Making cards too dense.
19. Using tiny text for important information.
20. Hiding primary actions below too much content.

## 34. Quality Checklist for Every AI UI Task

Before finishing, the AI must verify:

### Design

- [ ] Page looks professional and polished.
- [ ] Visual style matches mental health booking platform.
- [ ] Layout is not empty or generic.
- [ ] Spacing is consistent.
- [ ] Color usage follows semantic rules.
- [ ] Typography hierarchy is clear.

### UX

- [ ] Primary action is obvious.
- [ ] Secondary actions are not competing.
- [ ] Navigation works.
- [ ] Empty states exist where relevant.
- [ ] Loading states exist where relevant.
- [ ] Error states are friendly.

### Accessibility

- [ ] Forms have labels.
- [ ] Buttons have clear text.
- [ ] Color is not the only signal.
- [ ] Focus states are preserved.
- [ ] Images have alt text or are decorative.
- [ ] Modal/dialog usage is accessible.

### Code

- [ ] TypeScript compiles.
- [ ] No broken imports.
- [ ] No unused imports.
- [ ] Reusable components used.
- [ ] No secrets in client code.
- [ ] No unfinished TODOs.
- [ ] `npm run dev` should work.

### Security/Privacy

- [ ] No private patient data on public pages.
- [ ] Role-specific pages are designed as protected.
- [ ] No service role key in frontend.
- [ ] No fake clinical claims.

## 35. Recommended AI Prompt Prefix

Use this at the start of every future prompt:

```text
Before writing code, read and follow `mental_health_design_system_skill.md` / `SKILL.md` as the mandatory design system reference.

Use HeroUI as the primary UI component system, Tailwind CSS for layout and styling, and keep the interface calm, professional, responsive, accessible, and suitable for a mental health booking platform.

Do not create blank placeholder pages. Do not create generic UI. Do not invent medical data or claims. Make sure all routes, imports, buttons, and navigation work.

At the end, include a short design QA checklist confirming that the result follows the design system.
```

## 36. Prompt Pattern for Building a Page

```text
Build the [PAGE NAME] page for the Mental Health Booking Platform.

Read and follow the project architecture file and the design system skill file first.

Route: [ROUTE]
Primary user role: [PATIENT / DOCTOR / ADMIN / PUBLIC]
Primary action: [ACTION]
Secondary actions: [ACTIONS]
Data source: [DEMO DATA / SUPABASE / MOCKED UNTIL BACKEND]

Requirements:
- Use HeroUI components where suitable.
- Use Tailwind CSS for layout.
- Follow the design tokens, spacing, typography, and accessibility rules from the design skill.
- Include loading, empty, and error states if the page depends on data.
- Make it fully responsive.
- Avoid fake medical claims and fake credentials.
- Ensure all links and buttons work.
- Ensure code compiles with no broken imports.

Return:
1. Files created/changed.
2. Full code.
3. How to test.
4. Design QA checklist.
```

## 37. Prompt Pattern for Improving Existing UI

```text
Review and improve the existing UI for [PAGE/COMPONENT].

Use the design system skill file as the source of truth.

Goals:
- Make the design more professional, calm, and trustworthy.
- Keep HeroUI as the primary component system.
- Improve spacing, hierarchy, responsiveness, and accessibility.
- Do not change business logic unless required.
- Do not break existing routes or imports.
- Do not add fake medical claims.

Before editing, identify the main UX/design problems.
After editing, list what improved and confirm the QA checklist.
```

## 38. Prompt Pattern for Creating Components

```text
Create a reusable component named [COMPONENT NAME] for the Mental Health Booking Platform.

Follow the design system skill file.
Use HeroUI components where suitable.
Use TypeScript props.
Use semantic variant names where needed.
Make it responsive and accessible.
Do not hardcode random colors; use design tokens or Tailwind semantic classes.

Component purpose:
[DESCRIBE PURPOSE]

States required:
- default
- loading if needed
- empty if needed
- error if needed
- disabled if needed

Return the component code and example usage.
```

## 39. HeroUI AI Resources

When using an AI coding environment that supports external docs, provide these references:

- HeroUI React docs: `https://heroui.com/docs/react/getting-started`
- HeroUI React LLM docs: `https://heroui.com/react/llms.txt`
- HeroUI React full LLM docs: `https://heroui.com/react/llms-full.txt`
- HeroUI components docs: `https://heroui.com/docs/react/components`
- HeroUI theming docs: `https://heroui.com/docs/react/getting-started/theming`
- HeroUI styling docs: `https://heroui.com/docs/react/getting-started/styling`
- HeroUI agent skills docs: `https://heroui.com/docs/react/getting-started/agent-skills`

If the tool supports HeroUI skills, install or reference the official HeroUI React skill.

Recommended command from HeroUI docs:

```bash
curl -fsSL https://heroui.com/install | bash -s heroui-react
```

Alternative if skills package is supported:

```bash
npx skills add heroui-inc/heroui
```

If using Cursor docs:

```text
@Docs https://heroui.com/react/llms-full.txt
```

## 40. AGENTS.md Integration Snippet

Add this to the root `AGENTS.md` if using a coding agent:

```md
# Project UI Instructions

This project is a Mental Health Booking Platform built with Next.js, TypeScript, Tailwind CSS, HeroUI, Supabase, and Vercel.

Before creating or modifying UI, read:

- `mental_health_design_system_skill.md` or `skills/mental-health-heroui-design-system/SKILL.md`
- the main project architecture Markdown file

HeroUI is the primary component system. Tailwind CSS is used for layout and customization. All UI must be calm, professional, responsive, accessible, and suitable for a mental health booking platform.

Do not create blank placeholder pages. Do not invent medical claims, doctor credentials, patient stories, or fake ratings. Do not expose private data. Do not expose secrets in client code.
```

## 41. Final Rule

If there is a conflict between speed and design quality, choose design quality.

If there is a conflict between design and privacy, choose privacy.

If there is a conflict between visual creativity and patient trust, choose patient trust.

If the AI is unsure, it should build the simplest calm professional version that works, compiles, and follows this skill.

