# TrackLynk Lite — TRL-PWA Project Overview

> One-stop end-to-end orientation for a designer-who-codes joining the project.
> Last grounded against source on **2026-05-06**.
> If anything below disagrees with the code, **the code wins** — file an issue and we'll update this doc.

---

## 0. Read this first — doc-map and what to ignore

This repo has accumulated five "source of truth" documents and several of them are stale or about a different version of the product. To avoid wasting your first day, here's what to read and what to skip.

| File | Status | Use it for |
|---|---|---|
| `apps/TRL-PWA/PRODUCT.md` | **Current** | Product purpose, audience, brand voice, anti-references, design principles. |
| `DESIGN.md` (repo root) | **Current** | Visual design system: tokens, color rules, typography, components, do/don't. The most polished doc in the repo. |
| `apps/TRL-PWA/plan.md` | **Current — task list** | The MUI migration plan, phase-by-phase. Treat as a living todo list, not a finished spec. |
| `apps/TRL-PWA/PROJECT_OVERVIEW.md` | **This file** | Engineering + design-system glue — links the above to the actual code. |
| `README.md` (repo root) | **Stale** | Describes the *old* `onboarding-prototype/` (Tailwind, brand red `#E8656A`, no MUI). The current app is structurally different. Ignore unless you need historical context. |
| `TRACKLYNK_CLAUDE.md` (repo root) | **Stale + contradicts current stack** | Describes a React Native + Expo + NativeWind + Reanimated build that was never shipped to TRL-PWA. The current app is a React + MUI + Capacitor PWA. Do not use as a stack reference. |
| `PRODUCT.md` (repo root) | Largely overlaps with the TRL-PWA copy | Read the TRL-PWA one instead. |

**Open contradictions you should be aware of** (rather than discover at 2 AM):

1. **Buttons.** `DESIGN.md` § 5 specifies the primary button as a **flat lime fill** with no gradients anywhere in the system. `src/themes/components.ts` overrides `MuiButton-containedPrimary` to a `linear-gradient(135deg, #C8FF00 → #8FB800)` plus a glow `boxShadow`. Either the spec is right or the code is. Resolve before pushing visual changes that touch buttons.
2. **Stack.** `TRACKLYNK_CLAUDE.md` claims React Native + NativeWind + Reanimated. `vite.config.ts`, `package.json`, and every `.tsx` file in `src/` say otherwise. Trust the code.
3. **Tailwind.** `tailwind.config.js` is still in the repo. It's empty, no `@tailwind` directives are referenced, and `apps/TRL-PWA/plan.md` Phase 0.2 plans its removal. Treat as legacy until that phase ships.

---

## 1. What is TrackLynk Lite (TRL-PWA)

A consumer GPS vehicle-tracking PWA for **parents of teen drivers**. The OBD dongle plugs into the car, the app shows where each family vehicle is and whether everything is OK.

**The whole product fits in one sentence:** *"Where is my family's car right now, and is everything OK?"* — answered in a single glance, no taps required. (See `apps/TRL-PWA/PRODUCT.md` for the long version.)

**It is not** a fleet-management tool, an accountability dashboard, or a Bouncie clone. Don't import telematics-jargon patterns from Samsara or Geotab; don't import parental-soft patterns from Bouncie or Life360. The brand is *Direct, Modern, Watchful* — read the anti-references section in `PRODUCT.md` before doing exploratory design.

**Form factors.** The PWA runs in mobile browsers. Capacitor wraps it for iOS and Android (`capacitor.config.ts`, `npm run cap:add:ios`, `npm run cap:open:ios`).

---

## 2. Brand & design language (TL;DR)

The full system lives in `DESIGN.md`. The shortest version a designer-who-codes needs to start:

- **Singular accent:** Signal Lime `#C8FF00`. No second accent color. No teal/cyan/yellow-green neighbors. If you reach for a second hue, fix the layout instead.
- **Surfaces:** Midnight Ink `#04050D` (app/map floor) → Night Panel `#0D0D14` (cards) → Glass overlays (above the live map only).
- **Typography:** Inter throughout, weight-differentiated. No display pairing, no monospace exception.
- **Status communication:** never color alone. Always color + text or color + icon (WCAG AA).
- **Watchful, not surveillance.** Alert Red and Alert Amber are *reserved* — they cannot appear decoratively.
- **Glass = function.** Glass treatment is only for panels floating *above* the live map. Glass on a solid background is decoration without function.
- **One glance, one answer.** If a screen answers two questions, it's two screens.

