# Information Architecture: TrackLynk Lite PWA

> **Source:** Synthesized from codebase (`src/routes/index.tsx`, all page components) and  
> `docs/tracklynk lite workbook.xlsx` (Flow Registry F-001–F-065, Feature-Screen-API mapping, Features sheet).  
> **Date:** 2026-05-05  
> **Build baseline:** Phase 1 prototype — "Shipped to Prototype" flows confirmed live.

---

## Site Map

```
/ (app root)
│
├── /onboarding/welcome                  [PUBLIC] Welcome carousel (3 slides: Brand → Features → Pricing)
├── /onboarding/choose-plan              [PUBLIC] Subscription tier + billing period picker
├── /onboarding/add-vehicle              [PUBLIC] VIN entry / barcode scan
├── /onboarding/vehicle-details          [PUBLIC] Vehicle model/year confirmation
├── /onboarding/scan-device              [PUBLIC] OBD-II device locator
├── /onboarding/device-setup-wizard      [PUBLIC] 4-step Bluetooth pairing wizard
├── /onboarding/success                  [PUBLIC] Completion / "Open TrackLynk"
│
├── /auth/login                          [PUBLIC] Apple OAuth | Google OAuth | Email | Face ID
├── /auth/sign-up                        [PUBLIC] Email registration form (5 fields)
│   └── (planned) /auth/forgot-password  [BACKLOG] Forgot password flow (F-002 gap)
│
└── / [PROTECTED — ProtectedRoute → MainLayout]
    ├── / (index)                        Home: full-screen live map + floating vehicle header + trip card
    │
    ├── /trips                           Trip History list (grouped by date)
    │   └── /trips/:id                   Trip Detail (map, stats, score, events)
    │
    ├── /health                          Health hub (Driver tab | Vehicle tab)
    │   ├── [tab: driver]                Driver score ring, 7-day trend, 7 factor cards, improvement tip
    │   └── [tab: vehicle]               Vehicle score ring, 7-day trend, 6 factor cards, maintenance schedule
    │       └── (planned) /health/factor/:factorId   OBD drill-down per factor (F-029 — partial)
    │
    └── /settings                        Settings hub (list → subpages)
        ├── /settings/account            Profile edit, password, 2FA, biometrics, active sessions
        ├── /settings/vehicles           Manage vehicles (add, edit, remove, re-pair device)
        ├── /settings/alerts             Notification channel + rule configuration
        ├── /settings/device-management  OBD device status, IMEI, last comm, re-pair
        ├── /settings/payment            Subscription plan, billing period, payment method
        ├── /settings/legal              Privacy Policy, Terms of Service
        ├── /settings/support            Help/FAQ, send message (email-based)
        └── /settings/about              App version, credits
```

**Overlay surfaces (no dedicated route):**
- `Ask AI` panel — slides in from right over any main tab (ConversationalPanel)
- Trip filter sheet — accessed from `/trips` filter icon
- Onboarding progress bar — persistent across `/onboarding/*` steps

---

## Navigation Model

### Primary navigation — Bottom tab bar
Floating pill bar, always visible inside the protected shell. 5 items.

| Position | Label | Icon | Route |
|----------|-------|------|-------|
| 1 (left) | Home | MapPin | `/` |
| 2 | Trips | Route | `/trips` |
| 3 (center) | Ask AI | MessageSquare | Panel overlay — no route change |
| 4 | Health | HeartPulse | `/health` |
| 5 (right) | Settings | Settings | `/settings` |

Active state: lime `#C8FF00` icon + label, background pill indicator animated with `layoutId`.  
Maximum items: **5** (do not exceed — center slot is reserved for AI panel).

### Secondary navigation — Settings section
Flat list inside `/settings` index. No nesting in the nav; each item navigates to a full-screen subpage that replaces the settings list (Settings renders `<Outlet />` when on a subpage).

### Utility navigation
- **Back button**: present on all `/auth/*`, all `/onboarding/*` subpages after welcome, `/settings/*` subpages, `/trips/:id`
- **Onboarding progress bar**: step indicator (e.g. "5 of 6") shown at top of each onboarding step, doubles as back affordance
- **Notification bell**: in Home floating header → (planned) notification center
- **Avatar / profile chip**: in Home floating header → (planned) quick profile access
- **Vehicle selector chevron**: in Home floating header → (planned) multi-vehicle switcher (F-020 backlog)

