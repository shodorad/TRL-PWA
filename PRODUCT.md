# Product

## Register

product

## Users

Parents aged 35–55 with a 16–22-year-old new driver in the household. Two or three family vehicles. Comfortable with apps, not technical. Already evaluated Bouncie or Life360 before finding Tracklynk. The buyer understands status chips and fuel percentages but cannot parse telematics jargon — PIDs, DTCs, sensitivity sliders with no defaults. They want named, declarative information: "Sarah's Civic, parked at school" not "Vehicle 1, geo-zone 3 entry event."

UI density: medium. Inter 14–15px body, generous whitespace, one primary action per screen, no nested tabs. Every OBD code translated to plain English. Every threshold defaulted to a parent-reasonable value before exposing the control.

## Product Purpose

Peace of mind. "Where is my family's car right now, and is everything OK?" — answered in one glance, no taps required.

Home is a glance, not a console: two beats of attention max — where is the car (map + pin) and is everything OK (status chip + health chips). Accountability surfaces (is my teen speeding?) live on Trips and Driving Insights, not Home. Optimization/savings framing is wrong for this audience entirely.

## Brand Personality

Direct. Modern. Watchful.

*Direct* — declarative copy, no hedges. "Sarah's Civic left home, 8:47 AM." Not "vehicle moving event detected."

*Modern* — lime-on-black, Inter, glass surfaces, big legible data. 2025-app, not 2015-utility.

*Watchful* — always-on, paying attention, surfaces what matters. A smart house alarm panel that doesn't shout. Not a sentry. Bridges parent-of-teen safety with a sharp aesthetic without becoming surveillance-feeling.

## Anti-references

- **Cute or parental-soft** — no blobby illustrations, no mascots, no "Hi Mom! 👋" copy, no rounded baby shapes. Bouncie leans this way. Don't.
- **Surveillance-state** — no red-dominant alert design, no police-scanner typography, no "tamper detected" without a softer translation underneath.
- **Enterprise telematics** — no Samsara-style data tables, no spreadsheet-density screens, no role-based-access language, no PID/DTC jargon surfaced without translation.
- **Generic dark-mode SaaS** — lime is the differentiator. No second accent color. No blue-gray neutrals. No gradients beyond the existing token system.

## Design Principles

1. **One glance, one answer.** Every screen answers one question immediately, without taps. If a screen answers two questions, it's two screens.
2. **Translate, never expose.** Every technical value (DTC, OBD PID, battery voltage threshold) gets a plain-English translation before it reaches the user. Jargon lives in the logs, not the UI.
3. **Watchful, not worried.** Status design should calm first, alert only when truly needed. Default states are reassuring. Alerts are deliberate and rare.
4. **Named over numbered.** "Sarah's Civic" over "Vehicle 1." "Left home" over "exited geo-zone 3." Real names, real places, real times.
5. **Lime as signal, not decoration.** The lime accent exists to indicate what matters now — active state, primary action, live status. Using it decoratively erodes its meaning.

## Accessibility & Inclusion

WCAG AA minimum. High-contrast text on dark backgrounds. No reliance on color alone for status — pair with icons and labels. Reduced-motion support via `prefers-reduced-motion` for Framer Motion animations. Parent demographic may include users with mild presbyopia — body text not below 14px, tap targets not below 44px.