---

## 3. Tech stack (locked, with versions from `package.json`)

| Layer | Choice | Version | Notes |
|---|---|---|---|
| Language | TypeScript | 5.5 | strict mode on, `@/*` path alias to `src/*`. |
| UI framework | React | 18.3.1 | Hooks. `<React.StrictMode>` in `index.tsx`. |
| Build tool | Vite | 5.3.1 | `vite-plugin-pwa` for service worker + offline. |
| Component library | MUI | 6.4.5 | `@mui/material` + `@mui/icons-material`. **Styled engine is `styled-components`**, not Emotion (see `vite.config.ts` alias). |
| Theming | MUI `createTheme` | – | `src/themes/index.ts`. Dark mode, Inter, lime primary, gradient button override. |
| CSS-in-JS | styled-components | 6.1 | `import { styled } from '@mui/material/styles'` works because of the alias. |
| Animation | Framer Motion | 11.0 | Slide transitions, tap micro-interactions, layoutId tab indicator. Respect `prefers-reduced-motion`. |
| Icons | lucide-react | 0.383 | Default icon set. Match stroke widths across screens. |
| Routing | react-router-dom | 6.24 | `createBrowserRouter` + lazy-loaded routes. See § 5. |
| HTTP | axios | 1.7 | One shared instance with bearer-token interceptor. See § 7. |
| Maps | `@react-google-maps/api` | 2.20 | Requires `VITE_GOOGLE_MAPS_API_KEY`. |
| Native shell | Capacitor | 6.0 | iOS + Android wrap. |
| Tailwind | – | – | **Being removed.** Empty config still in repo. Don't add new utility classes. |

> **No state library yet.** State is plain React Context (4 providers). React Query, Zustand, Redux are *not* installed despite what `TRACKLYNK_CLAUDE.md` says. If you introduce one, document it here.

---

## 4. Repo map (TRL-PWA only)

```
apps/TRL-PWA/
├── capacitor.config.ts       Native shell config (iOS/Android)
├── vite.config.ts            Build, PWA manifest, runtime caching, @ alias
├── tsconfig.json             strict TS, "@/*" → "src/*"
├── tailwind.config.js        Legacy. Empty. Remove per plan.md Phase 0.2.
├── PRODUCT.md                Product north star (audience, brand, principles)
├── plan.md                   MUI migration task list — open work
├── PROJECT_OVERVIEW.md       This file
├── public/                   PWA icons, manifest assets
├── docs/                     Tracklynk lite workbook.xlsx (PM artefact)
├── old-prototype/            Pre-MUI snapshot. Reference only — do not edit.
└── src/
    ├── index.tsx             React entry point
    ├── App.tsx               Theme + Context providers + router
    ├── index.css             Global CSS (font import, scrollbar hide, keyframes)
    ├── vite-env.d.ts
    │
    ├── themes/
    │   ├── index.ts          createTheme: palette, typography, shape, spacing
    │   ├── palette.ts        Brand color constants (single source for hex values)
    │   └── components.ts     MUI component overrides (Button, Chip, Input, etc.)
    │
    ├── styles/
    │   └── globals.ts        globalStyles string injected via <style> in App
    │
    ├── routes/
    │   ├── index.tsx         createBrowserRouter — full route table
    │   └── ProtectedRoute.tsx Outlet/Navigate based on isAuthenticated
    │
    ├── layout/
    │   ├── MainLayout.tsx    Shell for protected routes — bottom tab bar (Home,
    │   │                     Trips, Ask AI, Health, Settings) + Outlet
    │   └── ConversationalPanel.tsx  Slide-up "Ask AI" chat surface
    │
    ├── pages/                One folder per screen. Lazy-loaded by the router.
    │   ├── onboarding/       welcome → choose-plan → select-device →
    │   │                     payment → order-tracking → device-purchase-details
    │   │                     → add-vehicle → vehicle-details → scan-device →
    │   │                     device-setup-wizard → device-tracking → success
    │   ├── authentication/   login, sign-up, sign-in, forgot-password,
    │   │                     verify-email
    │   ├── home/             Map view (the "watch face")
    │   ├── trips/            List and trips/:id detail
    │   ├── health/           Vehicle + driver health summary
    │   └── settings/         Index + 8 sub-screens (account, vehicles, alerts,
    │                         device-management, payment, legal, support, about)
    │
    ├── components/
    │   └── common/           Cross-screen primitives:
    │                         GlassCard, PrimaryButton, ProgressBar, Car3D
    │
    ├── contexts/             Plain React Context providers (no Redux/Zustand)
    │   ├── AuthContext.tsx       user, token, isAuthenticated
    │   ├── VehicleContext.tsx    nickname, plate, VIN, model
    │   ├── DeviceContext.tsx     OBD pairing state
    │   └── PlanContext.tsx       Selected subscription plan
    │
    ├── services/             Axios callers, one file per domain
    │   ├── axiosInstance.ts  Shared client + bearer/401 interceptors
    │   ├── authService.ts
    │   ├── vehicleService.ts
    │   └── tripService.ts
    │
    ├── menu-items/
    │   └── index.ts          NavItem[] for the bottom tab bar
    │
    └── assets/               Static images, the 3D car render, etc.
```

