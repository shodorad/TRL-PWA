# Build Tasks: Sign-In & Purchase Flow

Generated from: `.design/tracklynk-pwa/INFORMATION_ARCHITECTURE.md`  
Reference: `TRL-MUI` commit `64df85a5` (Raima Ghosh, 2026-05-05) — Login, ForgotPassword, VerifyEmail screens  
Date: 2026-05-05

---

## What was added in the MUI prototype (not yet in this PWA)

| MUI screen | PWA equivalent | Status |
|---|---|---|
| `Login` — "Welcome back" email+password sign-in | `/auth/sign-in` | **Missing — create** |
| `ForgotPassword` — reset link + animated sent state | `/auth/forgot-password` | **Missing — create** |
| `VerifyEmail` — 6-digit OTP with auto-advance | `/auth/verify-email` | **Missing — create** |
| `ChoosePlan` improvements — feature list, legal note, dynamic CTA | `/onboarding/choose-plan` | **Needs sync** |
| Auth screen "Sign in" link — routes to wrong page | `/auth/login` line 123 | **Bug — fix** |

---

## Foundation

- [ ] **Add 3 auth routes to the router**: In [src/routes/index.tsx](src/routes/index.tsx) under the `// ── Auth (public)` block, add lazy routes for `/auth/sign-in`, `/auth/forgot-password`, and `/auth/verify-email`. _Modifies existing file. No new components needed yet._

- [ ] **Expose email in AuthContext for OTP screen**: The `VerifyEmail` screen needs to display the masked email that was just registered. Add an `email` field (and setter) to [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx) so `sign-up` can write it and `verify-email` can read it. _Modifies existing file._

---

## Bug Fix

- [ ] **Fix broken "Sign in" link on Auth screen**: In [src/pages/authentication/login/index.tsx](src/pages/authentication/login/index.tsx) at line 123, `SignInLink` navigates to `/auth/sign-up` — it must navigate to `/auth/sign-in` instead. One-line fix. _Modifies existing file._

---

## New Screens

- [ ] **Build `/auth/sign-in` — "Welcome back" sign-in form**: Create `src/pages/authentication/sign-in/index.tsx`. Matches MUI `Login` page:
  - Heading "Welcome back", subtitle "Sign in to your account"
  - Email field + password field with show/hide toggle (eye icon from lucide-react)
  - Inline "Forgot password?" link beside the password label → `navigate('/auth/forgot-password')`
  - Primary "Sign in" CTA (`PrimaryButton` from `@/components/common/PrimaryButton`) above SSO divider
  - Apple + Google SSO buttons (reuse styled button pattern from `login/index.tsx`)
  - "Don't have an account? Sign up" row at bottom → `navigate('/auth/sign-up')`
  - Client-side email regex + non-empty password validation before navigation
  - Back button → `navigate(-1)`
  - _Creates new file. Reuses: `PrimaryButton`, `glassCard` tokens, MUI `Box/Typography/Button`, `framer-motion`._

- [ ] **Build `/auth/forgot-password` — Reset link with animated confirmation**: Create `src/pages/authentication/forgot-password/index.tsx`. Two-phase screen using `AnimatePresence`:
  - **Idle phase**: email input + "Send reset link" CTA button; back button top-left
  - **Sent phase** (after submit): animated envelope SVG with 3 pulsing opacity rings (`motion.div` keyframes), masked email display (mask all chars before `@` except first 2), "Resend" text link that re-shows the idle phase, "Back to sign in" link → `navigate('/auth/sign-in')`
  - No `next` route — all exits are either resend (back to idle) or sign-in link
  - _Creates new file. Reuses: `glassCard`, `PrimaryButton`, MUI styled components, `framer-motion AnimatePresence`._

- [ ] **Build `/auth/verify-email` — 6-digit OTP entry**: Create `src/pages/authentication/verify-email/index.tsx`. Matches MUI `VerifyEmail`:
  - 6 individual `<input>` boxes styled as glass tiles (not a single field)
  - **Auto-advance**: focus moves to next box on digit entry
  - **Paste support**: distributes pasted string across boxes starting at focused index
  - **Backspace**: clears current box and moves focus to previous
  - **Auto-submit**: fires navigation to `/onboarding/choose-plan` when all 6 digits are filled
  - 30-second resend cooldown: shows "Resend (30s)" countdown, becomes "Resend code" when expired
  - Reads masked email from `AuthContext` (set up in foundation task above)
  - Back button → `navigate(-1)`
  - _Creates new file. Reuses: `AuthContext`, `glassCard`, `framer-motion`, lucide-react icons._

---

## Purchase Flow Sync

- [ ] **Sync `/onboarding/choose-plan` with MUI improvements**: In [src/pages/onboarding/choose-plan/index.tsx](src/pages/onboarding/choose-plan/index.tsx), apply changes from MUI `ChoosePlan`:
  - Add feature list beneath the plan cards: Real-time GPS tracking · Speed & trip alerts · Geofence zones · Unlimited trip history · Multi-vehicle dashboard (5 items with check icons)
  - Make CTA label dynamic: `"Start for $9.65/mo"` (monthly) / `"Start for $7.99/mo"` (annual) — not a hardcoded string
  - Add legal caption below CTA: _"Your card won't be charged until setup is complete."_
  - Keep existing `PlanContext` write on selection (MUI uses `UserContext` — our PWA uses `PlanContext`, do not change that)
  - _Modifies existing file. Reuses: `PlanContext`, `PrimaryButton`, existing plan card layout._

---

## Wiring & Navigation

- [ ] **Wire sign-up → verify-email → choose-plan flow**: In [src/pages/authentication/sign-up/index.tsx](src/pages/authentication/sign-up/index.tsx), after form submit:
  1. Write `email` to `AuthContext` (new field from foundation task)
  2. Navigate to `/auth/verify-email` (currently goes to `/onboarding/choose-plan` directly — add OTP step in between)
  - The `verify-email` auto-submit will navigate to `/onboarding/choose-plan`
  - _Modifies existing file._

---

## Review

- [ ] **Design review**: Run `/design-review` against the brief and new screens.