### Mobile navigation
The bottom tab bar is already the mobile primary nav (no hamburger, no sidebar). Bottom clearance `paddingBottom: 82px` is applied to all scrollable page bodies so content is never hidden behind the tab bar.

---

## Content Hierarchy

### `/` — Home (Live Map)
1. **Full-screen map** — The dominant surface; vehicle position is the core value proposition
2. **Floating vehicle header** (top) — Vehicle name, device ID, notification bell, user avatar; always accessible above map
3. **Live trip card** (below header) — Active trip name + destination + GO button; surfaces only when a trip is in progress
4. **Re-center button** (bottom-right) — Quick restore map to vehicle position
5. **Tab bar** (bottom float) — Navigation, always visible
6. **Ask AI panel** (triggered from tab) — Conversational overlay for quick queries (F-023: chips for fuel, trips, speed alerts, parking, diagnostics, device health)

### `/trips` — Trip History
1. **Header + filter button** — Title, date-range filter access
2. **Grouped trip list** — Today / Yesterday / dated groups; each row shows name, time range, distance, duration, score grade
3. **Aggregate stats card** (planned top of list — F-027) — Weekly/monthly total trips, miles, drive time
4. **Empty state** — Route icon + prompt when no trips exist
5. *(Tab bar)*

### `/trips/:id` — Trip Detail
1. **Back nav + trip title + score badge** — Orientation, instant score at a glance
2. **Route map** (220px) — Polyline of the trip; color-coded speed bands planned (F-026 gap)
3. **Stats row** — Distance · Duration · Avg MPH · Max MPH (4 equal cells)
4. **Driving Score section** — Score gauge (A/B/C/D), label, event summary sentence
5. **Driving Events section** — Event list (type, location, time); clean drive state if none
6. *(Planned: fuel cost per trip, animated replay controls — F-026 gap)*

### `/health` — Health Hub
1. **Tab toggle** — Driver | Vehicle (equal prominence; user switches context)
2. **Score card** — Ring gauge (grade + numeric), peer percentile badge, 7-day sparkline trend
3. **Improvement tip card** — Surfaced only when score < 80 and a factor has a tip
4. **Factor list** — Per-factor bar + numeric score; ordered by impact weight
5. **Maintenance schedule** (Vehicle tab only) — Oil Change, Tire Rotation, Air Filter, Brake Fluid with status chips (OK / Due Soon / Overdue)
6. *(Planned: per-factor drill-down — F-029, NHTSA recall alerts — F-033)*

### `/settings` — Settings Hub
1. **Section list** — 8 items; each has an icon, label, chevron
2. *(No sub-navigation shown at the hub level; subpages replace the list via Outlet)*

### `/settings/account`
1. Profile info (name, email, mobile, avatar)
2. Password change
3. Two-Factor Authentication toggle + setup
4. Face ID / Biometrics toggle
5. Active Sessions viewer + sign-out others
6. *(Planned: Delete Account, Export My Data — F-063)*

### `/settings/alerts`
1. Speed Alerts toggle
2. Geofence Alerts toggle
3. Trip Start / Trip End toggles
4. Vehicle Health alerts toggle
5. *(Planned: per-rule threshold config, quiet hours, notification channels — F-036/F-037)*

---

## User Flows

### F-008 — First-Time User Onboarding (Happy Path)