---

## 5. Routes & screen flow

Defined in `src/routes/index.tsx`. All non-shell screens are lazy-loaded.

### Public — onboarding (no auth required)

```
/onboarding/welcome
  └─► /onboarding/choose-plan
        └─► /onboarding/select-device
              └─► /onboarding/payment
                    └─► /onboarding/order-tracking
                          └─► /onboarding/device-purchase-details
                                └─► /onboarding/add-vehicle
                                      └─► /onboarding/vehicle-details
                                            └─► /onboarding/scan-device
                                                  └─► /onboarding/device-setup-wizard
                                                        └─► /onboarding/device-tracking
                                                              └─► /onboarding/success
```

The flow is linear; navigation is `useNavigate()` calls inside each page. There's no shared stepper component yet — `components/common/ProgressBar.tsx` is used per screen.

### Public — authentication

```
/auth/login
/auth/sign-up
/auth/sign-in
/auth/forgot-password
/auth/verify-email
```

### Protected — main app (wrapped by `ProtectedRoute` + `MainLayout`)

`ProtectedRoute` checks `useAuth().isAuthenticated`; if false, redirects to `/onboarding/welcome`.

```
/                            Home (live map)
/trips                       Trips list
/trips/:id                   Trip detail
/health                      Vehicle + driver health
/settings                    Settings index
  /settings/account
  /settings/vehicles
  /settings/alerts
  /settings/device-management
  /settings/payment
  /settings/legal
  /settings/support
  /settings/about
```

### Bottom tab bar (defined in `MainLayout.tsx`)

Five visible tabs: **Home, Trips, [Ask AI], Health, Settings**. The center "Ask AI" slot toggles `ConversationalPanel`, not a route. Active tab gets the lime indicator via Framer Motion `layoutId="tab-indicator"`.

> Note: `src/menu-items/index.ts` lists only three tabs. The actual five-tab bar is hard-coded in `MainLayout.tsx`. If you add or rename tabs, do it in both places — there's no single source of truth yet.

### Catch-all

`*` → redirect to `/onboarding/welcome`. There is no 404 screen.

---

## 6. The shell — `App.tsx` + `MainLayout.tsx`

`App.tsx` wires everything together:

```tsx
<StyleSheetManager>            // styled-components
  <ThemeProvider theme={theme}> // MUI dark theme + lime
    <CssBaseline />
    <style>{globalStyles}</style>
    <AuthProvider>
      <VehicleProvider>
        <DeviceProvider>
          <PlanProvider>
            <RouterProvider router={router} />
```

`MainLayout.tsx` is the protected-route shell. It renders the page in `<Outlet />` plus a floating glass tab bar absolutely positioned `bottom: 12, left: 50%`, width capped at 560 px so the same shell works on phone and tablet widths.

Key visual conventions baked into the layout:

- Bar height 62 px, radius 28 px, glass at `rgba(18,22,32,0.92)` + `backdrop-filter: blur(20px)`.
- Active tab indicator is a `layoutId`-shared `motion.div` with a `rgba(200,255,0,0.10)` fill + `rgba(200,255,0,0.18)` border. Animated `spring(400, 30)`.
- Tab labels are 9.5 px Inter — small, intentional. If you bump them, bump them all.
- `safe-area-inset-top/bottom` padding is on `LayoutRoot` for iOS notches.

---

## 7. State, services, and data flow

### Client state — React Context only

Four providers, all in `src/contexts/`:

| Context | Holds | Persisted? |
|---|---|---|
| `AuthContext` | `user` (firstName, lastName, phone, email), `token`, `isAuthenticated` | `token` reads from `localStorage.accessToken` on mount. `user` is in-memory. |
| `VehicleContext` | Single vehicle: `vin, nickname, plate, model` | In-memory. |
| `DeviceContext` | OBD pairing state (see file) | In-memory. |
| `PlanContext` | Selected subscription plan | In-memory. |

> **Multi-vehicle is not implemented.** `VehicleContext` holds a single object, not an array. The product is described as multi-vehicle ("Sarah's Civic, Mike's Accord") — adding multi-vehicle is a known scope expansion, not a bug.

### Server state — axios, no React Query

`src/services/axiosInstance.ts`:

- `baseURL = import.meta.env.VITE_API_BASE_URL`
- Request interceptor injects `Authorization: Bearer <token>` from `localStorage.accessToken`.
- Response interceptor: on `401`, clears the token and `window.location.href = '/auth/login'`.

Domain callers live in `authService.ts`, `vehicleService.ts`, `tripService.ts`. No caching, no retry policy, no optimistic updates yet.

If you introduce React Query, plumb it in `App.tsx` *outside* the four context providers and update this section.

---

## 8. Component primitives

`src/components/common/` is the shared primitive layer. Today it contains:

| Component | Purpose |
|---|---|
| `GlassCard.tsx` | Floating glass surface (the signature elevation treatment). Use this anywhere the spec calls for a glass card over the map. |
| `PrimaryButton.tsx` | Wraps MUI `Button` with project defaults. **NB:** today it relies on the gradient theme override (see open contradiction in § 0). |
| `ProgressBar.tsx` | Step indicator used across onboarding. |
| `Car3D.tsx` | The hero 3D car render with overlay glow. |

**There is no full base-component layer yet.** When you reach for AppText, AppButton, StatusChip, StatRow, AppCard — they don't exist. Either build them in `components/common/` or use MUI directly with the theme. If you build new primitives, follow the file pattern above and update this section.

`menu-items/` holds nav metadata. `layout/ConversationalPanel.tsx` is its own thing — read it before building anything else that needs to slide up over the map.

---

## 9. Theme → DESIGN.md mapping (for designer-who-codes)

The MUI theme in `src/themes/` is the runtime expression of `DESIGN.md`. Here's the mapping you'll need every day:

| `DESIGN.md` token | Code source | MUI access |
|---|---|---|
| Signal Lime `#C8FF00` | `palette.ts → PRIMARY_LIME` | `theme.palette.primary.main` |
| Standby Lime `#8FB800` | `palette.ts → PRIMARY_OLIVE` | `theme.palette.primary.dark` |
| Midnight Ink `#04050D` | `palette.ts → BG_DARK` | `theme.palette.background.default` |
| Night Panel `#0D0D14` | `palette.ts → SURFACE_DARK` | `theme.palette.background.paper` |
| Success Green `#2ECC71` | not yet wired | (use `#2ECC71` literal until plumbed) |
| Alert Red `#E74C3C` | not yet wired | (use literal) |
| Alert Amber `#F5A623` | `WARNING_YELLOW = #facc15` ⚠ different value | `theme.palette.warning.main` |
| Inter font stack | `themes/index.ts → typography.fontFamily` | `theme.typography.fontFamily` |
| Border radius `16` (default) | `themes/index.ts → shape.borderRadius` | `theme.shape.borderRadius` |
| Spacing base `4 px` | `themes/index.ts → spacing: 4` | `theme.spacing(n)` |

**Drift to fix.** `DESIGN.md` declares Alert Amber as `#F5A623`; the theme uses `#facc15`. Pick one and propagate. A second pass should also wire success/error explicitly into `theme.palette` instead of leaving them as literals scattered across components.

**Sx vs styled.** Most screens use MUI's `sx` prop for one-off styles and `styled(Box)` for repeated ones. Both are fine. Avoid inline `style={{}}` for anything theme-related — it bypasses the design system.

---

## 10. Local development

### Prerequisites

- Node 18+
- npm 9+
- A Google Maps API key (for `/health` and `/` map views)

### Setup