```
1. User opens app cold (no auth token)
   → Redirect to /onboarding/welcome

2. /onboarding/welcome
   → Auto-advancing 3-slide carousel: Brand · Features · Pricing
   → User swipes or waits
   → Taps "Get Started →"  ──────────────────────────────── path A
   → Taps "Explore the app (skip)" ────────────────────────── path B (demo mode, F-017)
   → Taps "Already have an account? Sign In" ───────────────── path C (returning user)

PATH A — New user sign-up:
3. /auth/login
   → "Create your account"
   → Taps "Continue with Apple"   ── OAuth → navigate('/') → MainLayout
   → Taps "Continue with Google"  ── OAuth → navigate('/') → MainLayout
   → Taps "Sign up with Email →"  ── /auth/sign-up

4. /auth/sign-up
   → Fills: First Name, Last Name, Mobile, Email, Password
   → Submit → (planned: verify email) → /onboarding/choose-plan

5. /onboarding/choose-plan  [step 5/6]
   → Monthly ($9.65/mo) or Annual ($7.99/mo, save $21)
   → "Start for $X/mo" → setPlan context → /onboarding/add-vehicle

6. /onboarding/add-vehicle  [step 1/6 in wizard]
   → Enter VIN manually OR scan VIN barcode
   → Next → /onboarding/vehicle-details

7. /onboarding/vehicle-details  [step 2/6]
   → Confirm vehicle model, year, color
   → Name vehicle (nickname input)
   → Next → /onboarding/scan-device

8. /onboarding/scan-device  [step 3/6]
   → Illustrated guide to locating OBD-II port
   → "I've found it" → /onboarding/device-setup-wizard

9. /onboarding/device-setup-wizard  [step 4/6]
   → Step 1: Find the OBD port
   → Step 2: Plug in your device
   → Step 3: Bluetooth pairing / "Pairing…" state
   → Step 4: Start your engine
   → Success → /onboarding/success
   OR "Skip for now" → /onboarding/success  [F-015]

10. /onboarding/success
    → "One last thing" screen
    → "Open TrackLynk" → navigate('/') → Home (MainLayout)
```

### F-002 / F-003 — Returning User Sign-In

```
1. User opens app (no valid token)
   → /onboarding/welcome → "Already have an account? Sign In"
   OR direct: /auth/login

2. /auth/login
   Path A — Biometric:
   → "Use Face ID" button → scanning → verified → navigate('/')

   Path B — OAuth:
   → "Continue with Apple" / "Continue with Google" → navigate('/')

   Path C — Email/Password:
   → "Sign up with Email →" (currently routes to sign-up; dedicated sign-in screen gap — F-002)
   → (planned) /auth/sign-in → email + password form → navigate('/')

   Path D — Forgot Password:
   → (planned) /auth/forgot-password → reset email sent → /auth/login  [F-002 gap]
```

### F-018 — Live Tracking (Home Tab)

```
1. User taps "Home" tab or lands at /
2. Map loads (Google Maps dark theme) — vehicle pin at GPS position
3. If trip in progress:
   → Live trip card visible: name, destination address, ETA, GO button
   → GO button → (planned) navigation handoff to Maps app
4. If parked:
   → Parked status chip + last engine-off timestamp (planned — F-021 backlog)
   → Current address via reverse geocode
5. Re-center button → map re-centers on vehicle
6. Vehicle header → vehicle name + device ID always visible
7. Notification bell → (planned) notification center
8. Avatar → (planned) profile quick access
9. Ask AI tab → slide-in panel → quick-action chips or free-text query
```

### F-024 / F-026 — Trip History & Detail

```
1. User taps "Trips" tab → /trips
2. Trip list: grouped Today / Yesterday / date sections
   → Each row: trip name, start → end time, distance, duration, score badge (A/B/C)
3. Tap filter icon → filter sheet → date range picker → list updates
4. Tap trip row → /trips/:id
5. Trip detail:
   → Route map (tap/zoom; animated replay planned)
   → Stats row (distance · duration · avg mph · max mph)
   → Driving Score section (gauge + description)
   → Events section (hard brake, rapid accel, speed alert; or "Clean drive")
6. Back button → /trips
```

### F-028 / F-038 — Health Score Review

```
1. User taps "Health" tab → /health (default: Driver tab)
2. Driver tab:
   → Score card: ring gauge (B / 78), peer badge "Top 32% of drivers", 7-day sparkline
   → Tip card (if score < 80): top actionable improvement
   → Factor list: Speeding · Hard Braking · Rapid Acceleration · Harsh Cornering ·
                  Time of Day · Miles Driven · Idle Time (each with bar + numeric)
3. User taps "Vehicle" tab:
   → Score card: ring gauge (B+ / 84), peer badge, 7-day sparkline
   → Factor list: Battery Health · Engine Temperature · Fuel System ·
                  Active Fault Codes · Maintenance Status · Overall Mileage
   → Maintenance schedule: Oil Change · Tire Rotation · Air Filter · Brake Fluid
     with status chips
4. (Planned) Tap factor row → /health/factor/:factorId drill-down (F-029)
```