```bash
cd apps/TRL-PWA
cp .env.example .env.development
# fill in:
#   VITE_API_BASE_URL=https://api.tracklynk.com
#   VITE_GOOGLE_MAPS_API_KEY=...
npm install
npm run dev          # http://localhost:5173
```

### Build

```bash
npm run build        # tsc + vite build → dist/
npm run preview      # serve dist/ for verification
```

### Native (Capacitor)

```bash
npm run cap:add:ios       # one-time, scaffolds ios/
npm run cap:add:android   # one-time, scaffolds android/
npm run cap:sync          # after every web build
npm run cap:open:ios      # opens Xcode
npm run cap:open:android  # opens Android Studio
```

The PWA service worker is registered via `vite-plugin-pwa` in `vite.config.ts`. Runtime caching: API requests use `NetworkFirst`, Google Maps tiles use `CacheFirst`.

---

## 11. Migration status (as of 2026-05-06)

The MUI rebuild documented in `apps/TRL-PWA/plan.md` is **partially complete**:

- ✅ MUI core + lab installed.
- ✅ Theme scaffold in `src/themes/` (palette, typography, component overrides).
- ✅ Routing migrated to `react-router-dom v6` `createBrowserRouter`.
- ✅ Bottom tab bar rebuilt as a custom Framer-Motion glass component (intentionally not MUI `BottomNavigation`).
- 🟡 Tailwind not yet removed. `tailwind.config.js` is empty but file still exists.
- 🟡 Shared components only partially extracted. Onboarding screens still hold local style objects in places.
- 🟡 Theme drift vs `DESIGN.md` (gradient buttons, amber color, missing success/error palette entries).

When you start work, sanity-check the relevant phase in `plan.md` first.

---

## 12. Accessibility floor

From `PRODUCT.md` and `DESIGN.md` — non-negotiables:

- WCAG **AA** minimum.
- Audience is 35–55 → body text not below **14 px**, tap targets not below **44 px**.
- **Never color-only** for status. Pair color with icon or text.
- Honor `prefers-reduced-motion` on every Framer Motion animation. The animation should resolve to its end state instantly when reduced motion is requested. Most existing screens *don't* implement this yet — fix as you touch them.
- Icon-only buttons need `aria-label`. The bottom tab buttons currently don't have them — known gap.

---

## 13. Known gaps and gotchas

These are the things that will trip you up. They are not in `plan.md` (which is migration-focused).

1. **Five tab bar vs three menu-items.** Hard-coded in `MainLayout.tsx`, only three listed in `src/menu-items/index.ts`. Single source of truth needed.
2. **VehicleContext is single-vehicle.** Multi-vehicle is a product requirement. Treat as scope, not a bug, but don't design new screens that assume single-vehicle data.
3. **No real auth.** `AuthContext` reads from `localStorage.accessToken`. There's no refresh-token flow; on 401 the user is hard-redirected to `/auth/login`.
4. **No 404 screen.** Catch-all redirects to `/onboarding/welcome`. Any unrecognized path looks like the user got logged out, even when authed.
5. **No skeleton loaders.** Lazy-loaded routes show a black spinner placeholder (`background: '#04050d'`). Empty/error states are not standardized.
6. **`ConversationalPanel` "Ask AI" tab** is real UI but the conversational backend is not wired. Don't promise it in user-facing copy until it is.
7. **Gradient primary button** vs spec — see § 0.
8. **Amber drift** vs spec — see § 9.
9. **`prefers-reduced-motion`** is not implemented on most Framer animations (tab indicator, page transitions, micro-interactions).
10. **Tailwind ghost.** `tailwind.config.js` exists but isn't wired. Don't add classes; remove the file when § 0.2 of `plan.md` is shipped.

---

## 14. Where to look next

- Visual / brand questions → `DESIGN.md`
- "Why are we building this" → `apps/TRL-PWA/PRODUCT.md`
- "What's still on the migration list" → `apps/TRL-PWA/plan.md`
- Code structure / how the runtime is wired → this file, § 4–8
- Old design / animation vocabulary (carousel, drag mechanics, spring tunings) → root `README.md` (stale stack info, but the *animation* references are still useful for tone)
- Competitor reference frames → `apps/TRL-PWA/old-prototype/` and the various Bouncie audits in `decks/` and `research/`

---

*Maintainers: please update this file the moment any of the following change: top-level routes, theme palette, the four contexts, the bottom tab structure, or which docs are canonical. A stale overview is worse than no overview.*