### F-055 / F-058 — Settings Management

```
1. User taps "Settings" tab → /settings (hub list)
2. Account → /settings/account
   → Edit name, email, mobile, avatar → Save
   → Change Password → current + new + confirm → Save
   → Two-Factor Auth toggle → setup wizard (authenticator / SMS / backup codes)
   → Face ID toggle → OS biometric permission prompt
   → Active Sessions → view devices → "Sign out other sessions"
3. Vehicles → /settings/vehicles
   → Vehicle row: nickname, OBD ID, re-pair button
   → "Add Vehicle" → onboarding add-vehicle flow (step 6/6 variant)
   → "Remove Vehicle" → confirmation modal → removed
4. Alerts → /settings/alerts
   → Toggle Speed / Geofence / Trip Start-End / Vehicle Health
   → (Planned) Per-rule threshold config
5. Device Management → /settings/device-management
   → Device status, IMEI, serial, last comm, location
   → Re-pair → device-setup-wizard flow
6. Payment & Plan → /settings/payment
   → Active plan + price + renewal date
   → Switch Monthly / Annual
   → Upgrade / change plan → plan picker
   → Payment method (card form)
7. Legal → /settings/legal
   → Privacy Policy | Terms of Service
8. Support → /settings/support
   → FAQ list + "Send Message" form → submits to registered email
9. About → /settings/about
   → App version, build info
```

### F-059 — Subscription Plan Change

```
1. /settings/payment
2. Current plan shown: "Annual Plan · Renews Jan 15, 2026 · $7.99/mo"
3. "Switch to Monthly" link → confirmation → updated
   OR "Upgrade or change plan" → plan picker (Personal / Business / Fleet tiers)
4. Plan picker: select tier → confirm → payment method confirmation → plan updated
```

---

## Naming Conventions

| Concept | Label in UI | Notes |
|---------|-------------|-------|
| OBD-II hardware unit | "Device" | Never "dongle", "tag", or "tracker" in consumer UI |
| Bluetooth hardware device ID | "OBD-II · [IMEI]" | Display format: OBD-II · 15-digit number |
| Driving behavior score | "Driver Score" (on Health tab), letter grade "A/B/C/D" on trips | Two representations: 0–100 ring + letter grade. Never "safety score" |
| Vehicle condition score | "Vehicle Score" | Same ring + grade pattern as Driver Score |
| GPS position update | "Live Trip" (active) / last engine-off timestamp (parked) | Never "tracking" in consumer-facing copy |
| Billing period | "Monthly" / "Annual" | Never "yearly"; "Annual" is the marketing term used in toggles |
| Subscription tier | "Personal" / "Business" / "Fleet" | Three tiers per F-010; pricing slide shows a single plan (assumed Personal) |
| Hard braking event | "Hard Braking" | Never "harsh braking" except in internal factor label |
| DTC fault code | "Active Fault Codes" / "code history" | Plain English description shown alongside code |
| Geo-zone | "Geofence" (developer), "Geo-Zone" (feature mapping) | UI copy should use "Zone" or "Geofence Zone" for consistency |
| Trip categorisation (V2) | "Business" / "Personal" / "Commute" | V2 feature; not in current build |
| App name | "TrackLynk" (full) / "TL" (abbreviation) | Spelling: capital T, capital L, no space |

---

## Component Reuse Map

| Component | Used on | Behavior differences |
|-----------|---------|---------------------|
| `MainLayout` (bottom tab bar + ConversationalPanel) | All protected pages (`/`, `/trips`, `/trips/:id`, `/health`, `/settings/*`) | Tab bar always floating; settings subpages hide the outer layout shell and render via Outlet |
| `ProgressBar` | All `/onboarding/*` step pages | `current` and `total` props vary per step; includes back affordance |
| `GlassCard` | Home trip info card, Health score cards, factor cards, maintenance card, settings items, onboarding plan card | Consistent `glassCard` style tokens from `src/styles/glass.ts`; border radius varies by context |
| `PrimaryButton` | Onboarding CTAs (bottom action bar) | Full-width, lime `#C8FF00` fill |
| `Car3D` | Welcome slide 1 | Only on marketing/splash surfaces |
| Dark map (Google Maps dark theme styles) | Home (`/`), Trip Detail (`/trips/:id`) | Home = full-screen + live polyline; Trip Detail = 220px embedded, gestures disabled |
| Score ring (SVG circle gauge) | Health tab (both Driver and Vehicle tabs), Trip Detail score section | Animated `motion.circle`; color changes per score tier |
| Sparkline (SVG polyline) | Health tab 7-day trend | Static data; color inherits from score tier |
| `ConversationalPanel` | Mounted once in `MainLayout`, toggled by Ask AI tab | Slides in from right over content area; no route change |
| `ProtectedRoute` | Wraps all authenticated routes | Redirects to `/onboarding/welcome` if no auth token |
| Auth contexts (`AuthContext`, `VehicleContext`, `PlanContext`, `DeviceContext`) | App-wide via context providers | Single source of truth; consumed by pages via custom hooks |

---

## Content Growth Plan

| Section | Growth pattern | IA accommodation |
|---------|---------------|-----------------|
| Trip History (`/trips`) | Unbounded — every drive adds a row | Date grouping already in place; add infinite scroll or pagination at >90 days; filter by date range already built (F-025) |
| Health factor drill-downs (`/health/factor/:id`) | Fixed set of 13 factors (7 driver + 6 vehicle) | Static routes; no pagination needed; each factor page is a leaf |
| Maintenance items (Vehicle tab) | Up to ~10 standard items + user-created custom tasks (F-031 planned) | List with "Add custom task" CTA; status chips handle growing list without layout changes |
| Active Fault Codes | Variable (0–N active DTCs) | "No active codes" empty state already exists; "view code history" link for archived codes |
| Notifications / Alert types | Currently 4 top-level; spec (F-036/F-037) implies up to ~12 rule types | Alerts settings page should group by category (Drive / Vehicle / Care) matching TLL_FTR_39–41 |
| Vehicles (Settings) | 1 vehicle (Personal plan) up to fleet-size | Vehicles list with "Add Vehicle" footer CTA; pagination or scroll for fleet |
| Settings sections | Currently 8; voice assistant, theme, leaderboard planned (backlog) | Hub list accommodates new items naturally; group by category if >12 items |

---

## URL Strategy

### Rules

- Pattern: `/section/subsection/:dynamicId`
- All lowercase, hyphen-separated words
- No trailing slashes

### Dynamic segments

| Segment | Route | Value type |
|---------|-------|-----------|
| `:id` | `/trips/:id` | Integer — matches TRIPS array index (1–N) |
| `:factorId` | `/health/factor/:factorId` (planned) | Slug — e.g. `battery-health`, `hard-braking` |

### Query parameters (planned)

| Parameter | Page | Purpose |
|-----------|------|---------|
| `?from=YYYY-MM-DD&to=YYYY-MM-DD` | `/trips` | Date range filter persistence |
| `?tab=driver\|vehicle` | `/health` | Deep-link to a specific health tab |

### Catch-all

All unrecognised routes redirect to `/onboarding/welcome` (default new-user entry point).  
After authentication is confirmed, ProtectedRoute will intercept and allow through to `/`.

---

## Build Status vs. IA (P0 Gaps)

The following flows are in the IA but not yet built — highest priority missing pieces:

| Gap | Flow ID | Missing |
|-----|---------|---------|
| Sign out | F-007 | No sign-out CTA anywhere in Settings |
| Forgot password | F-002 | No `/auth/forgot-password` route or form |
| Email sign-in (returning user) | F-002 | Login screen says "Create your account" — no dedicated sign-in form |
| Vehicle switcher | F-020 | Header chevron present but not wired |
| Multi-vehicle in Settings | F-058 | Vehicles list route exists; add/remove flows not fully wired |
| Trip animated replay | F-026 | Map renders but no play/pause controls |
| Per-factor drill-down | F-029 | Health factors are list only; no route for detail |
| Geofence zone creation | F-046 | Alerts toggle exists; no zone creation UI |
| Emergency contacts / SOS | F-048, F-049 | No route or UI |
